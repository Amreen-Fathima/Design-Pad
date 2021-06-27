import { Component, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { ItemStatus, ItemType } from '../../../../models/enums';
import { Colors } from '../../../../constants/colors.service';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

@Component({
  selector: 'app-video-toolbar',
  templateUrl: './video-toolbar.component.html',
  styleUrls: ['./video-toolbar.component.scss'],
})
export class VideoToolbarComponent implements OnInit {
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

      // let pathEles = svgEle.querySelectorAll(tagName);
      // let index = 0;

      // if (this.colorAndIndex.length != 0) {
      //   for (let i = 0; i < pathEles.length; i++) {
      // if (this.colorAndIndex[previousColor][index] == i) {
      let innerTag = svgEle.querySelectorAll(tagName)[this.colorAndIndex[previousColor][i + 1]];
      if (innerTag.style.fill) {
        innerTag.style.fill = color;
      } else {
        innerTag.setAttribute('fill', color);
      }

      // index++;
      // if (index >= this.colorAndIndex[previousColor].length) {
      //   return;
      // }
      // }
      //   }
      // }
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
    this.ur.theData(this.ds.theDesign);
  }

  renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
}
