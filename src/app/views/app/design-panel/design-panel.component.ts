import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  Injector,
} from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { Colors } from 'src/app/constants/colors.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { MoveableService } from 'src/app/services/moveable.service';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { ItemStatus, ItemType } from 'src/app/models/enums';
import { DownloadService } from 'src/app/services/download.service';
import { MediaService } from 'src/app/services/media.service';
import { UserRole } from 'src/app/shared/auth.roles';
import { FirebaseService } from 'src/app/services/firebase.service';
import {
  Design,
  Item,
  UploadUserTemplate,
  UserData,
} from 'src/app/models/models';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/auth.service';

declare var ResizeObserver;

@Component({
  selector: 'app-design-panel',
  templateUrl: './design-panel.component.html',
  styleUrls: ['./design-panel.component.scss'],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class DesignPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    public ds: DesignService,
    public moveableService: MoveableService,
    private zone: NgZone,
    public toolbarService: ToolbarService,
    public downloadService: DownloadService,
    public media: MediaService,
    public injector: Injector,
    public firebaseService: FirebaseService,
    public ngZone: NgZone,
    public db: AngularFirestore,
    public authService: AuthService
  ) {}

  foreColor = Colors.getColors().separatorColor;

  @ViewChild('host') host: ElementRef;
  @ViewChild('moveableContainer') moveableContainer: ElementRef;

  resizeObserver;
  ItemType = ItemType;
  ItemStatus = ItemStatus;

  selectedFileType = 'PDF';
  fileTypeItems = [];
  // currentRole = JSON.parse(localStorage.getItem('user'))?.role;
  role = UserRole;

  ngOnInit(): void {
    this.ds.init();
    this.fileTypeItems = ['PDF', 'JPG'];
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      this.zone.run(() => {
        let width = entries[0].contentRect.width;
        let height = entries[0].contentRect.height;

        if (this.ds.zoomMethod === 'fit') {
          this.ds.zoomFitInside(width, height);
        } else if (this.ds.zoomMethod === 'fill') {
          this.ds.zoomFillInside(width, height);
        }
      });
    });

    this.resizeObserver.observe(this.host.nativeElement);

    this.moveableService.init();
  }

  ngOnDestroy() {
    this.resizeObserver.unobserve(this.host.nativeElement);
  }

  onSelectZoomOption(method: string, value?: number) {
    if (method === 'custom') {
      this.ds.zoomCustomValue(value);
    } else if (method === 'fit') {
      let width = this.host.nativeElement.clientWidth;
      let height = this.host.nativeElement.clientHeight;

      this.ds.zoomFitInside(width, height);
    } else if (method === 'fill') {
      let width = this.host.nativeElement.clientWidth;
      let height = this.host.nativeElement.clientHeight;

      this.ds.zoomFillInside(width, height);
    }
  }

  async newTemplate() {
    this.ds.theDesign.pages = [
      {
        title: '',
        thumbnail: '',
        items: [],
      },
    ];
    this.ds.selectedCategoryIndex = null;
    this.ds.selectedTemplateIndex = null;
    this.ds.theDesign.category.title = '';
    this.ds.theDesign.category.categoryType.title = '';
    this.ds.theDesign.category.tags = [];
    this.ds.thePageId = 0;
    this.moveableService.selectedPageId = '0';
    // this.addPage();
  }

  addPage() {
    const media = this.injector.get(MediaService);

    this.moveableService.onSelectTargets([]);

    if (media.selectedVideo) {
      clearInterval(media.playVideoProgressTimer);
      media.stopVideo();
    }

    for (let i = 0; i < this.ds.theDesign.pages.length; i++)
      for (let j = 0; j < this.ds.theDesign.pages[i].items.length; j++) {
        if (this.ds.theDesign.pages[i].items[j].type == ItemType.video) {
          this.ds.theDesign.pages[i].items[j].onPlayVideo = false;
          this.ds.theDesign.pages[i].items[j].onPlayButton = false;
        }
      }

    this.ds.addPage();

    this.toolbarService.textEditItems.push([]);

    setTimeout(() => {
      let panelArea = document.querySelector('#selecto-area');
      panelArea.scrollTop = (panelArea.firstChild as HTMLElement).scrollHeight;
    }, 10);
  }

  duplicateePage() {
    this.ds.theDesign.pages.push(
      JSON.parse(JSON.stringify(this.ds.theDesign.pages[this.ds.thePageId]))
    );
    this.ds.thePageId++;

    for (
      let i = 0;
      i < this.ds.theDesign.pages[this.ds.thePageId].items.length;
      i++
    ) {
      this.ds.theDesign.pages[this.ds.thePageId].items[i].pageId =
        this.ds.thePageId;
    }

    for (let i = 0; i < document.querySelectorAll('.card').length; i++) {
      document.querySelectorAll('.card')[i].setAttribute('tabindex', '0');
    }
    setTimeout(() => {
      document
        .querySelectorAll('.card')
        [this.ds.thePageId].setAttribute('tabindex', '-1');
      (
        document.querySelectorAll('.card')[this.ds.thePageId] as HTMLElement
      ).focus();
    });
  }

  removePage() {
    this.moveableService.onSelectTargets([]);

    if (this.ds.theDesign.pages.length > 1) {
      this.ds.theDesign.pages.splice(this.ds.thePageId, 1);

      for (let i = this.ds.thePageId; i < this.ds.theDesign.pages.length; i++) {
        for (let j = 0; j < this.ds.theDesign.pages[i].items.length; j++) {
          this.ds.theDesign.pages[i].items[j].pageId = i;
        }
      }
    } else {
      this.ds.theDesign.pages[0].items = [];
    }

    if (this.ds.thePageId > 0) this.ds.thePageId--;
    this.moveableService.selectedPageId = this.ds.thePageId.toString();
  }

  async uploadAdminTemplate() {
    this.ds.selectedTemplateTagItems = this.ds.theDesign.category.tags;
    console.log(this.ds.selectedTemplateTagItems);
    this.ds.isUploadTemplate = true;

    setTimeout(() => {
      (
        document.querySelector(
          '.category-name.category-value'
        ) as HTMLInputElement
      ).value = this.ds.theDesign.category.categoryType.title;
      (
        document.querySelector(
          '.template-name.template-value'
        ) as HTMLInputElement
      ).value = this.ds.theDesign.category.title;
    });

    let modelContainer = document.querySelector(
      '.model-container'
    ) as HTMLElement;
    modelContainer.style.display = 'block';

    setTimeout(() => {
      (
        modelContainer.querySelector('.category-name') as HTMLInputElement
      ).value = this.ds.theDesign.category.categoryType.title;
      (
        modelContainer.querySelector('.template-name') as HTMLInputElement
      ).value = this.ds.theDesign.category.title;
    });
  }

  showDownloadContent() {
    if (!this.authService?.user) {
      let modal = document.querySelector('.model-container') as HTMLElement;

      modal.style.display = 'block';
    } else {
      this.moveableService.isShowDownload =
        !this.moveableService.isShowDownload;
    }
  }

  download() {
    this.downloadService.download(this.selectedFileType);
  }

  changeFileType(event) {
    this.selectedFileType = event;
  }

  selectMusic() {
    (document.querySelector('.rotateIcon') as HTMLElement).style.border =
      '2px solid #00c4cc';
    this.ds.status = ItemStatus.music_selected;
  }

  showTooltip(i) {
    (
      document.querySelector('.MenuTextList').querySelectorAll('div')[
        i
      ] as HTMLElement
    ).style.opacity = '1';
  }

  hideTooltip(i) {
    (
      document.querySelector('.MenuTextList').querySelectorAll('div')[
        i
      ] as HTMLElement
    ).style.opacity = '0';
  }

  async UploadTemplate() {
    if (!this.authService?.user) {
      let modal = document.querySelector('.model-container') as HTMLElement;

      modal.style.display = 'block';
    } else {
      let haveItem: boolean = false;
      for (let i = 0; i < this.ds.theDesign.pages.length; i++) {
        for (let j = 0; j < this.ds.theDesign.pages[i].items.length; j++) {
          if (this.ds.theDesign.pages[i].items[j]) haveItem = true;
        }
      }

      if (haveItem) {
        const arr = document.querySelectorAll('.card');
        this.downloadService.onDownloading = true;

        for (let i = 0; i < this.ds.theDesign.pages.length; i++) {
          let thumbnail = await this.downloadService.getOnePageAsImg(arr[i]);

          thumbnail = await this.ds.resizeImg(thumbnail);
          this.ds.theDesign.pages[i].thumbnail = thumbnail as string;
        }

        let template = {
          thumbnail: this.ds.theDesign.pages[0].thumbnail,
          width: this.ds.imgWidth,
          height: this.ds.imgHeight,
          design: this.ds.theDesign,
          timestamp: Date.now(),
        } as UploadUserTemplate;

        let user: UserData = (await this.firebaseService.readUser(
          JSON.parse(localStorage.getItem('user')).uid
        )) as UserData;

        let templates = user?.template;
        if (!templates) templates = [];
        templates.push(template);

        console.log(this.authService.user);
        await this.firebaseService.updateUserTemplate(templates, user.docId);

        this.downloadService.onDownloading = false;
      }
    }
  }
}
