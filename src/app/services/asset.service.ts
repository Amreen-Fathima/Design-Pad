import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AssetImage, CategoryName } from '../models/models';
import { AssetMusic } from '../models/models';
import { AssetElement } from '../models/models';
import { AssetVideo } from '../models/models';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class AssetService {
  elementCategoryName: string[] = [];
  assetElements: any[] = [];
  leftoverElements: AssetElement[] = [];
  categoryName: string[] = [];

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  readImageByTag(tag: string) {
    if (tag === '')
      return this.db.collection<AssetImage>('Images').snapshotChanges();
    else
      return this.db
        .collection<AssetImage>('Images', (ref) =>
          ref.where('tags', 'array-contains', tag)
        )
        .snapshotChanges();
  }

  readUserFileImagesByDocId(assetImage: AssetImage) {
    return this.db
      .collection<AssetImage>('UserFiles')
      .doc(assetImage.uid)
      .snapshotChanges();
  }

  readMusicByTag(tag: string) {
    if (tag === '')
      return this.db.collection<AssetMusic>('Musics').snapshotChanges();
    else
      return this.db
        .collection<AssetMusic>('Musics', (ref) =>
          ref.where('tags', 'array-contains', tag)
        )
        .snapshotChanges();
  }

  setElementCategoryName(categoryName) {
    this.db
      .collection<CategoryName>('CategoryName')
      .doc('CategoryName')
      .set({ categoryName: categoryName });
  }

  readElementCategoryName() {
    return this.db
      .collection<CategoryName>('CategoryName')
      .doc('CategoryName')
      .get();
  }

  updateElementCategory(element) {
    this.db.collection<AssetElement>('Elements').doc(element.uid).update({
      category: element.category,
      tags: element.tags,
    });
  }

  readElementByTag(tag: string) {
    if (tag === '')
      return this.db.collection<AssetElement>('Elements').snapshotChanges();
    else
      return this.db
        .collection<AssetElement>('Elements', (ref) =>
          ref.where('tags', 'array-contains', tag)
        )
        .snapshotChanges();
  }

  readElementCount(docId) {
    return this.db.collection<AssetElement>('Elements').doc(docId).get();
  }

  readElementByCategory(name: string) {
    return this.db
      .collection<AssetElement>('Elements', (ref) =>
        ref.where('category', 'array-contains', name)
      )
      .snapshotChanges();
  }

  updateElementCount(count, docId) {
    this.db.collection<AssetElement>('Elements').doc(docId).update({
      clickCount: count,
    });
  }

  readVideoByTag(tag: string) {
    if (tag === '')
      return this.db.collection<AssetVideo>('Videos').snapshotChanges();
    else
      return this.db
        .collection<AssetVideo>('Videos', (ref) =>
          ref.where('tags', 'array-contains', tag)
        )
        .snapshotChanges();
  }

  updateImageTags(assetImage: AssetImage) {
    this.db.collection<AssetImage>('Images').doc(assetImage.uid).update({
      tags: assetImage.tags,
      timestamp: Date.now(),
    });
  }

  updateMusicTags(assetMusic: AssetMusic) {
    this.db.collection<AssetMusic>('Musics').doc(assetMusic.uid).update({
      tags: assetMusic.tags,
      timestamp: Date.now(),
    });
  }

  updateElementTags(assetElement: AssetElement) {
    this.db.collection<AssetElement>('Elements').doc(assetElement.uid).update({
      tags: assetElement.tags,
      timestamp: Date.now(),
    });
  }

  createElements(elements, categoryName) {
    this.db
      .collection<AssetElement>('Elements')
      .doc(categoryName)
      .set({ elements: elements });
  }

  updateVideoTags(assetVideo: AssetVideo) {
    this.db.collection<AssetVideo>('Videos').doc(assetVideo.uid).update({
      tags: assetVideo.tags,
      timestamp: Date.now(),
    });
  }

  removeImages(arr: AssetImage[]) {
    arr.forEach((asset) => {
      this.storage.ref(asset.path).delete();
      this.db.collection<AssetImage>('Images').doc(asset.uid).delete();
    });
  }

  removeUserFileImages(arr: AssetImage[]) {
    arr.forEach((asset) => {
      this.storage.ref(asset.path).delete();
      this.db.collection<AssetImage>('UserFiles').doc(asset.uid).delete();
    });
  }

  removeMusics(arr: AssetMusic[]) {
    arr.forEach((asset) => {
      this.storage.ref(asset.path).delete();
      this.db.collection<AssetMusic>('Musics').doc(asset.uid).delete();
    });
  }

  removeUserElements(arr) {
    arr.forEach((asset) => {
      this.storage.ref(asset.path).delete();
      this.db.collection<AssetElement>('Elements').doc(asset.uid).delete();
    });
  }

  updateElements(elements, docId) {
    this.db
      .collection<AssetElement>('Elements')
      .doc(docId)
      .update({ elements: elements });
  }

  removeElements() {
    if (!this.leftoverElements) {
      for (let i = 0; i < this.assetElements.length; i++) {
        this.db
          .collection<AssetElement>('Elements')
          .doc(this.assetElements[i]['elements'][0].category)
          .delete();
      }
    } else {
      for (let i = 0; i < this.leftoverElements.length; i++) {
        if (
          this.leftoverElements[i]['elements'].length !=
          this.assetElements[i]['elements'].length
        ) {
          if (this.leftoverElements[i]['elements'].length) {
            let elements = this.leftoverElements[i]['elements'];
            console.log(elements);

            this.db
              .collection<AssetElement>('Elements')
              .doc(this.elementCategoryName[i])
              .update({
                elements,
              });
          } else {
            this.db
              .collection<AssetElement>('Elements')
              .doc(this.elementCategoryName[i])
              .delete();
          }
        }
      }
    }
  }

  removeVideos(arr: AssetVideo[]) {
    arr.forEach((asset) => {
      this.storage.ref(asset.path).delete();
      this.db.collection<AssetVideo>('Videos').doc(asset.uid).delete();
    });
  }

  async updateMusicThumbnail(file: File, assetMusic: AssetMusic) {
    if (file.type == 'image/jpeg') {
      let orignal = await this.fileToDataURL(file);
      let thumbnail = await this.makeMusicThumbnail(orignal);

      this.db.collection<AssetMusic>('Musics').doc(assetMusic.uid).update({
        thumbnail: thumbnail,
        timestamp: Date.now(),
      });
    }
  }

  makeMusicThumbnail(original: string) {
    return new Promise((resolve, reject) => {
      let thumbnail: string;
      let img = new Image();
      const max = 100;
      img.onload = () => {
        if (img.height > max) {
          var oc = document.createElement('canvas'),
            octx = oc.getContext('2d');
          oc.height = img.height;
          oc.width = img.width;
          octx.drawImage(img, 0, 0);
          oc.width = (img.width / img.height) * max;
          oc.height = max;
          octx.drawImage(oc, 0, 0, oc.width, oc.height);
          octx.drawImage(img, 0, 0, oc.width, oc.height);
          thumbnail = oc.toDataURL();
        } else {
          try {
            thumbnail = oc.toDataURL();
          } catch (error) {
            return;
          }
        }

        resolve(thumbnail);
      };
      img.src = original;
    });
  }

  fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        let original = reader.result as string;
        resolve(original);
      };
      reader.readAsDataURL(file);
    });
  }
}
