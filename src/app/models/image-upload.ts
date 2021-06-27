import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';

import { AssetImage } from './models';
import { Injectable } from '@angular/core';

export class ImageUpload {
  constructor(private authService: AuthService, private storage: AngularFireStorage, private db: AngularFirestore) {}

  task: AngularFireUploadTask;
  percentage: Observable<number> = new Observable<number>();
  snapshot: Observable<any>;
  downloadURL: string;

  orignal: string;
  thumbnail: string;
  width: number;
  height: number;

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

  makeThumbnail(original: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let thumbnail: string;
      let img = new Image();
      const max = 100;
      img.onload = () => {
        this.width = img.width;
        this.height = img.height;

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

  async uploadImage(file: File, isAdmin: boolean) {
    console.log(file);
    this.orignal = await this.fileToDataURL(file);
    this.thumbnail = await this.makeThumbnail(this.orignal);

    let userId = this.authService.user.uid;
    if (isAdmin) userId = 'admin';

    // The storage path
    let path = `user_files/${userId}/image/${Date.now()}_${file.name}`;
    if (isAdmin) path = `assets/image/${Date.now()}_${file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    console.log('png');
    this.snapshot = this.task.snapshotChanges().pipe(
      // tap(console.log),
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        let collectionName = isAdmin ? 'Images' : 'UserFiles';

        this.db.collection<AssetImage>(collectionName).add({
          downloadURL: this.downloadURL,
          path,
          thumbnail: this.thumbnail,
          width: this.width,
          height: this.height,
          timestamp: Date.now(),
          userId,
          tags: [file.name],
        });
      })
    );
  }
}
