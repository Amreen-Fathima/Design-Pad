import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { DesignService } from 'src/app/services/design.service';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ItemStatus, ItemType } from 'src/app/models/enums';

@Component({
  selector: 'app-text-toolbar',
  templateUrl: './text-toolbar.component.html',
  styleUrls: ['./text-toolbar.component.scss'],
})
export class TextToolbarComponent implements OnInit {
  @ViewChild('fontSizeInput', { read: MatAutocompleteTrigger })
  fontSizeInput: MatAutocompleteTrigger;

  ItemStatus = ItemStatus;

  fontControl = new FormControl();
  myControl = new FormControl();

  fontSizes = [];
  currentFontSize: string;
  sizeEle: HTMLInputElement;
  fontEle: HTMLInputElement;

  letter;
  lineHeight;
  isShowLineHeight: boolean = false;
  textColor = '#000000';
  textBgColor = '#ffffff';
  // textItems = [];
  // targets = [];

  constructor(public moveableService: MoveableService, public toolbarService: ToolbarService, public ds: DesignService) {}

  ngOnInit(): void {
    let offset = 2;
    for (let i = 6; i <= 144; i += offset) {
      this.fontSizes.push(i);
      switch (i) {
        case 18:
          offset = 3;
          break;
        case 24:
          offset = 4;
          break;
        case 36:
          offset = 6;
          break;
        case 48:
          offset = 8;
          break;
        case 104:
          offset = 16;
          break;
        case 120:
          offset = 24;
          break;
      }
    }
  }

  ngAfterViewInit(): void {
    let thePageItem = this.ds.theDesign.pages[this.moveableService.selectedPageId].items;
    this.toolbarService.textItems = [];
    this.toolbarService.targets = [];

    for (let i = 0; i < thePageItem.length; i++) {
      if (thePageItem[i].selected) {
        this.toolbarService.targets.push(
          document.querySelector(this.ds.getType(thePageItem[i].type) + thePageItem[i].pageId + '-' + thePageItem[i].itemId)
        );
        if (thePageItem[i].type == ItemType.text) this.toolbarService.textItems.push(thePageItem[i]);
      }
    }

    for (let i = 0; i < this.toolbarService.textItems.length; i++) {
      let selectorEle = document.querySelector<HTMLElement>(
        '#textSelector-' + this.toolbarService.textItems[i].pageId + '-' + this.toolbarService.textItems[i].itemId
      );
      let item = this.moveableService.getItem(selectorEle);

      if (!i) this.toolbarService.createTextEditor(this.toolbarService.textItems[i].pageId, this.toolbarService.textItems[i].itemId, true);
      else this.toolbarService.createTextEditor(this.toolbarService.textItems[i].pageId, this.toolbarService.textItems[i].itemId, false);

      // this.sizeEle = document.querySelector<HTMLInputElement>('#fontSizeInput');
      // this.fontEle = document.querySelector<HTMLInputElement>('#fontInput');

      // setTimeout(() => {
      //   this.sizeEle.value = (Math.floor(Number.parseFloat(item.fontSize.substr(0, item.fontSize.length - 2)) * 10) / 10).toString();
      //   this.fontControl.disable();
      // });

      let qlEditor = document
        .querySelector('#textEditor-' + this.toolbarService.textItems[i].pageId + '-' + this.toolbarService.textItems[i].itemId)
        .querySelector('.ql-editor') as HTMLElement;
      qlEditor.style.lineHeight = item.lineHeight + 'em';
      qlEditor.style.letterSpacing = Number.parseFloat(item.letterSpacing) / 1000 + 'em';

      let fontFormEle = document.querySelector('#fontForm').firstChild.firstChild.firstChild as HTMLElement;
      let fontSelector = document.querySelector('#fontSelector') as HTMLElement;

      fontSelector.style.width = fontFormEle.clientWidth + 'px';
      fontSelector.style.height = fontFormEle.clientHeight + 'px';
    }

    this.sizeEle = document.querySelector<HTMLInputElement>('#fontSizeInput');
    this.fontEle = document.querySelector<HTMLInputElement>('#fontInput');

    let hasSameFontSize = true;
    let hasSameFontFamily = true;
    for (let i = 0; i < this.toolbarService.textItems.length - 1; i++) {
      if (this.toolbarService.textItems[i].fontSize != this.toolbarService.textItems[i + 1].fontSize) hasSameFontSize = false;
      if (this.toolbarService.textItems[i].fontFamily != this.toolbarService.textItems[i + 1].fontFamily) hasSameFontFamily = false;
    }

    setTimeout(() => {
      if (hasSameFontSize)
        this.sizeEle.value = (
          Math.floor(
            Number.parseFloat(this.toolbarService.textItems[0].fontSize.substr(0, this.toolbarService.textItems[0].fontSize.length - 2)) * 10
          ) / 10
        ).toString();
      if (hasSameFontFamily) this.fontEle.value = this.toolbarService.textItems[0].fontFamily;
      else this.fontEle.value = 'Multi Fonts...';
      this.fontControl.disable();
    });

    // add event to bolb button
    document.querySelector('#bold').addEventListener('click', () => {
      for (let i = 0; i < this.toolbarService.quills.length; i++) {
        let quill = this.toolbarService.quills[i];
        let length: number = quill.getLength();

        if (this.toolbarService.quills.length > 1 || quill.getSelection()?.length == 0) {
          this.moveableService.enableTextEdit();
          if (quill.getFormat(0, length - 1).bold) quill.formatText(0, length - 1, 'bold', false);
          else quill.formatText(0, length - 1, 'bold', true);
        }
        quill.blur();
      }
    });

    document.querySelector('#italic').addEventListener('click', () => {
      for (let i = 0; i < this.toolbarService.quills.length; i++) {
        let quill = this.toolbarService.quills[i];
        let length: number = quill.getLength();

        if (this.toolbarService.quills.length > 1 || quill.getSelection()?.length == 0) {
          this.moveableService.enableTextEdit();
          if (quill.getFormat(0, length - 1).italic) quill.formatText(0, length - 1, 'italic', false);
          else quill.formatText(0, length - 1, 'italic', true);
        }
        quill.blur();
      }
    });

    document.querySelector('#underline').addEventListener('click', () => {
      for (let i = 0; i < this.toolbarService.quills.length; i++) {
        let quill = this.toolbarService.quills[i];
        let length: number = quill.getLength();

        if (this.toolbarService.quills.length > 1 || quill.getSelection()?.length == 0) {
          this.moveableService.enableTextEdit();
          if (quill.getFormat(0, length - 1).underline) quill.formatText(0, length - 1, 'underline', false);
          else quill.formatText(0, length - 1, 'underline', true);
        }
        quill.blur();
      }
    });

    document.querySelector('#strike').addEventListener('click', () => {
      for (let i = 0; i < this.toolbarService.quills.length; i++) {
        let quill = this.toolbarService.quills[i];
        let length: number = quill.getLength();

        if (this.toolbarService.quills.length > 1 || quill.getSelection()?.length == 0) {
          this.moveableService.enableTextEdit();
          if (quill.getFormat(0, length - 1).strike) quill.formatText(0, length - 1, 'strike', false);
          else quill.formatText(0, length - 1, 'strike', true);
        }
        quill.blur();
      }
    });

    document.querySelector('#color').addEventListener('click', () => {
      (document.querySelector('#color').querySelector('input') as HTMLElement).click();
    });

    document.querySelector('#bgColor').addEventListener('click', () => {
      (document.querySelector('#bgColor').querySelector('input') as HTMLElement).click();
    });
  }

