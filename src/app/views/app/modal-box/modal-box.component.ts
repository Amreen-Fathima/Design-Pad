import { AuthService } from 'src/app/shared/auth.service';
import { Observable } from 'rxjs';
import { AdminTemplate, AdminTemplates } from './../../../models/models';
import { Component, OnInit } from '@angular/core';
import { Design, UploadUserTemplate, UserData } from 'src/app/models/models';
import { DesignService } from 'src/app/services/design.service';
import { DownloadService } from 'src/app/services/download.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-box',
  templateUrl: './modal-box.component.html',
  styleUrls: ['./modal-box.component.scss'],
})
export class ModalBoxComponent implements OnInit {
  control = new FormControl();
  filteredCategorys: Observable<string[]>;
  // selectedTemplateTagItems: string[] = ['aaa'];
  selectedItems: any;
  categoryTitle: 'asdf';

  constructor(
    public downloadService: DownloadService,
    public ds: DesignService,
    public firebaseService: FirebaseService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.filteredCategorys = this.control.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value))
    );

    this.firebaseService.getCategoryName();
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.ds.categoryName.filter((street) =>
      this._normalizeValue(street).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  closeTheModal() {
    let modal = document.querySelector('.model-container') as HTMLElement;
    modal.style.display = 'none';

    this.ds.isUploadTemplate = false;
    this.ds.isRemoveTemplate = false;
  }

  async uploadTemplate() {
    let modelContainer = document.querySelector(
      '.model-container'
    ) as HTMLElement;
    let categoryName = (
      modelContainer.querySelector('.category-name') as HTMLInputElement
    ).value;
    let templateName = (
      modelContainer.querySelector('.template-name') as HTMLInputElement
    ).value;

    if (!categoryName || !templateName) {
      (document.querySelector('.alert-msg') as HTMLElement).style.opacity = '1';
    } else {
      this.ds.theDesign.category.categoryType.title = categoryName;
      this.ds.theDesign.category.title = templateName;
      this.ds.theDesign.category.tags = this.ds.selectedTemplateTagItems;

      (document.querySelector('.alert-msg') as HTMLElement).style.opacity = '0';
      this.ds.isUploading = true;

      //
      let modal = document.querySelector('.model-container') as HTMLElement;

      const arr = document.querySelectorAll('.card');
      for (let i = 0; i < this.ds.theDesign.pages.length; i++) {
        let thumbnail = await this.downloadService.getOnePageAsImg(arr[i]);

        thumbnail = await this.ds.resizeImg(thumbnail);
        this.ds.theDesign.pages[i].thumbnail = thumbnail as string;
      }

      // let thumbnail = await this.downloadService.getOnePageAsImg();

      modal.style.display = 'none';

      let categoryIndex;
      let templateIndex;

      if (
        this.ds.selectedCategoryIndex != null &&
        this.ds.selectedTemplateIndex != null
      ) {
        if (
          this.ds.categoryName[this.ds.selectedCategoryIndex] == categoryName
        ) {
          this.ds.adminAllTemplates[this.ds.selectedCategoryIndex].templates[
            this.ds.selectedTemplateIndex
          ].design = this.ds.theDesign;
          this.ds.adminAllTemplates[this.ds.selectedCategoryIndex].templates[
            this.ds.selectedTemplateIndex
          ].timestamp = Date.now();
          console.log(
            this.ds.adminAllTemplates[this.ds.selectedCategoryIndex].templates[
              this.ds.selectedTemplateIndex
            ]
          );

          await this.firebaseService.updateAdminCategory(
            this.ds.adminAllTemplates[this.ds.selectedCategoryIndex].templates,
            categoryName
          );
        } else {
          await this.removeSelectedTemplate();
          await this.saveTheTemplate(categoryName);

          this.ds.selectedCategoryIndex = null;
          this.ds.selectedTemplate = null;
        }
      } else {
        //save the new template

        await this.saveTheTemplate(categoryName);
      }
      this.ds.isUploading = false;

      this.ds.selectedCategoryIndex = categoryIndex;
      this.ds.selectedTemplateIndex = templateIndex;
    }
  }

  async saveTheTemplate(categoryName) {
    console.log('save');
    let categoryIndex;
    let templateIndex;
    let templates: AdminTemplate[];
    let template: AdminTemplate = {
      design: this.ds.theDesign,
      width: this.ds.imgWidth,
      height: this.ds.imgHeight,
      timestamp: Date.now(),
    };

    if (this.ds.categoryName.includes(categoryName)) {
      templates =
        this.ds.adminAllTemplates[this.ds.categoryName.indexOf(categoryName)]
          .templates;

      categoryIndex = this.ds.categoryName.indexOf(categoryName);
      templateIndex =
        this.ds.adminAllTemplates[this.ds.categoryName.indexOf(categoryName)]
          .templates.length;
    } else {
      templates = [];

      categoryIndex = this.ds.categoryName.length;
      templateIndex = 0;
    }
    templates.push(template);

    // await this.firebaseService.updateAdminCategory(
    //   templates,

    // )

    await this.firebaseService.createAdminTemplates(templates, categoryName);
  }

  async updateTheCategoy(templates, docId) {
    // let categoryIndex;
    // let templateIndex;

    // categoryIndex = this.ds.categoryName.length;
    // templateIndex = 0;
    // console.log(
    //   templates,
    //   this.ds.adminAllTemplates[this.ds.selectedCategoryIndex].templates[0]
    //     .design.category.categoryType.title
    // );

    await this.firebaseService.updateAdminCategory(templates, docId);
  }

  onTemplateTagChange($event) {
    console.log($event);
    this.ds.selectedTemplateTagItems = $event;
  }

  async removeSelectedTemplate() {
    let templates: AdminTemplate[] = [];
    let docId =
      this.ds.adminAllTemplates[this.ds.selectedCategoryIndex].templates[0]
        .design.category.categoryType.title;

    console.log(this.ds.selectedTemplateIndex);

    this.ds.adminAllTemplates[this.ds.selectedCategoryIndex].templates.splice(
      this.ds.selectedTemplateIndex,
      1
    );

    templates =
      this.ds.adminAllTemplates[this.ds.selectedCategoryIndex].templates;

    if (!templates.length) {
      console.log('null');
      await this.firebaseService.removeAdminCategory(docId);
    } else await this.updateTheCategoy(templates, docId);
  }

  async removeTemplate() {
    await this.removeSelectedTemplate();

    this.ds.filteredTemplate = null;
    this.ds.selectedTemplate = null;
    this.closeTheModal();
  }
}
