import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { MaterialModule } from './material.module';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppComponent } from './app.component';
import { DescriptionComponent } from './components/description/description.component';
import { LayoutComponent } from './components/layout/layout.component';

import { PreviewPageComponent } from '../pages/preview/preview-page.component';
import { RegPageComponent } from '../pages/registration/reg-page.component';
import { NotFoundPageComponent } from '../pages/not-found-page/not-found-page.component';
import { LoginPageComponent } from '../pages/login/login-admin-page.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PreviewPageComponent,
    RegPageComponent,
    DescriptionComponent,
    NotFoundPageComponent,
    LoginPageComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaskDirective,
    NgxMaskPipe,
    HttpClientModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideNgxMask(),
    provideMomentDateAdapter(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
