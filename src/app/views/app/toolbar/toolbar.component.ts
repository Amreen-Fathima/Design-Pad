import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Colors } from 'src/app/constants/colors.service';
import { ItemStatus, ItemType } from 'src/app/models/enums';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { DownloadService } from 'src/app/services/download.service';
import { UndoRedoService } from 'src/app/services/undo-redo.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class ToolbarComponent implements OnInit {
  constructor(
    public ds: DesignService,
    public moveableService: MoveableService,
    public downloadService: DownloadService,
    public urService: UndoRedoService,
    private notifications: NotificationsService
  ) {}

  theDesignWidth;
  theDesignHeight;
  width;
  height;
  roundedWidth;
  roundedHeight;

  activeColor = Colors.getColors().separatorColor;
  ItemType = ItemType;
  ItemStatus = ItemStatus;

  selectedFileType = 'PDF';
  fileTypeItems = [];

  underItem = -1;
  overItem = -1;

  tags = ['Px', 'In', 'Mm', 'Cm'];

  zoomOptions = [
    { value: 300, label: '300%' },
    { value: 200, label: '200%' },
    { value: 125, label: '125%' },
    { value: 100, label: '100%' },
    { value: 75, label: '75%' },
    { value: 50, label: '50%' },
    { value: 25, label: '25%' },
    { value: 10, label: '10%' },
  ];

  ngOnInit(): void {
    this.fileTypeItems = ['PDF', 'JPG'];
    this.roundedWidth = this.ds.pxTo(
      this.ds.selectedDimensionType,
      this.ds.pageW()
    );
    this.roundedHeight = this.ds.pxTo(
      this.ds.selectedDimensionType,
      this.ds.pageH()
    );
    this.width = this.roundedWidth;
    this.height = this.roundedHeight;
  }

  setDesign(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.theDesignWidth = this.ds.toPx(
        this.ds.selectedDimensionType,
        this.roundedWidth
      );
      this.theDesignHeight = this.ds.toPx(
        this.ds.selectedDimensionType,
        this.roundedHeight
      );

      this.ds.theDesign.category.size.x = this.theDesignWidth;
      this.ds.theDesign.category.size.y = this.theDesignHeight;
      this.moveableService.isDimension = false;

      let designPanel = document.querySelector<HTMLElement>('#designPanel');
      let width = designPanel.clientWidth;
      let height = designPanel.clientHeight;

      this.ds.zoomFitInside(width, height);
    }
  }

  showDimensionContent() {
    this.roundedWidth = this.ds.pxTo(
      this.ds.selectedDimensionType,
      this.ds.pageW()
    );
    this.roundedHeight = this.ds.pxTo(
      this.ds.selectedDimensionType,
      this.ds.pageH()
    );
    this.width = this.roundedWidth;
    this.height = this.roundedHeight;
    this.moveableService.isDimension = !this.moveableService.isDimension;
  }

  showPositionContent() {
    this.detectOverlaps();
    this.moveableService.isPosition = !this.moveableService.isPosition;
    this.moveableService.isTransPosition = false;
  }

  showTransparencyContent() {
    this.moveableService.isTransPosition =
      !this.moveableService.isTransPosition;
    this.moveableService.isPosition = false;
  }

  createGroup() {
    let item;
    let items = [];
    for (
      let i = 0;
      i < this.ds.theDesign.pages[this.ds.thePageId].items.length;
      i++
    ) {
      item = this.ds.theDesign.pages[this.ds.thePageId].items[i];
      if (item.selected) {
        items.push(item);
      }
    }
    if (items.length > 0) {
      this.moveableService.isSelectGroup = true;
      this.ds.addGroupItem();
    } else {
      alert('There is no select item!');
      this.notifications.create(
        'Error',
        'There is no select item!',
        NotificationType.Bare,
        {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false,
        }
      );
    }
  }

  createUngroup() {
    this.ds.deleteSelectedGroupItem();
  }

  changeFileType(event) {
    this.selectedFileType = event;
  }

  detectOverlaps() {
    let selectedItem = document.querySelector(
      this.getType(
        this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
          this.moveableService.selectedItemId
        ].type
      ) +
        this.moveableService.selectedPageId +
        '-' +
        this.moveableService.selectedItemId
    );
    const itemsOnPage =
      this.ds.theDesign.pages[this.moveableService.selectedPageId].items;
    let overlapItems = [];

    for (let i = 0; i < itemsOnPage.length; i++) {
      if (itemsOnPage[i].itemId != this.moveableService.selectedItemId) {
        let otherItem = document.querySelector(
          this.getType(itemsOnPage[i].type) +
            itemsOnPage[i].pageId +
            '-' +
            itemsOnPage[i].itemId
        );
        console.log(
          this.getType(itemsOnPage[i].type) +
            itemsOnPage[i].pageId +
            '-' +
            itemsOnPage[i].itemId
        );

        if (this.collision(selectedItem, otherItem)) {
          overlapItems.push(i);
        }
      }
    }

    this.underItem = this.catchUnderItem(overlapItems);
    this.overItem = this.catchOverItem(overlapItems);
  }

  forwardItem() {
    if (this.overItem != -1) {
      let pageItems =
        this.ds.theDesign.pages[this.moveableService.selectedPageId].items;
      let item = pageItems[this.moveableService.selectedItemId];

      for (
        let i = Number.parseInt(this.moveableService.selectedItemId);
        i < this.overItem;
        i++
      ) {
        this.ds.theDesign.pages[this.moveableService.selectedPageId].items[i] =
          this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
            i + 1
          ];
        this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
          i
        ].itemId = i;
        this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
          i
        ].zIndex = 100 + i;
      }

      this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
        this.overItem
      ] = item;
      this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
        this.overItem
      ].zIndex = 100 + this.overItem;
      this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
        this.overItem
      ].itemId = this.overItem;
      this.moveableService.selectedItemId = this.overItem.toString();

      setTimeout(() => {
        this.detectOverlaps();
      });
    }
  }

  backwardItem() {
    if (this.underItem != -1) {
      let pageItems =
        this.ds.theDesign.pages[this.moveableService.selectedPageId].items;
      let item = pageItems[this.moveableService.selectedItemId];

      for (
        let i = Number.parseInt(this.moveableService.selectedItemId);
        i > this.underItem;
        i--
      ) {
        this.ds.theDesign.pages[this.moveableService.selectedPageId].items[i] =
          this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
            i - 1
          ];
        this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
          i
        ].itemId = i;
        this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
          i
        ].zIndex = 100 + i;
      }

      this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
        this.underItem
      ] = item;
      this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
        this.underItem
      ].zIndex = 100 + this.underItem;
      this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
        this.underItem
      ].itemId = this.underItem;
      this.moveableService.selectedItemId = this.underItem.toString();

      setTimeout(() => {
        this.detectOverlaps();
      });
    }
  }

  catchOverItem(overlapItems) {
    for (let i = 0; i < overlapItems.length; i++) {
      if (overlapItems[i] > this.moveableService.selectedItemId) {
        this.addHoverEvent('forward');
        return overlapItems[i];
      }
    }

    this.removeHoverEvent('forward');
    return -1;
  }

  catchUnderItem(overlapItems) {
    for (let i = overlapItems.length; i >= 0; i--) {
      if (overlapItems[i] < this.moveableService.selectedItemId) {
        this.addHoverEvent('backward');
        return overlapItems[i];
      }
    }

    this.removeHoverEvent('backward');
    return -1;
  }

  addHoverEvent(action) {
    let element = document.getElementById(action);
    element.classList.add('hover');
  }

  removeHoverEvent(action) {
    let element = document.getElementById(action);
    element.classList.remove('hover');
  }

  getType(status) {
    let type;

    switch (status) {
      case ItemType.image:
        type = '#imageElement-';
        break;
      case ItemType.text:
        type = '#textEditor-';
        break;
      case ItemType.element:
        type = '#SVGElement-';
        break;
      case ItemType.video:
        type = '#VideoElement';
        break;
    }

    return type;
  }

  collision(item, otherItem) {
    let matrix = new WebKitCSSMatrix(item.style.transform);

    let x1 = matrix.m41;
    let y1 = matrix.m42;
    let w1 = item.offsetWidth;
    let h1 = item.offsetHeight;
    let r1 = x1 + w1;
    let b1 = y1 + h1;

    matrix = new WebKitCSSMatrix(otherItem.style.transform);
    let x2 = matrix.m41;
    let y2 = matrix.m42;
    let w2 = otherItem.offsetWidth;
    let h2 = otherItem.offsetHeight;
    let r2 = x2 + w2;
    let b2 = y2 + h2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
  }

  changeValueType(event) {
    this.theDesignWidth = this.ds.toPx(this.ds.previousType, this.width);
    this.theDesignHeight = this.ds.toPx(this.ds.previousType, this.height);
    this.ds.previousType = event;
    console.log(
      this.ds.previousType,
      this.theDesignWidth,
      this.theDesignHeight
    );

    this.width = this.ds.pxTo(
      this.ds.selectedDimensionType,
      this.theDesignWidth
    );
    this.height = this.ds.pxTo(
      this.ds.selectedDimensionType,
      this.theDesignHeight
    );
    this.roundedWidth = Math.round(this.width * 100) / 100;
    this.roundedHeight = Math.round(this.height * 100) / 100;

    console.log(this.ds.selectedDimensionType, this.width, this.height);
  }

  onSelectZoomOption(method: string, value?: number) {
    let designPanel = document.querySelector('#designPanel');

    if (method === 'custom') {
      this.ds.zoomCustomValue(value);
    } else if (method === 'fit') {
      let width = designPanel.clientWidth;
      let height = designPanel.clientHeight;

      this.ds.zoomFitInside(width, height);
    } else if (method === 'fill') {
      let width = designPanel.clientWidth;
      let height = designPanel.clientHeight;

      this.ds.zoomFillInside(width, height);
    }
  }

  inputTansparencyChange(event) {
    this.moveableService.transparency = event.target.value;
    this.setItemOpacity();
  }

  onTransparencyChange(event) {
    this.moveableService.transparency = event.value;
    this.setItemOpacity();
  }

  sliderOnChange(value: number) {
    this.urService.saveTheData(this.ds.theDesign);
  }

  setItemOpacity() {
    let items = this.ds.theDesign.pages[this.ds.thePageId].items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].selected) {
        console.log(items[i]);
        items[i].opacity = (this.moveableService.transparency / 100).toString();
      }
    }
  }

  onClickDirection(type: number) {
    let ele = [];
    let { x: W, y: H } = this.ds.theDesign.category.size;
    let items = this.ds.theDesign.pages[this.ds.thePageId].items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].selected) {
        if (type == 0) {
          items[i].y = 0;
        } else if (type == 1) {
          items[i].x = 0;
        } else if (type == 2) {
          items[i].y = (H - items[i].h) / 2;
        } else if (type == 3) {
          items[i].x = (W - items[i].w) / 2;
        } else if (type == 4) {
          items[i].y = H - items[i].h;
        } else if (type == 5) {
          items[i].x = W - items[i].w;
        }

        ele.push(
          document.querySelector<HTMLElement>(
            this.ds.getType(items[i].type) +
              this.ds.thePageId +
              '-' +
              items[i].itemId
          )
        );
      }
    }
    setTimeout(() => {
      this.moveableService.onSelectTargets(ele);
    });
  }
}
