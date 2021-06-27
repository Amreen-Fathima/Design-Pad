import { Component, OnInit } from '@angular/core';
import { ImageFilterObj } from 'src/app/models/image-filter';
import { Item } from 'src/app/models/models';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

@Component({
  selector: 'toolpanel-preset',
  templateUrl: './preset.component.html',
  styleUrls: ['./preset.component.scss'],
})
export class PresetComponent implements OnInit {
  constructor(public ds: DesignService, public moveableService: MoveableService, public ur: UndoRedoService) {}
  ngOnInit(): void {}

  setPresets(preset) {
    this.ds.setFilterCss(preset.css);
    this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId].filter = preset.css;
    this.ur.saveTheData(this.ds.theDesign);
  }
}
