import { FirebaseService } from 'src/app/services/firebase.service';
import { HttpClient, XhrFactory, HttpXhrBackend } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { saveAs } from 'file-saver';
import { MoveableService } from 'src/app/services/moveable.service';

declare let JSZip;

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  ds = this.injector.get(DesignService);
  onDownloading: boolean;

  constructor(
    private http: HttpClient,
    public injector: Injector,
    public firebaseService: FirebaseService
  ) {}

  download(selectedFileType) {
    if (selectedFileType == 'PDF') this.downloadAsPdf();
    else this.downloadAsImg();
  }

  downloadAsPdf() {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    let width = this.ds.theDesign.category.size.x;
    let height = this.ds.theDesign.category.size.y;
    this.onDownloading = true;

    document.querySelectorAll('.ql-editor').forEach((ele) => {
      if (ele.parentElement.children[2]) {
        ele.parentElement.children[2].remove();
      }

      for (let i = 0; i < ele.parentElement.children.length; i++) {
        if (i != 0) {
          ele.parentElement.children[i].remove();
        }
      }

      for (
        let i = 0;
        i < ele.parentElement.parentElement.children.length;
        i++
      ) {
        if (i != 0) {
          // ele.parentElement.parentElement.children[i].remove();
        }
      }

      let pageid = ele.parentElement.getAttribute('pageid');
      let itemid = ele.parentElement.getAttribute('itemid');

      (ele.parentElement.parentElement as HTMLElement).style.color = (
        ele.parentElement as HTMLElement
      ).style.color;

      this.ds.theDesign.pages[pageid].items[itemid].textColor = (
        ele.parentElement as HTMLElement
      ).style.color;
    });

    let htmlContent =
      document.querySelector('head').outerHTML +
      '<body style="margin: 0; padding: 0;>';
    let index = 0;

    document.querySelectorAll('.card').forEach((ele) => {
      if (ele.querySelectorAll('p').length != 0) {
        ele.querySelectorAll('p').forEach((el) => {
          el.style.margin = '0';
        });
      }

      this.generateImgElement(ele);

      let htmlStr = ele.children[0].children[0].outerHTML;

      htmlStr =
        `<div style="width: 600px; height: 500px; position: absolute; top: ${
          500 * index
        }px">` +
        htmlStr +
        '</div>';

      index++;
      htmlContent += htmlStr;
    });

    htmlContent += '</body>';

    formData.append('text', htmlContent);
    formData.append('page_width', Math.round(width) + 'px');
    formData.append('page_height', Math.round(height) + 'px');
    formData.append('no_margins', 'True');

    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      let blob = xhr.response;

      let fr = new FileReader();
      fr.onload = (result) => {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob);
          return;
        }
        const url = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = url;
        link.download = 'result.pdf';
        link.click();

        this.onDownloading = false;
        this.deleteGeneratedElement();
        this.calcDownloadCount();
      };
      fr.readAsText(blob);
    };
    xhr.open('POST', 'https://api.pdfcrowd.com/convert/20.10/');
    xhr.setRequestHeader(
      'Authorization',
      'Basic ' + btoa('adwitglobal' + ':' + '7b61297e35af1139edd33821adadd19e')
    );

    xhr.send(formData);
  }

  async downloadAsImg() {
    let zip = new JSZip();
    this.onDownloading = true;

    document.querySelectorAll('.ql-editor').forEach((ele) => {
      if (ele.parentElement.children[2]) {
        ele.parentElement.children[2].remove();
      }

      for (let i = 0; i < ele.parentElement.children.length; i++) {
        if (i != 0) {
          ele.parentElement.children[i].remove();
        }
      }

      for (
        let i = 0;
        i < ele.parentElement.parentElement.children.length;
        i++
      ) {
        if (i != 0) {
          // ele.parentElement.parentElement.children[i].remove();
        }
      }

      let pageid = ele.parentElement.getAttribute('pageid');
      let itemid = ele.parentElement.getAttribute('itemid');

      (ele.parentElement.parentElement as HTMLElement).style.color = (
        ele.parentElement as HTMLElement
      ).style.color;

      this.ds.theDesign.pages[pageid].items[itemid].textColor = (
        ele.parentElement as HTMLElement
      ).style.color;
    });

    const arr = document.querySelectorAll('.card');
    for (let i = 0; i < arr.length; i++) {
      let ele = arr[i];
      if (ele.querySelectorAll('p').length != 0) {
        ele.querySelectorAll('p').forEach((el) => {
          el.style.margin = '0';
        });
      }

      this.generateImgElement(ele);

      let htmlContent =
        document.querySelector('head').outerHTML +
        '<body style="margin: 0; padding: 0;>';
      let htmlStr = ele.children[0].children[0].outerHTML;

      htmlStr =
        `<div style="width: 600px; height: 500px; position: absolute;">` +
        htmlStr +
        '</div>';
      htmlContent = htmlContent + htmlStr + '</body>';

      const blob = await this.downloadOnePageAsImg(htmlContent);
      this.calcDownloadCount();
      if (document.querySelectorAll('.card').length > 1)
        zip.file(i + 1 + '.jpg', blob);
      else saveAs(blob, i + 1 + '.jpg');
    }

    // this.onDownloading = false;
    this.deleteGeneratedElement();

    if (document.querySelectorAll('.card').length > 1)
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        saveAs(content, 'image.zip');
      });
  }

  downloadCount = 0;
  downloadTemplateCount = 0;
  async calcDownloadCount() {
    let user = await this.firebaseService.readUser(
      JSON.parse(localStorage.getItem('user')).uid
    );
    if (user['downloadCount'] == undefined) {
      this.downloadCount = 0;
    } else {
      this.downloadCount = user['downloadCount'];
    }
    this.downloadCount++;
    this.firebaseService.updateUserDownloadCount(
      this.downloadCount,
      user['docId']
    );

    this.firebaseService
      .readTemplateCount(this.ds.categoryName[this.ds.selectedCategoryIndex])
      .subscribe((e) => {
        let data = e.data();
        if (data['downloadCount'] == undefined) {
          this.downloadTemplateCount = 0;
        } else {
          this.downloadTemplateCount = data['downloadCount'];
        }
        this.downloadTemplateCount++;
        this.firebaseService.updateDownloadTemplateCount(
          this.downloadTemplateCount,
          this.ds.categoryName[this.ds.selectedCategoryIndex]
        );
      });
  }

  downloadOnePageAsImg(htmlContent) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      let formData = new FormData();

      formData.append('text', htmlContent);
      formData.append(
        'screenshot_width',
        Math.round(this.ds.theDesign.category.size.x).toString()
      );
      formData.append(
        'screenshot_height',
        Math.round(this.ds.theDesign.category.size.y).toString()
      );
      formData.append('output_format', 'jpg');

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          this.onDownloading = false;
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      };

      xhr.open('POST', 'https://api.pdfcrowd.com/convert/20.10/', true);
      xhr.setRequestHeader(
        'Authorization',
        'Basic ' +
          btoa('adwitglobal' + ':' + '7b61297e35af1139edd33821adadd19e')
      );
      xhr.send(formData);
    });
  }
  generateImgElement(ele) {
    let videoEle = ele.querySelectorAll('video');
    for (let i = 0; i < videoEle.length; i++) {
      const ms = this.injector.get(MoveableService);
      let vid = videoEle[i] as HTMLVideoElement;
      let item = ms.getItem(vid);
      let imgEle = document.createElement('IMG') as HTMLImageElement;

      imgEle.style.width = vid.style.width;
      imgEle.style.height = vid.style.height;
      imgEle.style.transform = vid.style.transform;
      imgEle.style.clipPath = vid.style.clipPath;
      imgEle.style.zIndex = vid.style.zIndex;
      imgEle.style.position = vid.style.position;
      imgEle.style.left = '0';
      imgEle.style.top = '0';
      imgEle.src = item.thumbnail;

      vid.parentElement.appendChild(imgEle);
    }
  }

  deleteGeneratedElement() {
    document
      .querySelector('#designPanel')
      .querySelectorAll('video')
      .forEach((ele) => {
        ele.parentElement.querySelector('img').remove();
      });
  }

  async getOnePageAsImg(ele) {
    return new Promise(async (resolve, reject) => {
      document.querySelectorAll('.ql-editor').forEach((ele) => {
        if (ele.parentElement.children[2]) {
          ele.parentElement.children[2].remove();
        }

        for (let i = 0; i < ele.parentElement.children.length; i++) {
          if (i != 0) {
            ele.parentElement.children[i].remove();
          }
        }

        for (
          let i = 0;
          i < ele.parentElement.parentElement.children.length;
          i++
        ) {
          if (i != 0) {
            // ele.parentElement.parentElement.children[i].remove();
          }
        }

        let pageid = ele.parentElement.getAttribute('pageid');
        let itemid = ele.parentElement.getAttribute('itemid');

        (ele.parentElement.parentElement as HTMLElement).style.color = (
          ele.parentElement as HTMLElement
        ).style.color;

        this.ds.theDesign.pages[pageid].items[itemid].textColor = (
          ele.parentElement as HTMLElement
        ).style.color;
      });

      // let ele = arr[0];
      if (ele.querySelectorAll('p').length != 0) {
        ele.querySelectorAll('p').forEach((el) => {
          el.style.margin = '0';
        });
      }
      console.log(ele);

      this.generateImgElement(ele);

      let htmlContent =
        document.querySelector('head').outerHTML +
        '<body style="margin: 0; padding: 0;>';
      let htmlStr = ele.children[0].children[0].outerHTML;

      htmlStr =
        `<div style="width: 600px; height: 500px; position: absolute;">` +
        htmlStr +
        '</div>';
      htmlContent = htmlContent + htmlStr + '</body>';

      const blob = (await this.downloadOnePageAsImg(htmlContent)) as Blob;
      const reader = new FileReader();
      reader.onload = () => {
        let original = reader.result as string;
        resolve(original);
      };
      reader.readAsDataURL(blob);
    });
  }
}
