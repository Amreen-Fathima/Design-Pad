import { AdminTemplates } from './../../../../models/models';
import { Component, OnInit } from '@angular/core';
import { UploadUserTemplate, UserData } from 'src/app/models/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DesignService } from 'src/app/services/design.service';
import { UserRole } from 'src/app/shared/auth.roles';
import { MoveableService } from 'src/app/services/moveable.service';
import { AuthService } from 'src/app/shared/auth.service';
import { UndoRedoService } from 'src/app/services/undo-redo.service';
import { Subject, Subscription } from 'rxjs';
import * as CSS from 'csstype';

@Component({
  selector: 'sidebar-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent implements OnInit {
  tabBar;
  templates: AdminTemplates[];
  userTemplates: UploadUserTemplate[];
  ratios: number[] = [];
  userRatios: number[] = [];
  // currentRole = JSON.parse(localStorage.getItem('user'))?.role;
  role = UserRole;

  item$: Subscription;
  userItem$: Subscription;
  selectedItemTemp: number[] = [];
  selectedItemObserve = new Subject();
  selectedUserItemObserve = new Subject();
  count: number = 0;
  userCount: number = 0;
  theTab: number = 0;
  userDocId: string;
  keyword: string;
  tags = ['tennis', 'flower', 'football'];
  thumbnailTimer: any;
  thumbnailIndex: number;
  theDesignWidth;
  theDesignHeight;

  constructor(
    public firebaseService: FirebaseService,
    public ds: DesignService,
    public ur: UndoRedoService,
    public moveableService: MoveableService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.ds.latestTemplate) {
      this.ds.theDesign = this.ds.latestTemplate.design;
    }
    // this.initScrollButton();
  }

  ngAfterViewInit(): void {
    this.readUserTemplates();
    this.item$ = this.selectedItemObserve.subscribe((items: []) => {
      this.count = items.length;
      if (items.length != 0) {
        (
          document.querySelector('#deleteAdminTemplateStatus') as HTMLElement
        ).style.opacity = '1';
      } else {
        (
          document.querySelector('#deleteAdminTemplateStatus') as HTMLElement
        ).style.opacity = '0';
      }
    });
    this.userItem$ = this.selectedUserItemObserve.subscribe((items: []) => {
      this.userCount = items.length;
      if (items.length != 0) {
        (
          document.querySelector('#deleteUserTemplateStatus') as HTMLElement
        ).style.opacity = '1';
      } else {
        (
          document.querySelector('#deleteUserTemplateStatus') as HTMLElement
        ).style.opacity = '0';
      }
    });
  }

  ngOnDestroy(): void {
    this.item$.unsubscribe();
    this.userItem$.unsubscribe();
  }

  readImagesByTag(tag: string) {
    // this.isLoading = true;
    // this.assetService.readImageByTag(tag).subscribe((data) => {
    //   this.assetImages = data.map((e) => {
    //     return {
    //       uid: e.payload.doc.id,
    //       ...e.payload.doc.data(),
    //     } as AssetImage;
    //   });
    //   this.heights = decideHeights(this.assetImages, 329, 150, 4);
    //   this.isLoading = false;
    // });
  }

  detectTabPage(event) {
    this.selectedItemTemp = [];
    this.theTab = event;
  }

  async readUserTemplates() {
    if (JSON.parse(localStorage.getItem('user'))?.uid) {
      this.firebaseService
        .readObservableUser(JSON.parse(localStorage.getItem('user')).uid)
        .subscribe((e) => {
          let users = e.map((data) => {
            return {
              docId: data.payload.doc.id,
              ...data.payload.doc.data(),
            } as UserData;
          });

          this.ds.userTemplates = users[0].template;
          this.userDocId = users[0].docId;
          this.userRatios = this.decideScale(
            this.ds.userTemplates,
            2,
            this.padding
          );
        });
    }
  }

  padding = 4;
  decideScale(templates, count, padding) {
    if (templates.length != 0) {
      let screenWidth = 330 - padding * 2 * count;
      let ratios: number[] = [];

      for (let i = 1; i < templates.length; i = i + 2) {
        let ratio = screenWidth / (templates[i].width + templates[i - 1].width);
        ratios.push(ratio);
        ratios.push(ratio);
      }

      if (templates.length % 2 == 1) {
        let ratio = 157 / templates[templates.length - 1].width;
        ratios.push(ratio);
      }

      return ratios;
    }
  }

  addTemplatePage(item: AdminTemplates) {
    // this.ds.deleteSelectedItem();
    // this.ds.onSelectNothing();
    // this.moveableService.clearMoveable();
    // this.ds.isTemplate = true;
    // let screenWidth = this.ds.theDesign.category.size.x;
    // let screenHeight = this.ds.theDesign.category.size.y;
    // this.ds.theDesign.category.size.x = item.design.category.size.x;
    // this.ds.theDesign.category.size.y = item.design.category.size.y;
    // let ratio;
    // let deltaX = 0;
    // let deltaY = 0;
    // this.ds.theDesign.pages[this.ds.thePageId].items = JSON.parse(
    //   JSON.stringify(item.design.pages[0].items)
    // );
    // this.ds.theDesign.category.size.x = screenWidth;
    // this.ds.theDesign.category.size.y = screenHeight;
    // if (
    //   screenWidth != item.design.category.size.x ||
    //   screenHeight != item.design.category.size.y
    // ) {
    //   if (screenWidth > screenHeight) {
    //     ratio = screenHeight / item.design.category.size.y;
    //     deltaX = (screenWidth - item.design.category.size.x * ratio) / 2;
    //   } else {
    //     ratio = screenWidth / item.design.category.size.x;
    //     deltaY = (screenHeight - item.design.category.size.y * ratio) / 2;
    //   }
    //   let pageItems = this.ds.theDesign.pages[this.ds.thePageId].items;
    //   for (let i = 0; i < pageItems.length; i++) {
    //     pageItems[i].selected = false;
    //     pageItems[i].scaleX = item.design.pages[0].items[i].scaleX * ratio;
    //     pageItems[i].scaleY = item.design.pages[0].items[i].scaleY * ratio;
    //     pageItems[i].x =
    //       item.design.pages[0].items[i].x * ratio +
    //       deltaX +
    //       (item.design.pages[0].items[i].w * (ratio - 1)) / 2;
    //     pageItems[i].y =
    //       item.design.pages[0].items[i].y * ratio +
    //       deltaY +
    //       (item.design.pages[0].items[i].h * (ratio - 1)) / 2;
    //   }
    // }
  }

  addUserTemplatePage(i) {
    this.ds.isTemplate = true;

    for (let i = 0; i < this.userTemplates.length; i++)
      for (
        let j = 0;
        j < this.userTemplates[i].design.pages[0].items.length;
        j++
      ) {
        this.userTemplates[i].design.pages[0].items[j].selected = false;
      }
    this.ds.theDesign = JSON.parse(
      JSON.stringify(this.userTemplates[i].design)
    );
  }

  overAdminTemplateItem(i) {
    if (
      document
        .querySelector('#adminTemplateItem' + i)
        .getAttribute('selected') == 'false'
    ) {
      if (this.authService.user.role == this.role.Admin)
        (
          document
            .querySelector('#adminTemplateItem' + i)
            .querySelector('div') as HTMLElement
        ).style.display = 'block';
      (
        document.querySelector('#adminTemplateItem' + i)
          .firstChild as HTMLElement
      ).style.borderColor = '#f16624';
    }
    // if (document.querySelector('#adminTemplateItem' + i).getAttribute('selected') == 'true')
    //   (document.querySelector('#adminTemplateItem' + i).firstChild as HTMLElement).style.borderColor = '#f16624';
  }

  leaveAdminTemplateItem(i) {
    if (
      document
        .querySelector('#adminTemplateItem' + i)
        .getAttribute('selected') == 'false'
    ) {
      if (this.authService.user.role == this.role.Admin)
        (
          document
            .querySelector('#adminTemplateItem' + i)
            .querySelector('div') as HTMLElement
        ).style.display = 'none';
      (
        document.querySelector('#adminTemplateItem' + i)
          .firstChild as HTMLElement
      ).style.borderColor = 'transparent';
    }
  }

  adminCheckBoxStyle(i): CSS.Properties {
    if (document.querySelector('#adminTemplateItem' + i))
      if (
        document
          .querySelector('#adminTemplateItem' + i)
          .getAttribute('selected') == 'true'
      ) {
        return {
          background: '#f16624',
        };
      } else
        return {
          background: 'white',
        };
  }

  adminItemStyle(i, item): CSS.Properties {
    if (document.querySelector('#adminTemplateItem' + i))
      if (
        document
          .querySelector('#adminTemplateItem' + i)
          .getAttribute('selected') == 'true'
      ) {
        return {
          height: item.height * this.ratios[i] + this.padding * 2 + 'px',
          borderColor: '#f16624',
        };
      } else
        return {
          height: item.height * this.ratios[i] + this.padding * 2 + 'px',
          borderColor: 'transparent',
        };
  }

  checkAdminItem(i: number) {
    if (
      document
        .querySelector('#adminTemplateItem' + i)
        .getAttribute('selected') == 'false'
    ) {
      document
        .querySelector('#adminTemplateItem' + i)
        .setAttribute('selected', 'true');
      this.selectedItemTemp.push(i);
      this.selectedItemObserve.next(this.selectedItemTemp);
    } else {
      document
        .querySelector('#adminTemplateItem' + i)
        .setAttribute('selected', 'false');
      for (let j = 0; j < this.selectedItemTemp.length; j++) {
        if (this.selectedItemTemp[j] == i) {
          this.selectedItemTemp.splice(j, 1);
          j--;
        }
      }
      this.selectedItemObserve.next(this.selectedItemTemp);
    }
  }

  deleteAdminTemplate() {
    // let arr: AdminTemplates[] = [];
    // for (let i = 0; i < this.selectedItemTemp.length; i++) {
    //   arr.push(this.templates[this.selectedItemTemp[i]]);
    // }
    // for (let j = 0; j < this.selectedItemTemp.length; j++) {
    //   this.templates.splice(j, 1);
    // }
    // this.selectedItemTemp = [];
    // this.selectedItemObserve.next(this.selectedItemTemp);
    // this.firebaseSerivce.removeAdminTemplates(arr);
  }

  closeAdminTemplatePanel() {
    for (let i = 0; i < this.selectedItemTemp.length; i++) {
      if (
        document
          .querySelector('#adminTemplateItem' + this.selectedItemTemp[i])
          .getAttribute('selected') == 'true'
      ) {
        document
          .querySelector('#adminTemplateItem' + this.selectedItemTemp[i])
          .setAttribute('selected', 'false');
        (
          document
            .querySelector('#adminTemplateItem' + this.selectedItemTemp[i])
            .querySelector('div') as HTMLElement
        ).style.display = 'none';
      }
    }
    this.selectedItemTemp = [];
    this.selectedItemObserve.next(this.selectedItemTemp);
  }

  overUserTemplateItem(i) {
    if (
      document
        .querySelector('#userTemplateItem' + i)
        .getAttribute('selected') == 'false'
    ) {
      (
        document
          .querySelector('#userTemplateItem' + i)
          .querySelector('div') as HTMLElement
      ).style.display = 'block';
      (
        document.querySelector('#userTemplateItem' + i)
          .firstChild as HTMLElement
      ).style.borderColor = '#f16624';
    }
  }

  leaveUserTemplateItem(i) {
    if (
      document
        .querySelector('#userTemplateItem' + i)
        .getAttribute('selected') == 'false'
    ) {
      (
        document
          .querySelector('#userTemplateItem' + i)
          .querySelector('div') as HTMLElement
      ).style.display = 'none';
      (
        document.querySelector('#userTemplateItem' + i)
          .firstChild as HTMLElement
      ).style.borderColor = 'transparent';
    }
  }

  userCheckBoxStyle(i): CSS.Properties {
    if (document.querySelector('#userTemplateItem' + i))
      if (
        document
          .querySelector('#userTemplateItem' + i)
          .getAttribute('selected') == 'true'
      ) {
        return {
          background: '#f16624',
        };
      } else
        return {
          background: 'white',
        };
  }

  userItemStyle(i, item): CSS.Properties {
    if (document.querySelector('#userTemplateItem' + i))
      if (
        document
          .querySelector('#userTemplateItem' + i)
          .getAttribute('selected') == 'true'
      ) {
        return {
          height: item.height * this.userRatios[i] + this.padding * 2 + 'px',
          borderColor: '#f16624',
        };
      } else
        return {
          height: item.height * this.userRatios[i] + this.padding * 2 + 'px',
          borderColor: 'transparent',
        };
  }

  checkUserItem(i: number) {
    if (
      document
        .querySelector('#userTemplateItem' + i)
        .getAttribute('selected') == 'false'
    ) {
      document
        .querySelector('#userTemplateItem' + i)
        .setAttribute('selected', 'true');
      this.selectedItemTemp.push(i);
      this.selectedUserItemObserve.next(this.selectedItemTemp);
    } else {
      document
        .querySelector('#userTemplateItem' + i)
        .setAttribute('selected', 'false');
      for (let j = 0; j < this.selectedItemTemp.length; j++) {
        if (this.selectedItemTemp[j] == i) {
          this.selectedItemTemp.splice(j, 1);
          j--;
        }
      }
      this.selectedUserItemObserve.next(this.selectedItemTemp);
    }
  }

  deleteUserTemplate() {
    // let arr: UploadUserTemplate[] = [];
    // for (let i = 0; i < this.selectedItemTemp.length; i++) {
    //   arr.push(this.userTemplates[this.selectedItemTemp[i]]);
    // }

    for (let j = 0; j < this.selectedItemTemp.length; j++) {
      this.userTemplates.splice(this.selectedItemTemp[j], 1);
    }
    this.selectedItemTemp = [];
    this.selectedUserItemObserve.next(this.selectedItemTemp);

    // this.firebaseSerivce.removeAdminTemplates(arr);
    this.firebaseService.updateUserTemplate(this.userTemplates, this.userDocId);
  }

  closeUserTemplatePanel() {
    for (let i = 0; i < this.selectedItemTemp.length; i++) {
      if (
        document
          .querySelector('#userTemplateItem' + this.selectedItemTemp[i])
          .getAttribute('selected') == 'true'
      ) {
        document
          .querySelector('#userTemplateItem' + this.selectedItemTemp[i])
          .setAttribute('selected', 'false');
        (
          document
            .querySelector('#userTemplateItem' + this.selectedItemTemp[i])
            .querySelector('div') as HTMLElement
        ).style.display = 'none';
      }
    }
    this.selectedItemTemp = [];
    this.selectedUserItemObserve.next(this.selectedItemTemp);
  }

  scrollNext(i) {
    let percent = 102;
    let itemCount = this.ds.adminTemplates[i].templates.length;
    let category = document.querySelector('#category-' + i) as HTMLElement;
    let offsetValue = parseFloat(category.style.left);

    if (!offsetValue) offsetValue = 0;

    if (
      !(offsetValue > 0 && offsetValue < 1) &&
      itemCount - parseInt((((offsetValue * -1) / 100) * 2).toString()) - 2 >= 1
    ) {
      if (
        itemCount - parseInt((((offsetValue * -1) / 100) * 2).toString()) - 2 >
          1 &&
        5 - parseInt((((offsetValue * -1) / 100) * 2).toString()) - 2 > 1
      )
        category.style.left = (offsetValue - percent).toString() + '%';
      else category.style.left = (offsetValue - percent / 2).toString() + '%';
    }

    (
      category.parentElement.parentElement.querySelectorAll(
        '.scroll-button'
      )[0] as HTMLElement
    ).style.display = 'block';
    this.detectScrollButtonPosition(category, i);
  }

  scrollBefore(i) {
    let percent = 102;
    let category = document.querySelector('#category-' + i) as HTMLElement;
    let offsetValue = parseFloat(category.style.left);

    if (!offsetValue) offsetValue = 0;

    if (Math.abs(offsetValue) > 0) {
      if (Math.abs(offsetValue) / 100 > 0 && Math.abs(offsetValue) / 100 < 1)
        category.style.left = (offsetValue + percent / 2).toString() + '%';
      else category.style.left = (offsetValue + percent).toString() + '%';
    }

    (
      category.parentElement.parentElement.querySelectorAll(
        '.scroll-button'
      )[1] as HTMLElement
    ).style.display = 'block';
    this.detectScrollButtonPosition(category, i);
  }

  detectScrollButtonPosition(category, i) {
    let left = category.style.left;

    setTimeout(() => {
      if (left == '0%') {
        (
          category.parentElement.parentElement.querySelectorAll(
            '.scroll-button'
          )[0] as HTMLElement
        ).style.display = 'none';
      }
      if (
        !(
          parseInt((Math.abs(parseFloat(left) / 100) * 2).toString()) + 2 <
          this.ds.adminTemplates[i].templates.length
        ) ||
        !(parseInt((Math.abs(parseFloat(left) / 100) * 2).toString()) + 2 < 5)
      ) {
        (
          category.parentElement.parentElement.querySelectorAll(
            '.scroll-button'
          )[1] as HTMLElement
        ).style.display = 'none';
      }
    }, 1000);
  }

  initScrollButton() {
    setTimeout(() => {
      if (!this.ds.filteredTemplate && !this.ds.selectedTemplate)
        for (let i = 0; i < this.ds.adminTemplates.length; i++) {
          if (this.ds.adminTemplates[i].templates.length > 2) {
            (
              document
                .querySelector('#category-' + i)
                ?.parentElement.parentElement.querySelectorAll(
                  '.scroll-button'
                )[1] as HTMLElement
            ).style.display = 'block';
          }
        }
    });
  }

  putPage(i) {
    let page = JSON.parse(
      JSON.stringify(this.ds.selectedTemplate?.design.pages[i])
    );

    this.ds.isTemplate = true;

    for (let i = 0; i < page.items.length; i++)
      page.items[i].pageId = this.ds.thePageId;

    this.ds.theDesign.pages[this.ds.thePageId] = page;
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
        this.setPadSize(
          this.ds.adminAllTemplates[this.ds.selectedCategoryIndex].templates[i]
            .design.category.size.x,
          this.ds.adminAllTemplates[this.ds.selectedCategoryIndex].templates[i]
            .design.category.size.y
        );
        break;
      }
    }

    this.moveableService.onSelectTargets([]);

    let design = JSON.parse(JSON.stringify(this.ds.selectedTemplate?.design));
    this.ds.theDesign = design;
    this.ds.thePageId = 0;
    this.moveableService.selectedPageId = '0';
  }

  clickCount = 0;
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

    // Increase click count...
    this.firebaseService
      .readTemplateCount(this.ds.categoryName[this.ds.selectedCategoryIndex])
      .subscribe((e) => {
        let data = e.data();
        if (data['clickCount'] == undefined) {
          this.clickCount = 0;
        } else {
          this.clickCount = data['clickCount'];
        }
        this.clickCount++;
        this.firebaseService.updateTemplateCount(
          this.clickCount,
          this.ds.categoryName[this.ds.selectedCategoryIndex]
        );
      });
    this.ur.saveTheData(this.ds.theDesign);
  }

  setPadSize(x, y) {
    this.theDesignWidth = this.ds.toPx(this.ds.selectedDimensionType, x);
    this.theDesignHeight = this.ds.toPx(this.ds.selectedDimensionType, y);

    this.ds.theDesign.category.size.x = this.theDesignWidth;
    this.ds.theDesign.category.size.y = this.theDesignHeight;
    this.moveableService.isDimension = false;

    let designPanel = document.querySelector<HTMLElement>('#designPanel');
    let width = designPanel.clientWidth;
    let height = designPanel.clientHeight;

    this.ds.zoomFitInside(width, height);

    (document.querySelector('#padWidth') as HTMLInputElement).value = x;
    (document.querySelector('#padHeight') as HTMLInputElement).value = y;
  }

  backToCategory() {
    this.ds.selectedTemplate = null;
    if (!this.ds.selectedTemplate && !this.ds.filteredTemplate)
      this.initScrollButton();
    else {
      setTimeout(() => {
        (
          document.querySelector('#searchAdminTemplate') as HTMLInputElement
        ).value = this.keyword;
      });
    }
  }

  getKeyword(e) {
    this.keyword = e.target.value;
  }

  clearKeyword() {
    this.keyword = null;
    (document.querySelector('#searchAdminTemplate') as HTMLInputElement).value =
      this.keyword;
    this.filterAdminTemplate(this.keyword);
  }

  searchAdminTemplate(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.filterAdminTemplate(this.keyword);
    }
  }

  putCategory(i) {
    // this.ds.selectedCategory = this.ds.adminAllTemplates[i];
    this.ds.selectedCategoryIndex = i;
    this.keyword =
      this.ds.adminAllTemplates[
        i
      ].templates[0].design.category.categoryType.title;
    (document.querySelector('#searchAdminTemplate') as HTMLInputElement).value =
      this.keyword;

    this.ds.filteredTemplate = [];
    for (let j = 0; j < this.ds.adminAllTemplates[i].templates.length; j++) {
      this.ds.filteredTemplate.push(this.ds.adminAllTemplates[i].templates[j]);
    }
  }

  filterAdminTemplate(keyword) {
    if (!keyword) {
      this.ds.selectedCategory = null;
      this.ds.filteredTemplate = null;
    } else {
      this.ds.filteredTemplate = [];
      let filter = keyword.split(' ');

      for (let i = 0; i < this.ds.adminAllTemplates.length; i++) {
        for (let j = 0; j < this.ds.adminAllTemplates[i]?.templates.length; j++)
          for (let k = 0; k < filter.length; k++) {
            if (
              JSON.stringify(
                this.ds.adminAllTemplates[i].templates[j].design.category.tags
              )
                ?.replace('/"label":/g', '')
                .includes(filter)
            ) {
              this.ds.filteredTemplate.push(
                this.ds.adminAllTemplates[i]?.templates[j]
              );
              break;
            }
          }
      }
    }
  }

  deleteAlert() {
    let modal = document.querySelector('.model-container') as HTMLElement;

    this.ds.isRemoveTemplate = true;
    modal.style.display = 'block';
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
