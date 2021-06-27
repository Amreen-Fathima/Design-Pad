import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { Item } from 'src/app/models/models';
import { ItemStatus } from 'src/app/models/enums';
import { MediaService } from 'src/app/services/media.service';

import * as CSS from 'csstype';

@Component({
  selector: 'app-video-selector',
  templateUrl: './video-selector.component.html',
  styleUrls: ['./video-selector.component.scss'],
})
export class VideoSelectorComponent implements OnInit {
  @Input('item') item;
  @ViewChild('videoSelector') videoSelector: ElementRef;

  ItemStatus = ItemStatus;
  currentVideoduration = 0;

  constructor(public ds: DesignService, public moveableService: MoveableService, public media: MediaService) {}

  ngOnInit(): void {
    this.ds.setStatus(ItemStatus.video_selected);
  }

  ngAfterViewInit(): void {
    if (!this.ds.isTemplate && this.ds.isAddItem) {
      this.moveableService.copiedTheData = [];
      this.moveableService.copiedTheData.push(this.moveableService.getItem(this.videoSelector.nativeElement));
      this.moveableService.onSelectTargets([this.videoSelector.nativeElement]);
    } else {
      this.ds.copiedTargets.push(this.videoSelector.nativeElement);
      this.moveableService.onSelectTargets(this.ds.copiedTargets);
    }
    this.ds.isAddItem = false;

    this.media.selectedVideo = document.querySelector('#VideoElement' + this.item.pageId + '-' + this.item.itemId) as HTMLVideoElement;
    this.setIntervalVideo();

    this.moveableService.onPageElements.push(document.querySelector(this.ds.getType(this.item.type) + this.item.pageId + '-' + this.item.itemId));
  }

  styleItemPosition(item: Item): CSS.Properties {
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

  playButtonSelector(item: Item): CSS.Properties {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '48px',
      height: '48px',
      transform: `translate(${
        (item.w * item.clipPathToNumber[3]) / 100 + (item.w * (1 - (item.clipPathToNumber[1] + item.clipPathToNumber[3]) / 100) - 48) / 2
      }px, ${
        (item.h * item.clipPathToNumber[0]) / 100 + (item.h * (1 - (item.clipPathToNumber[0] + item.clipPathToNumber[2]) / 100) - 48) / 2
      }px) scale(${item.scaleX}, ${item.scaleY})`,
      WebkitTransform: `translate(${
        (item.w * item.clipPathToNumber[3]) / 100 + (item.w * (1 - (item.clipPathToNumber[1] + item.clipPathToNumber[3]) / 100) - 48) / 2
      }px, ${
        (item.h * item.clipPathToNumber[0]) / 100 + (item.h * (1 - (item.clipPathToNumber[0] + item.clipPathToNumber[2]) / 100) - 48) / 2
      }px) scale(${item.scaleX}, ${item.scaleY})`,
      zIndex: item.zIndex,
      cursor: 'pointer',
      background: 'rgba(17,23,29,.6)',
      borderRadius: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
  }

  videoProgressStyle(item) {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: item.w * (1 - (item.clipPathToNumber[1] + item.clipPathToNumber[3]) / 100) + 'px',
      height: '38px',
      transform: `translate(${(item.w * item.clipPathToNumber[3]) / 100}px, ${item.h - (item.h * item.clipPathToNumber[2]) / 100 - 38}px))`,
      WebkitTransform: `translate(${(item.w * item.clipPathToNumber[3]) / 100}px, ${item.h - (item.h * item.clipPathToNumber[2]) / 100 - 38}px)`,
      zIndex: item.zIndex,
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
  }

  playVideo() {
    if (this.item.onPlayVideo) this.media.stopVideo();
    else this.setIntervalVideo();

    this.item.onPlayVideo = !this.item.onPlayVideo;
  }

  startVideoCrop() {
    // if (this.onPlayVideo) {
    //   this.media.stopVideo();
    // }
    this.ds.setStatus(ItemStatus.video_crop);
  }

  setProgressPosition(e, item) {
    let ele = document.getElementById('progress_bar_box') as HTMLElement;
    let vid = (document.getElementById('VideoElement' + item.pageId + '-' + item.itemId) as HTMLVideoElement).getBoundingClientRect();

    let x = e.pageX - ele.getBoundingClientRect().left;
    let clickedValue = (x / ele.clientWidth / this.ds.zoomValue) * 100;
    this.currentVideoduration = this.media.setVideoPosition(clickedValue);

    this.item.onPlayVideo = false;
    this.playVideo();
  }

  setIntervalVideo() {
    this.media.selectedVideo.currentTime = this.currentVideoduration;
    this.media.selectedVideo.play();

    this.media.playVideoProgressTimer = setInterval(() => {
      this.currentVideoduration = this.media.selectedVideo.currentTime;

      if (document.querySelector('#videoProgress')) {
        (document
          .querySelector('#VideoSelector-' + this.item.pageId + '-' + this.item.itemId)
          .querySelector('#videoProgress') as HTMLElement).style.width =
          (this.media.selectedVideo.currentTime / this.media.selectedVideo.duration) * 100 + '%';
      }
      if (this.media.selectedVideo.currentTime >= this.media.selectedVideo.duration) {
        clearInterval(this.media.playVideoProgressTimer);
        this.item.onPlayVideo = false;
      }
    }, 10);
  }
}
