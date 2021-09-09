import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';

import { UploaderModule } from '../1/uploader/uploader.module';
import { TopnavComponent } from './topnav/topnav.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DesignPanelComponent } from './design-panel/design-panel.component';
import { PageComponent } from './page/page.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PhotosComponent } from './sidebar/photos/photos.component';
import { RemoveHostDirective } from './remove-host.directive';
import { NgxMoveableModule } from 'ngx-moveable';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { UserUploadsComponent } from './sidebar/user-uploads/user-uploads.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from 'src/app/material.module';
import { ToolpanelComponent } from './toolpanel/toolpanel.component';
import { NouisliderModule } from 'ng2-nouislider';
import { FilterComponent } from './toolpanel/filter/filter.component';
import { PresetComponent } from './toolpanel/preset/preset.component';
import { TextComponent } from './sidebar/text/text.component';
import { TextItemComponent } from './page/text-item/text-item.component';
import { EditItemComponent } from './page/edit-item/edit-item.component';
import { ImageToolbarComponent } from './toolbar/image-toolbar/image-toolbar.component';
import { TextToolbarComponent } from './toolbar/text-toolbar/text-toolbar.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { FontListComponent } from './toolpanel/font-list/font-list.component';
import { FontItemComponent } from './toolpanel/font-list/font-item/font-item.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TextEffectsComponent } from './toolpanel/text-effects/text-effects.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { ColorPickerModule } from 'ngx-color-picker';
import { MusicsComponent } from './sidebar/musics/musics.component';
import { ElementsComponent } from './sidebar/elements/elements.component';
import { ElementToolbarComponent } from './toolbar/element-toolbar/element-toolbar.component';
import { HttpClientModule } from '@angular/common/http';
import { SVGElementComponent } from './page/element/svgelement/svgelement.component';
import { SVGSelectorComponent } from './page/element/svgselector/svgselector.component';
import { ImageElementComponent } from './page/image/image-element/image-element.component';
import { ImageSelectorComponent } from './page/image/image-selector/image-selector.component';
import { MusicToolbarComponent } from './toolbar/music-toolbar/music-toolbar.component';
import { VideosComponent } from './sidebar/videos/videos.component';
import { VideoElementComponent } from './page/video/video-element/video-element.component';
import { VideoSelectorComponent } from './page/video/video-selector/video-selector.component';
import { VideoToolbarComponent } from './toolbar/video-toolbar/video-toolbar.component';
import { TemplatesComponent } from './sidebar/templates/templates.component';
import { MatButtonModule } from '@angular/material/button';
import { FooterPanelComponent } from './footer-panel/footer-panel.component';
import { ModalBoxComponent } from './modal-box/modal-box.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MyTemplatesComponent } from './sidebar/my-templates/my-templates.component';

@NgModule({
  declarations: [
    AppComponent,
    TopnavComponent,
    SidebarComponent,
    DesignPanelComponent,
    PageComponent,
    PhotosComponent,
    RemoveHostDirective,
    UserUploadsComponent,
    ToolbarComponent,
    ToolpanelComponent,
    FilterComponent,
    PresetComponent,
    TextComponent,
    TextItemComponent,
    EditItemComponent,
    ImageToolbarComponent,
    TextToolbarComponent,
    FontListComponent,
    FontItemComponent,
    TextEffectsComponent,
    MusicsComponent,
    ElementsComponent,
    ElementToolbarComponent,
    SVGElementComponent,
    SVGSelectorComponent,
    ImageElementComponent,
    ImageSelectorComponent,
    MusicToolbarComponent,
    VideosComponent,
    VideoElementComponent,
    VideoSelectorComponent,
    VideoToolbarComponent,
    TemplatesComponent,
    FooterPanelComponent,
    ModalBoxComponent,
    MyTemplatesComponent,
  ],
  imports: [
    CommonModule,
    CollapseModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    LayoutContainersModule,
    UploaderModule,
    NgxMoveableModule,
    LazyLoadImageModule,
    MaterialModule,
    NouisliderModule,
    NgSelectModule,
    SelectDropDownModule,
    InfiniteScrollModule,
    MatSliderModule,
    MatTabsModule,
    ColorPickerModule,
    HttpClientModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
  ],

  exports: [TopnavComponent],
})
export class AppModule {}
