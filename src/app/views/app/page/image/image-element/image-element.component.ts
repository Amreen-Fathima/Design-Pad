import { Component, Input, OnInit } from '@angular/core';
import { MoveableService } from '../../../../../services/moveable.service';
import { Item } from '../../../../../models/models';

import * as CSS from 'csstype';

@Component({
  selector: 'app-image-element',
  templateUrl: './image-element.component.html',
  styleUrls: ['./image-element.component.scss'],
})
export class ImageElementComponent implements OnInit {
  @Input('item') item;

  constructor(public moveableService: MoveableService) {}

  ngOnInit(): void {}

  styleItem(item: Item): CSS.Properties {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: item.w + 'px',
      height: item.h + 'px',
      transform: this.moveableService.strTransform(item),
      WebkitTransform: this.moveableService.strTransform(item),
      border: 'none',
      filter: item.filter,
      WebkitFilter: item.filter,
      clipPath: item.clipStyle,
      zIndex: item.zIndex,
    };
  }
}
