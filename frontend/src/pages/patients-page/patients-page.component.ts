import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { IPatients } from '../../types/types';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../../app/components/add/add.component';
import { EditComponent } from '../../app/components/edit/edit.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Moment } from 'moment';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import 'moment/locale/ru';
import { MY_FORMATS } from '../../app/material.module';

const moment = _rollupMoment || _moment;

const lang = moment.locale('ru');

@Component({
  selector: 'app-patients-page',
  templateUrl: './patients-page.component.html',
  styleUrl: './patients-page.component.css',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: lang },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PatientsPageComponent implements AfterViewInit, OnInit {
  patients: IPatients[] = [];
  patientsLength: number | null = 0;
  minDate: Moment = moment(new Date());
  inputValue = '';

  limit!: number;
  page!: number;

  displayedColumns: string[] = [
    'created',
    'name',
    'phone',
    'email',
    'date',
    'time',
    'action',
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private _adminService: AdminService,
    private _dialog: MatDialog,
    private _dateAdapter: DateAdapter<Date>
  ) {}
  ngOnInit(): void {
    this._dateAdapter.setLocale('ru-RU');
  }
  ngAfterViewInit(): void {
    this.page = this.paginator.pageIndex;
    this.limit = this.paginator.pageSize;
    this.getPatientsList(this.page, this.limit, this.inputValue);
    this.paginator._intl.itemsPerPageLabel = 'пациентов на странице:';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      if (end > length) {
        return `${start} - ${length} из ${length}`;
      }
      return `${start} - ${end} из ${length}`;
    };
  }

  // get list of all patients
  getPatientsList(page: number, limit: number, keyword: string = '') {
    this._adminService
      .getAllPatients(page + 1, limit, keyword)
      .subscribe((result) => {
        console.log('get patient', result);

        this.patients = result.body;
        this.patientsLength = result.count;
      });
  }

  //create new patient
  openAddForm() {
    const dialogRef = this._dialog.open(AddComponent);
    dialogRef.afterClosed().subscribe((close) => {
      console.log('close dialogRef', close);
      if (close) {
        this.getPatientsList(this.page, this.limit, this.inputValue);
      }
    });
  }

  //update selected patient
  openEditForm(data: IPatients) {
    const dialogRef = this._dialog.open(EditComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe((close) => {
      console.log('close dialogRef', close);
      if (close) {
        this.getPatientsList(this.page, this.limit, this.inputValue);
      }
    });
  }

  //delete selected patient
  deletePatient(_id: string): void {
    this._adminService.deletePatient(_id).subscribe((result) => {
      console.log(result);
      this.getPatientsList(this.page, this.limit, this.inputValue);
    });
  }

  handlePageEvent(e: PageEvent) {
    this.page = e.pageIndex;
    this.getPatientsList(this.page, this.limit, this.inputValue);
  }

  // form submit
  onChangeFilter(e: Event) {
    const input = e.target as HTMLInputElement;
    this.inputValue = input.value;
    this.getPatientsList(this.page, this.limit, this.inputValue);
  }

  startDate: Date | undefined;
  endDate: Date | undefined;

  myFilter = (d: Date | null) => {};

  dateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    console.log(dateRangeStart.value);
    console.log(dateRangeEnd.value);
  }

  clearSelection() {
    // this.startDate = this.endDate = undefined;
  }
}
