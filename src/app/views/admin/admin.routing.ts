import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Routes, RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AdminAuthComponent } from './admin-auth/admin-auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DevprogressComponent } from './devprogress/devprogress.component';

const routes: Routes = [
  {
    path: '',
    component: AdminAuthComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'devprogress',
    component: DevprogressComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
