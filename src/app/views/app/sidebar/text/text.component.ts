import { MoveableService } from 'src/app/services/moveable.service';
import { Component, OnInit } from '@angular/core';
import { ItemStatus } from 'src/app/models/enums';
import { DesignService } from 'src/app/services/design.service';
import { ToolbarService } from 'src/app/services/toolbar.service';

@Component({
  selector: 'sidebar-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  constructor(
    public ds: DesignService,
    public moveableService: MoveableService,
    public toolbarService: ToolbarService
  ) {}

  ngOnInit(): void {}

  onKeyUpSearch(event) {}

  onClickAddText(text) {
    setTimeout(() => {
      this.ds.setStatus(ItemStatus.none);
    });
    if (text == 'Add a heading') {
      this.ds.sidebar_text_add('28px', text, '1000');
    }
    if (text == 'Add a subheading') {
      this.ds.sidebar_text_add('19px', text, '500');
    }
    if (text == 'Add a little bit of body text') {
      this.ds.sidebar_text_add('12px', text, '0');
    }

    this.toolbarService.isCreateQuill = true;
  }
}
