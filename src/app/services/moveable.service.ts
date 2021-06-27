import { Injectable, NgZone, Injector } from '@angular/core';

import Moveable, {
  OnDragStart,
  OnDrag,
  OnDragGroupStart,
  OnDragGroup,
  OnRotate,
  OnResizeStart,
  OnResize,
  OnResizeGroupStart,
  OnResizeGroup,
  OnRotateStart,
  OnRotateGroupStart,
  OnRotateGroup,
  OnClip,
  OnScaleStart,
  OnScale,
  OnScaleEnd,
  OnResizeEnd,
  OnRotateEnd,
  OnSnap,
} from 'moveable';
import Selecto, {
  OnDragEnd,
  OnKeyEvent,
  OnScroll,
  OnSelect,
  OnSelectEnd,
} from 'selecto';
import { ToolbarService } from './toolbar.service';
import { DesignService } from './design.service';
import { Item } from '../models/models';
import { ItemStatus, ItemType } from '../models/enums';
import { UndoRedoService } from 'src/app/services/undo-redo.service';
import { MediaService } from './media.service';

declare var ResizeObserver;

@Injectable({
  providedIn: 'root',
})
export class MoveableService {
  selecto: Selecto;
  moveable: Moveable;
  disabledPointId: string = '#page-0';
  isSelectedTarget: boolean;
  isEditable: boolean = true;
  pageId: number;
  previousTarget;
  selectedPageId: string = '0';
  selectedItemId: string = '0';
  itemScale: number;

  isMouseDown: boolean = false;
  isMouseMove: boolean = false;
  isDrag: boolean = false;
  isScale: boolean = false;

  isOnResize: boolean = false;

  isShowDownload: boolean = false;
  isDimension: boolean = false;
  isPosition: boolean = false;

  selectFisShowDownload: boolean;

  isDragItem: boolean = false;

  currentUser = JSON.parse(localStorage.getItem('user'));
  targetGroup: (HTMLElement | SVGElement)[] = [];
  copiedTheData = [];

  positionOffset = 7;
  beforPositionX: number = 0;
  beforPositionY: number = 0;
  itemX: number;
  itemY: number;

  onPageElements: Element[] = [];

  constructor(
    private ds: DesignService,
    private toolbarService: ToolbarService,
    private ur: UndoRedoService,
    private zone: NgZone,
    private injector: Injector
  ) {}

  init() {
    let container: HTMLElement = document.querySelector('#selecto-container');
    let scroller: HTMLElement = document.querySelector('#selecto-area');

    this.selecto = this.initSelecto(container, scroller);
  }

  initSelecto(container: HTMLElement, scroller: HTMLElement) {
    let targets: (HTMLElement | SVGElement)[] = [];

    const selecto = new Selecto({
      // The container to add a selection element
      container: container,
      dragContainer: scroller,
      // Container to bound the selection area. If false, do not bound. If true, it is the container of selecto. (default: false)
      boundContainer: true,
      // Targets to select. You can register a queryselector or an Element.
      selectableTargets: ['.target'],
      // Whether to select by click (default: true)
      selectByClick: true,
      // Whether to select from the target inside (default: true)
      selectFromInside: false,
      // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
      continueSelect: false,
      // Determines which key to continue selecting the next target via keydown and keyup.
      toggleContinueSelect: 'shift',
      // The container for keydown and keyup events
      keyContainer: container,
      // The rate at which the target overlaps the drag area to be selected. (default: 100)
      hitRate: 0,
      scrollOptions: {
        container: scroller,
        throttleTime: 30,
        threshold: 0,
      },
    });

    selecto.on('scroll', (e: OnScroll) => {
      scroller.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
    });

    selecto
      .on('selectStart', () => {
        if (this.selectedPageId) {
          let items = this.ds.theDesign.pages[this.selectedPageId].items;
          // for (let i = 0; i < items.length; i++) {
          //   items[i].selected = false;
          // }
          this.isCreateTextItem = false;
          if (!this.ds.isPressedShiftKey) {
            this.toolbarService.quills[0]?.setSelection(0, 0);
            this.toolbarService.quills[0]?.blur();
            this.toolbarService.quills = [];
          }
        }
      })
      .on('select', (e: OnSelect) => {
        if (this.ur.isUndoRedo) {
          this.ur.isUndoRedo = false;
        }
        // e.added.forEach((el) => {
        //   let item = this.getItem(el);

        //   if (item) {
        //     item.selected = true;
        //   }
        // });
        // e.removed.forEach((el) => {
        //   let item = this.getItem(el);
        //   if (item) {
        //     item.selected = false;
        //   }
        // });
      })
      .on('selectEnd', (e: OnSelectEnd) => {
        targets = e.selected;

        if (!this.ds.isPressedShiftKey) {
          this.copiedTheData = [];
          this.targetGroup = [];
        }

        for (let i = 0; i < targets.length; i++) {
          this.copiedTheData.push(
            JSON.parse(JSON.stringify(this.getItem(targets[i])))
          );
        }

        for (let i = 0; i < targets.length; i++) {
          this.targetGroup.push(targets[i]);
        }
        if (this.ds.isPressedShiftKey) {
          this.onSelectTargets(this.targetGroup);
        } else this.onSelectTargets(targets);

        let item = this.getItem(targets[0]);

        if (
          e.isDragStart &&
          !(item.type == ItemType.text && targets.length == 1)
        ) {
          // it's deleted. It's because it is moving when mouse is moving.
          e.inputEvent.preventDefault();
          setTimeout(() => {
            this.moveable?.dragStart(e.inputEvent);
          }, 10);
        }
      });

    selecto.on('dragStart', (e) => {
      const target = e.inputEvent.target;
      if (
        (this.moveable && this.moveable.isMoveableElement(target)) ||
        targets.some((t) => t === target || t.contains(target))
      ) {
        e.stop();
      }
    });

    return selecto;
  }

