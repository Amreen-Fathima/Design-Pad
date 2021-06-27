import { Component, OnInit } from '@angular/core';
import { AssetImage } from 'src/app/models/models';
import { AssetService } from 'src/app/services/asset.service';
import { DesignService } from 'src/app/services/design.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
  constructor(public assetService: AssetService, public authService: AuthService, private ds: DesignService) {}

  ngOnInit() {
    this.readImagesByFilter('');
  }

  files: File[] = [];

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      if (files.item(i).type == 'image/jpeg') {
        this.files.push(files.item(i));
      }
    }
  }

  isLoading = false;
  assetImages: AssetImage[] = [];
  readImagesByFilter(tag: string) {
    this.isLoading = true;
    this.assetService.readImageByTag(tag).subscribe((data) => {
      this.assetImages = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetImage;
      });

      this.isLoading = false;
    });
  }

  addTagFn(addedTag: string): string {
    return addedTag;
  }

  onAddRemoveTag(assetImage: AssetImage) {
    this.assetService.updateImageTags(assetImage);
  }

  removeSelected() {
    this.assetService.removeImages(this.selected);
  }

  selected: AssetImage[] = [];
  isSelected(p: AssetImage): boolean {
    return this.selected.findIndex((x) => x.uid === p.uid) > -1;
  }
  onSelect(item: AssetImage): void {
    if (this.isSelected(item)) {
      this.selected = this.selected.filter((x) => x.uid !== item.uid);
    } else {
      this.selected.push(item);
    }
    this.setSelectAllState();
  }

  selectAllState = '';
  setSelectAllState(): void {
    if (this.selected.length === this.assetImages.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.assetImages];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  onSearchKeyUp(event) {
    if (event.keyCode === 13) {
      this.readImagesByFilter(event.target.value);
    }
  }
}
