import { MoveableService } from 'src/app/services/moveable.service';
import { Component, OnInit } from '@angular/core';
import { ItemStatus } from 'src/app/models/enums';
import { DesignService } from 'src/app/services/design.service';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { AdminTemplate } from 'src/app/models/models';

@Component({
  selector: 'sidebar-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  thumbnailTimer: any;
  thumbnailIndex: number;

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

  clickCategory(template, j) {
    clearInterval(this.thumbnailTimer);
    this.ds.selectedTemplate = template;
    this.ds.selectedCategoryIndex = this.ds.categoryName.indexOf(
      this.ds.selectedTemplate.design.category.categoryType.title
    );
    this.ds.selectedTemplateIndex = j;
    if (template.design.pages.length == 1) {
      this.putAllPages();
      this.ds.selectedTemplate = null;
    }
  }

  putAllPages() {
    this.ds.isTemplate = true;
    this.ds.selectedCategoryIndex = this.ds.categoryName.indexOf(
      this.ds.selectedTemplate.design.category.categoryType.title
    );

    for (
      let i = 0;
      i <
      this.ds.adminAllTemplates[this.ds.selectedCategoryIndex].templates.length;
      i++
    ) {
      if (
        this.ds.adminAllTemplates[this.ds.selectedCategoryIndex].templates[i]
          .design.category.title ==
        this.ds.selectedTemplate.design.category.title
      ) {
        this.ds.selectedTemplateIndex = i;
        break;
      }
    }

    this.moveableService.onSelectTargets([]);

    let design = JSON.parse(JSON.stringify(this.ds.selectedTemplate?.design));
    this.ds.theDesign = design;
    this.ds.thePageId = 0;
    this.moveableService.selectedPageId = '0';
  }

  thumbnailAnimation(i, j) {
    let items = document.querySelector('#template-' + i + '-' + j).children;
    this.thumbnailIndex = 0;
    (
      document
        .querySelector('#template-' + i + '-' + j)
        .querySelector('.thumbnailCounter') as HTMLElement
    ).style.opacity = '1';
    if (items.length > 2)
      this.thumbnailTimer = setInterval(() => {
        setTimeout(() => {
          items[this.thumbnailIndex].animate(
            [{ marginLeft: '0' }, { marginLeft: '-100%' }],
            {
              duration: 1000,
              easing: 'ease',
            }
          );
          (items[this.thumbnailIndex] as HTMLElement).style.marginLeft =
            '-100%';
          let nextIndex = this.thumbnailIndex + 1;
          if (nextIndex >= items.length - 1) nextIndex = 0;
          items[nextIndex].animate(
            [{ marginLeft: '100%' }, { marginLeft: '0' }],
            {
              duration: 1000,
              easing: 'ease',
            }
          );
          (items[nextIndex] as HTMLElement).style.marginLeft = '0';
          this.thumbnailIndex++;
          if (this.thumbnailIndex >= items.length - 1) this.thumbnailIndex = 0;
        }, 300);
      }, 1300);
  }

  initAnimation(i, j) {
    this.thumbnailIndex = 0;
    (
      document
        .querySelector('#template-' + i + '-' + j)
        .querySelector('.thumbnailCounter') as HTMLElement
    ).style.opacity = '0';
    let items = document.querySelector('#template-' + i + '-' + j).children;
    for (let i = 0; i < items.length - 1; i++) {
      if (!i) (items[i] as HTMLElement).style.marginLeft = '0';
      else (items[i] as HTMLElement).style.marginLeft = '100%';
    }
    clearInterval(this.thumbnailTimer);
  }
}
