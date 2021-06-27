import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { Item } from 'src/app/models/models';

import * as CSS from 'csstype';
import { ItemStatus } from 'src/app/models/enums';

@Component({
  selector: 'app-svgselector',
  templateUrl: './svgselector.component.html',
  styleUrls: ['./svgselector.component.scss'],
})
export class SVGSelectorComponent implements OnInit {
  @Input('item') item;
  @ViewChild('svgSelector') svgSelector: ElementRef;

  constructor(
    public ds: DesignService,
    public moveableService: MoveableService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!this.ds.isTemplate) {
      if (this.ds.isAddItem) {
        this.moveableService.copiedTheData = [];
        this.moveableService.copiedTheData.push(
          this.moveableService.getItem(this.svgSelector.nativeElement)
        );
        this.moveableService.onSelectTargets([this.svgSelector.nativeElement]);
      } else {
        this.ds.copiedTargets.push(this.svgSelector.nativeElement);
        // this.moveableService.onSelectTargets(this.ds.copiedTargets);
      }
      // this.moveableService.setSelectable(this.item.itemId, this.item.pageId, '#SVGSelector-');
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
      zIndex: item.zIndex,
    };
  }
}
