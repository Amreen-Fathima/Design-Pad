import { Component, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'app-music-toolbar',
  templateUrl: './music-toolbar.component.html',
  styleUrls: ['./music-toolbar.component.scss'],
})
export class MusicToolbarComponent implements OnInit {
  constructor(public ds: DesignService, public media: MediaService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    (document.querySelector('#musicProgress') as HTMLElement).style.width = (this.media.audio.currentTime / this.media.duration) * 100 + '%';
    (document.querySelector('.rotateIcon') as HTMLElement).style.border = '2px solid #00c4cc';
  }

  ngOnDestroy(): void {
    (document.querySelector('.rotateIcon') as HTMLElement).style.border = '';
    this.media.isSoundContent = false;
  }

  togglePlayButton() {
    if (this.media.isPlayMusic) {
      this.media.playMusic();
    } else this.media.stopMusic();

    this.media.isPlayMusic = !this.media.isPlayMusic;
  }

  deleteMusic() {
    this.media.deleteMusic();
  }

  setProgressPosition(e) {
    let ele = document.getElementById('progress_bar_box') as HTMLElement;

    let x = e.pageX - ele.offsetLeft;
    let clickedValue = (x / ele.offsetWidth) * 100;
    this.media.setMusicPosition(clickedValue);
  }

  controlVolume() {
    this.media.isSoundContent = !this.media.isSoundContent;
  }

  changeSlide(event) {
    this.media.volume = event.value;

    if (this.media.volume == 0) this.media.isMute = true;
    else if (event.value > 0 && this.media.isMute) this.media.isMute = false;
  }

  inputVolumeValue(event) {
    if (event.target.value > 100) {
      this.media.volume = 100;
    }
    this.media.volume = event.target.value;

    if (this.media.volume == 0) this.media.isMute = true;
    else if (this.media.volume > 0 && !this.media.isMute) this.media.isMute = false;
  }
}