  changeTextColor() {
    for (let i = 0; i < this.toolbarService.quills.length; i++) {
      let quill = this.toolbarService.quills[i];
      let length: number = quill.getLength();

      if (
        this.toolbarService.targets.length > 1 ||
        !this.toolbarService.range ||
        this.toolbarService.range == null ||
        this.toolbarService.range?.length == 0
      ) {
        this.moveableService.enableTextEdit();
        quill.formatText(0, length - 1, 'color', this.textColor);
        quill.blur();
      } else {
        quill.formatText(this.toolbarService.range.index, this.toolbarService.range.length, 'color', this.textColor);
        setTimeout(() => {
          this.toolbarService.quills[0].setSelection(this.toolbarService.range.index, this.toolbarService.range.length);
        });
      }
      if (this.toolbarService.quills.length != 1) quill.blur();
    }
  }

  changeBgTextColor() {
    for (let i = 0; i < this.toolbarService.quills.length; i++) {
      let quill = this.toolbarService.quills[i];
      let length: number = quill.getLength();

      if (
        this.toolbarService.targets.length > 1 ||
        !this.toolbarService.range ||
        this.toolbarService.range == null ||
        this.toolbarService.range?.length == 0
      ) {
        this.moveableService.enableTextEdit();
        quill.formatText(0, length - 1, 'background', this.textBgColor);
        quill.blur();
      } else {
        quill.formatText(this.toolbarService.range.index, this.toolbarService.range.length, 'background', this.textBgColor);
        setTimeout(() => {
          this.toolbarService.quills[0].setSelection(this.toolbarService.range.index, this.toolbarService.range.length);
        });
      }
      if (this.toolbarService.quills.length != 1) quill.blur();
    }
  }

  catchEnterKey(event) {
    if (event.charCode == 13) {
      this.fontSizeInput.closePanel();
      this.setFontSize(this.sizeEle.value);
    }
  }

  showPanel() {
    this.sizeEle.select();
    this.fontSizeInput.openPanel();
  }

  optionSelected() {
    this.setFontSize(this.sizeEle.value);
  }

  setFontSize(fontSize: string) {
    for (let i = 0; i < this.toolbarService.textItems.length; i++) {
      let ele = document.querySelector<HTMLElement>(
        '#textEditor-' + this.toolbarService.textItems[i].pageId + '-' + this.toolbarService.textItems[i].itemId
      );
      let item = this.moveableService.getItem(ele);
      item.fontSize = fontSize + 'px';
      ele.style.fontSize = item.fontSize;
    }
  }

  showFontList() {
    this.ds.setStatus(this.ItemStatus.text_font_list);
  }

  showTextEffects() {
    this.ds.setStatus(this.ItemStatus.text_effect);
  }

  // set Line Height and Letter space
  setLineHeight() {
    let item = this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId];

    this.lineHeight = Number.parseFloat(item.lineHeight);
    this.letter = Number.parseFloat(item.letterSpacing);

    this.isShowLineHeight = this.isShowLineHeight ? false : true;
  }

  onLetterChange(event) {
    this.letter = event.value;

    this.toolbarService.enableLineHeight(this.letter, this.lineHeight);
  }
  inputLetterChange(event) {
    this.letter = event.target.value;
    this.toolbarService.enableLineHeight(this.letter, this.lineHeight);
  }
  onLineHeightChange(event) {
    this.lineHeight = event.value;

    this.toolbarService.enableLineHeight(this.letter, this.lineHeight);
  }
  inputLineHeightChange(event) {
    this.lineHeight = event.target.value;
    this.toolbarService.enableLineHeight(this.letter, this.lineHeight);
  }
}
