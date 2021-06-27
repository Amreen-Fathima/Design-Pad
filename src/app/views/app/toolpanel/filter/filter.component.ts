import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ImageFilterObj } from 'src/app/models/image-filter';
import { Item } from 'src/app/models/models';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

@Component({
  selector: 'toolpanel-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  brightness: FormControl;
  contrast: FormControl;
  saturate: FormControl;
  sepia: FormControl;
  grayscale: FormControl;
  blur: FormControl;
  invert: FormControl;

  constructor(public ds: DesignService, public moveableService: MoveableService, public ur: UndoRedoService) {
    this.brightness = new FormControl();
    this.contrast = new FormControl();
    this.saturate = new FormControl();
    this.sepia = new FormControl();
    this.grayscale = new FormControl();
    this.blur = new FormControl();
    this.invert = new FormControl();

    this.brightness.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
      this.savePresets();
    });
    this.contrast.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
      this.savePresets();
    });
    this.saturate.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
      this.savePresets();
    });
    this.sepia.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
      this.savePresets();
    });
    this.grayscale.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
      this.savePresets();
    });
    this.blur.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
      this.savePresets();
    });
    this.invert.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
      this.savePresets();
    });
  }

  ngOnInit(): void {}

  onChangeObj() {
    let css = this.ds.filterObj.css();
    this.ds.setFilterCss(css);
  }

  savePresets() {
    if (this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId].filter) {
      this.ur.saveTheData(this.ds.theDesign);
    }
  }
}
