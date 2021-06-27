import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AssetImage } from 'src/app/models/models';
import { decideHeights } from 'src/app/models/geometry';

import { AssetService } from 'src/app/services/asset.service';
import { DesignService } from 'src/app/services/design.service';
import { Subject, Subscription } from 'rxjs';
import * as CSS from 'csstype';
import { AuthService } from 'src/app/shared/auth.service';
import { UserRole } from 'src/app/shared/auth.roles';

@Component({
  selector: 'app-sidebar-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements AfterViewInit {
  @ViewChild('gridContainer', { static: false }) gridContainer: ElementRef;

  item$: Subscription;
  selectedItemTemp: number[] = [];
  selectedItemObserve = new Subject();
  count: number = 0;
  role = UserRole;

  constructor(
    public assetService: AssetService,
    public ds: DesignService,
    public authService: AuthService
  ) {}

  ngAfterViewInit(): void {
    this.readImagesByTag('');

    this.item$ = this.selectedItemObserve.subscribe((items: []) => {
      this.count = items.length;
      if (items.length != 0) {
        (
          document.querySelector('#deleteAdminImageStatus') as HTMLElement
        ).style.opacity = '1';
      } else {
        (
          document.querySelector('#deleteAdminImageStatus') as HTMLElement
        ).style.opacity = '0';
      }
    });
  }

  onImgClick(assetImage: AssetImage) {
    this.ds.addImageItem(assetImage);
  }

  onStartDrag(event: DragEvent, assetImage: AssetImage) {
    event.dataTransfer.setData('jsonAssetImage', JSON.stringify(assetImage));
  }

  onKeyUpSearch(event) {
    if (event.keyCode == 13) {
      this.readImagesByTag(event.target.value);
    }
    if (event.key == 'Delete') {
      console.log('Delete');
    }
  }

  isLoading = false;
  assetImages: AssetImage[] = [];
  heights: number[] = [];
  readImagesByTag(tag: string) {
    this.isLoading = true;
    this.assetService.readImageByTag(tag).subscribe((data) => {
      this.assetImages = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetImage;
      });

      this.heights = decideHeights(this.assetImages, 330, 150, 4);
      this.isLoading = false;
    });
  }

  tags = ['tennis', 'flower', 'football'];

  test(event) {
    console.log(event);
  }

  overImageItem(i) {
    if (
      document.querySelector('#adminImageItem' + i).getAttribute('selected') ==
      'false'
    ) {
      if (this.authService.user?.role == this.role.Admin)
        (
          document
            .querySelector('#adminImageItem' + i)
            .querySelector('div') as HTMLElement
        ).style.display = 'block';
      (
        document.querySelector('#adminImageItem' + i).firstChild as HTMLElement
      ).style.borderColor = '#f16624';
    }
  }

  leaveImageItem(i) {
    if (
      document.querySelector('#adminImageItem' + i).getAttribute('selected') ==
      'false'
    ) {
      if (this.authService.user?.role == this.role.Admin)
        (
          document
            .querySelector('#adminImageItem' + i)
            .querySelector('div') as HTMLElement
        ).style.display = 'none';
      (
        document.querySelector('#adminImageItem' + i).firstChild as HTMLElement
      ).style.borderColor = 'transparent';
    }
  }

  checkBoxStyle(i): CSS.Properties {
    if (
      document.querySelector('#adminImageItem' + i).getAttribute('selected') ==
      'true'
    ) {
      return {
        background: '#f16624',
      };
    } else
      return {
        background: 'white',
      };
  }

  imageItemStyle(i): CSS.Properties {
    if (
      document.querySelector('#adminImageItem' + i).getAttribute('selected') ==
      'true'
    ) {
      return {
        borderColor: '#f16624',
      };
    } else
      return {
        borderColor: 'transparent',
      };
  }

  checkItem(i: number) {
    if (
      document.querySelector('#adminImageItem' + i).getAttribute('selected') ==
      'false'
    ) {
      document
        .querySelector('#adminImageItem' + i)
        .setAttribute('selected', 'true');
      this.selectedItemTemp.push(i);
      this.selectedItemObserve.next(this.selectedItemTemp);
    } else {
      document
        .querySelector('#adminImageItem' + i)
        .setAttribute('selected', 'false');
      for (let j = 0; j < this.selectedItemTemp.length; j++) {
        if (this.selectedItemTemp[j] == i) {
          this.selectedItemTemp.splice(j, 1);
          j--;
        }
      }
      this.selectedItemObserve.next(this.selectedItemTemp);
    }
  }

  deleteImageItem() {
    let arr: AssetImage[] = [];
    for (let i = 0; i < this.selectedItemTemp.length; i++) {
      arr.push(this.assetImages[this.selectedItemTemp[i]]);
    }

    for (let j = 0; j < this.selectedItemTemp.length; j++) {
      this.assetImages.splice(j, 1);
    }
    this.selectedItemTemp = [];
    this.selectedItemObserve.next(this.selectedItemTemp);

    this.assetService.removeImages(arr);
  }

  closePanel() {
    for (let i = 0; i < this.selectedItemTemp.length; i++) {
      if (
        document
          .querySelector('#adminImageItem' + this.selectedItemTemp[i])
          .getAttribute('selected') == 'true'
      ) {
        document
          .querySelector('#adminImageItem' + this.selectedItemTemp[i])
          .setAttribute('selected', 'false');
        (
          document
            .querySelector('#adminImageItem' + this.selectedItemTemp[i])
            .querySelector('div') as HTMLElement
        ).style.display = 'none';
      }
    }
    this.selectedItemTemp = [];
    this.selectedItemObserve.next(this.selectedItemTemp);
  }
}
