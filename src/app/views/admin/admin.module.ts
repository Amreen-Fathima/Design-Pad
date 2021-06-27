import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAuthComponent } from './admin-auth/admin-auth.component';
import { AdminRoutingModule } from './admin.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PhotosComponent } from './photos/photos.component';
import { UploaderModule } from '../1/uploader/uploader.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DevprogressComponent } from './devprogress/devprogress.component';
import { MaterialModule } from 'src/app/material.module';
import { MusicsComponent } from './musics/musics.component';
import { ElementsComponent } from './elements/elements.component';
import { VideosComponent } from './videos/videos.component';

@NgModule({
  declarations: [AdminAuthComponent, DashboardComponent, PhotosComponent, DevprogressComponent, MusicsComponent, ElementsComponent, VideosComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    UploaderModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    PerfectScrollbarModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class AdminModule {}
