import { Component, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { ItemStatus, ItemType } from '../../../../models/enums';
import { Colors } from '../../../../constants/colors.service';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

@Component({
  selector: 'app-element-toolbar',
  templateUrl: './element-toolbar.component.html',
  styleUrls: ['./element-toolbar.component.scss'],
})
export class ElementToolbarComponent implements OnInit {
  ItemStatus = ItemStatus;
  activeColor = Colors.getColors().separatorColor;

  color;
  colorAndIndex;

  constructor(public moveableService: MoveableService, public ds: DesignService, public ur: UndoRedoService) {}

  ngOnInit(): void {
    this.color = this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId]['color'];
    this.colorAndIndex = this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId]['colorAndIndex'];
  }

  changeElementColor(event, index) {
    this.setColor(this.color[index], event.target.value);
  }

  setColor(previousColor, color) {
    let tagName;
    let svgEle = document.querySelector('#SVGElement-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId);

    for (let i = 0; i < this.colorAndIndex[previousColor].length; i = i + 2) {
      tagName = this.selectTagName(this.colorAndIndex[previousColor][i]);

      let innerTag = svgEle.querySelectorAll(tagName)[this.colorAndIndex[previousColor][i + 1]];
      // if (innerTag.style.fill) {
      if (getComputedStyle(innerTag as Element).fill) {
        innerTag.style.fill = color;
      } else {
        innerTag.setAttribute('fill', color);
      }
    }
  }

  selectTagName(index) {
    let tagName;
    switch (index) {
      case -1:
        tagName = 'path';
        break;
      case -2:
        tagName = 'circle';
        break;
      case -3:
        tagName = 'rect';
        break;
      case -4:
        tagName = 'polygon';
        break;
      case -5:
        tagName = 'ellipse';
        break;
      case -6:
        tagName = 'text';
        break;
    }

    return tagName;
  }

  setColorToSvg(event, index) {
    this.renameKey(this.colorAndIndex, this.color[index], event.target.value);
    this.color[index] = event.target.value;
    this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId].color[index] = this.color[index];
    this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId].SVGElement = document.querySelector(
      '#SVGElement-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    ).innerHTML;
    this.ur.saveTheData(this.ds.theDesign);
  }

  renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
}
