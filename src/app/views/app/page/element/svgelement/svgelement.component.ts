import { Component, Input, OnInit } from '@angular/core';
import { MoveableService } from 'src/app/services/moveable.service';
import { Item, Page } from 'src/app/models/models';
import { ItemStatus, ItemType } from 'src/app/models/enums';

import * as CSS from 'csstype';
import { DesignService } from 'src/app/services/design.service';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

@Component({
  selector: 'app-svgelement',
  templateUrl: './svgelement.component.html',
  styleUrls: ['./svgelement.component.scss'],
})
export class SVGElementComponent implements OnInit {
  @Input('item') item;

  constructor(public moveableService: MoveableService, public ds: DesignService, public ur: UndoRedoService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!this.ur.isUndoRedo) this.ds.setStatus(ItemStatus.element_selected);
    setTimeout(() => {
      let svgEle = document.querySelector('#SVGElement-' + this.item.pageId + '-' + this.item.itemId);
      svgEle.innerHTML = this.item.SVGElement;

      let htmlCollect = svgEle.querySelectorAll('svg');

      if (htmlCollect[0].getAttribute('viewBox')) {
        htmlCollect[0].setAttribute('viewBox', htmlCollect[0].getAttribute('viewBox'));
      } else {
        let width = htmlCollect[0].clientWidth;
        let height = htmlCollect[0].clientHeight;
        htmlCollect[0].setAttribute('viewBox', '0, 0, ' + width + ', ' + height);
      }
      htmlCollect[0].setAttribute('width', this.item.w);
      htmlCollect[0].setAttribute('height', this.item.h);

      this.moveableService.selectedItemId = this.item.itemId;
      this.moveableService.selectedPageId = this.item.pageId;

      this.getSVGColorCollection();
    });
  }

  styleItem(item: Item): CSS.Properties {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: item.w + 'px',
      height: item.h + 'px',
      transform: this.moveableService.strTransform(item),
      WebkitTransform: this.moveableService.strTransform(item),
      filter: item.filter,
      WebkitFilter: item.filter,
      clipPath: item.clipStyle,
      zIndex: item.zIndex,
    };
  }

  getSVGColorCollection() {
    let svgEle = document.querySelector('#SVGElement-' + this.item.pageId + '-' + this.item.itemId);
    let tags = ['path', 'circle', 'rect', 'polygon', 'ellipse', 'text'];

    for (let i = 0; i < tags.length; i++) {
      let index = 0;
      svgEle.querySelectorAll(tags[i]).forEach((ele) => {
        let color;
        let pathEle = ele as SVGPathElement;
        if (getComputedStyle(pathEle).fill) {
          color = getComputedStyle(pathEle).fill;
        } else {
          color = pathEle.getAttribute('fill');
        }
        if (color == 'none') {
          color = '#ffffff';
        }
        if (color == undefined && color == null) {
          color = '#000000';
        }
        if (color.indexOf('rgb(') == 0) {
          color = this.RGBToHex(color);
        }
        if (color.length == 4 && color.indexOf('#') == 0) {
          color = '#' + color.substr(1) + color.substr(1);
        }
        if (color.indexOf('url') < 0 && color.indexOf('current') != 0) {
          if (this.sameColorFilter(color)) {
            this.item.color.push(color);
          }
          if (!this.item.colorAndIndex[color]) {
            this.item.colorAndIndex[color] = [];
          }
          const tagIndex = this.selectTagName(tags[i]);
          this.item.colorAndIndex[color].push(tagIndex);
          this.item.colorAndIndex[color].push(index);
        }
        index++;
      });
    }

    if (this.item.color.length > 6) {
      this.item.color = [];
      this.item.colorAndIndex = {};
    }
  }

  selectTagName(name) {
    let tagName;
    switch (name) {
      case 'path':
        tagName = -1;
        break;
      case 'circle':
        tagName = -2;
        break;
      case 'rect':
        tagName = -3;
        break;
      case 'polygon':
        tagName = -4;
        break;
      case 'ellipse':
        tagName = -5;
        break;
      case 'text':
        tagName = -6;
        break;
    }

    return tagName;
  }

  sameColorFilter(color) {
    for (let i = 0; i < this.item.color.length; i++) {
      if (this.item.color[i] == color) {
        return false;
      }
    }

    return true;
  }

  RGBToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb.substr(4).split(')')[0].split(sep);

    let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);

    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;

    return '#' + r + g + b;
  }
}
