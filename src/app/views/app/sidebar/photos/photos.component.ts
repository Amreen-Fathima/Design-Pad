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
import { UnsplashService } from './../../../../services/unsplash.service';
import { PexelService } from './../../../../services/pexel.service';

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
  unsplashItems = [];
  pexelItems = [];
  photoItems = [];

  constructor(
    public assetService: AssetService,
    public ds: DesignService,
    public authService: AuthService,
    private unsplashService: UnsplashService,
    private pexelService: PexelService
  ) {}

  ngAfterViewInit(): void {
    this.readImagesByTag(10);

    // this.item$ = this.selectedItemObserve.subscribe((items: []) => {
    //   this.count = items.length;
    //   if (items.length != 0) {
    //     (
    //       document.querySelector('#deleteAdminImageStatus') as HTMLElement
    //     ).style.opacity = '1';
    //   } else {
    //     (
    //       document.querySelector('#deleteAdminImageStatus') as HTMLElement
    //     ).style.opacity = '0';
    //   }
    // });
  }

  onImgClick(assetImage) {
    if (assetImage.urls !== undefined) {
      this.ds.addImageItem({
        uid: assetImage.id,
        downloadURL: assetImage.links.download,
        path: assetImage.links.download_location,
        thumbnail: assetImage.urls.thumb,
        width: assetImage.width,
        height: assetImage.height,
        timestamp: new Date().getTime(),
        userId: 'admin',
        tags: [''],
      });
    } else {
      this.ds.addImageItem({
        uid: assetImage.id,
        downloadURL: assetImage.src.original,
        path: assetImage.src.photographer_url,
        thumbnail: assetImage.src.original,
        width: assetImage.width,
        height: assetImage.height,
        timestamp: new Date().getTime(),
        userId: 'admin',
        tags: [''],
      });
    }
    // else {
    //   this.ds.addImageItem(assetImage);
    // }
  }

  onStartDrag(event: DragEvent, assetImage) {
    let asset: AssetImage;
    if (assetImage.urls !== undefined) {
      asset = {
        uid: assetImage.id,
        downloadURL: assetImage.links.download,
        path: assetImage.links.download_location,
        thumbnail: assetImage.urls.thumb,
        width: assetImage.width,
        height: assetImage.height,
        timestamp: new Date().getTime(),
        userId: 'admin',
        tags: [''],
      };
      event.dataTransfer.setData('jsonAssetImage', JSON.stringify(asset));
    } else {
      asset = {
        uid: assetImage.id,
        downloadURL: assetImage.src.original,
        path: assetImage.src.photographer_url,
        thumbnail: assetImage.src.original,
        width: assetImage.width,
        height: assetImage.height,
        timestamp: new Date().getTime(),
        userId: 'admin',
        tags: [''],
      };
      event.dataTransfer.setData('jsonAssetImage', JSON.stringify(asset));
    }
    // else {
    //   event.dataTransfer.setData('jsonAssetImage', JSON.stringify(assetImage));
    // }
  }

  onKeyUpSearch(event) {
    if (event.keyCode == 13) {
      this.readImagesByTag(10);
    }
    if (event.key == 'Delete') {
      console.log('Delete');
    }
  }

  isLoading = false;
  searchTag: string = '';
  assetImages: AssetImage[] = [];
  heights: number[] = [];
  unsplashHeights: number[] = [];
  pexelHeights: number[] = [];
  photoHeights: number[] = [];
  pageIndex: number = 1;
  readImagesByTag(per_page: number) {
    let tag = this.searchTag;
    this.pageIndex = 1;
    this.isLoading = true;
    // this.assetService.readImageByTag(tag).subscribe((data) => {
    //   this.assetImages = data.map((e) => {
    //     return {
    //       uid: e.payload.doc.id,
    //       ...e.payload.doc.data(),
    //     } as AssetImage;
    //   });

    //   this.heights = decideHeights(this.assetImages, 330, 150, 4);
    //   this.isLoading = false;
    // });
    this.photoItems = [];
    this.photoHeights = [];
    if (tag == '') {
      this.unsplashService.getImage(per_page, 1).subscribe((result: any) => {
        this.unsplashItems = result;
        for (let i = 0; i < this.unsplashItems.length; i++) {
          this.photoItems.push(this.unsplashItems[i]);
        }
        this.unsplashHeights = decideHeights(this.unsplashItems, 330, 150, 4);
        for (let j = 0; j < this.unsplashHeights.length; j++) {
          this.photoHeights.push(this.unsplashHeights[j]);
        }
      });
      this.pexelService.getImage(per_page, 1).subscribe((result: any) => {
        this.pexelItems = result['photos'];
        for (let i = 0; i < this.pexelItems.length; i++) {
          this.photoItems.push(this.pexelItems[i]);
        }
        this.pexelHeights = decideHeights(this.pexelItems, 330, 150, 4);
        for (let j = 0; j < this.pexelHeights.length; j++) {
          this.photoHeights.push(this.pexelHeights[j]);
        }
      });
    } else {
      this.unsplashService
        .searchImage(per_page, 1, tag)
        .subscribe((result: any) => {
          this.unsplashItems = result['results'];
          for (let i = 0; i < this.unsplashItems.length; i++) {
            this.photoItems.push(this.unsplashItems[i]);
          }
          this.unsplashHeights = decideHeights(this.unsplashItems, 330, 150, 4);
          for (let j = 0; j < this.unsplashHeights.length; j++) {
            this.photoHeights.push(this.unsplashHeights[j]);
          }
        });
      this.pexelService
        .searchImage(per_page, 1, tag)
        .subscribe((result: any) => {
          this.pexelItems = result['photos'];
          for (let i = 0; i < this.pexelItems.length; i++) {
            this.photoItems.push(this.pexelItems[i]);
          }
          this.pexelHeights = decideHeights(this.pexelItems, 330, 150, 4);
          for (let j = 0; j < this.pexelHeights.length; j++) {
            this.photoHeights.push(this.pexelHeights[j]);
          }
        });
    }
  }

  onClickLoadMore() {
    this.pageIndex++;
    let tag = this.searchTag;
    if (tag == '') {
      this.unsplashService
        .getImage(10, this.pageIndex)
        .subscribe((result: any) => {
          this.unsplashItems = result;
          for (let i = 0; i < this.unsplashItems.length; i++) {
            this.photoItems.push(this.unsplashItems[i]);
          }
          this.unsplashHeights = decideHeights(this.unsplashItems, 330, 150, 4);
          for (let j = 0; j < this.unsplashHeights.length; j++) {
            this.photoHeights.push(this.unsplashHeights[j]);
          }
        });
      this.pexelService
        .getImage(10, this.pageIndex)
        .subscribe((result: any) => {
          this.pexelItems = result['photos'];
          for (let i = 0; i < this.pexelItems.length; i++) {
            this.photoItems.push(this.pexelItems[i]);
          }
          this.pexelHeights = decideHeights(this.pexelItems, 330, 150, 4);
          for (let j = 0; j < this.pexelHeights.length; j++) {
            this.photoHeights.push(this.pexelHeights[j]);
          }
        });
    } else {
      this.unsplashService
        .searchImage(10, this.pageIndex, tag)
        .subscribe((result: any) => {
          this.unsplashItems = result['results'];
          for (let i = 0; i < this.unsplashItems.length; i++) {
            this.photoItems.push(this.unsplashItems[i]);
          }
          this.unsplashHeights = decideHeights(this.unsplashItems, 330, 150, 4);
          for (let j = 0; j < this.unsplashHeights.length; j++) {
            this.photoHeights.push(this.unsplashHeights[j]);
          }
        });
      this.pexelService
        .searchImage(10, this.pageIndex, tag)
        .subscribe((result: any) => {
          this.pexelItems = result['photos'];
          for (let i = 0; i < this.pexelItems.length; i++) {
            this.photoItems.push(this.pexelItems[i]);
          }
          this.pexelHeights = decideHeights(this.pexelItems, 330, 150, 4);
          for (let j = 0; j < this.pexelHeights.length; j++) {
            this.photoHeights.push(this.pexelHeights[j]);
          }
        });
    }
  }

  tags = ['tennis', 'flower', 'football'];

  lazyLoad(target) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          img.setAttribute('src', src);
          img.classList.add('fadeIn');
          observer.disconnect(); //entry.target
        }
      });
    });
    obs.observe(target);
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
        ).style.display = 'none';
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
