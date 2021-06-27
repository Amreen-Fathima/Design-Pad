import { Injectable, Injector } from '@angular/core';
import { Item } from '../models/models';
import { DesignService } from 'src/app/services/design.service';
import { UndoRedoService } from 'src/app/services/undo-redo.service';
import ArcText from 'arc-text';
import { MoveableService } from './moveable.service';

declare var Quill;

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  url =
    'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBipcG_GYuR_AN_TP6SxzppJz9sWZxIJSQ';

  textEditItems = [];
  textItems = [];
  targets = [];
  isCreateQuill: boolean = false;

  angle;
  direction;
  quillData;
  isCurving: boolean = false;
  range = null;

  constructor(public ds: DesignService, private injector: Injector) {
    this.textEditItems.push([]);
  }

  quills = [];

  createTextEditor(selectedPageId, selectedItemId, hasToolbar) {
    let quill;
    const ds = this.injector.get(DesignService);
    const ur = this.injector.get(UndoRedoService);
    const moveableService = this.injector.get(MoveableService);

    if (hasToolbar)
      quill = new Quill(
        '#textEditor-' + selectedPageId + '-' + selectedItemId,
        {
          modules: {
            toolbar: '#toolbar',
          },
          theme: 'snow',
        }
      );
    else
      quill = new Quill('#textEditor-' + selectedPageId + '-' + selectedItemId);

    quill
      .on('selection-change', (range, range2) => {
        if (quill.hasFocus()) {
          this.range = range;
        }
        if (range && range2 === null) {
          this.ds.isOnInput = true;
        }
      })
      .on('text-change', (delta, oldDelta, source) => {
        let textEle = document.querySelector(
          '#textEditor-' + selectedPageId + '-' + selectedItemId
        ) as HTMLElement;
        let item = moveableService.getItem(textEle);
        this.quillData = textEle.querySelector('.ql-editor');
        ds.theDesign.pages[selectedPageId].items[selectedItemId].quillData =
          this.quillData.outerHTML;
        if (item.isCurve)
          this.setCurveEffect(item.pageId, item.itemId, item.angle, true);

        ur.saveTheData(ds.theDesign);
      });

    (
      document
        .querySelector('#textEditor-' + selectedPageId + '-' + selectedItemId)
        .querySelector('.ql-editor') as HTMLElement
    ).style.overflow = 'hidden';

    if (this.isCreateQuill) {
      if (this.textEditItems[selectedPageId].length > selectedItemId) {
        this.textEditItems[selectedPageId][selectedItemId] = quill;
        this.isCreateQuill = false;
      } else {
        this.textEditItems[selectedPageId].push(quill);
        this.isCreateQuill = false;
      }
    }

    this.quills.push(quill);
  }

  resetting(item: Item) {
    let ele = document.querySelector<HTMLInputElement>('#fontSizeInput');
    if (ele) {
      ele.value = (
        Math.floor(
          Number.parseFloat(item.fontSize.substr(0, item.fontSize.length - 2)) *
            10
        ) / 10
      ).toString();
    }
  }

  setCurveEffect(
    selectedPageId,
    selectedItemId,
    curveValue,
    textChange: boolean
  ) {
    const ds = this.injector.get(DesignService);
    let zoom = this.ds.zoomValue / 100;

    if (curveValue < 0) {
      this.direction = -1;
    } else this.direction = 1;
    if (curveValue == 0) {
      this.angle = 20000;
    } else {
      this.angle = (5000 / curveValue) * this.direction;
    }

    const moveableService = this.injector.get(MoveableService);
    let editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' + selectedPageId + '-' + selectedItemId
    );
    let curveText = document.querySelector<HTMLElement>(
      '#curveText-' + selectedPageId + '-' + selectedItemId
    );
    let item = moveableService.getItem(editorEle);

    curveText.innerHTML = this.quills[0].getText();
    curveText.style.fontSize = editorEle.style.fontSize;
    curveText.style.fontFamily = editorEle.style.fontFamily;
    // curveText.style.fontWeight = item.fontWeight.toString();
    if (!textChange) curveText.style.opacity = '1';
    else curveText.style.opacity = '0.4';
    curveText.style.lineHeight = item.lineHeight;
    curveText.style.letterSpacing =
      Number.parseFloat(item.letterSpacing) / 1000 + 'em';
    curveText.style.transform = `translate(${item.x}px, ${item.y}px) rotate(0deg))  scale(${item.scaleX}, ${item.scaleY})`;
    editorEle.setAttribute('Curve', 'true');
    item.isCurve = true;
    if (!textChange) editorEle.style.opacity = '0';

    let arcText = new ArcText(curveText);

    arcText.arc(this.angle);
    arcText.direction(this.direction);

    this.resetPosition(curveText);
    this.getCurveTextArea(curveText, item, textChange);

    let curveTextStr;

    setTimeout(() => {
      this.ds.theDesign.pages[moveableService.selectedPageId].items[
        moveableService.selectedItemId
      ].textOpacity = '0';
      this.ds.theDesign.pages[moveableService.selectedPageId].items[
        moveableService.selectedItemId
      ].curveOpacity = '1';
      this.ds.theDesign.pages[moveableService.selectedPageId].items[
        moveableService.selectedItemId
      ].curveText = this.quills[0].getText();
      for (let i = 0; i < this.quills[0].getLength() - 1; i++) {
        let textFormat = this.quills[0].getFormat(i, 1);
        this.effectToWord(textFormat, i, curveText);
      }
    });

    //effect style to curve text include ( blod, italic, underline, line-through, color, blackground-color )
  }

  effectToWord(textFormat, index, curveText) {
    let texts = curveText.querySelectorAll('span');

    if (texts[index]) {
      if (textFormat['bold'])
        (texts[index] as HTMLElement).style.fontWeight = 'bold';
      if (textFormat['italic'])
        (texts[index] as HTMLElement).style.fontStyle = 'italic';
      if (textFormat['underline'])
        (texts[index] as HTMLElement).style.textDecoration = 'underline';
      if (textFormat['strike'])
        (texts[index] as HTMLElement).style.textDecoration = 'line-through';
      if (textFormat['strike'] && textFormat['underline'])
        (texts[index] as HTMLElement).style.textDecoration =
          'underline line-through';
      if (textFormat['color'])
        (texts[index] as HTMLElement).style.color = textFormat['color'];
      if (textFormat['background'])
        (texts[index] as HTMLElement).style.background =
          textFormat['background'];
    }
  }

  resetPosition(curveText: HTMLElement) {
    const ds = this.injector.get(DesignService);
    let zoom = this.ds.zoomValue;
    let curveEles = (curveText.firstChild as HTMLElement).children;

    setTimeout(() => {
      let center = this.getTransformOrignCenter(
        (curveEles[0] as HTMLElement).style.transformOrigin.toString()
      );
      for (let i = 0; i < curveEles.length; i++) {
        this.setTransformOrignCenter(curveEles[i] as HTMLElement, center, zoom);
      }
    }, 50);
  }

  getTransformOrignCenter(center) {
    return Number.parseFloat(
      center.substring(center.indexOf(' ') + 1, center.length)
    );
  }

  setTransformOrignCenter(ele, center, zoom) {
    ele.style.transformOrigin = `center ${center / (zoom / 100)}em`;
  }

  getCurveTextArea(curveText: HTMLElement, item: Item, textChange: boolean) {
    const moveableService = this.injector.get(MoveableService);
    const ds = this.injector.get(DesignService);

    setTimeout(() => {
      let textSelector = document.querySelector(
        '#textSelector-' + item.pageId + '-' + item.itemId
      ) as HTMLElement;

      item.w = this.getCurveTextWidth(curveText);
      item.h =
        (curveText.firstChild as HTMLElement).clientHeight /
        (ds.zoomValue / 100);

      textSelector.style.width = item.w + 'px';
      textSelector.style.height = item.h + 'px';
      curveText.style.width = item.w + 'px';
      curveText.style.height = item.h + 'px';

      if (!textChange) moveableService.onSelectTargets([textSelector]);
    }, 50);
  }

  getCurveTextWidth(curveText) {
    let left, right;
    for (
      let i = 0;
      i < (curveText.firstChild as HTMLElement)?.children.length;
      i++
    ) {
      let rectLeft = (curveText.firstChild as HTMLElement).children[
        i
      ].getBoundingClientRect().left;
      let rectRight = (curveText.firstChild as HTMLElement).children[
        i
      ].getBoundingClientRect().right;

      if (!left) left = rectLeft > rectRight ? rectRight : rectLeft;
      if (!right) right = rectLeft < rectRight ? rectRight : rectLeft;

      left =
        (rectLeft > rectRight ? rectRight : rectLeft) < left
          ? rectLeft > rectRight
            ? rectRight
            : rectLeft
          : left;
      right =
        (rectLeft < rectRight ? rectRight : rectLeft) > right
          ? rectLeft < rectRight
            ? rectRight
            : rectLeft
          : right;
    }

    return right - left;
  }

  setEffectToCurve(editorEle, curveText) {
    if (editorEle.children[0].children[0].children.length > 0) {
      let text = editorEle.children[0].children[0].innerHTML;
      let ele = [];
      let index = 0;
      let length = 0;
      let fromIndex = 0;

      for (
        let i = 0;
        i < editorEle.children[0].children[0].children.length;
        i++
      ) {
        ele.push(editorEle.children[0].children[0].children[i]);
      }

      for (let j = 0; j < ele.length; j++) {
        index =
          index +
          length +
          text.indexOf(ele[j].outerHTML, fromIndex) -
          fromIndex;
        length = ele[j].innerHTML.length;

        for (let i = index; i < index + length; i++) {
          let textEle = curveText.children[0].children[i] as HTMLElement;
          textEle.style.color = ele[j].style.color;
        }

        if (
          ele[j].outerHTML.indexOf('<strong') >= 0 &&
          ele[j].outerHTML.indexOf('</strong>') >= 0
        ) {
          for (let i = index; i < index + length; i++) {
            let textEle = curveText.children[0].children[i] as HTMLElement;
            textEle.style.fontWeight = 'bold';
          }
        }

        fromIndex =
          text.indexOf(ele[j].outerHTML, fromIndex) + ele[j].outerHTML.length;
      }
    }
  }

  enableLineHeight(letter, lineHeight) {
    const moveableService = this.injector.get(MoveableService);

    let editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' +
        moveableService.selectedPageId +
        '-' +
        moveableService.selectedItemId
    );
    let qlEditor = <HTMLElement>editorEle.firstChild;

    qlEditor.style.lineHeight = lineHeight + 'em';
    qlEditor.style.letterSpacing = letter / 1000 + 'em';

    let item =
      this.ds.theDesign.pages[moveableService.selectedPageId].items[
        moveableService.selectedItemId
      ];

    item.lineHeight = lineHeight.toString();
    item.letterSpacing = letter.toString();
    if (item.isCurve)
      this.setCurveEffect(item.pageId, item.itemId, item.angle, false);
  }
}
