import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { MyErrorStateMatcher } from '../../material.module';

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
import { PatientsService } from '../../../services/patients.service';
import { IPatients } from '../../../types/types';
import { MY_FORMATS } from '../../material.module';
import { AdminService } from '../../../services/admin.service';
import { DisabledDatesService } from '../../../services/disabled-dates.service';

const moment = _rollupMoment || _moment;

const lang = moment.locale('ru');

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: lang },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EditComponent implements OnInit {
  editForm;
  buttonText = 'изменить запись';
  buttonCancelText = 'отмена';
  timeStatus = false;
  editStatus = false;
  arrEditTime: string[] = [];
  cisDateFormat: string | undefined = '';
  minDate: Moment = moment(new Date());
  matcher = new MyErrorStateMatcher();
  arrayDisabledDates: string[] = [];
  constructor(
    private _dateAdapter: DateAdapter<Date>,
    private _patientsService: PatientsService,
    private _adminService: AdminService,
    private _disabledDateService: DisabledDatesService,
    private _dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: IPatients
  ) {
    this.sundayAndDisabledDatesFilter =
      this.sundayAndDisabledDatesFilter.bind(this);

    this.editForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Zа-яА-Я\s]*$/),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(16),
      ]),
      email: new FormControl(
        '',
        Validators.pattern(
          /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/
        )
      ),
      date: new FormControl<Moment>(moment(), Validators.required),
      time: new FormControl('', Validators.required),
    });
  }
  ngOnInit() {
    this._dateAdapter.setLocale('ru-RU');

    this.getDisabledDates();

    if (this.editData) {
      this.editForm.controls['name'].setValue(this.editData.name!);
      this.editForm.controls['phone'].setValue(this.editData.phone!);
      this.editForm.controls['email'].setValue(this.editData.email!);
      this.editForm.controls['date'].setValue(
        moment(this.editData.date, 'DD-MM-YYYY')
      );
      this.editForm.controls['time'].setValue(this.editData.time!);

      if (this.editData.date) {
        const bodyObject = {
          date: this.editData.date,
        };
        this._patientsService.postTimeByDate(bodyObject).subscribe((result) => {
          console.log('on init', result);

          if (result.body) {
            this.arrEditTime = result.body;
            this.arrEditTime.push(this.editData.time!);
            this.arrEditTime.sort();
            this.timeStatus = true;
          }
        });
      }
    }
  }

  // get disabled dates from api
  getDisabledDates() {
    this._disabledDateService.getDisabledDates().subscribe((result) => {
      if (result.body && result.body.length > 0) {
        this.arrayDisabledDates = result.body.map((d) => d.disabledDate);
        if (this.arrayDisabledDates.includes(this.editData.date!)) {
          this.arrayDisabledDates = this.arrayDisabledDates.filter(
            (d) => d !== this.editData.date!
          );
        }
        console.log('getDisabledDates', this.arrayDisabledDates);
      } else {
        this.arrayDisabledDates = [];
      }
    });
  }

  sundayAndDisabledDatesFilter(date: Moment | null) {
    const day = date?.isoWeekday();
    const input = moment(date).format('DD-MM-YYYY');
    return day !== 7 && !this.arrayDisabledDates.includes(input);
  }

  onChangeDate(event: MatDatepickerInputEvent<Moment>) {
    const cisDateFormat = event.value?.format('DD-MM-YYYY');
    if (cisDateFormat) {
      const bodyObject = {
        date: cisDateFormat,
      };
      this._patientsService.postTimeByDate(bodyObject).subscribe((result) => {
        console.log('onChangeDateEdit', result);
        if (result.body) {
          if (bodyObject.date === this.editData.date) {
            this.arrEditTime = result.body;
            this.arrEditTime.push(this.editData.time!);
            this.arrEditTime.sort();
            this.timeStatus = true;
          } else {
            this.arrEditTime = result.body;
          }
        }
      });
    }
  }

  onFormSubmit() {
    if (this.editForm.valid) {
      const bodyObject: IPatients = {
        name: this.editForm.value?.name,
        phone: this.editForm.value?.phone,
        email: this.editForm.value?.email,
        previousEmail: this.editData.email!,
        date: this.editForm.value?.date?.format('DD-MM-YYYY'),
        previousDate: this.editData.date!,
        time: this.editForm.value?.time,
        previousTime: this.editData.time!,
        _id: this.editData._id,
      };
      if (bodyObject) {
        this._adminService.updatePatients(bodyObject).subscribe((result) => {
          alert('suc Update appointment');
          console.log('resUpdatePatientfromADMIN', result);
          this._dialogRef.close(true);
        });
      }
    }
  }

  onCancel() {
    this._dialogRef.close();
  }
}
