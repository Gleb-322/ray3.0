import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from './admin.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const adminService = inject(AdminService);
  if (adminService.isLoggetIn()) {
    return true;
  }

  return router.navigate(['/login']);
};
