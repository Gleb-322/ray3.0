import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { IPatients, IRangeDate } from '../../types/types';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../../app/components/add/add.component';
import { EditComponent } from '../../app/components/edit/edit.component';
import { DisabledDatesService } from '../../services/disabled-dates.service';
import { Moment } from 'moment';
import { ToastrService } from 'ngx-toastr';

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
import {
  MatDateRangePicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { DialogComponent } from '../../app/components/dialog/dialog.component';

const moment = _rollupMoment || _moment;

const lang = moment.locale('ru');

@Component({
  selector: 'app-patients-page',
  templateUrl: './patients-page.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: lang },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PatientsPageComponent implements AfterViewInit, OnInit {
  arrayDisabledDates: string[] = [];
  arrayUndisabledDates: string[] = [];
  patients: IPatients[] = [];
  patientsLength: number | null = 0;
  minDate: Moment = moment(new Date());
  inputValue = '';
  limit: number = 12;
  page: number = 0;
  start: Moment | undefined;
  end: Moment | undefined;
  arrayOfObjectRangeDates: IRangeDate[] = [];
  unlockButtonStatus = false;
  postStatus = false;

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

  @ViewChild('dateRangePicker', { static: false }) dateRangePicker: any;

  constructor(
    private _adminService: AdminService,
    private _disabledDateService: DisabledDatesService,
    private _dialog: MatDialog,
    private _dateAdapter: DateAdapter<Date>,
    private _toastr: ToastrService
  ) {
    this.sundayAndDisabledDatesFilter =
      this.sundayAndDisabledDatesFilter.bind(this);
  }
  ngOnInit(): void {
    this._dateAdapter.setLocale('ru-RU');
    this.getDisabledDates();
    this.getPatientsList(this.page, this.limit, this.inputValue);
  }
  ngAfterViewInit(): void {
    this.page = this.paginator.pageIndex;
    this.limit = this.paginator.pageSize;
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

  // get disabled dates from api
  getDisabledDates() {
    this._disabledDateService.getDisabledDates().subscribe((result) => {
      if (result.errorCode === 0) {
        if (result.body.length > 0) {
          this.arrayDisabledDates = result.body.map((d) => d.disabledDate);
          this.arrayUndisabledDates = result.body
            .filter((d) => d.full !== true)
            .map((d) => d.disabledDate);
        } else {
          this.arrayDisabledDates = [];
          this.arrayUndisabledDates = [];
        }
      } else {
        console.log('error get dis dates', result.errorMessage);
      }
      console.log('this.arrayDisabledDates', this.arrayDisabledDates);
    });
  }

  //create new patient
  openAddForm() {
    const dialogRef = this._dialog.open(AddComponent);
    dialogRef.afterClosed().subscribe((close) => {
      if (close) {
        this.getDisabledDates();
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
      if (close) {
        this.getDisabledDates();
        this.getPatientsList(this.page, this.limit, this.inputValue);
      }
    });
  }

  //delete selected patient
  deletePatient(_id: string): void {
    let dialogRef = this._dialog.open(DialogComponent, {
      data: {
        title: 'Удаление записи',
        body: 'Действительно хотите удалить выбранную запись?',
      },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this._adminService.deletePatient(_id).subscribe((result) => {
          console.log('delete', result);
          this.getDisabledDates();
          this.getPatientsList(this.page, this.limit, this.inputValue);
        });
      }
    });
  }

  // get current page in paginator
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

  // filter range date picker by Sunday and disabled dates
  sundayAndDisabledDatesFilter(date: Moment | null) {
    const day = date?.isoWeekday();
    const input = moment(date).format('DD-MM-YYYY');
    if (this.unlockButtonStatus) {
      return day !== 7 && this.arrayUndisabledDates.includes(input);
    }

    return day !== 7 && !this.arrayDisabledDates.includes(input);
  }

  startCahnge(event: MatDatepickerInputEvent<Moment | undefined>) {
    this.start = moment(event.value, 'DD-MM-YYYY');
  }

  endCahnge(event: MatDatepickerInputEvent<Moment | undefined>) {
    this.end = moment(event.value, 'DD-MM-YYYY');
    this.dateRangeChange();
  }

  // change range disabled dates
  dateRangeChange() {
    if (this.start && this.end) {
      let currentDate = this.start.clone();
      while (currentDate <= this.end) {
        this.arrayOfObjectRangeDates.push({
          disabledDate: currentDate.format('DD-MM-YYYY'),
        });
        currentDate = currentDate.clone().add(1, 'days');
      }
    }

    console.log('change', this.arrayOfObjectRangeDates);
    if (
      this.arrayOfObjectRangeDates &&
      this.arrayOfObjectRangeDates.length > 0
    ) {
      let dialogRef = this._dialog.open(DialogComponent, {
        data: {
          title: this.unlockButtonStatus
            ? 'Разблокировка дат'
            : 'Блокировка дат',
          body: this.unlockButtonStatus
            ? 'Разблокировать выбранные(ую) даты(у)?'
            : 'Заблокировать выбранные(ую) даты(у)?',
        },
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.postStatus = true;
          this.dateRangeSubmit();
        } else {
          this.start = undefined;
          this.end = undefined;
          this.arrayOfObjectRangeDates = [];
        }
      });
    } else {
      this.postStatus = false;
    }
  }

  // post range disabled dates
  dateRangeSubmit() {
    if (this.postStatus) {
      if (this.unlockButtonStatus) {
        console.log(
          'this.arrayOfObjectRangeDates',
          this.arrayOfObjectRangeDates
        );
        this._disabledDateService
          .postUnlockDisabledDates(this.arrayOfObjectRangeDates)
          .subscribe((result) => {
            console.log('post undis suc', result);
            if (result.body) {
              this.start = undefined;
              this.end = undefined;
              this.arrayOfObjectRangeDates = [];
              this.getDisabledDates();
              this.unlockButtonStatus = false;
              this.postStatus = false;
            }
          });
      } else {
        this._disabledDateService
          .postDisabledDates(this.arrayOfObjectRangeDates)
          .subscribe((result) => {
            console.log('post suc', result);
            if (result.body) {
              this.start = undefined;
              this.end = undefined;
              this.arrayOfObjectRangeDates = [];
              this.getDisabledDates();
              this.postStatus = false;
            }
          });
      }
    }
  }

  // open range picker and unlock disabled dates
  openDatePicker(picker: MatDateRangePicker<Moment>) {
    this.unlockButtonStatus = !this.unlockButtonStatus;
    picker.open();
  }

  // lock undisabled dates and clean inputs
  cleanDatePicker() {
    this.unlockButtonStatus = false;
    this.start = undefined;
    this.end = undefined;
    this.arrayOfObjectRangeDates = [];
  }

  showSuccess() {
    this._toastr.success('Hello world!', 'Toastr fun!');
  }
}
