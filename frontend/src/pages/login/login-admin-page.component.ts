import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

import { MyErrorStateMatcher } from '../../app/material.module';
import { IAdmin } from '../../types/types';
import { Router } from '@angular/router';

@Component({
  selector: 'login-admin-page',
  templateUrl: './login-admin-page.component.html',
})
export class LoginPageComponent {
  hide = true;
  buttonText = 'войти';
  errorMessage = '';
  errorMessageStatus = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {}

  adminForm = this.formBuilder.group({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  onFormSubmit() {
    const postObject = {
      login: this.adminForm.value?.login,
      password: this.adminForm.value?.password,
    };
    if (postObject) {
      this.adminService.postLoginAdmin(postObject).subscribe((result) => {
        if (result.errorMessage) {
          this.errorMessage = result.errorMessage;
          this.errorMessageStatus = true;
        } else {
          const token = result.token;
          console.log('token', token);
          console.log('admin', result.body);
          localStorage.setItem('token', token);
          localStorage.setItem('loggetIn', 'true');
          this.router.navigate(['/admin']);
        }
      });
    }
  }
}
