import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
  styleUrl: './admin-dashboard-page.component.css',
})
export class AdminDashboardPageComponent {
  constructor(public adminService: AdminService, private router: Router) {}

  logoutAdmin(): void {
    console.log('logout');
    this.adminService.logOutAdmin();
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
