import { Component, OnInit } from '@angular/core';
import { MoveableService } from 'src/app/services/moveable.service';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { UndoRedoService } from 'src/app/services/undo-redo.service';
import { DesignService } from 'src/app/services/design.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, combineLatest } from 'rxjs/operators';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import * as CSS from 'csstype';

@Component({
  selector: 'toolpanel-text-effects',
  templateUrl: './text-effects.component.html',
  styleUrls: ['./text-effects.component.scss'],
})
export class TextEffectsComponent implements OnInit {
  editorEle;
  fontSize;
  step = 1;
  value = 0;

  /* Shadow */

  offset = 50;
  spliceOffset = 50;
  echoOffset = 50;
  glitchOffset = 30;
  offsetX;
  offsetY;
  blurSize;
  blur = 0;
  angle = -45;
  directionX = 0;
  directionY = 1;

  shadowColor;
  outlineColor;

  shadowR: number = 0;
  shadowG: number = 0;
  shadowB: number = 0;
  outlineR: number = 0;
  outlineG: number = 0;
  outlineB: number = 0;

  opacity = 40;
  intensity = 50;

  thickness = 50;
  previousFontColor = null;

  glitchColorA = 'rgb(0, 255, 255)';
  glitchColorB = 'rgb(255, 0, 255)';

  glitchColorA1 = '#00FFFF';
  glitchColorA2 = '#FF00FF';
  glitchColorB1 = '#00FFFF';
  glitchColorB2 = '#FF0000';

  neonValue;
  curveValue;

  shadowFormGroup: FormGroup;
  shadowOffsetControl: FormControl = new FormControl();
  shadowDirectionControl: FormControl = new FormControl();
  shadowBlurControl: FormControl = new FormControl();
  shadowTransparencyControl: FormControl = new FormControl();

  liftIntensityControl: FormControl = new FormControl();

  hollowThicknessControl: FormControl = new FormControl();

  spliceOffsetControl: FormControl = new FormControl();
  spliceDirectionControl: FormControl = new FormControl();
  spliceThicknessControl: FormControl = new FormControl();

  echoOffsetControl: FormControl = new FormControl();
  echoDirectionControl: FormControl = new FormControl();

  glitchOffsetControl: FormControl = new FormControl();
  glitchDirectionControl: FormControl = new FormControl();

  neonIntensityControl: FormControl = new FormControl();

  curveIntensityControl: FormControl = new FormControl();

  isShadow: boolean = false;
  isLift: boolean = false;
  isHollow: boolean = false;
  isSplice: boolean = false;
  isEcho: boolean = false;
  isGlitch: boolean = false;
  isNeon: boolean = false;
  isCurve: boolean = false;

