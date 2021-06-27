import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'font-list-item',
  templateUrl: './font-item.component.html',
  styleUrls: ['./font-item.component.scss'],
})
export class FontItemComponent implements OnInit {
  @Input('font') font;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}
}
