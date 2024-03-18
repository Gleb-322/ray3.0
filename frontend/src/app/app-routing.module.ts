import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewPageComponent } from '../pages/preview/preview-page.component';
import { RegPageComponent } from '../pages/registration/reg-page.component';
import { NotFoundPageComponent } from '../pages/not-found-page/not-found-page.component';
import { LoginPageComponent } from '../pages/login/login-admin-page.component';
import { LayoutComponent } from './components/layout/layout.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', redirectTo: 'preview', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'preview', component: PreviewPageComponent },
      { path: 'registration', component: RegPageComponent },
    ],
  },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
