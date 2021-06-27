import { AssetImage } from './models';

export const isPntInRect = (
  x: number,
  y: number,
  x0: number,
  y0: number,
  w: number,
  h: number
) => {
  return x0 <= x && x <= x0 + w && y0 <= y && y <= y0 + h;
};

export const eightPos = (left, top, w, h) => [
  { x: left, y: top },
  { x: left + w, y: top },
  { x: left + w, y: top + h },
  { x: left, y: top + h },
  { x: left + w / 2, y: top },
  { x: left + w, y: top + h / 2 },
  { x: left + w / 2, y: top + h },
  { x: left, y: top + h / 2 },
];

export const decideHeights = (
  arr: AssetImage[],
  W: number,
  maxH: number,
  padding: number
) => {
  let heights = [];
  for (let i = 0; i < arr.length; i++) {
    if (i < heights.length) continue;
    let wSum = 0;
    let j = i;
    for (; j < arr.length; j++) {
      wSum +=
        (arr[j].width * (maxH - 2 * padding)) / arr[j].height + 2 * padding;
      if (wSum >= W) break;
    }

    let h = Math.floor((maxH * W) / wSum);
    if (wSum < W) h = maxH;

    for (let k = i; k <= j; k++) heights.push(h);
  }
  return heights;
};
