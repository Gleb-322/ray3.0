import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'login-admin-page',
  templateUrl: './login-admin-page.component.html',
})
export class LoginPageComponent {
  hide = true;
  buttonText = 'войти';

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService
  ) {}

  adminForm = this.formBuilder.group({
    login: new FormControl(''),
    password: new FormControl(''),
  });

  onFormSubmit() {
    console.log(this.adminForm.value);
    const postObject = {
      login: this.adminForm.value?.login,
      password: this.adminForm.value?.password,
    };
    if (postObject) {
      this.adminService.postLoginAdmin(postObject).subscribe((result) => {
        if (result.success === true) {
          console.log(result.body);
        }
        console.log(result);
      });
    }
  }
}
