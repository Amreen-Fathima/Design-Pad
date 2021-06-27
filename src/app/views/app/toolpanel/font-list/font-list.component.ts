import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core'; // Google Font Key is AIzaSyBipcG_GYuR_AN_TP6SxzppJz9sWZxIJSQ
import { ToolbarService } from '../../../../services/toolbar.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { DesignService } from 'src/app/services/design.service';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

@Component({
  selector: 'toolpanel-font-list',
  templateUrl: './font-list.component.html',
  styleUrls: ['./font-list.component.scss'],
})
export class FontListComponent implements OnInit {
  @ViewChild('scrollTop') scrollTop: ElementRef;
  @ViewChild('perfectScroll') perfectScroll: ElementRef;

  @Input() isPagingMode: boolean;

  selector = '.scrollPanel';
  array = [];
  sum = 30;
  scrollDistance = 3;
  scrollUpDistance = 2;
  throttle = 300;
  direction = '';
  fonts;
  textPart: string = '';
  index: number;
  previousSelectedFontItemIndex: number = null;

  constructor(
    public toolbarService: ToolbarService,
    public moveableService: MoveableService,
    public ds: DesignService,
    public ur: UndoRedoService
  ) {}

  ngOnInit(): void {
    let url = this.toolbarService.url;

    fetch(url)
      .then((res) => res.json())
      .then((out) => {
        this.fonts = out;
        this.appendItems(0, this.sum);
      })
      .catch((err) => console.error(err));
  }

  ngAfterViewInit(): void {
    document
      .querySelector('#searchFontInput')
      .querySelector<HTMLElement>('span').style.display = 'none';
    document.querySelector<HTMLElement>('#sub-menu').style.backgroundColor =
      '#f7f7f7';
  }

  ngOnDestroy(): void {
    document.querySelector<HTMLElement>('#sub-menu').style.backgroundColor =
      '#f7f7f7';
  }

  checkList(index: number, fontFamily: string) {
    // let ele = (document.querySelector<HTMLElement>(
    //   '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    // ).style.fontFamily = fontFamily);
    // this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId].fontFamily = fontFamily
    document.querySelector<HTMLInputElement>('#fontInput').value = fontFamily;
    this.ds.previousSelectedFontItemFamily = fontFamily;
    for (let i = 0; i < this.toolbarService.textItems.length; i++)
      this.toolbarService.textItems[i].fontFamily = fontFamily;
    // this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId].fontFamily = fontFamily;
    this.ur.saveTheData(this.ds.theDesign);
  }

  onScrollDown(ev) {
    // add another 20 items
    const start = this.sum;
    this.sum += 20;
    this.appendItems(start, this.sum);

    this.direction = 'down';
  }

  appendItems(startIndex, endIndex) {
    this.addItems(startIndex, endIndex, 'push');
  }

  addItems(startIndex, endIndex, _method) {
    if (this.textPart != '') {
      for (let i = 0; i < this.sum; ++i) {
        if (this.index >= this.fonts.items.length) return;
        while (
          this.fonts.items[this.index].family
            .toLowerCase()
            .indexOf(this.textPart.toLowerCase()) != 0
        ) {
          this.index++;
          if (this.index >= this.fonts.items.length) return;
        }
        this.array[_method](this.fonts.items[this.index]);
        this.index++;
      }
    } else {
      for (let i = startIndex; i < this.sum; ++i) {
        if (i >= this.fonts.items.length) return;
        this.array[_method](this.fonts.items[i]);
      }
    }
  }

  onUp(ev) {
    // console.log('scrolled up!', ev);
    // const start = this.sum;
    // this.sum += 30;
    // this.prependItems(start, this.sum);
    // this.direction = 'up';
  }

  prependItems(startIndex, endIndex) {
    this.addItems(startIndex, endIndex, 'unshift');
  }

  onSearch($event) {
    this.textPart = $event['term'];
    if (this.textPart != '') {
      this.index = 0;
      this.array = [];
      this.sum = 30;
      this.addItems(0, 30, 'push');
      this.setScrollTop();
    } else {
      this.array = [];
      this.addItems(0, 30, 'push');
    }
  }

  onClear() {
    this.textPart = '';
    this.sum = 30;
    this.array = [];
    this.addItems(0, 30, 'push');
    this.setScrollTop();
  }

  setScrollTop() {
    let div: HTMLElement = this.scrollTop.nativeElement;
    div.scrollIntoView();
    div = this.perfectScroll.nativeElement;
    div.scrollIntoView();
  }
}
