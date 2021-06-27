import { element } from 'protractor';
import { AssetElement, CategoryName } from './../../../models/models';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AssetService } from '../../../../../src/app/services/asset.service';
import { DesignService } from '../../../../../src/app/services/design.service';
import { AuthService } from '../../../../../src/app/shared/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss'],
})
export class ElementsComponent implements OnInit {
  constructor(
    public assetService: AssetService,
    public authService: AuthService,
    public ds: DesignService,
    private db: AngularFirestore
  ) {}

  isUploadElement: boolean = false;
  control = new FormControl();
  filteredCategorys: Observable<string[]>;
  // categoryName: string[] = ['AAAA', 'BBBBB', 'CCCC'];
  // categoryName: string[] = [];
  // tags: string[] = [];
  categoryName: any;
  tags: any;
  temp: FileList;

  ngOnInit() {
    this.readElementByFilter('');

    this.filteredCategorys = this.control.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.categoryName.filter((street) =>
      this._normalizeValue(street).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  files: File[] = [];

  onDrop(files: FileList) {
    let modal = document.querySelector(
      '.element-model-container'
    ) as HTMLElement;
    modal.style.display = 'block';
    this.temp = files;

    this.categoryName = [];
    this.tags = [];
  }

  isLoading = false;
  a = {};

  readElementByFilter(tag: string) {
    this.isLoading = true;
    this.assetService.readElementCategoryName().subscribe((doc) => {
      this.assetService.categoryName = doc.data()['categoryName'];
    });

    this.assetService.readElementByTag(tag).subscribe((data) => {
      this.assetService.assetElements = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetElement;
      });
      console.log(this.assetService.assetElements);

      this.isLoading = false;
    });
  }

  saveCategoryName(e, assetElement, i, j) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.onAddRemoveTag(assetElement);
    }
  }

  addTagFn(addedTag: string): string {
    return addedTag;
  }

  onAddRemoveTag(assetElement: AssetElement) {
    let isUpdate: boolean = false;
    console.log(assetElement);

    this.assetService.updateElementCategory(assetElement);

    for (let i = 0; i < assetElement.category.length; i++) {
      if (!this.assetService.categoryName.includes(assetElement.category[i])) {
        this.assetService.categoryName.push(assetElement.category[i]);
        isUpdate = true;
      }
    }
    if (isUpdate)
      this.assetService.setElementCategoryName(this.assetService.categoryName);
    // assetElement.category = [];
    // for (let i = 0; i < this.categoryName.length; i++) {
    //   assetElement.category.push(this.categoryName);
    // }
    // console.log(assetElement);
    // let index = this.assetService.categoryName.indexOf(
    //   assetElement.category
    // );
    // if (this.assetService.elementCategoryName[i] == assetElement.category) {
    //   this.assetService.updateElements(
    //     this.assetService.assetElements[i]['elements'],
    //     assetElement.category
    //   );
    // } else {
    //   this.assetService.assetElements[i]['elements'].splice(j, 1);
    //   if (!this.assetService.assetElements[i]['elements'].length) {
    //     this.db
    //       .collection<AssetElement>('Elements')
    //       .doc(this.assetService.elementCategoryName[i])
    //       .delete();
    //     this.assetService.elementCategoryName.splice(i, 1);
    //   } else {
    //     this.db
    //       .collection<AssetElement>('Elements')
    //       .doc(this.assetService.elementCategoryName[i])
    //       .update({ elements: this.assetService.assetElements[i]['elements'] });
    //   }
    //   if (
    //     !this.assetService.elementCategoryName.includes(assetElement.category)
    //   ) {
    //     this.assetService.createElements([assetElement], assetElement.category);
    //   } else {
    //     let elements: AssetElement[] =
    //       this.assetService.assetElements[index]['elements'];
    //     elements.push(assetElement);
    //     this.db
    //       .collection<AssetElement>('Elements')
    //       .doc(elements[0].category)
    //       .update({
    //         elements: elements,
    //       });
    //   }
    // }
  }

  removeSelected() {
    this.assetService.removeElements();
  }

  selected: AssetElement[] = [];
  isSelected(p: AssetElement): boolean {
    return this.selected.includes(p);
  }
  onSelect(item: AssetElement, i, j): void {
    let checked: boolean = (
      document.querySelector('#customCheck-' + i + '-' + j) as HTMLInputElement
    ).checked;
    console.log(checked);

    if (checked) {
      this.selected.push(item);
      this.assetService.leftoverElements[i]['elements'].splice(
        this.assetService.leftoverElements[i]['elements'].indexOf(item),
        1
      );
      console.log(this.assetService.leftoverElements);
    } else {
      this.selected.splice(this.selected.indexOf(item), 1);
    }
  }

  selectAllState = '';
  setSelectAllState(): void {
    let elementsCount = 0;
    for (let i = 0; i < this.assetService.assetElements.length; i++) {
      elementsCount =
        elementsCount + this.assetService.assetElements[i]['elements'].length;
    }

    if (this.selected.length === elementsCount) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [];

      for (let i = 0; i < this.assetService.assetElements.length; i++)
        for (
          let j = 0;
          j < this.assetService.assetElements[i]['elements'].length;
          j++
        ) {
          this.selected.push(this.assetService.assetElements[i]['elements'][j]);
          this.assetService.leftoverElements = JSON.parse(
            JSON.stringify(this.assetService.assetElements)
          );
        }

      this.assetService.leftoverElements = null;
      // this.selected = this.assetService.assetElements[0]['elements'];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
    console.log(this.selectAllState);
  }

  onSearchKeyUp(event) {
    if (event.keyCode === 13) {
      this.readElementByFilter(event.target.value);
    }
  }

  closeTheModal() {
    let modal = document.querySelector(
      '.element-model-container'
    ) as HTMLElement;
    modal.style.display = 'none';
  }

  getTags($event) {
    this.tags = $event;
  }

  uploadElement() {
    console.log(this.categoryName.length);
    if (!this.categoryName.length) {
      (
        document.querySelector('.alert-element-msg') as HTMLElement
      ).style.opacity = '1';
    } else {
      (
        document.querySelector('.alert-element-msg') as HTMLElement
      ).style.opacity = '0';
      for (let i = 0; i < this.temp.length; i++) {
        if (this.temp.item(i).type == 'image/svg+xml') {
          this.files.push(this.temp.item(i));
        }
      }
      this.closeTheModal();
    }
  }
}
