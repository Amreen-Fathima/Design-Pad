import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';

import { AssetElement, AssetVideo } from './models';

export class VideoUpload {
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

  generateThumbnail(videoFile: Blob): Promise<string> {
    const video: HTMLVideoElement = document.createElement('video');
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    return new Promise<string>((resolve, reject) => {
      canvas.addEventListener('error', reject);
      video.addEventListener('error', reject);
      video.addEventListener('canplay', (event) => {
        let max = 400;

        this.width = video.videoWidth;
        this.height = video.videoHeight;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        if (video.videoHeight > video.videoWidth) {
          if (video.videoHeight > max) {
            canvas.width = (video.videoWidth / video.videoHeight) * max;
            canvas.height = max;
            this.width = canvas.width;
            this.height = canvas.height;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
          } else context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        } else {
          if (video.videoWidth > max) {
            canvas.height = (video.videoHeight / video.videoWidth) * max;
            canvas.width = max;
            this.width = canvas.width;
            this.height = canvas.height;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
          } else context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        }

        resolve(canvas.toDataURL());
      });
      if (videoFile.type) {
        video.setAttribute('type', videoFile.type);
      }
      video.preload = 'auto';
      video.src = window.URL.createObjectURL(videoFile);
      video.load();
    });
  }

  async uploadVideo(file: File, isAdmin: boolean) {
    this.generateThumbnail(file).then((thumbnailData) => {
      this.thumbnail = thumbnailData;
    });

    let userId = this.authService.user.uid;
    if (isAdmin) userId = 'admin';

    // The storage path
    let path = `user_files/${userId}/video/${Date.now()}_${file.name}`;
    if (isAdmin) path = `assets/video/${Date.now()}_${file.name}`;

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

        let collectionName = isAdmin ? 'Videos' : 'UserFiles';
        let duration = await this.getDuration(this.downloadURL);

        this.db.collection<AssetVideo>(collectionName).add({
          downloadURL: this.downloadURL,
          path,
          thumbnail: this.thumbnail,
          width: this.width,
          height: this.height,
          timestamp: Date.now(),
          userId,
          tags: [file.name],
          duration: duration,
        });
      })
    );
  }

  getDuration(downloadURL) {
    return new Promise(function (resolve) {
      let video = document.createElement('video');

      video.addEventListener(
        'loadedmetadata',
        function () {
          resolve(video.duration);
        },
        false
      );

      video.src = downloadURL;
    });
  }
}
