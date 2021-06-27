import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MoveableService } from '../../../../../services/moveable.service';
import { DesignService } from '../../../../../services/design.service';
import { Item } from '../../../../../models/models';
import { MediaService } from 'src/app/services/media.service';

import * as CSS from 'csstype';

@Component({
  selector: 'app-video-element',
  templateUrl: './video-element.component.html',
  styleUrls: ['./video-element.component.scss'],
})
export class VideoElementComponent implements OnInit {
  @Input('item') item;
  @ViewChild('videoElement') videoElement: ElementRef;

  constructor(public moveableService: MoveableService, public ds: DesignService, public media: MediaService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.media.selectedVideo = null;
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
      zIndex: item.zIndex,
      border: 'none',
      filter: item.filter,
      WebkitFilter: item.filter,
      clipPath: item.clipStyle,
    };
  }

  parentVideoElement(item: Item): CSS.Properties {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: item.w + 'px',
      height: item.h + 'px',
      transform: this.moveableService.strTransform(item),
      WebkitTransform: this.moveableService.strTransform(item),
      zIndex: item.zIndex,
    };
  }

  playButtonStyle(item: Item): CSS.Properties {
    let x = (item.w - 48) / 2;
    let y = (item.h - 48) / 2;
    return {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      top: 0,
      left: 0,
      transform: `translate(${x}px, ${y}px)`,
      WebkitTransform: `translate(${x}px, ${y}px)`,
      border: 'none',
      background: 'rgba(17,23,29,.6)',
      borderRadius: '100%',
      width: '48px',
      height: '48px',
    };
  }
}
