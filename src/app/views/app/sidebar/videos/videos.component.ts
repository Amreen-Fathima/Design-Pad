import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AssetVideo } from '../../../../../app/models/models';

import { AssetService } from '../../../../../app/services/asset.service';
import { DesignService } from '../../../../../app/services/design.service';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'sidebar-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements AfterViewInit {
  @ViewChild('gridContainer', { static: false }) gridContainer: ElementRef;

  previewTimer;
  videoEle = document.createElement('video');

  constructor(public assetService: AssetService, public ds: DesignService, public media: MediaService) {}

  ngAfterViewInit(): void {
    this.readVideosByTag('');
  }

  onImgClick(assetVideo: AssetVideo) {
    // this.ds.addVideoItem(assetVideo);
  }

  onStartDrag(event: DragEvent, assetVideo: AssetVideo) {
    event.dataTransfer.setData('jsonAssetImage', JSON.stringify(assetVideo));
  }

  onKeyUpSearch(event) {
    if (event.keyCode == 13) {
      this.readVideosByTag(event.target.value);
    }
    if (event.key == 'Delete') {
      console.log('Delete');
    }
  }

  isLoading = false;
  assetVideos: AssetVideo[] = [];
  ratios: number[] = [];
  padding: number = 4;
  readVideosByTag(tag: string) {
    this.isLoading = true;
    this.assetService.readVideoByTag(tag).subscribe((data) => {
      this.assetVideos = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetVideo;
      });

      this.decideHeights(this.assetVideos, 2, 4);
      this.isLoading = false;
    });
  }

  decideHeights(assetVideos: AssetVideo[], count, padding) {
    let screenWidth = 330 - padding * count * 2;

    for (let i = 1; i < assetVideos.length; i = i + 2) {
      let ratio = screenWidth / (assetVideos[i].width + assetVideos[i - 1].width);

      this.ratios.push(ratio);
      this.ratios.push(ratio);
    }

    if (assetVideos.length % 2 == 1) {
      let width = assetVideos[assetVideos.length - 1].width;
      let height = assetVideos[assetVideos.length - 1].height;

      if (width > height) this.ratios.push(157 / width);
      else this.ratios.push(88.313 / height);
    }
  }

  tags = [];

  startClipVideo(index) {
    this.previewTimer = setTimeout(() => {
      let thumbnailParentEle = document.querySelector('#videoThumbnail' + index).parentElement as HTMLElement;

      this.videoEle.style.width = this.assetVideos[index].width * this.ratios[index] + this.padding * 2 + 'px';
      this.videoEle.style.height = this.assetVideos[index].height * this.ratios[index] + this.padding * 2 + 'px';
      this.videoEle.src = this.assetVideos[index].downloadURL;

      this.videoEle.classList.add('loopVideo');

      thumbnailParentEle.appendChild(this.videoEle);
      (document.querySelector('#videoThumbnail' + index) as HTMLElement).style.border = '1px solid #f16624';

      this.videoEle.oncanplay = () => {
        this.videoEle.play();
      };
    }, 100);
  }

  stopClipVideo(index) {
    (document.querySelector('#videoThumbnail' + index) as HTMLElement).style.border = '1px solid transparent';
    this.videoEle.remove();
    clearTimeout(this.previewTimer);
  }

  convertDuration(duration) {
    let min = Math.floor(duration / 60);
    let sec = Math.floor(duration % 60).toString();

    if (min == 0) {
      return sec + '.0s';
    } else {
      if (Number.parseFloat(sec) < 10) sec = '0' + sec;
      return min + ':' + sec;
    }
  }

  addVideoOnPage(item) {
    this.ds.sidebar_video_add(item);
  }
}
