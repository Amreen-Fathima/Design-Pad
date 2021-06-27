import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { Item, Page } from 'src/app/models/models';
import { ItemStatus, ItemType } from 'src/app/models/enums';
import { MoveableService } from 'src/app/services/moveable.service';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { DesignService } from 'src/app/services/design.service';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

import * as CSS from 'csstype';

@Component({
  selector: 'app-text-item',
  templateUrl: './text-item.component.html',
  styleUrls: ['./text-item.component.scss'],
})
export class TextItemComponent implements OnInit, AfterViewInit {
  @Input() item: Item;
  @Input() itemId: number;
  @Input() pageId: number;
  @ViewChild('textSelector') textSelector: ElementRef;

  constructor(
    public moveableService: MoveableService,
    public toolbarService: ToolbarService,
    public ds: DesignService,
    public ur: UndoRedoService
  ) {}

  ngOnInit(): void {
    this.ds.onSelectNothing();
  }

  ngOnDestroy(): void {
    this.moveableService
      .resizeObserver()
      .unobserve(
        document.querySelector<HTMLElement>(
          '#textEditor-' + this.item.pageId + '-' + this.item.itemId
        )
      );
  }

  ngAfterViewInit(): void {
    // if (this.item.isCurve) this.moveableService.isEditable = false;
    this.moveableService.isEditable = true;

    if (!this.ds.isTemplate) {
      if (this.ds.isAddItem) {
        this.moveableService.copiedTheData = [];
        this.moveableService.copiedTheData.push(
          this.moveableService.getItem(this.textSelector.nativeElement)
        );
        this.moveableService.onSelectTargets([this.textSelector.nativeElement]);
      } else {
        this.ds.copiedTargets.push(this.textSelector.nativeElement);
        // this.moveableService.onSelectTargets(this.ds.copiedTargets);
      }
    } else this.ds.setStatus(ItemStatus.none);
    this.ds.isAddItem = false;

    this.moveableService.onPageElements.push(
      document.querySelector(
        this.ds.getType(this.item.type) +
          this.item.pageId +
          '-' +
          this.item.itemId
      )
    );
  }

  styleItemPosition(item: Item): CSS.Properties {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: item.w + 'px',
      height: item.h + 'px',
      transform: this.moveableService.strTransform(item),
      WebkitTransform: this.moveableService.strTransform(item),
      zIndex: item.zIndex,
    };
  }
  styleItem(item: Item): CSS.Properties {
    if (item.type === ItemType.image)
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: item.w + 'px',
        height: item.h + 'px',
        transform: this.moveableService.strTransform(item),
        WebkitTransform: this.moveableService.strTransform(item),
        border: 'none',
        filter: item.filter,
        WebkitFilter: item.filter,
        clipPath: item.clipStyle,
        zIndex: item.zIndex,
      };

    if (item.type === ItemType.text)
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: item.w + 'px',
        height: item.h + 'px',
        transform: this.moveableService.strTransform(item),
        WebkitTransform: this.moveableService.strTransform(item),
        zIndex: item.zIndex,
      };
  }

  onMouseMoveItem(event: MouseEvent, item: Item) {
    let pageEl: HTMLElement = document.querySelector(`#page-${item.pageId}`);
    let rect: DOMRect = pageEl.getBoundingClientRect();
    let isOverflow =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (!isOverflow) {
      item.hovered = true;
    } else {
      item.hovered = false;
    }
  }

  enableTextEdit(event: MouseEvent) {
    this.moveableService.enableTextEdit();
  }

  onMouseDown() {
    this.moveableService.isMouseDown = true;
  }
}
