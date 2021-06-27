import { Component, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: 'sidebar-my-templates',
  templateUrl: './my-templates.component.html',
  styleUrls: ['./my-templates.component.scss'],
})
export class MyTemplatesComponent implements OnInit {
  constructor(public ds: DesignService) {}

  ngOnInit(): void {}

  putPage(i) {
    let design = JSON.parse(JSON.stringify(this.ds.userTemplates[i]?.design));

    this.ds.theDesign = design;
  }
}
