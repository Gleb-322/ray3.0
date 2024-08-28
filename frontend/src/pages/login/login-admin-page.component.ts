import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../services/admin.service';

import { MyErrorStateMatcher } from '../../app/material.module';
import { IAdmin } from '../../types/types';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'login-admin-page',
  templateUrl: './login-admin-page.component.html',
})
export class LoginPageComponent {
  hide = true;
  adminForm;
  errorMessage: string | null = null;
  errorMessageStatus = false;
  matcher = new MyErrorStateMatcher();

  constructor(private _adminService: AdminService, private router: Router) {
    this.adminForm = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required]),
    });
  }

  onFormSubmit() {
    const postObject = {
      login: this.adminForm.value?.login,
      password: this.adminForm.value?.password,
    };
    if (postObject) {
      this._adminService.postLoginAdmin(postObject).subscribe((result) => {
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
