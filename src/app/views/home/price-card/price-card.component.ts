import { Component, Input, OnInit } from '@angular/core';
import { IPriceItem } from 'src/app/data/prices';

@Component({
  selector: 'app-price-card',
  templateUrl: './price-card.component.html',
  styleUrls: ['./price-card.component.scss'],
})
export class PriceCardComponent implements OnInit {
  @Input() price: IPriceItem;

  constructor() {}

  ngOnInit(): void {}
}
