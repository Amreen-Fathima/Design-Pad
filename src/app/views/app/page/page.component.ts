import { MoveableService } from 'src/app/services/moveable.service';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { Page } from 'src/app/models/models';
import { Colors } from 'src/app/constants/colors.service';
import { ItemType } from 'src/app/models/enums';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import * as CSS from 'csstype';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit, AfterViewInit {
  @Input() page: Page;
  @Input() pageId: number;
  @ViewChild('textEditor') textEditor: ElementRef;

  ItemType = ItemType;

  modulesBubble = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link'],
      ['clean'],
    ],
  };

  constructor(public ds: DesignService, public moveableService: MoveableService, public sanitizer: DomSanitizer, private http: HttpClient) {}

  colors = Colors;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setActivePage();
    });
  }

  setActivePage() {
    if (this.ds.thePageId == this.pageId) return;
    console.log('active page:' + this.pageId);
    this.ds.thePageId = this.pageId;
  }

  onClickPage() {
    this.setActivePage();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    let data = JSON.parse(event.dataTransfer.getData('jsonAssetImage'));
    this.setActivePage();
    this.ds.addImageItem(data);
  }

  test() {
    alert('aa');
  }

  /******************
   ***** Styles
   ******************/

  styleCard(): CSS.Properties {
    return {
      borderRadius: '0%',
      overflow: 'visible',
      width: (this.ds.pageW() * this.ds.zoomValue) / 100 + 'px',
      height: (this.ds.pageH() * this.ds.zoomValue) / 100 + 'px',
      boxShadow: this.pageId == this.ds.thePageId ? '' : 'none',
    };
  }

  styleCardInside(): CSS.Properties {
    return {
      position: 'absolute',
      transformOrigin: 'top left',
      width: this.ds.theDesign.category.size.x + 'px',
      height: this.ds.theDesign.category.size.y + 'px',
      transform: `scale(${this.ds.zoomValue / 100})`,
    };
  }

  styleLayer(): CSS.Properties {
    return {
      position: 'absolute',
      top: '0',
      left: '0',
      height: '100%',
      width: '100%',
    };
  }

  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
