import { Component, OnInit } from '@angular/core';
// import { AssetElement } from '../../../../../src/app/models/models';
import { AssetVideo } from '../../../../../src/app/models/models';
import { AssetService } from '../../../../../src/app/services/asset.service';
import { DesignService } from '../../../../../src/app/services/design.service';
import { AuthService } from '../../../../../src/app/shared/auth.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {
  constructor(public assetService: AssetService, public authService: AuthService, private ds: DesignService) {}

  ngOnInit() {
    this.readVideoByFilter('');
  }

  files: File[] = [];

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      if (files.item(i).type.slice(0, 6) == 'video/') {
        this.files.push(files.item(i));
      }
    }
  }

  isLoading = false;
  assetVideos: AssetVideo[] = [];
  readVideoByFilter(tag: string) {
    this.isLoading = true;
    this.assetService.readVideoByTag(tag).subscribe((data) => {
      this.assetVideos = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetVideo;
      });

      this.isLoading = false;
    });
  }

  addTagFn(addedTag: string): string {
    return addedTag;
  }

  onAddRemoveTag(assetVideo: AssetVideo) {
    this.assetService.updateVideoTags(assetVideo);
  }

  removeSelected() {
    this.assetService.removeVideos(this.selected);
  }

  selected: AssetVideo[] = [];
  isSelected(p: AssetVideo): boolean {
    return this.selected.findIndex((x) => x.uid === p.uid) > -1;
  }
  onSelect(item: AssetVideo): void {
    if (this.isSelected(item)) {
      this.selected = this.selected.filter((x) => x.uid !== item.uid);
    } else {
      this.selected.push(item);
    }
    this.setSelectAllState();
  }

  selectAllState = '';
  setSelectAllState(): void {
    if (this.selected.length === this.assetVideos.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.assetVideos];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  onSearchKeyUp(event) {
    if (event.keyCode === 13) {
      this.readVideoByFilter(event.target.value);
    }
  }
}