  clearMoveable() {
    if (this.moveable) {
      this.moveable.setState({ target: [] });
      this.selecto.setSelectedTargets([]);

      this.moveable = null;
      this.isSelectedTarget = false;
    }
  }

  isResizeObserver: boolean = true;
  async onSelectTargets(targets: (HTMLElement | SVGElement)[]) {
    this.clearMoveable();

    if (!this.ds.isPressedShiftKey)
      for (
        let i = 0;
        i < this.ds.theDesign.pages[this.selectedPageId]?.items.length;
        i++
      )
        this.ds.theDesign.pages[this.selectedPageId].items[i].selected = false;

    let thePageId = -1;
    targets.forEach((target) => {
      let item = this.getItem(target);
      if (item) item.selected = true;
      if (thePageId === -1) thePageId = item.pageId;
      else if (thePageId > item.pageId) thePageId = item.pageId;
    });

    targets = targets.filter((target) => {
      let item = this.getItem(target);
      return item.pageId === thePageId;
    });

    if (targets.length > 1) {
      this.ds.setStatus(ItemStatus.none);

      this.moveable = this.makeMoveableGroup(thePageId, targets);
      this.ds.onSelectGroup(thePageId, targets);
    } else if (targets.length === 1) {
      let item = this.getItem(targets[0]);
      let previousItem = this.getItem(this.previousTarget);

      if (this.previousTarget != targets[0]) {
        this.resetCurveText(previousItem);
      }

      if (this.ds.isCopiedItem) this.ds.deleteSelectedItem();
      this.selectedItemId = targets[0].getAttribute('itemId');
      this.selectedPageId = targets[0].getAttribute('pageId');
      this.selectableTextEditor();
      this.onChangeSelectedItem(targets[0]);

      if (item.type === ItemType.image) {
        this.moveable = this.makeMoveableImage(thePageId, targets[0]);
        this.ds.onSelectImageItem(thePageId, item);
      } else if (item.type === ItemType.text) {
        if (!this.ur.isUndoRedo) {
          this.moveable = this.makeMoveableText(thePageId, targets[0]);
          if (
            this.previousTarget != targets[0] &&
            item.type == ItemType.text &&
            previousItem?.type == ItemType.text
          ) {
            setTimeout(() => {
              this.ds.setStatus(ItemStatus.none);
            });
            this.ds.onSelectTextItem(true);
          } else this.ds.onSelectTextItem(false);
          this.isSelectedTarget = true;
          this.resetTextToolbar();
        }

        if (this.isResizeObserver) {
          this.resizeObserver().observe(
            document.querySelector<HTMLElement>(
              '#textEditor-' + this.selectedPageId + '-' + this.selectedItemId
            )
          );
        }
      } else if (item.type === ItemType.element) {
        this.moveable = this.makeMoveableElement(thePageId, targets[0]);
        this.ds.onSelectElementItem(thePageId, item);
      } else if (item.type === ItemType.video) {
        const media = this.injector.get(MediaService);

        media.selectedVideo = document.querySelector(
          '#VideoElement' + item.pageId + '-' + item.itemId
        ) as HTMLVideoElement;
        this.moveable = this.makeMoveableVideo(thePageId, targets[0]);
        this.ds.onSelectVideoItem(thePageId, item);
      }

      this.previousTarget = targets[0];
    } else {
      let item = this.getItem(this.previousTarget);

      this.toolbarService.quills[0]?.setSelection(0);
      this.toolbarService.quills[0]?.blur();
      this.toolbarService.quills = [];
      this.ds.deleteSelectedItem();
      this.toolbarService.range = null;

      if (this.previousTarget) {
        if (item?.type == ItemType.text) {
          document.querySelector<HTMLElement>(
            '#sub-menu'
          ).style.backgroundColor = '#f7f7f7';
        }
      }

      if (
        this.ds.status == ItemStatus.image_crop ||
        this.ds.status == ItemStatus.element_crop ||
        this.ds.status == ItemStatus.video_crop
      ) {
        this.ur.saveTheData(this.ds.theDesign);
      }
      this.ds.onSelectNothing();
      if (
        this.ds.theDesign.pages[this.selectedPageId].items.length &&
        this.ds.theDesign.pages[this.selectedPageId].items[this.selectedItemId]
          .type &&
        this.ds.theDesign.pages[this.selectedPageId].items[this.selectedItemId]
          .type == ItemType.text
      ) {
        this.resizeObserver().unobserve(
          document.querySelector<HTMLElement>(
            '#textEditor-' + this.selectedPageId + '-' + this.selectedItemId
          )
        );
      }

      this.isResizeObserver = false;
      this.isEditable = false;
      this.ds.isOnInput = false;
      this.isShowDownload = false;
      this.isDimension = false;
      this.isPosition = false;

      this.selectableTextEditor();

      // if (
      //   document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId) &&
      //   document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId).getAttribute('curve') == 'true'
      // ) {
      //   let curveEle = document.querySelector<HTMLElement>('#curveText-' + this.selectedPageId + '-' + this.selectedItemId);
      //   let editorEle = document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId);
      //   let item = this.getItem(editorEle);
      //   editorEle.style.opacity = '0';
      //   curveEle.style.opacity = '1';
      //   // curveEle.setAttribute('style', '-webkit-opacity: 0');

      //   // this.toolbarService.setCurveEffect(this.selectedPageId, this.selectedItemId, item.angle, false);
      // }

      this.resetCurveText(item);
      this.previousTarget = null;
    }
  }

