import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';

import { AssetMusic } from './models';

export class MusicUpload {
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

  async uploadMusic(file: File, isAdmin: boolean) {
    let str = file.name.split('').reverse();
    let name = str
      .slice(str.indexOf('.') + 1, str.length)
      .reverse()
      .join('');

    this.orignal = await this.fileToDataURL(file);

    let userId = this.authService.user.uid;
    if (isAdmin) userId = 'admin';

    // The storage path
    let path = `user_files/${userId}/musics/${Date.now()}_${file.name}`;
    if (isAdmin) path = `assets/musics/${Date.now()}_${file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      // tap(console.log),
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        let collectionName = isAdmin ? 'Musics' : 'UserFiles';

        let duration = await this.getDuration(this.downloadURL);

        this.db.collection<AssetMusic>(collectionName).add({
          downloadURL: this.downloadURL,
          path,
          timestamp: Date.now(),
          userId,
          thumbnail: '',
          tags: [],
          name: name,
          duration: duration,
        });
      })
    );
  }

  getDuration(downloadURL) {
    return new Promise(function (resolve) {
      let au = new Audio();

      au.addEventListener(
        'loadedmetadata',
        function () {
          resolve(au.duration);
        },
        false
      );

      au.src = downloadURL;
    });
  }
}
