export class ImageFilterObj {
  blur = 0;
  brightness = 100;
  contrast = 100;
  grayscale = 0;
  // hue = 0;
  invert = 0;
  opacity = 100;
  saturate = 100;
  sepia = 0;

  params = {
    blur: [0, 10, 0],
    brightness: [0, 200, 100],
    contrast: [0, 200, 100],
    grayscale: [0, 100, 0],
    // hue: [0, 360, 0],
    invert: [0, 100, 0],
    opacity: [0, 100, 100],
    saturate: [0, 200, 100],
    sepia: [0, 100, 0],
  };

  constructor(str: string) {
    if (!str || str.length === 0) return;
    if (str.indexOf('blur(') > -1)
      this.blur = Number(str.split('blur(')[1]?.split('px)')[0]);
    if (str.indexOf('brightness(') > -1)
      this.brightness = Number(str.split('brightness(')[1]?.split('%)')[0]);
    if (str.indexOf('contrast(') > -1)
      this.contrast = Number(str.split('contrast(')[1]?.split('%)')[0]);
    if (str.indexOf('grayscale(') > -1)
      this.grayscale = Number(str.split('grayscale(')[1]?.split('%)')[0]);
    // this.hue = Number(str.split('hue(')[1].split('deg)')[0]);
    if (str.indexOf('invert(') > -1)
      this.invert = Number(str.split('invert(')[1]?.split('%)')[0]);
    if (str.indexOf('opacity(') > -1)
      this.opacity = Number(str.split('opacity(')[1]?.split('%)')[0]);
    if (str.indexOf('saturate(') > -1)
      this.saturate = Number(str.split('saturate(')[1]?.split('%)')[0]);
    if (str.indexOf('sepia(') > -1)
      this.sepia = Number(str.split('sepia(')[1]?.split('%)')[0]);
  }

  css() {
    return (
      'blur(' +
      this.blur +
      'px)' +
      ' saturate(' +
      this.saturate +
      '%)' +
      ' contrast(' +
      this.contrast +
      '%)' +
      ' invert(' +
      this.invert +
      '%)' +
      ' sepia(' +
      this.sepia +
      '%)' +
      ' grayscale(' +
      this.grayscale +
      '%)' +
      ' brightness(' +
      this.brightness +
      '%)'
      // +
      // ' hue-rotate(' +
      // this.hue +
      // 'deg)'
    );
  }
}
