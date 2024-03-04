import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { MaterialModule } from './material.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppComponent } from './app.component';
import { DescriptionComponent } from '../components/description/description.component';
import { SideBarComponent } from '../components/side-bar/side-bar.component';

import { PreviewPageComponent } from '../pages/preview/preview-page.component';
import { RegPageComponent } from '../pages/registration/reg-page.component';
import { NotFoundPageComponent } from '../pages/not-found-page/not-found-page.component';

@NgModule({
  declarations: [
    AppComponent,
    PreviewPageComponent,
    RegPageComponent,
    DescriptionComponent,
    SideBarComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideAnimationsAsync(), provideNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}