  resetCurveText(theItem) {
    if (
      document.querySelector<HTMLElement>(
        '#textEditor-' + theItem?.pageId + '-' + theItem?.itemId
      ) &&
      document
        .querySelector<HTMLElement>(
          '#textEditor-' + theItem?.pageId + '-' + theItem?.itemId
        )
        .getAttribute('curve') == 'true'
    ) {
      let curveEle = document.querySelector<HTMLElement>(
        '#curveText-' + theItem?.pageId + '-' + theItem?.itemId
      );
      let editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' + theItem?.pageId + '-' + theItem?.itemId
      );
      let item = this.getItem(editorEle);
      editorEle.style.opacity = '0';
      curveEle.style.opacity = '1';
    }
  }

  makeMoveableGroup(pageId: number, targets: (HTMLElement | SVGElement)[]) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector(
      '#page-' + pageId
    );

    const moveable = new Moveable(pageContainer, {
      // target: elements[0],
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: pageContainer,
      target: targets,
      draggable: true,
      resizable: true,
      rotatable: true,
      defaultGroupRotate: 0,
      defaultGroupOrigin: '50% 50%',
      originDraggable: true,
      originRelative: true,

      snappable: true,
      snapVertical: true,
      snapHorizontal: true,
      snapElement: true,
      snapCenter: true,
      isDisplaySnapDigit: true,
      snapGap: true,
      snapDigit: 1,
      snapThreshold: 7,
      elementGuidelines: this.onPageElements,
      verticalGuidelines: [
        0,
        this.ds.theDesign.category.size.x / 2,
        this.ds.theDesign.category.size.x,
      ],
      horizontalGuidelines: [
        0,
        this.ds.theDesign.category.size.y / 2,
        this.ds.theDesign.category.size.y,
      ],

      // scalable: true,
      origin: true,
      keepRatio: true,
      // Resize, Scale Events at edges.
      edge: false,
      throttleDrag: 0,
      throttleResize: 0,
      throttleScale: 0,
      throttleRotate: 0,
      rotationPosition: 'bottom',
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;

        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
        this.isDragItem = true;
      })
      .on('dragEnd', (e) => {
        if (this.isDragItem) this.ur.saveTheData(this.ds.theDesign);
        this.isDrag = false;
      })
      .on('dragGroupStart', (ev: OnDragGroupStart) => {
        ev.events.forEach((e) => {
          moveable.emit('dragStart', e);
        });
      })
      .on('dragGroup', (ev: OnDragGroup) => {
        ev.events.forEach((e) => {
          moveable.emit('drag', e);
        });
        this.isDragItem = true;
      })
      .on('dragGroupEnd', (e) => {
        if (this.isDragItem) this.ur.saveTheData(this.ds.theDesign);
        this.isDragItem = false;
      });

    /* resizable */
    moveable
      .on('resizeStart', (e: OnResizeStart) => {
        let item = this.getItem(e.target);
        if (item.type == ItemType.text) item.isOnResize = true;

        e.setOrigin(['%', '%']);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('resize', (e: OnResize) => {
        let item = this.getItem(e.target);
        if (item.type == ItemType.image) {
          item.x = e.drag.beforeTranslate[0];
          item.y = e.drag.beforeTranslate[1];
          item.w = e.width;
          item.h = e.height;

          e.target.style.transform = this.strTransform(item);
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
        }
        if (item.type == ItemType.text) {
          let scale = Math.round((e.width / item.w) * 100000) / 100000;
          item.w = e.width;
          item.h = item.h * scale;
          item.x = e.drag.beforeTranslate[0];
          item.y = e.drag.beforeTranslate[1];
          item.fontSize = (parseFloat(item.fontSize) * scale).toString() + 'px';

          e.target.style.width = item.w + 'px';
          e.target.style.height = item.h + 'px';
          e.target.style.transform = this.strTransform(item);
          let editorEle = document.querySelector<HTMLElement>(
            '#textEditor-' + item.pageId + '-' + item.itemId
          );
          editorEle.style.width = item.w + 1 + 'px';
          editorEle.style.fontSize = item.fontSize;

          let curveText = document.querySelector(
            '#curveText-' + item.pageId + '-' + item.itemId
          ) as HTMLElement;
          curveText.style.width = item.w + 'px';
        }
        if (item.type == ItemType.element) {
          let item = this.getItem(e.target);
          item.x = e.drag.beforeTranslate[0];
          item.y = e.drag.beforeTranslate[1];
          item.w = e.width;
          item.h = e.height;

          e.target.style.transform = this.strTransform(item);
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;

          let svgEle = document
            .querySelector('#SVGElement-' + item.pageId + '-' + item.itemId)
            .querySelector('svg');
          svgEle.setAttribute('width', item.w.toString());
          svgEle.setAttribute('height', item.h.toString());
        }
      })
      .on('resizeEnd', (e) => {
        let item = this.getItem(e.target);
        if (item.type == ItemType.text) item.isOnResize = false;

        this.ur.saveTheData(this.ds.theDesign);
      })
      .on('resizeGroupStart', (ev: OnResizeGroupStart) => {
        ev.events.forEach((e: OnResizeStart) => {
          moveable.emit('resizeStart', e);
        });
      })
      .on('resizeGroup', (ev: OnResizeGroup) => {
        ev.events.forEach((e: OnResize) => {
          moveable.emit('resize', e);
        });
      })
      .on('resizeGroupEnd', (e) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    /* rotatable */
    moveable
      .on('rotateStart', (e: OnRotateStart) => {
        let item = this.getItem(e.target);
        e.set(item.rotate);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('rotate', (e: OnRotate) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.rotate = e.rotate;

        e.target.style.transform = this.strTransform(item);
      })
      .on('rotateEnd', (e) => {
        this.ur.saveTheData(this.ds.theDesign);
      })
      .on('rotateGroupStart', (ev: OnRotateGroupStart) => {
        ev.events.forEach((e: OnRotateStart) => {
          moveable.emit('rotateStart', e);
        });
      })
      .on('rotateGroup', (ev: OnRotateGroup) => {
        ev.events.forEach((e: OnRotate) => {
          moveable.emit('rotate', e);
        });
      })
      .on('rotateGroupEnd', (e) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    return moveable;
  }

  makeMoveableImage(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector(
      '#page-' + pageId
    );

    const moveable = new Moveable(pageContainer, {
      // target: elements[0],
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: pageContainer,
      target: target,
      draggable: true,
      resizable: true,
      rotatable: true,
      originDraggable: true,
      originRelative: true,

      snappable: true,
      snapVertical: true,
      snapHorizontal: true,
      snapElement: true,
      snapCenter: true,
      isDisplaySnapDigit: true,
      snapGap: true,
      snapDigit: 1,
      snapThreshold: 7,

      elementGuidelines: this.onPageElements,
      verticalGuidelines: [
        0,
        this.ds.theDesign.category.size.x / 2,
        this.ds.theDesign.category.size.x,
      ],
      horizontalGuidelines: [
        0,
        this.ds.theDesign.category.size.y / 2,
        this.ds.theDesign.category.size.y,
      ],
      // scalable: true,
      origin: true,
      keepRatio: true,
      // Resize, Scale Events at edges.
      edge: false,
      throttleDrag: 0,
      throttleResize: 0,
      throttleScale: 0,
      throttleRotate: 0,
      rotationPosition: 'bottom',
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;
        let item = this.getItem(target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        target.style.transform = this.strTransform(item);
        this.isDragItem = true;
      })
      .on('dragEnd', (e) => {
        if (this.isDragItem) this.ur.saveTheData(this.ds.theDesign);
        this.isDragItem = false;
      });

    /* resizable */
    moveable
      .on('resizeStart', (e: OnResizeStart) => {
        let item = this.getItem(e.target);
        e.setOrigin(['%', '%']);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('resize', (e: OnResize) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.w = e.width;
        item.h = e.height;

        e.target.style.transform = this.strTransform(item);
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
      })
      .on('resizeEnd', (e) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    /* rotatable */
    moveable
      .on('rotateStart', (e: OnRotateStart) => {
        let item = this.getItem(e.target);
        e.set(item.rotate);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('rotate', (e: OnRotate) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.rotate = e.rotate;

        e.target.style.transform = this.strTransform(item);
      })
      .on('rotateEnd', (e) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    return moveable;
  }

  tempClipStyle;
  startImageCrop() {
    if (!this.moveable) return;

    let target = <HTMLElement | SVGElement>this.moveable.target;
    let item = this.getItem(target);
    if (item.clipStyle)
      this.tempClipStyle = JSON.parse(JSON.stringify(item.clipStyle));
    else this.tempClipStyle = '';

    this.clearMoveable();

    if (item.type == ItemType.element) {
      this.moveable = this.makeClipableElement(item.pageId, target);
    } else if (item.type == ItemType.video) {
      this.moveable = this.makeClipableVideo(item.pageId, target);
    } else this.moveable = this.makeClipableImage(item.pageId, target);
  }

  endImageCrop(isSave: boolean) {
    if (!this.moveable) return;

    let target = <HTMLElement | SVGElement>this.moveable.target;
    let item = this.getItem(target);

    if (!isSave) {
      target.style.clip = this.tempClipStyle;
      target.style.clipPath = this.tempClipStyle;
      item.clipStyle = this.tempClipStyle;
    } else {
    }

    this.clearMoveable();
    this.moveable = this.makeMoveableImage(item.pageId, target);
  }

  makeClipableImage(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector(
      '#page-' + pageId
    );

    const moveable = new Moveable(pageContainer, {
      // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
      target: target,
      container: pageContainer,
      clippable: true,
      clipRelative: true,
      clipArea: false,
      dragArea: true,
      dragWithClip: true,
      defaultClipPath: 'inset',
      clipTargetBounds: true,
      clipVerticalGuidelines: [],
      clipHorizontalGuidelines: [],

      snappable: true,
      snapVertical: true,
      snapHorizontal: true,
      snapElement: true,
      snapCenter: true,
      isDisplaySnapDigit: true,
      snapGap: true,
      snapDigit: 1,
      snapThreshold: 7,
      elementGuidelines: this.onPageElements,
      verticalGuidelines: [
        0,
        this.ds.theDesign.category.size.x / 2,
        this.ds.theDesign.category.size.x,
      ],
      horizontalGuidelines: [
        0,
        this.ds.theDesign.category.size.y / 2,
        this.ds.theDesign.category.size.y,
      ],

      draggable: true,
      throttleDrag: 0,
      startDragRotate: 0,
      throttleDragRotate: 0,
      zoom: 1,
      origin: true,
      padding: { left: 0, top: 0, right: 0, bottom: 0 },
    });

    moveable.on('clip', (e: OnClip) => {
      if (e.clipType === 'rect') {
        e.target.style.clip = e.clipStyle;
      } else {
        e.target.style.clipPath = e.clipStyle;
      }
      let item = this.getItem(e.target);
      item.clipStyle = e.clipStyle;
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;

        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
        // this.isDragItem = true;
      })
      .on('dragEnd', (e: OnDragEnd) => {});

    return moveable;
  }

  makeClipableElement(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector(
      '#page-' + pageId
    );

    const moveable = new Moveable(pageContainer, {
      // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
      target: target,
      container: pageContainer,
      clippable: true,
      clipRelative: true,
      clipArea: false,
      dragArea: true,
      dragWithClip: true,
      defaultClipPath: 'inset',
      clipTargetBounds: true,
      clipVerticalGuidelines: [],
      clipHorizontalGuidelines: [],

      draggable: true,
      throttleDrag: 0,
      startDragRotate: 0,
      throttleDragRotate: 0,
      zoom: 1,
      origin: true,
      padding: { left: 0, top: 0, right: 0, bottom: 0 },

      snappable: true,
      snapVertical: true,
      snapHorizontal: true,
      snapElement: true,
      snapCenter: true,
      isDisplaySnapDigit: true,
      snapGap: true,
      snapDigit: 1,
      snapThreshold: 7,
      elementGuidelines: this.onPageElements,
      verticalGuidelines: [
        0,
        this.ds.theDesign.category.size.x / 2,
        this.ds.theDesign.category.size.x,
      ],
      horizontalGuidelines: [
        0,
        this.ds.theDesign.category.size.y / 2,
        this.ds.theDesign.category.size.y,
      ],
    });

    moveable.on('clip', (e: OnClip) => {
      if (e.clipType === 'rect') {
        e.target.style.clip = e.clipStyle;
      } else {
        e.target.style.clipPath = e.clipStyle;
      }
      let item = this.getItem(e.target);
      item.clipStyle = e.clipStyle;
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;

        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
      });

    return moveable;
  }

  makeClipableVideo(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector(
      '#page-' + pageId
    );

    const moveable = new Moveable(pageContainer, {
      // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
      target: target,
      container: pageContainer,
      clippable: true,
      clipRelative: true,
      clipArea: false,
      dragArea: true,
      dragWithClip: true,
      defaultClipPath: 'inset',
      clipTargetBounds: true,
      clipVerticalGuidelines: [],
      clipHorizontalGuidelines: [],

      draggable: true,
      throttleDrag: 0,
      startDragRotate: 0,
      throttleDragRotate: 0,
      zoom: 1,
      origin: true,
      padding: { left: 0, top: 0, right: 0, bottom: 0 },

      snappable: true,
      snapVertical: true,
      snapHorizontal: true,
      snapElement: true,
      snapCenter: true,
      isDisplaySnapDigit: true,
      snapGap: true,
      snapDigit: 1,
      snapThreshold: 7,
      elementGuidelines: this.onPageElements,
      verticalGuidelines: [
        0,
        this.ds.theDesign.category.size.x / 2,
        this.ds.theDesign.category.size.x,
      ],
      horizontalGuidelines: [
        0,
        this.ds.theDesign.category.size.y / 2,
        this.ds.theDesign.category.size.y,
      ],
    });

    moveable.on('clip', (e: OnClip) => {
      let item = this.getItem(e.target);

      if (e.clipType === 'rect') {
        e.target.style.clip = e.clipStyle;
      } else {
        e.target.style.clipPath = e.clipStyle;
      }
      item.clipStyle = e.clipStyle;
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;

        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
        // this.isDragItem = true;
      })
      .on('dragEnd', (e: OnDragEnd) => {});

    return moveable;
  }

  makeMoveableText(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector(
      '#page-' + pageId
    );

    const moveable = new Moveable(pageContainer, {
      // target: elements[0],
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: pageContainer,
      origin: false,
      target: target,
      throttleDrag: 0,
      draggable: true,

      resizable: true,
      scalable: false,
      renderDirections: ['nw', 'ne', 'se', 'sw', 'e', 'w'],

      rotatable: true,
      rotationPosition: 'bottom',

      snappable: true,
      snapVertical: true,
      snapHorizontal: true,
      snapElement: true,
      snapCenter: true,
      isDisplaySnapDigit: true,
      snapGap: true,
      snapDigit: 1,
      snapThreshold: 7,
      elementGuidelines: this.onPageElements,
      verticalGuidelines: [
        0,
        this.ds.theDesign.category.size.x / 2,
        this.ds.theDesign.category.size.x,
      ],
      horizontalGuidelines: [
        0,
        this.ds.theDesign.category.size.y / 2,
        this.ds.theDesign.category.size.y,
      ],
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;
        let item = this.getItem(target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        target.style.transform = this.strTransform(item);
        if (this.isMouseDown) {
          this.isDrag = true;
        }

        this.isDragItem = true;
      })
      .on('dragEnd', (e) => {
        if (this.isDragItem) {
          this.ur.saveTheData(this.ds.theDesign);
        }
      });

    /* resize */
    moveable
      .on('resizeStart', (e: OnResizeStart) => {
        let item = this.getItem(e.target);
        item.isOnResize = true;

        e.setOrigin(['%', '%']);
        e.dragStart && e.dragStart.set([item.x, item.y]);
        if (e.direction[0] !== 0 && e.direction[1] !== 0) {
          this.isScale = true;
        } else this.isScale = false;
      })
      .on('resize', (e: OnResize) => {
        if (this.isScale) {
          let item = this.getItem(e.target);

          let scale = Math.round((e.width / item.w) * 100000) / 100000;
          item.w = e.width;
          item.h = item.h * scale;
          item.x = e.drag.beforeTranslate[0];
          item.y = e.drag.beforeTranslate[1];
          item.fontSize = (parseFloat(item.fontSize) * scale).toString() + 'px';

          e.target.style.width = item.w + 'px';
          e.target.style.height = item.h + 'px';
          e.target.style.transform = this.strTransform(item);
          let editorEle = document.querySelector<HTMLElement>(
            '#textEditor-' + this.selectedPageId + '-' + this.selectedItemId
          );
          editorEle.style.width = item.w + 1 + 'px';
          editorEle.style.fontSize = item.fontSize;

          let curveText = document.querySelector(
            '#curveText-' + item.pageId + '-' + item.itemId
          ) as HTMLElement;
          curveText.style.width = item.w + 'px';
        } else {
          let item = this.getItem(e.target);
          let editorEle = document.querySelector<HTMLElement>(
            '#textEditor-' + item.pageId + '-' + item.itemId
          );
          item.w = e.width;
          if (item.h != editorEle.clientHeight) {
            let offsetX = editorEle.clientHeight - item.h;
            item.h = editorEle.clientHeight;
            this.moveable.request('resizable', {
              offsetHeight: offsetX,
              isInstant: true,
            });
            return;
          }
          item.x = e.drag.beforeTranslate[0];
          item.y = e.drag.beforeTranslate[1];
          e.target.style.transform = this.strTransform(item);
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${item.h}px`;
          item = this.getItem(editorEle);
          editorEle.style.width = item.w + 'px';

          let curveText = document.querySelector(
            '#curveText-' + item.pageId + '-' + item.itemId
          ) as HTMLElement;
          curveText.style.width = item.w + 'px';
        }
      })
      .on('resizeEnd', ({ target, isDrag }) => {
        let item = this.getItem(target);
        item.isOnResize = false;

        this.setSelectable(
          target.getAttribute('itemId'),
          target.getAttribute('pageId'),
          '#textSelector-'
        );
        this.selectableTextEditor();
        this.ur.saveTheData(this.ds.theDesign);
      });

    /* rotate */
    moveable
      .on('rotateStart', (e: OnRotateStart) => {
        let item = this.getItem(e.target);
        e.set(item.rotate);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('rotate', (e: OnRotate) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.rotate = e.rotate;

        e.target.style.transform = this.strTransform(item);
      })
      .on('rotateEnd', (e: OnRotateEnd) => {
        this.selectableTextEditor();
        this.ur.saveTheData(this.ds.theDesign);
      });

    return moveable;
  }

  startVideoCrop() {
    if (!this.moveable) return;

    let target = <HTMLElement | SVGElement>this.moveable.target;
    let item = this.getItem(target);
    if (item.clipStyle)
      this.tempClipStyle = JSON.parse(JSON.stringify(item.clipStyle));
    else this.tempClipStyle = '';

    this.clearMoveable();

    if (item.type == ItemType.element) {
      this.moveable = this.makeClipableElement(item.pageId, target);
    } else this.moveable = this.makeClipableImage(item.pageId, target);
  }

  endVideoCrop(isSave: boolean) {
    this.ds.setClipPathToNumber();
    if (!this.moveable) return;

    let target = <HTMLElement | SVGElement>this.moveable.target;
    let item = this.getItem(target);

    if (!isSave) {
      target.style.clip = this.tempClipStyle;
      target.style.clipPath = this.tempClipStyle;
      item.clipStyle = this.tempClipStyle;
    } else {
    }

    this.clearMoveable();
    this.moveable = this.makeMoveableImage(item.pageId, target);
  }

  getItem(target: HTMLElement | SVGElement): Item {
    if (target) {
      const pageId = Number(target.getAttribute('pageId'));
      const itemId = Number(target.getAttribute('itemId'));
      if (
        pageId < this.ds.theDesign.pages.length &&
        itemId < this.ds.theDesign.pages[pageId].items.length
      ) {
        let item = this.ds.theDesign.pages[pageId].items[itemId];
        return item;
      }
      return null;
    }
  }

  strTransform(item: Item): string {
    return `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg) scale(${item.scaleX}, ${item.scaleY})`;
  }

  isCreateTextItem: boolean = false;
  onChangeSelectedItem(target) {
    if (this.previousTarget != undefined) {
      if (this.previousTarget != target) {
        if (!this.isCreateTextItem) {
          // this.toolbarService.quills[0]?.blur();
          this.isEditable = false;

          if (
            document.querySelector<HTMLElement>(
              '#textEditor-' + this.selectedPageId + '-' + this.selectedItemId
            )
          )
            this.resizeObserver().unobserve(
              document.querySelector<HTMLElement>(
                '#textEditor-' + this.selectedPageId + '-' + this.selectedItemId
              )
            );
        }
        this.ds.isOnInput = false;
        this.isPosition = false;
        this.toolbarService.range = null;
      }
    }
  }
  enableTextEdit() {
    if (!this.isDrag) {
      if (this.isEditable) {
        document.querySelectorAll<HTMLElement>('.ql-editor').forEach((ele) => {
          if (
            ele.parentElement.getAttribute('itemId') == this.selectedItemId &&
            ele.parentElement.getAttribute('pageId') == this.selectedPageId
          ) {
            this.setFocus(ele);
            ele.parentElement.style.zIndex = '1000';

            if (
              document
                .querySelector<HTMLElement>(
                  '#textEditor-' +
                    this.selectedPageId +
                    '-' +
                    this.selectedItemId
                )
                .getAttribute('curve') != null &&
              document
                .querySelector<HTMLElement>(
                  '#textEditor-' +
                    this.selectedPageId +
                    '-' +
                    this.selectedItemId
                )
                .getAttribute('curve') == 'true'
            ) {
              document.querySelector<HTMLElement>(
                '#textEditor-' + this.selectedPageId + '-' + this.selectedItemId
              ).style.opacity = '1';
              document.querySelector<HTMLElement>(
                '#curveText-' + this.selectedPageId + '-' + this.selectedItemId
              ).style.opacity = '0.4';
            }
          }
        });
      }
    } else this.isDrag = false;
    if (this.isSelectedTarget) {
      this.isEditable = true;
    }
    this.isMouseDown = false;
  }

  setFocus(ele) {
    let s = window.getSelection();
    let r = document.createRange();
    r.setStart(ele, ele.childElementCount);
    r.setEnd(ele, ele.childElementCount);
    s.removeAllRanges();
    s.addRange(r);
    this.isSelectedTarget = false;
  }

  setSelectable(item, page, selector) {
    let ele = document.querySelector(
      selector + page + '-' + item
    ) as HTMLElement;
    this.getItem(ele as HTMLElement).selected = true;
    let arrEles = [];
    arrEles.push(ele);
    let func: OnSelectEnd = {
      selected: arrEles,
      afterAdded: null,
      afterRemoved: null,
      isDragStart: false,
      isDouble: false,
      added: arrEles,
      removed: [],
      rect: null,
      inputEvent: null,
      currentTarget: arrEles[0],
    };
    this.selecto.emit('selectEnd', func);
    this.selectedItemId = item;
    this.selectedPageId = page;
    this.isResizeObserver = true;
  }

  selectableTextEditor() {
    /* reset textEditor layer on textEditor selector */
    document.querySelectorAll<HTMLElement>('.ql-editor').forEach((ele) => {
      let parentElement = ele.parentElement;
      let item = this.getItem(parentElement);

      if (parentElement.style.zIndex !== item.zIndex) {
        parentElement.style.zIndex = item.zIndex;
      }
    });
  }

  resetTextToolbar() {
    let ele = document.querySelector<HTMLElement>(
      '#textEditor-' + this.selectedPageId + '-' + this.selectedItemId
    );
    let item = this.getItem(ele);
    this.toolbarService.resetting(item);
  }

  // moveable Element
  makeMoveableElement(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector(
      '#page-' + pageId
    );

    const moveable = new Moveable(pageContainer, {
      // target: elements[0],
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: pageContainer,
      target: target,
      draggable: true,
      resizable: true,
      rotatable: true,
      originDraggable: true,
      originRelative: true,

      snappable: true,
      snapVertical: true,
      snapHorizontal: true,
      snapElement: true,
      snapCenter: true,
      isDisplaySnapDigit: true,
      snapGap: true,
      snapDigit: 1,
      snapThreshold: 7,
      elementGuidelines: this.onPageElements,
      verticalGuidelines: [
        0,
        this.ds.theDesign.category.size.x / 2,
        this.ds.theDesign.category.size.x,
      ],
      horizontalGuidelines: [
        0,
        this.ds.theDesign.category.size.y / 2,
        this.ds.theDesign.category.size.y,
      ],

      // bounds: { left: 0, right: 600, top: 0, bottom: 500 },
      // innerBounds: { left: 500, top: 500, width: 100, height: 100 },

      // scalable: true,
      origin: true,
      keepRatio: true,
      // Resize, Scale Events at edges.
      edge: false,
      throttleDrag: 0,
      throttleResize: 0,
      throttleScale: 0,
      throttleRotate: 0,
      rotationPosition: 'bottom',
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;

        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
        this.isDragItem = true;
      })
      .on('dragEnd', (e) => {
        if (this.isDragItem) {
          this.ur.saveTheData(this.ds.theDesign);
        }
        this.isDragItem = false;
      });

    /* resizable */
    moveable
      .on('resizeStart', (e: OnResizeStart) => {
        let item = this.getItem(e.target);
        e.setOrigin(['%', '%']);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('resize', (e: OnResize) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.w = e.width;
        item.h = e.height;

        e.target.style.transform = this.strTransform(item);
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;

        let svgEle = document
          .querySelector('#SVGElement-' + item.pageId + '-' + item.itemId)
          .querySelector('svg');
        svgEle.setAttribute('width', item.w.toString());
        svgEle.setAttribute('height', item.h.toString());
      })
      .on('resizeEnd', (e: OnResizeEnd) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    /* rotatable */
    moveable
      .on('rotateStart', (e: OnRotateStart) => {
        let item = this.getItem(e.target);
        e.set(item.rotate);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('rotate', (e: OnRotate) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.rotate = e.rotate;

        e.target.style.transform = this.strTransform(item);
      })
      .on('rotateEnd', (e: OnRotateEnd) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    return moveable;
  }

  makeMoveableVideo(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector(
      '#page-' + pageId
    );

    const moveable = new Moveable(pageContainer, {
      container: pageContainer,
      target: target,
      draggable: true,
      resizable: true,
      rotatable: true,
      originDraggable: true,
      originRelative: true,

      snappable: true,
      snapVertical: true,
      snapHorizontal: true,
      snapElement: true,
      snapCenter: true,
      isDisplaySnapDigit: true,
      snapGap: true,
      snapDigit: 1,
      snapThreshold: 7,
      elementGuidelines: this.onPageElements,
      verticalGuidelines: [
        0,
        this.ds.theDesign.category.size.x / 2,
        this.ds.theDesign.category.size.x,
      ],
      horizontalGuidelines: [
        0,
        this.ds.theDesign.category.size.y / 2,
        this.ds.theDesign.category.size.y,
      ],

      origin: false,
      keepRatio: true,
      edge: false,
      throttleDrag: 0,
      throttleResize: 0,
      throttleScale: 0,
      throttleRotate: 0,
      rotationPosition: 'bottom',
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;
        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
        this.isDragItem = true;
      })
      .on('dragEnd', (e) => {
        if (this.isDragItem) {
          this.ur.saveTheData(this.ds.theDesign);
        }
        this.isDragItem = false;
      });

    /* resizable */
    moveable
      .on('resizeStart', (e: OnResizeStart) => {
        let item = this.getItem(e.target);
        e.setOrigin(['%', '%']);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('resize', (e: OnResize) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.w = e.width;
        item.h = e.height;

        e.target.style.transform = this.strTransform(item);
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;

        let videoEle = document.querySelector(
          '#VideoElement' + item.pageId + '-' + item.itemId
        ) as HTMLElement;
        videoEle.style.width = `${e.width}px`;
        videoEle.style.height = `${e.height}px`;
      })
      .on('resizeEnd', (e: OnResizeEnd) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    /* rotatable */
    moveable
      .on('rotateStart', (e: OnRotateStart) => {
        let item = this.getItem(e.target);
        e.set(item.rotate);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('rotate', (e: OnRotate) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.rotate = e.rotate;

        e.target.style.transform = this.strTransform(item);
      })
      .on('rotateEnd', (e: OnRotateEnd) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    return moveable;
  }

  resizeObserver() {
    return new ResizeObserver((entries) => {
      this.zone.run(() => {
        let item = this.getItem(entries[0].target);
        if (item) {
          let selectorEle = document.querySelector<HTMLElement>(
            '#textSelector-' + item.pageId + '-' + item.itemId
          );
          let editorEle = document.querySelector<HTMLElement>(
            '#textEditor-' + item.pageId + '-' + item.itemId
          );

          if (
            !this.ur.isUndoRedo &&
            !item.isOnResize &&
            !item.isCurve &&
            selectorEle
          ) {
            let width = JSON.stringify(entries[0].contentRect.width) + 'px';

            //reach at the end of the screen
            if (
              this.toolbarService.quills[0]?.hasFocus() &&
              item.x + item.w > this.ds.theDesign.category.size.x
            ) {
              width = this.ds.theDesign.category.size.x - item.x + 'px';
              editorEle.style.width = width;
            }

            let height = JSON.stringify(entries[0].contentRect.height) + 'px';
            selectorEle.style.width = width;
            selectorEle.style.height = height;
            item.w = parseFloat(width);
            item.h = parseFloat(height);
            item.x =
              item.x -
              (parseFloat(width) - parseFloat(selectorEle.style.width)) / 2;
            selectorEle.style.transform = `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg) scale(${item.scaleX}, ${item.scaleY})`;
            if (this.toolbarService.targets.length > 1)
              setTimeout(() => {
                this.onSelectTargets(this.toolbarService.targets);
              });
            else this.setSelectable(item.itemId, item.pageId, '#textSelector-');
            this.isResizeObserver = false;
          }
        }
      });
    });
  }

  curveTextObserver() {
    return new ResizeObserver((entries) => {
      let item = this.getItem(entries[0].target);
      let selectorEle = document.querySelector<HTMLElement>(
        '#textSelector-' + item.pageId + '-' + item.itemId
      );
      let editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' + item.pageId + '-' + item.itemId
      );
      let curveText = document.querySelector<HTMLElement>(
        '#curveText-' + item.pageId + '-' + item.itemId
      );
      let width = this.toolbarService.getCurveTextWidth(curveText);

      if (
        item?.isCurve &&
        this.toolbarService.quills[0]?.hasFocus() &&
        selectorEle
      ) {
        item.w = width;
        item.h =
          (curveText.firstChild as HTMLElement).clientHeight /
          (this.ds.zoomValue / 100);
        if (
          item.x + editorEle.getBoundingClientRect().width >
          this.ds.theDesign.category.size.x
        ) {
          editorEle.style.width =
            this.ds.theDesign.category.size.x - item.x + 'px';
        }

        selectorEle.style.width = item.w + 'px';
        selectorEle.style.height = item.h + 'px';
        curveText.style.width = item.w + 'px';
        curveText.style.height = item.h + 'px';
        selectorEle.style.transform = `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg) scale(${item.scaleX}, ${item.scaleY})`;
        this.setSelectable(item.itemId, item.pageId, '#textSelector-');
        this.isResizeObserver = false;
      }
    });
  }
}