  constructor(
    public moveableService: MoveableService,
    public toolbarService: ToolbarService,
    public ur: UndoRedoService,
    public ds: DesignService
  ) {
    this.shadowOffsetControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isShadow) {
          this.saveTheData();
        }
      });
    this.shadowDirectionControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isShadow) {
          this.saveTheData();
        }
      });
    this.shadowBlurControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isShadow) {
          this.saveTheData();
        }
      });
    this.shadowTransparencyControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isShadow) {
          this.saveTheData();
        }
      });
    this.liftIntensityControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isLift) {
          this.saveTheData();
        }
      });
    this.hollowThicknessControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isHollow) {
          this.saveTheData();
        }
      });
    this.spliceOffsetControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isSplice) {
          this.saveTheData();
        }
      });
    this.spliceDirectionControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isSplice) {
          this.saveTheData();
        }
      });
    this.spliceThicknessControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isSplice) {
          this.saveTheData();
        }
      });
    this.echoOffsetControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isEcho) {
          this.saveTheData();
        }
      });
    this.echoDirectionControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isEcho) {
          this.saveTheData();
        }
      });
    this.glitchOffsetControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isGlitch) {
          this.saveTheData();
        }
      });
    this.glitchDirectionControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isGlitch) {
          this.saveTheData();
        }
      });
    this.neonIntensityControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isNeon) {
          this.saveTheData();
        }
      });
    this.curveIntensityControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.isCurve) {
          this.saveTheData();
        }
      });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    document.querySelector<HTMLElement>('#sub-menu').style.backgroundColor =
      '#293039';
  }
  ngOnDestroy(): void {
    document.querySelector<HTMLElement>('#sub-menu').style.backgroundColor =
      '#293039';
  }

  saveTheData() {
    console.log('save the text-effect');
    this.ur.saveTheData(this.ds.theDesign);
  }

  setTextEffect(method: string) {
    document.querySelectorAll<HTMLElement>('.effectContent').forEach((ele) => {
      if (ele.style.display == 'block') {
        ele.style.display = 'none';
      }
    });
    document.querySelectorAll<HTMLElement>('.effectSelector').forEach((ele) => {
      ele = ele.firstElementChild as HTMLElement;
      if (ele.style.borderColor == 'rgb(109, 47, 165)') {
        ele.style.borderColor = 'rgba(118, 118, 118, 0.3)';
      }
    });
    if (method == 'none') {
      document.querySelector<HTMLElement>('#selector-none').style.borderColor =
        'rgb(109, 47, 165)';
      this.defaultEffect();
      this.setEffectSelector('#selector-none');
      this.saveTheData();
    }
    if (method == 'shadow') {
      this.isShadow = true;
      this.defaultEffect();
      this.shadowColor = '#808080';
      this.setShadowEffect();
      document.querySelector<HTMLElement>('#shadow').style.display = 'block';
      this.setEffectSelector('#selector-shadow');
      this.saveTheData();
    }
    if (method == 'lift') {
      this.isLift = true;
      this.defaultEffect();
      this.shadowColor = '#808080';
      this.setShadowEffect();
      document.querySelector<HTMLElement>('#lift').style.display = 'block';
      this.setEffectSelector('#selector-lift');
      this.saveTheData();
    }
    if (method == 'hallow') {
      this.isHollow = true;
      this.defaultEffect();
      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' +
          this.moveableService.selectedPageId +
          '-' +
          this.moveableService.selectedItemId
      );
      this.editorEle.style.color = 'white';
      this.outlineColor = '#000000';

      this.setHollowEffect();
      document.querySelector<HTMLElement>('#hallow').style.display = 'block';
      this.setEffectSelector('#selector-hallow');
      this.saveTheData();
    }
    if (method == 'splice') {
      this.isSplice = true;
      this.defaultEffect();
      this.thickness = 50;
      this.offset = 50;
      this.angle = -45;
      this.shadowColor = '#808080';
      this.outlineColor = '#000000';

      this.onInputShadowColorChange();
      this.onInputHollowColorChange();

      document.querySelector<HTMLElement>('#splice').style.display = 'block';
      this.setEffectSelector('#selector-splice');

      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' +
          this.moveableService.selectedPageId +
          '-' +
          this.moveableService.selectedItemId
      );
      this.previousFontColor = this.editorEle.style.color;
      this.editorEle.style.color = 'white';
      this.setShadowEffect();
      this.setHollowEffect();
      this.saveTheData();
    }
    if (method == 'echo') {
      this.isEcho = true;
      this.defaultEffect();
      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' +
          this.moveableService.selectedPageId +
          '-' +
          this.moveableService.selectedItemId
      );
      this.shadowColor = '#000000';
      this.offset = 50;
      this.angle = -45;
      this.blurSize = 0;

      this.setMultiShadowEffect();
      document.querySelector<HTMLElement>('#echo').style.display = 'block';
      this.setEffectSelector('#selector-echo');
      this.saveTheData();
    }
    if (method == 'glitch') {
      this.isGlitch = true;
      this.defaultEffect();
      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' +
          this.moveableService.selectedPageId +
          '-' +
          this.moveableService.selectedItemId
      );
      this.shadowColor = '#000000';
      this.offset = 30;
      this.blurSize = 0;
      this.angle = 90;
      this.directionX = Math.sin((this.angle * Math.PI) / 180);
      this.directionY = Math.cos((this.angle * Math.PI) / 180);

      this.setGlitchEffect();
      document.querySelector<HTMLElement>('#glitch').style.display = 'block';
      this.setEffectSelector('#selector-glitch');
      this.saveTheData();
    }
    if (method == 'neon') {
      this.isNeon = true;
      this.defaultEffect();
      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' +
          this.moveableService.selectedPageId +
          '-' +
          this.moveableService.selectedItemId
      );
      this.shadowColor = '#000000';
      this.blurSize = 50;
      this.neonValue = 50;

      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' +
          this.moveableService.selectedPageId +
          '-' +
          this.moveableService.selectedItemId
      );
      this.editorEle.style.color = 'rgb(0, 0, 0)';

      this.onInputShadowColorChange();

      this.setNeonEffect();
      document.querySelector<HTMLElement>('#neon').style.display = 'block';
      this.setEffectSelector('#selector-neon');
      this.saveTheData();
    }
    if (method == 'curve') {
      this.editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' +
          this.moveableService.selectedPageId +
          '-' +
          this.moveableService.selectedItemId
      );
      let item = this.moveableService.getItem(this.editorEle);

      this.isCurve = true;
      this.defaultEffect();
      this.curveValue = item.angle;
      this.toolbarService.direction = 1;
      this.setCurveEffect();
      document.querySelector<HTMLElement>('#curve').style.display = 'block';
      this.setEffectSelector('#selector-curve');
    }
  }

  defaultEffect() {
    this.editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' +
        this.moveableService.selectedPageId +
        '-' +
        this.moveableService.selectedItemId
    );

    this.editorEle.style.textShadow = 'rgba(0, 0, 0, 0) 0px 0px 0px';
    this.editorEle.style.webkitTextStroke = '0px rgb(0, 0, 0)';
    if (!this.previousFontColor) {
      this.editorEle.style.color = this.previousFontColor;
      this.previousFontColor = null;
    }
    this.editorEle.setAttribute('Curve', 'false');
    let item = this.moveableService.getItem(this.editorEle);
    item.isCurve = false;

    document.querySelector<HTMLElement>(
      '#textEditor-' +
        this.moveableService.selectedPageId +
        '-' +
        this.moveableService.selectedItemId
    ).style.opacity = '1';
    document.querySelector<HTMLElement>(
      '#curveText-' +
        this.moveableService.selectedPageId +
        '-' +
        this.moveableService.selectedItemId
    ).style.opacity = '0';
    document
      .querySelector<HTMLElement>(
        '#curveText-' +
          this.moveableService.selectedPageId +
          '-' +
          this.moveableService.selectedItemId
      )
      .setAttribute('style', '-webkit-opacity: 0');
    this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
      this.moveableService.selectedItemId
    ].textOpacity = '1';
    this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
      this.moveableService.selectedItemId
    ].curveOpacity = '0';
  }

  setEffectSelector(id) {
    let ele = document.querySelector<HTMLElement>(id)
      .firstElementChild as HTMLElement;
    ele.style.borderColor = 'rgb(109, 47, 165)';
  }

  setShadowEffect() {
    this.editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' +
        this.moveableService.selectedPageId +
        '-' +
        this.moveableService.selectedItemId
    );
    this.fontSize = this.editorEle.style.fontSize;

    this.offsetX =
      (
        (parseFloat(this.fontSize) / (100 / this.offset) / 6) *
        this.directionX
      ).toString() + 'px';
    this.offsetY =
      (
        (parseFloat(this.fontSize) / (100 / this.offset) / 6) *
        this.directionY
      ).toString() + 'px';
    this.blurSize =
      (parseFloat(this.fontSize) / (100 / this.blur) / 6).toString() + 'px';

    let op = this.opacity / 100;

    let textShadow =
      'rgba(' +
      this.shadowR +
      ', ' +
      this.shadowG +
      ', ' +
      this.shadowB +
      ', ' +
      op +
      ') ' +
      this.offsetX +
      ' ' +
      this.offsetY +
      ' ' +
      this.blurSize;
    this.editorEle.style.textShadow = textShadow;
    this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
      this.moveableService.selectedItemId
    ].textShadow = textShadow;
  }

  setSpliceShadowEffect() {
    this.editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' +
        this.moveableService.selectedPageId +
        '-' +
        this.moveableService.selectedItemId
    );
    this.fontSize = this.editorEle.style.fontSize;

    this.offsetX =
      (
        (parseFloat(this.fontSize) / (100 / this.spliceOffset) / 6) *
        this.directionX
      ).toString() + 'px';
    this.offsetY =
      (
        (parseFloat(this.fontSize) / (100 / this.spliceOffset) / 6) *
        this.directionY
      ).toString() + 'px';
    this.blurSize =
      (parseFloat(this.fontSize) / (100 / this.blur) / 6).toString() + 'px';

    let op = this.opacity / 100;

    let textShadow =
      'rgba(' +
      this.shadowR +
      ', ' +
      this.shadowG +
      ', ' +
      this.shadowB +
      ', ' +
      op +
      ') ' +
      this.offsetX +
      ' ' +
      this.offsetY +
      ' ' +
      this.blurSize;
    this.editorEle.style.textShadow = textShadow;
    this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
      this.moveableService.selectedItemId
    ].textShadow = textShadow;
  }

  // shadow

  onInputOffsetChange(event) {
    this.offset = event.value;

    this.setShadowEffect();
  }

  onSpliceOffsetChange(event) {
    this.spliceOffset = event.value;

    this.setSpliceShadowEffect();
  }

  onInputBlurChange(event) {
    this.blur = event.value;

    this.setShadowEffect();
  }

  onInputDirectionChange(event) {
    this.angle = event.value;
    this.directionX = Math.sin((this.angle * Math.PI) / 180);
    this.directionY = Math.cos((this.angle * Math.PI) / 180);

    this.setShadowEffect();
  }

  onInputShadowColorChange() {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      this.shadowColor
    );

    this.shadowR = parseInt(result[1], 16);
    this.shadowG = parseInt(result[2], 16);
    this.shadowB = parseInt(result[3], 16);

    this.setShadowEffect();
  }

  onInputHollowColorChange() {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      this.outlineColor
    );

    this.outlineR = parseInt(result[1], 16);
    this.outlineG = parseInt(result[2], 16);
    this.outlineB = parseInt(result[3], 16);

    this.setHollowEffect();
  }

  onInputOpacityChange(event) {
    this.opacity = event.value;

    this.setShadowEffect();
  }

  onInputLiftChange(event) {
    this.intensity = event.value;
    this.blur = event.value;

    this.setShadowEffect();
  }

  // Hollow
  setHollowEffect() {
    this.editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' +
        this.moveableService.selectedPageId +
        '-' +
        this.moveableService.selectedItemId
    );
    this.fontSize = this.editorEle.style.fontSize;
    let textStroke =
      ((parseFloat(this.fontSize) * this.thickness) / 100 / 14.54).toString() +
      'px rgb(' +
      this.outlineR +
      ', ' +
      this.outlineG +
      ', ' +
      this.outlineB +
      ')';
    this.editorEle.style.webkitTextStroke = textStroke;
    this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
      this.moveableService.selectedItemId
    ].textStroke = textStroke;
  }

  onInputThicknessChange(event) {
    this.thickness = event.value;

    this.setHollowEffect();
  }

  // Echo
  setMultiShadowEffect() {
    this.editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' +
        this.moveableService.selectedPageId +
        '-' +
        this.moveableService.selectedItemId
    );
    this.fontSize = this.editorEle.style.fontSize;

    this.offsetX =
      (
        (parseFloat(this.fontSize) / (100 / this.echoOffset) / 6) *
        this.directionX
      ).toString() + 'px';
    this.offsetY =
      (
        (parseFloat(this.fontSize) / (100 / this.echoOffset) / 6) *
        this.directionY
      ).toString() + 'px';
    let offset2X =
      (
        (parseFloat(this.fontSize) / (100 / this.echoOffset) / 6) *
        this.directionX *
        2
      ).toString() + 'px';
    let offset2Y =
      (
        (parseFloat(this.fontSize) / (100 / this.echoOffset) / 6) *
        this.directionY *
        2
      ).toString() + 'px';
    this.blurSize =
      (parseFloat(this.fontSize) / (100 / this.blur) / 6).toString() + 'px';

    let textShadow =
      'rgba(' +
      this.shadowR +
      ', ' +
      this.shadowG +
      ', ' +
      this.shadowB +
      ', ' +
      0.5 +
      ') ' +
      this.offsetX +
      ' ' +
      this.offsetY +
      ' ' +
      this.blurSize +
      ', ' +
      'rgba(' +
      this.shadowR +
      ', ' +
      this.shadowG +
      ', ' +
      this.shadowB +
      ', ' +
      0.3 +
      ') ' +
      offset2X +
      ' ' +
      offset2Y +
      ' ' +
      this.blurSize;
    this.editorEle.style.textShadow = textShadow;
    this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
      this.moveableService.selectedItemId
    ].textShadow = textShadow;
  }

  onInputMultiOffsetChange(event) {
    this.echoOffset = event.value;

    this.setMultiShadowEffect();
  }

  onInputMultiDirectionChange(event) {
    this.angle = event.value;
    this.directionX = Math.sin((this.angle * Math.PI) / 180);
    this.directionY = Math.cos((this.angle * Math.PI) / 180);

    this.setMultiShadowEffect();
  }

  onInputMultiShadowColorChange() {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      this.shadowColor
    );

    this.shadowR = parseInt(result[1], 16);
    this.shadowG = parseInt(result[2], 16);
    this.shadowB = parseInt(result[3], 16);

    this.setMultiShadowEffect();
  }

  // Glitch
  setGlitchEffect() {
    this.editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' +
        this.moveableService.selectedPageId +
        '-' +
        this.moveableService.selectedItemId
    );
    this.fontSize = this.editorEle.style.fontSize;

    this.offsetX =
      (
        (parseFloat(this.fontSize) / (100 / this.glitchOffset) / 6) *
        this.directionX
      ).toString() + 'px';
    this.offsetY =
      (
        (parseFloat(this.fontSize) / (100 / this.glitchOffset) / 6) *
        this.directionY
      ).toString() + 'px';
    let offset2X =
      (
        ((-1 * parseFloat(this.fontSize)) / (100 / this.glitchOffset) / 6) *
        this.directionX
      ).toString() + 'px';
    let offset2Y =
      (
        ((-1 * parseFloat(this.fontSize)) / (100 / this.glitchOffset) / 6) *
        this.directionY
      ).toString() + 'px';
    this.blurSize =
      (parseFloat(this.fontSize) / (100 / this.blur) / 6).toString() + 'px';

    let textShadow =
      this.glitchColorA +
      ' ' +
      this.offsetX +
      ' ' +
      this.offsetY +
      ' ' +
      this.blurSize +
      ', ' +
      this.glitchColorB +
      ' ' +
      offset2X +
      ' ' +
      offset2Y +
      ' ' +
      this.blurSize;

    this.editorEle.style.textShadow = textShadow;
    this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
      this.moveableService.selectedItemId
    ].textShadow = textShadow;
  }

  onInputGlitchOffsetChange(event) {
    this.glitchOffset = event.value;

    this.setGlitchEffect();
  }

  onInputGlitchDirectionChange(event) {
    this.angle = event.value;
    this.directionX = Math.sin((this.angle * Math.PI) / 180);
    this.directionY = Math.cos((this.angle * Math.PI) / 180);

    this.setGlitchEffect();
  }

  isRed5Pink = false;
  onInputGlitchChange_A() {
    this.isRed5Pink = false;
  }

  onInputGlitchChange_B() {
    this.isRed5Pink = true;
  }

  onInputGlitchA1ColorChange() {
    let resultA1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      this.glitchColorA1
    );
    let resultA2 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      this.glitchColorA2
    );

    this.glitchColorA1 = resultA1[0];
    this.glitchColorA =
      'rgb(' +
      parseInt(resultA1[1], 16) +
      ', ' +
      parseInt(resultA1[2], 16) +
      ', ' +
      parseInt(resultA1[3], 16) +
      ')';
    this.glitchColorB =
      'rgb(' +
      parseInt(resultA2[1], 16) +
      ', ' +
      parseInt(resultA2[2], 16) +
      ', ' +
      parseInt(resultA2[3], 16) +
      ')';
    this.setGlitchEffect();
  }

  onInputGlitchA2ColorChange() {
    let resultA1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      this.glitchColorA1
    );
    let resultA2 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      this.glitchColorA2
    );

    this.glitchColorA2 = resultA2[0];
    this.glitchColorA =
      'rgb(' +
      parseInt(resultA1[1], 16) +
      ', ' +
      parseInt(resultA1[2], 16) +
      ', ' +
      parseInt(resultA1[3], 16) +
      ')';
    this.glitchColorB =
      'rgb(' +
      parseInt(resultA2[1], 16) +
      ', ' +
      parseInt(resultA2[2], 16) +
      ', ' +
      parseInt(resultA2[3], 16) +
      ')';
    this.setGlitchEffect();
  }

  onInputGlitchB1ColorChange() {
    let resultB1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      this.glitchColorB1
    );
    let resultB2 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      this.glitchColorB2
    );

    this.glitchColorB1 = resultB1[0];
    this.glitchColorA =
      'rgb(' +
      parseInt(resultB1[1], 16) +
      ', ' +
      parseInt(resultB1[2], 16) +
      ', ' +
      parseInt(resultB1[3], 16) +
      ')';
    this.glitchColorB =
      'rgb(' +
      parseInt(resultB2[1], 16) +
      ', ' +
      parseInt(resultB2[2], 16) +
      ', ' +
      parseInt(resultB2[3], 16) +
      ')';
    this.setGlitchEffect();
  }

  onInputGlitchB2ColorChange() {
    let resultB1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      this.glitchColorB1
    );
    let resultB2 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      this.glitchColorB2
    );

    this.glitchColorB2 = resultB2[0];
    this.glitchColorA =
      'rgb(' +
      parseInt(resultB1[1], 16) +
      ', ' +
      parseInt(resultB1[2], 16) +
      ', ' +
      parseInt(resultB1[3], 16) +
      ')';
    this.glitchColorB =
      'rgb(' +
      parseInt(resultB2[1], 16) +
      ', ' +
      parseInt(resultB2[2], 16) +
      ', ' +
      parseInt(resultB2[3], 16) +
      ')';
    this.setGlitchEffect();
  }

  // Neon

  setNeonEffect() {
    this.editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' +
        this.moveableService.selectedPageId +
        '-' +
        this.moveableService.selectedItemId
    );
    this.fontSize = this.editorEle.style.fontSize;

    this.offsetX = 1;
    this.offsetY = 1;
    this.blurSize =
      (parseFloat(this.fontSize) / (100 / this.blur) / 6).toString() + 'px';
    let blur = parseFloat(this.fontSize) / 100 / 6;

    let op = 1;

    let R = this.shadowR + ((255 - this.shadowR) * (this.neonValue - 1)) / 100;
    let G = this.shadowG + ((255 - this.shadowG) * (this.neonValue - 1)) / 100;
    let B = this.shadowB + ((255 - this.shadowB) * (this.neonValue - 1)) / 100;

    let textShadow =
      'rgba(' +
      this.shadowR +
      ', ' +
      this.shadowG +
      ', ' +
      this.shadowB +
      ', ' +
      op +
      ') ' +
      this.offsetX +
      'px' +
      ' ' +
      this.offsetY +
      'px' +
      ' ' +
      blur * 10 * 6 +
      'px, ' +
      'rgba(' +
      this.shadowR +
      ', ' +
      this.shadowG +
      ', ' +
      this.shadowB +
      ', ' +
      op +
      ') ' +
      this.offsetX +
      'px' +
      ' ' +
      this.offsetY +
      'px' +
      ' ' +
      blur * 10 * 8 +
      'px, ' +
      'rgba(' +
      this.shadowR +
      ', ' +
      this.shadowG +
      ', ' +
      this.shadowB +
      ', ' +
      op +
      ') ' +
      this.offsetX +
      'px' +
      ' ' +
      this.offsetY +
      'px' +
      ' ' +
      blur * 10 * 12 +
      'px';

    this.editorEle.style.color = 'rgb(' + R + ', ' + G + ', ' + B + ')';
    this.editorEle.style.textShadow = textShadow;
    this.ds.theDesign.pages[this.moveableService.selectedPageId].items[
      this.moveableService.selectedItemId
    ].textShadow = textShadow;
  }

  onInputNeonChange(event) {
    this.neonValue = event.value;
    this.setNeonEffect();
  }

  onInputNeonColorChange() {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      this.shadowColor
    );

    this.shadowR = parseInt(result[1], 16);
    this.shadowG = parseInt(result[2], 16);
    this.shadowB = parseInt(result[3], 16);

    this.setNeonEffect();
  }

  // curve

  setCurveEffect() {
    this.toolbarService.isCurving = true;
    this.toolbarService.setCurveEffect(
      this.moveableService.selectedPageId,
      this.moveableService.selectedItemId,
      this.curveValue,
      false
    );

    let curveText = document.querySelector<HTMLElement>(
      '#curveText-' +
        this.moveableService.selectedPageId +
        '-' +
        this.moveableService.selectedItemId
    );

    this.moveableService
      .curveTextObserver()
      .observe(
        document.querySelector<HTMLElement>(
          '#curveText-' +
            this.moveableService.selectedPageId +
            '-' +
            this.moveableService.selectedItemId
        )
      );
  }

  onInputCurveChange(event) {
    this.curveValue = event.value;
    let item = this.moveableService.getItem(this.editorEle);
    item.angle = this.curveValue;

    this.setCurveEffect();
  }
}
