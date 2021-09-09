// import { AdminTemplates } from './models';
import { ItemType } from './enums';
import { UserRole } from '../shared/auth.roles';
import { Data } from '@angular/router';

export interface Item {
  type: ItemType;
  pageId: number;
  itemId: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  clipStyle?: any;
  selected?: boolean;
  hovered?: boolean;
  url?: string;
  thumbnail?: string;
  filter?: string;
  text?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: number;
  SVGElement?: string;
  color?: [];
  textColor?: string;
  colorAndIndex?: {};
  lineHeight?: string;
  letterSpacing?: string;
  quillData?;
  textShadow?;
  textStroke?;
  curveText?;
  isCurve?;
  angle?;
  textOpacity?;
  curveOpacity?;
  zIndex;
  clipPathToNumber?: number[];
  onPlayButton?: boolean;
  onPlayVideo?: boolean;
  isOnResize?: boolean;
  tags?: string[];
  svgScale?: string;
  opacity?: string;
}

export interface Page {
  title: string;
  thumbnail?: string;
  items: Item[];
}

export interface Design {
  uid: string;
  title: string;
  category: Category;
  thumbnail: string;
  pages: Page[];
}

export interface Category {
  uid: string;
  title: string;
  size: { x: number; y: number };
  categoryType: CategoryType;
  thumbnail: string;
  tags: any;
}

export interface CategoryType {
  uid: string;
  title: string;
}

export interface AssetImage {
  uid?: string;
  downloadURL: string;
  path: string;
  thumbnail: string;
  width: number;
  height: number;
  timestamp: number;
  userId: string;
  tags: string[];
}

export interface CategoryName {
  category: string[];
}

export interface AssetElement {
  uid?: string;
  downloadURL: string;
  path: string;
  thumbnail: string;
  width: number;
  height: number;
  timestamp: number;
  userId: string;
  category: string[];
  tags: string[];
  svg?: string;
  clickCount?: number;
}

export interface AssetMusic {
  uid?: string;
  downloadURL: string;
  path: string;
  thumbnail: string;
  timestamp: number;
  userId: string;
  tags: string[];
  name: string;
  duration;
}

export interface AssetVideo {
  uid?: string;
  downloadURL: string;
  path: string;
  thumbnail: string;
  width: number;
  height: number;
  timestamp: number;
  userId: string;
  tags: string[];
  duration;
}

export interface UserData {
  docId?: string;
  uid: string;
  displayName: string;
  role: UserRole;
  template: UploadUserTemplate[];
  email: string;
  timestamp: number;
}

export interface AdminTemplate {
  docId?: string;
  design: Design;
  width: number;
  height: number;
  timestamp: number;
}

export interface AdminTemplates {
  templates: AdminTemplate[];
  clickCount: number;
  downloadCount: number;
}

export interface UploadUserTemplate {
  design: Design;
  thumbnail: string;
  width: number;
  height: number;
  timestamp: number;
}

export interface UndoRedo {
  maxLength: number;
  position: number;
  temp: any[];
}
