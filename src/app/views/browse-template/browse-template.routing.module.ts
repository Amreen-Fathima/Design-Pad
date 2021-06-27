import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowseTemplateComponent } from './browse-template.component';

const routes: Routes = [
  {
    path: '',
    component: BrowseTemplateComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowseTemplateRoutingModule {}
