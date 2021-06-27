import { Component, OnInit } from '@angular/core';
import { ItemStatus, ItemType } from 'src/app/models/enums';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: 'app-toolpanel',
  templateUrl: './toolpanel.component.html',
  styleUrls: ['./toolpanel.component.scss'],
})
export class ToolpanelComponent implements OnInit {
  constructor(public ds: DesignService) {}

  ItemStatus = ItemStatus;
  ItemType = ItemType;
  ngOnInit(): void {}
}
