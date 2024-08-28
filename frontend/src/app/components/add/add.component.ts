import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

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
import { DisabledDatesService } from '../../../services/disabled-dates.service';

const moment = _rollupMoment || _moment;

const lang = moment.locale('ru');

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: lang },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddComponent implements OnInit {
  addForm;
  timeStatus = false;
  arrTimes: string[] = [];
  arrayDisabledDates: string[] = [];
  minDate: Moment = moment(new Date());
  matcher = new MyErrorStateMatcher();
  constructor(
    private _dateAdapter: DateAdapter<Date>,
    private _patientsService: PatientsService,
    private _disabledDateService: DisabledDatesService,
    private _dialogRef: MatDialogRef<AddComponent>
  ) {
    this.sundayAndDisabledDatesFilter =
      this.sundayAndDisabledDatesFilter.bind(this);

    this.addForm = new FormGroup({
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
      date: new FormControl<Moment>(moment(''), Validators.required),
      time: new FormControl('', Validators.required),
    });
  }
  ngOnInit() {
    // set calendar for CIS format
    this._dateAdapter.setLocale('ru-RU');
    // get disanled dates from api
    this.getDisabledDates();
  }

  // get disabled dates from api
  getDisabledDates() {
    this._disabledDateService.getDisabledDates().subscribe((result) => {
      if (result.body && result.body.length > 0) {
        this.arrayDisabledDates = result.body.map((d) => d.disabledDate);
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
        console.log('AddOnChange', result.body);
        if (result.body) {
          this.arrTimes = result.body;
          this.timeStatus = true;
        }
      });
    }
  }

  onFormSubmit() {
    if (this.addForm.valid) {
      const bodyObject: IPatients = {
        name: this.addForm.value?.name,
        phone: this.addForm.value?.phone,
        email: this.addForm.value?.email,
        date: this.addForm.value?.date?.format('DD-MM-YYYY'),
        time: this.addForm.value?.time,
      };
      if (bodyObject) {
        this._patientsService.postPatients(bodyObject).subscribe((result) => {
          alert('suc add appointment');
          console.log('respostpatientfromADMIN', result);
          this._dialogRef.close(true);
        });
      }
    }
  }

  onCancel() {
    this._dialogRef.close();
  }
}
