import { Component, OnInit } from '@angular/core';
import { AssetMusic } from 'src/app/models/models';
import { AssetService } from 'src/app/services/asset.service';
import { DesignService } from 'src/app/services/design.service';
import { AuthService } from 'src/app/shared/auth.service';
import { MusicUpload } from 'src/app/models/music-upload';

@Component({
  selector: 'app-musics',
  templateUrl: './musics.component.html',
  styleUrls: ['./musics.component.scss'],
})
export class MusicsComponent implements OnInit {
  constructor(public assetService: AssetService, public authService: AuthService, private ds: DesignService) {}

  ngOnInit() {
    this.readMusicsByFilter('');
  }

  files: File[] = [];

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      if (files.item(i).type == 'audio/mpeg') {
        this.files.push(files.item(i));
      }
    }
  }

  isLoading = false;
  assetMusics: AssetMusic[] = [];
  readMusicsByFilter(tag: string) {
    this.isLoading = true;
    this.assetService.readMusicByTag(tag).subscribe((data) => {
      this.assetMusics = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetMusic;
      });

      this.isLoading = false;
    });
  }

  addTagFn(addedTag: string): string {
    return addedTag;
  }

  onAddRemoveTag(assetMusic: AssetMusic) {
    this.assetService.updateMusicTags(assetMusic);
  }

  removeSelected() {
    this.assetService.removeMusics(this.selected);
  }

  selected: AssetMusic[] = [];
  isSelected(p: AssetMusic): boolean {
    return this.selected.findIndex((x) => x.uid === p.uid) > -1;
  }
  onSelect(item: AssetMusic): void {
    if (this.isSelected(item)) {
      this.selected = this.selected.filter((x) => x.uid !== item.uid);
    } else {
      this.selected.push(item);
    }
    this.setSelectAllState();
  }

  selectAllState = '';
  setSelectAllState(): void {
    if (this.selected.length === this.assetMusics.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.assetMusics];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  onSearchKeyUp(event) {
    if (event.keyCode === 13) {
      this.readMusicsByFilter(event.target.value);
    }
  }

  updateThumbnail(files, assetMusic) {
    this.assetService.updateMusicThumbnail(files[0], assetMusic);
  }
}
