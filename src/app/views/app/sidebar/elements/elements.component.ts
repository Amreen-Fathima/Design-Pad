import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { AssetElement } from 'src/app/models/models';
import { DesignService } from 'src/app/services/design.service';
import { AssetService } from 'src/app/services/asset.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { UserRole } from 'src/app/shared/auth.roles';

import * as CSS from 'csstype';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';

@Component({
  selector: 'sidebar-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss'],
})
export class ElementsComponent implements OnInit {
  selector = '.scrollPanel';
  array = [];
  sum = 30;
  scrollDistance = 2;
  scrollUpDistance = 2;
  throttle = 300;
  direction = '';
  fonts;
  textPart: string = '';
  index: number;
  previousSelectedFontItemIndex: number = null;

  isLoading = false;
  assetElements: AssetElement[] = [];
  heights: number[] = [];

  item$: Subscription;
  selectedItemTemp: number[] = [];
  selectedItemObserve = new Subject();
  count: number = 0;
  role = UserRole;
  keyword: string;
  simpleElementSVG = [];
  svgIndex = 0;

  constructor(
    public assetService: AssetService,
    public ds: DesignService,
    public moveableService: MoveableService,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    let temp: number[] = [];

    await this.assetService.readElementCategoryName().subscribe((doc) => {
      this.assetService.categoryName = doc.data()['categoryName'];
    });
    await this.assetService.readElementByTag('').subscribe((data) => {
      let elements = data.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetElement;
      });

      this.assetService.assetElements = [];
      for (let i = 0; i < this.assetService.categoryName.length; i++) {
        let arr: AssetElement[] = [];

        for (let j = 0; j < elements.length; j++) {
          if (
            elements[j].category.includes(this.assetService.categoryName[i])
          ) {
            arr.push(elements[j]);
          }
        }

        if (arr.length) {
          this.assetService.assetElements.push(arr);
        } else {
          temp.push(i);
        }
      }
      for (let i = 0; i < temp.length; i++) {
        this.assetService.categoryName.splice(temp[i], 1);
      }
      this.isLoading = false;
    });
  }

  ngAfterViewInit(): void {
    this.readElementByTag('');
    this.item$ = this.selectedItemObserve.subscribe((items: []) => {
      this.count = items.length;
      if (items.length != 0) {
        (
          document.querySelector('#deleteSvgStatus') as HTMLElement
        ).style.opacity = '1';
      } else {
        (
          document.querySelector('#deleteSvgStatus') as HTMLElement
        ).style.opacity = '0';
      }
    });
  }

  initScrollButton() {
    setTimeout(() => {
      for (let i = 0; i < this.assetService.assetElements.length; i++) {
        if (this.assetService.assetElements[i].length > 5) {
          (
            document
              .querySelector('#category-element-' + i)
              ?.parentElement.parentElement.querySelectorAll(
                '.element-scroll-button'
              )[1] as HTMLElement
          ).style.display = 'block';
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.item$.unsubscribe();
  }

  readElementByTag(tag: string) {
    this.isLoading = true;
    this.assetService.readElementByTag(tag).subscribe((data) => {
      this.assetElements = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetElement;
      });
      this.initScrollButton();

      this.isLoading = false;
      this.array = [];
      // this.appendItems(0, this.sum);
    });
  }

  scrollNext(i) {
    let width = 18; // width is 18%
    let gap = 2; // gap is 2%
    let itemCount = this.assetService.assetElements[i].length;

    if (itemCount > 17) itemCount = 17;

    let percent = width * itemCount + gap * (itemCount - 1);
    let category = document.querySelector(
      '#category-element-' + i
    ) as HTMLElement;
    let offsetValue = parseFloat(category.style.left);

    if (Math.abs(offsetValue - 180) > percent) {
      category.style.left = ((percent - 100) * -1).toString() + '%';
      setTimeout(() => {
        (
          category.parentElement.parentElement.querySelectorAll(
            '.element-scroll-button'
          )[1] as HTMLElement
        ).style.display = 'none';
      }, 1000);
    } else {
      category.style.left = (offsetValue - 80).toString() + '%';
    }

    (
      category.parentElement.parentElement.querySelectorAll(
        '.element-scroll-button'
      )[0] as HTMLElement
    ).style.display = 'block';
  }

  scrollBefore(i) {
    let width = 18; // width is 18%
    let gap = 2; // gap is 2%
    let itemCount = this.assetService.assetElements[i].length;

    if (itemCount > 17) itemCount = 17;

    let percent = width * itemCount + gap * (itemCount - 1);
    let category = document.querySelector(
      '#category-element-' + i
    ) as HTMLElement;
    let offsetValue = parseFloat(category.style.left);

    if (offsetValue + 100 >= 0) {
      category.style.left = '0%';
      setTimeout(() => {
        (
          category.parentElement.parentElement.querySelectorAll(
            '.element-scroll-button'
          )[0] as HTMLElement
        ).style.display = 'none';
      }, 1000);
    } else {
      category.style.left = (offsetValue + 80).toString() + '%';
    }

    (
      category.parentElement.parentElement.querySelectorAll(
        '.element-scroll-button'
      )[1] as HTMLElement
    ).style.display = 'block';
  }

  getKeyword(e) {
    this.keyword = e.target.value;
  }

  clearKeyword() {
    this.keyword = null;
    (document.querySelector('#searchElementInput') as HTMLInputElement).value =
      this.keyword;
    this.filterElement(this.keyword);
  }

  searchElement(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.filterElement(this.keyword);
    }
  }

  filterElement(keyword) {
    if (!keyword) {
      this.ds.filteredElement = null;
    } else {
      this.ds.filteredElement = [];
      let filter = keyword.split(' ');

      for (let i = 0; i < this.assetService.assetElements.length; i++) {
        for (let j = 0; j < this.assetService.assetElements[i].length; j++) {
          for (let k = 0; k < filter.length; k++) {
            if (
              this.assetService.assetElements[i][j].tags.includes(filter[k])
            ) {
              this.ds.filteredElement.push(
                this.assetService.assetElements[i][j]
              );
              break;
            }
          }
        }
      }
    }
  }

  selectElementCategory(index) {
    this.ds.filteredElement = [];
    for (let i = 0; i < this.assetService.assetElements[index].length; i++) {
      this.ds.filteredElement.push(this.assetService.assetElements[index][i]);
    }
    console.log(this.ds.filteredElement);
    this.keyword = this.assetService.categoryName[index];
  }

  clickCount = 0;
  AddSVG(event, item, index) {
    if (event.type == 'click') {
      this.ds.sidebar_element_add(item);

      // Increase click count...
      this.assetService.readElementCount(item['id']).subscribe((e) => {
        let data = e.data();
        if (data['clickCount'] == undefined) {
          this.clickCount = 0;
        } else {
          this.clickCount = data['clickCount'];
        }
        this.clickCount++;
        this.assetService.updateElementCount(this.clickCount, item['id']);
      });
    }
  }

  // onScrollDown(ev) {
  //   // add another 20 items
  //   const start = this.sum;
  //   this.sum += 30;
  //   this.appendItems(start, this.sum);

  //   this.direction = 'down';
  // }

  // appendItems(startIndex, endIndex) {
  //   this.addItems(startIndex, endIndex, 'push');
  // }

  // addItems(startIndex, endIndex, _method) {
  //   if (this.assetElements != []) {
  //     for (let i = startIndex; i < endIndex; ++i) {
  //       if (i >= this.assetElements.length) return;
  //       this.array[_method](this.assetElements[i]);
  //     }
  //   }
  // }

  // AddSVG(event, item) {
  //   if (event.type == 'click') {
  //     this.ds.sidebar_element_add(item);
  //   }
  // }

  // overImageItem(i) {
  //   if (
  //     document.querySelector('#adminSvgItem' + i).getAttribute('selected') ==
  //     'false'
  //   ) {
  //     if (this.authService.user?.role == this.role.Admin)
  //       (
  //         document
  //           .querySelector('#adminSvgItem' + i)
  //           .querySelector('div') as HTMLElement
  //       ).style.display = 'block';
  //     (
  //       document.querySelector('#adminSvgItem' + i).firstChild as HTMLElement
  //     ).style.borderColor = '#f16624';
  //   }
  // }

  // leaveImageItem(i) {
  //   if (
  //     document.querySelector('#adminSvgItem' + i).getAttribute('selected') ==
  //     'false'
  //   ) {
  //     if (this.authService.user?.role == this.role.Admin)
  //       (
  //         document
  //           .querySelector('#adminSvgItem' + i)
  //           .querySelector('div') as HTMLElement
  //       ).style.display = 'none';
  //     (
  //       document.querySelector('#adminSvgItem' + i).firstChild as HTMLElement
  //     ).style.borderColor = 'transparent';
  //   }
  // }

  // checkBoxStyle(i): CSS.Properties {
  //   if (
  //     document.querySelector('#adminSvgItem' + i).getAttribute('selected') ==
  //     'true'
  //   ) {
  //     return {
  //       background: '#f16624',
  //     };
  //   } else
  //     return {
  //       background: 'white',
  //     };
  // }

  // imageItemStyle(i): CSS.Properties {
  //   if (
  //     document.querySelector('#adminSvgItem' + i).getAttribute('selected') ==
  //     'true'
  //   ) {
  //     return {
  //       borderColor: '#f16624',
  //     };
  //   } else
  //     return {
  //       borderColor: 'transparent',
  //     };
  // }

  // scrollHeight(): CSS.Properties {
  //   let offsetHeight = (
  //     document.querySelector('#searchElementInput') as HTMLElement
  //   ).clientHeight;
  //   return {
  //     height: `calc(100% - ${offsetHeight}px)`,
  //   };
  // }

  // checkItem(i: number) {
  //   if (
  //     document.querySelector('#adminSvgItem' + i).getAttribute('selected') ==
  //     'false'
  //   ) {
  //     document
  //       .querySelector('#adminSvgItem' + i)
  //       .setAttribute('selected', 'true');
  //     this.selectedItemTemp.push(i);
  //     this.selectedItemObserve.next(this.selectedItemTemp);
  //   } else {
  //     document
  //       .querySelector('#adminSvgItem' + i)
  //       .setAttribute('selected', 'false');
  //     for (let j = 0; j < this.selectedItemTemp.length; j++) {
  //       if (this.selectedItemTemp[j] == i) {
  //         this.selectedItemTemp.splice(j, 1);
  //         j--;
  //       }
  //     }
  //     this.selectedItemObserve.next(this.selectedItemTemp);
  //   }
  // }

  // deleteImageItem() {
  //   let arr: AssetElement[] = [];
  //   for (let i = 0; i < this.selectedItemTemp.length; i++) {
  //     arr.push(this.assetElements[this.selectedItemTemp[i]]);
  //   }
  //   for (let j = 0; j < this.selectedItemTemp.length; j++) {
  //     this.assetElements.splice(this.selectedItemTemp[j], 1);
  //   }

  //   this.selectedItemTemp = [];
  //   this.selectedItemObserve.next(this.selectedItemTemp);
  //   this.assetService.removeUserElements(arr);
  // }

  // closePanel() {
  //   for (let i = 0; i < this.selectedItemTemp.length; i++) {
  //     if (
  //       document
  //         .querySelector('#adminSvgItem' + this.selectedItemTemp[i])
  //         .getAttribute('selected') == 'true'
  //     ) {
  //       document
  //         .querySelector('#adminSvgItem' + this.selectedItemTemp[i])
  //         .setAttribute('selected', 'false');
  //       (
  //         document
  //           .querySelector('#adminSvgItem' + this.selectedItemTemp[i])
  //           .querySelector('div') as HTMLElement
  //       ).style.display = 'none';
  //     }
  //   }
  //   this.selectedItemTemp = [];
  //   this.selectedItemObserve.next(this.selectedItemTemp);
  // }
}
