import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { DropzoneDirective } from './dropzone.directive';
import { UploadTaskComponent } from './upload-task/upload-task.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DropzoneDirective, UploadTaskComponent],
  imports: [
    CommonModule,
    RouterModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    PerfectScrollbarModule,
  ],
  exports: [DropzoneDirective, UploadTaskComponent],
})
export class UploaderModule {}
