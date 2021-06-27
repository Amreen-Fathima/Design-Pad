import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MyfilesService } from 'src/app/services/myfiles.service';
import { AuthService } from 'src/app/shared/auth.service';
import { DesignService } from 'src/app/services/design.service';
import { AssetImage } from 'src/app/models/models';
import { decideHeights } from 'src/app/models/geometry';
import { Subject, Subscription } from 'rxjs';

import * as CSS from 'csstype';
import { saveAs } from 'file-saver';
import { AssetService } from 'src/app/services/asset.service';

@Component({
  selector: 'user-uploads',
  templateUrl: './user-uploads.component.html',
  styleUrls: ['./user-uploads.component.scss'],
})
export class UserUploadsComponent implements AfterViewInit, OnDestroy {
  constructor(
    public myfilesService: MyfilesService,
    public authService: AuthService,
    private ds: DesignService,
    public assetService: AssetService
  ) {}

  auth$: Subscription;
  item$: Subscription;
  selectedItemTemp: number[] = [];
  selectedItemObserve = new Subject();
  count: number = 0;

  ngAfterViewInit(): void {
    if (JSON.parse(localStorage.getItem('user'))?.uid) {
      this.readImagesByTag(JSON.parse(localStorage.getItem('user'))?.uid, '');
      this.auth$ = this.authService.subjectAuth.subscribe((isAuth) => {
        // if (!isAuth) {
        //   this.assetImages = [];
        //   this.heights = [];
        // } else {
        this.readImagesByTag(JSON.parse(localStorage.getItem('user'))?.uid, '');
        // }
      });
    }

    this.item$ = this.selectedItemObserve.subscribe((items: []) => {
      this.count = items.length;
      if (items.length != 0) {
        (document.querySelector('#deleteStatus') as HTMLElement).style.opacity =
          '1';
      } else {
        (document.querySelector('#deleteStatus') as HTMLElement).style.opacity =
          '0';
      }
    });
  }

  ngOnDestroy(): void {
    this.auth$?.unsubscribe();
    this.item$?.unsubscribe();
  }

  isLoading = false;
  assetImages: AssetImage[] = [];
  heights: number[] = [];
  readImagesByTag(userId, tag: string) {
    this.isLoading = true;
    this.myfilesService.readImageByTag(userId, tag).subscribe((data) => {
      this.assetImages = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetImage;
      });

      this.heights = decideHeights(this.assetImages, 329, 150, 4);
      this.isLoading = false;
    });
  }

  isHovering: boolean;
  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  files: File[] = [];
  onDrop(files: FileList) {
    this.selectedItemTemp = [];
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  onImgClick(assetImage: AssetImage) {
    this.ds.addImageItem(assetImage);
  }

  onStartDrag(event: DragEvent, assetImage: AssetImage) {
    event.dataTransfer.setData('jsonAssetImage', JSON.stringify(assetImage));
  }

  overImageItem(i) {
    if (
      document.querySelector('#userImageItem' + i).getAttribute('selected') ==
      'false'
    ) {
      (
        document.querySelector('#userImageItem' + i).lastChild as HTMLElement
      ).style.display = 'block';
      (
        document.querySelector('#userImageItem' + i).firstChild as HTMLElement
      ).style.borderColor = '#f16624';
    }
    // if (document.querySelector('#userImageItem' + i).getAttribute('selected') == 'true')
    //   (document.querySelector('#userImageItem' + i).firstChild as HTMLElement).style.borderColor = '#f16624';
  }

  leaveImageItem(i) {
    if (
      document.querySelector('#userImageItem' + i).getAttribute('selected') ==
      'false'
    ) {
      (
        document.querySelector('#userImageItem' + i).lastChild as HTMLElement
      ).style.display = 'none';
      (
        document.querySelector('#userImageItem' + i).firstChild as HTMLElement
      ).style.borderColor = 'transparent';
    }
  }

  checkBoxStyle(i): CSS.Properties {
    if (
      document.querySelector('#userImageItem' + i).getAttribute('selected') ==
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
      document.querySelector('#userImageItem' + i).getAttribute('selected') ==
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
      document.querySelector('#userImageItem' + i).getAttribute('selected') ==
      'false'
    ) {
      document
        .querySelector('#userImageItem' + i)
        .setAttribute('selected', 'true');
      this.selectedItemTemp.push(i);
      this.selectedItemObserve.next(this.selectedItemTemp);
    } else {
      document
        .querySelector('#userImageItem' + i)
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

  downloadImageItem() {
    let arr: AssetImage[] = [];
    for (let i = 0; i < this.selectedItemTemp.length; i++) {
      arr.push(this.assetImages[this.selectedItemTemp[i]]);
    }

    for (let i = 0; i < arr.length; i++) {
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        let blob = xhr.response;
        let type = blob.type.slice(
          blob.type.indexOf('/') + 1,
          blob.type.length
        );
        saveAs(blob, Date.now() + '.' + type);
      };
      xhr.open('GET', arr[i].downloadURL);
      xhr.send();
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

    this.assetService.removeUserFileImages(arr);
  }

  closePanel() {
    for (let i = 0; i < this.selectedItemTemp.length; i++) {
      if (
        document
          .querySelector('#userImageItem' + this.selectedItemTemp[i])
          .getAttribute('selected') == 'true'
      ) {
        document
          .querySelector('#userImageItem' + this.selectedItemTemp[i])
          .setAttribute('selected', 'false');
        (
          document.querySelector('#userImageItem' + this.selectedItemTemp[i])
            .lastChild as HTMLElement
        ).style.display = 'none';
      }
    }
    this.selectedItemTemp = [];
    this.selectedItemObserve.next(this.selectedItemTemp);
  }
}
