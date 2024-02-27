import { NgModule } from '@angular/core';
import { PreviewComponent } from './preview.component';
import { DescriptionComponent } from '../../components/description/description.component';
import { RegistrationFormModule } from '../../components/registration-form/registration-form.module';

@NgModule({
  declarations: [PreviewComponent, DescriptionComponent],
  imports: [RegistrationFormModule],
  exports: [PreviewComponent],
})
export class PreviewModule {}
