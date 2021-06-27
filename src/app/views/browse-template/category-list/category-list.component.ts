import { AdminTemplate } from './../../../models/models';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  selectedTemplate: AdminTemplate;
  filteredTemplate: AdminTemplate[] = [];
  keyword: string;
  tags: string;

  constructor(public ds: DesignService, public router: Router) {
    console.log(this.ds.adminAllTemplates);
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  navigateToCategory(categoryIndex, templateIndex) {
    this.ds.filteredTemplate = [];
    for (
      let i = 0;
      i < this.ds.adminAllTemplates[categoryIndex]['templates'].length;
      i++
    ) {
      this.ds.filteredTemplate.push(
        this.ds.adminAllTemplates[categoryIndex]['templates'][i]
      );
    }

    this.ds.latestTemplate =
      this.ds.adminAllTemplates[categoryIndex]['templates'][templateIndex];
    this.ds.keyword =
      this.ds.adminAllTemplates[categoryIndex]['templates'][
        templateIndex
      ].design.category.categoryType.title;

    this.router.navigate(['/app']);
  }

  viewMore(index) {
    for (
      let i = 0;
      i < this.ds.adminAllTemplates[index]['templates'].length;
      i++
    ) {
      this.filteredTemplate.push(
        this.ds.adminAllTemplates[index]['templates'][i]
      );
    }

    this.tags =
      this.ds.adminAllTemplates[index][
        'templates'
      ][0].design.category.categoryType.title;
    this.keyword = this.tags;
  }

  setFilteredTemplate(template) {
    this.ds.filteredTemplate = [];
    for (let i = 0; i < this.filteredTemplate.length; i++) {
      this.ds.filteredTemplate.push(this.filteredTemplate[i]);
    }
    this.ds.latestTemplate = template;
    this.ds.keyword = this.tags;
    this.router.navigate(['/app']);
  }

  clearKeyword() {
    this.keyword = '';
    this.tags = '';
    this.filteredTemplate = [];
  }

  searchAdminTemplate(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.keyword = (
        document.querySelector('.home-category-search') as HTMLInputElement
      ).value;
      this.filterAdminTemplate(this.keyword);
    }
  }

  filterAdminTemplate(keyword) {
    if (!keyword) {
      this.filteredTemplate = [];
    } else {
      this.filteredTemplate = [];
      let filter = keyword.split(' ');

      console.log(this.ds.adminAllTemplates.length);
      for (let i = 0; i < this.ds.adminAllTemplates.length; i++) {
        for (let j = 0; j < this.ds.adminAllTemplates[i]?.templates.length; j++)
          for (let k = 0; k < filter.length; k++) {
            if (
              this.ds.adminAllTemplates[i].templates[j].design.category.tags
                .length &&
              JSON.stringify(
                this.ds.adminAllTemplates[i].templates[j].design.category.tags
              )
                ?.replace('/"label":/g', '')
                .includes(filter[k])
            ) {
              this.filteredTemplate.push(
                this.ds.adminAllTemplates[i]?.templates[j]
              );
              break;
            }
          }
      }
    }
  }
}
