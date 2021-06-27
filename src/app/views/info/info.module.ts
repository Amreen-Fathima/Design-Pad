import { InfoRouteModules } from './info.routing';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { InfoComponent } from './info.component';
import { AppModule } from 'src/app/views/app/app.module';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [InfoComponent, PrivacyPolicyComponent],
  imports: [
    CommonModule,
    RouterModule,
    InfoRouteModules,
    SharedModule,
    AppModule,
  ],
  exports: [],
})
export class InfoModule {}
