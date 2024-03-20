import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { IPatients } from '../../types/types';

@Component({
  selector: 'app-patients-page',
  templateUrl: './patients-page.component.html',
  styleUrl: './patients-page.component.css',
})
export class PatientsPageComponent implements OnInit {
  patients: IPatients[] = [];
  displayedColumns: string[] = [
    'index',
    'name',
    'phone',
    'email',
    'date',
    'time',
  ];
  constructor(public adminService: AdminService) {}
  ngOnInit(): void {
    this.adminService.getAllPatients().subscribe((result) => {
      if (result.errorMessage) {
        console.log(result.errorMessage);
      }

      this.patients = result.body;
      console.log(this.patients);
      console.log('token', localStorage.getItem('token'));
    });
  }
}
