import { CategoryListComponent } from './category-list/category-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseTemplateComponent } from './browse-template.component';
import { BrowseTemplateRoutingModule } from './browse-template.routing.module';
import { ComponentsCarouselModule } from 'src/app/components/carousel/components.carousel.module';
import { AppModule } from 'src/app/views/app/app.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BrowseTemplateComponent, CategoryListComponent],
  imports: [
    CommonModule,
    BrowseTemplateRoutingModule,
    ComponentsCarouselModule,
    AppModule,
    LazyLoadImageModule,
    FormsModule,
  ],
})
export class BrowseTemplateModule {}
