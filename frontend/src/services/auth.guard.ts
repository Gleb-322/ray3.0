import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from './admin.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const adminService = inject(AdminService);
  console.log('login', adminService.loginStatus);
  if (adminService.loginStatus) {
    return true;
  }

  return router.navigate(['/login']);
};
