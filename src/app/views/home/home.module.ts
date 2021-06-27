import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home.routing';
import { HomeComponent } from './home.component';
import { PricesComponent } from './prices/prices.component';
import { PriceCardComponent } from './price-card/price-card.component';
import { FeatureComparisionComponent } from './feature-comparision/feature-comparision.component';
import { TranslateModule } from '@ngx-translate/core';
import { HeadroomModule } from '@ctrl/ngx-headroom';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ComponentsCarouselModule } from 'src/app/components/carousel/components.carousel.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppModule } from 'src/app/views/app/app.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    HomeComponent,
    PricesComponent,
    PriceCardComponent,
    FeatureComparisionComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    TranslateModule,
    HeadroomModule,
    CommonModule,
    ScrollToModule.forRoot(),
    ComponentsCarouselModule,
    MatIconModule,
    MatButtonModule,
    AppModule,
    LazyLoadImageModule,
  ],
})
export class HomeModule {}
