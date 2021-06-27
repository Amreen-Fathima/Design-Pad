import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../shared/auth.service';
import { AssetImage } from '../models/models';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class MyfilesService {
  constructor(private db: AngularFirestore, private storage: AngularFireStorage, private authService: AuthService) {}

  readImageByTag(userId: string, tag?: string) {
    if (!tag || tag === '')
      return this.db
        .collection<AssetImage>('UserFiles', (ref) => ref.where('userId', '==', userId))
        .snapshotChanges();
    else
      return this.db
        .collection<AssetImage>('UserFiles', (ref) => ref.where('tags', 'array-contains', tag).where('userId', '==', userId))
        .snapshotChanges();
  }

  updateImageTags(asset: AssetImage) {
    this.db.collection<AssetImage>('UserFiles').doc(asset.uid).update({
      tags: asset.tags,
      timestamp: Date.now(),
    });
  }

  removeImages(arr: AssetImage[]) {
    arr.forEach((asset) => {
      this.storage.ref(asset.path).delete();
      this.db.collection<AssetImage>('UserFiles').doc(asset.uid).delete();
    });
  }
}
