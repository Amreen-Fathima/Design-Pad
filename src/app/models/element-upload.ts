import { element } from 'protractor';
import { AssetService } from './../services/asset.service';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';
import { AssetElement, CategoryName } from './models';

export class ElementUpload {
  constructor(
    private authService: AuthService,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private assetService: AssetService
  ) {}

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
      const max = 98;
      img.onload = () => {
        this.width = img.width;
        this.height = img.height;

        if (img.height > max || img.width > max) {
          var oc = document.createElement('canvas'),
            octx = oc.getContext('2d');
          oc.height = img.height;
          oc.width = img.width;
          octx.drawImage(img, 0, 0);
          if (oc.width > oc.height) {
            oc.width = max;
            oc.height = (img.height / img.width) * max;
          } else {
            oc.width = (img.width / img.height) * max;
            oc.height = max;
          }
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

  async uploadElement(
    file: File,
    isAdmin: boolean,
    categoryName = null,
    tags = null
  ) {
    console.log(categoryName);
    this.orignal = await this.fileToDataURL(file);
    this.thumbnail = await this.makeThumbnail(this.orignal);

    let userId = this.authService.user.uid;
    if (isAdmin) userId = 'admin';

    // The storage path
    let path = `user_files/${userId}/element/${Date.now()}_${file.name}`;
    if (isAdmin) path = `assets/element/${Date.now()}_${file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    console.log(ref);
    this.snapshot = this.task.snapshotChanges().pipe(
      // tap(console.log),
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        let collectionName = isAdmin ? 'Elements' : 'UserFiles';

        console.log(this.assetService.categoryName);
        let category: string[] = [];
        for (let i = 0; i < categoryName.length; i++) {
          category.push(categoryName[i]['label']);
          if (
            !this.assetService.categoryName.includes(categoryName[i]['label'])
          ) {
            this.assetService.categoryName.push(categoryName[i]['label']);
          }
        }
        console.log(category);

        console.log(this.assetService.categoryName);
        this.assetService.setElementCategoryName(
          this.assetService.categoryName
        );

        this.db.collection<AssetElement>(collectionName).add({
          downloadURL: this.downloadURL,
          path,
          thumbnail: this.thumbnail,
          width: this.width,
          height: this.height,
          timestamp: Date.now(),
          userId,
          tags: [file.name],
          category: category,
        });
      })
    );
  }

  getElementCategoryName() {
    this.readElements().subscribe((e) => {
      this.assetService.elementCategoryName = [];

      e.forEach((data) => {
        this.assetService.elementCategoryName.push(data.payload.doc.id);
      });
    });
  }

  readElements() {
    return this.db.collection<AssetElement>('Elements').snapshotChanges();
  }

  createElements(templates, docId) {
    this.db
      .collection<AssetElement>('Elements')
      .doc(docId)
      .set({ templates: templates });
  }
}
