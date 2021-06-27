import { Injectable } from '@angular/core';
import { ItemStatus } from '../models/enums';
import { DesignService } from './design.service';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  audio = new Audio();
  volume;
  isPlayMusic: boolean = true;
  isSoundContent: boolean = false;
  isMute: boolean = false;
  playMusicProgressTimer;
  currentTime = 0;
  angle: number = 0;
  duration: number;
  selectedVideo: HTMLVideoElement = null;

  constructor(public ds: DesignService) {}

  addMusic() {
    this.audio.src = this.selectedMusic.downloadURL;

    setTimeout(() => {
      let ele = document.querySelector('.rotateIcon').firstChild as HTMLElement;
      ele.style.transform = 'rotate(0deg)';
      ele = document.querySelector('#musicProgress') as HTMLElement;
      ele.style.width = '0%';
    });
    this.setDefault();
  }

  selectedMusic = null;
  convertDuration(duration) {
    let min = Math.floor(parseInt(duration) / 60);
    let sec = Math.ceil(parseInt(duration) % 60).toString();

    if (Number.parseInt(sec) < 10) {
      sec = '0' + sec;
    }

    return min + ':' + sec;
  }

  playMusic() {
    this.duration = this.audio.duration;

    this.audio.load();
    this.audio.currentTime = this.currentTime;
    this.volume = this.audio.volume * 100;

    this.audio.play();

    this.playMusicProgress();
  }

  stopMusic() {
    this.audio.pause();
    clearInterval(this.playMusicProgressTimer);

    let ele = document.querySelector('.rotateIcon').firstChild as HTMLElement;
    ele.style.transform = 'rotate(0deg)';
    this.angle = 0;
  }

  playMusicProgress() {
    let rotateEle = document.querySelector('.rotateIcon').firstChild as HTMLElement;

    this.playMusicProgressTimer = setInterval(() => {
      this.angle++;
      if (this.angle == 360) this.angle = 0;
      rotateEle.style.transform = 'rotate(' + this.angle + 'deg)';

      this.currentTime = this.audio.currentTime;
      if (document.querySelector('#musicProgress'))
        (document.querySelector('#musicProgress') as HTMLElement).style.width = (this.audio.currentTime / this.duration) * 100 + '%';

      if (this.audio.currentTime >= this.duration) {
        this.setDefault();
      }
      if (this.isMute) this.audio.volume = 0;
      else this.audio.volume = this.volume / 100;
    }, 10);
  }

  deleteMusic() {
    let ele = document.querySelector('.rotateIcon').firstChild as HTMLElement;
    ele.style.transform = 'rotate(0deg)';
    ele = document.querySelector('#musicProgress') as HTMLElement;
    ele.style.width = '0%';

    this.setDefault();
    this.selectedMusic = null;
    this.ds.status = ItemStatus.none;
    this.audio.pause();
  }

  setDefault() {
    this.isPlayMusic = true;
    this.currentTime = 0;
    this.angle = 0;

    clearInterval(this.playMusicProgressTimer);
  }

  setMusicPosition(pos) {
    if (!this.isPlayMusic) {
      this.audio.pause();
      clearInterval(this.playMusicProgressTimer);
    }

    this.currentTime = (this.selectedMusic.duration * Number.parseFloat(pos)) / 100;
    this.audio.currentTime = this.currentTime;

    this.isPlayMusic = false;
    this.playMusic();
  }

  playVideoProgressTimer;
  // playVideo() {
  //   this.selectedVideo.play();

  //   this.playVideoProgressTimer = setInterval(() => {
  //     this.currentVideoTime = this.selectedVideo.currentTime;

  //     if (document.querySelector('#videoProgress')) {
  //       (document.querySelector('#videoProgress') as HTMLElement).style.width =
  //         (this.selectedVideo.currentTime / this.selectedVideo.duration) * 100 + '%';
  //       // console.log((this.selectedVideo.currentTime / this.selectedVideo.duration) * 100);
  //     }
  //     if (this.selectedVideo.currentTime >= this.selectedVideo.duration) clearInterval(this.playVideoProgressTimer);
  //   }, 10);
  // }

  stopVideo() {
    this.selectedVideo.pause();
    clearInterval(this.playVideoProgressTimer);
    console.log('stop');
  }

  setVideoPosition(pos) {
    this.stopVideo();
    let currentVideoTime = this.selectedVideo.duration * pos;
    return currentVideoTime;
  }
}
