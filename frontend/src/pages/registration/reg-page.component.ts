import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  DateFilterFn,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';

import { MyErrorStateMatcher } from '../../app/material.module';

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
import { PatientsService } from '../../services/patients.service';
import { IPatients } from '../../types/types';
import { MY_FORMATS } from '../../app/material.module';

const moment = _rollupMoment || _moment;

const lang = moment.locale('ru');

@Component({
  selector: 'app-form-page',
  templateUrl: './reg-page.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: lang },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RegPageComponent implements OnInit {
  patientForm: FormGroup;
  buttonText = 'записаться на прием';
  timeStatus = false;
  arrTimes: string[] = [];
  minDate: Moment = moment(new Date());
  matcher = new MyErrorStateMatcher();
  constructor(
    private _formBuilder: FormBuilder,
    private _dateAdapter: DateAdapter<Date>,
    private _patientsService: PatientsService,
    private _router: Router
  ) {
    this.patientForm = this._formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Zа-яА-Я\s]*$/),
      ]),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      date: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
      policy: new FormControl(false, Validators.requiredTrue),
    });
  }
  ngOnInit() {
    this._dateAdapter.setLocale('ru-RU');
  }

  sundayAndDisabledDatesFilter(date: Moment | null) {
    const arr = ['01-10-2024', '03-10-2024', '10-10-2024'];
    const time = date?.valueOf();

    const day = date ? date.isoWeekday() : new Date();
    return (
      day !== 7 && !arr.find((d) => moment(d, 'DD-MM-YYYY').valueOf() === time)
    );
  }

  onChangeDate(event: MatDatepickerInputEvent<Moment>) {
    const cisDateFormat = event.value?.format('DD-MM-YYYY');
    if (cisDateFormat) {
      const bodyObject = {
        date: cisDateFormat,
      };
      this._patientsService.postTimeByDate(bodyObject).subscribe((result) => {
        if (result.body.length > 0) {
          this.arrTimes = result.body;
          this.timeStatus = true;
        }
      });
    }
  }

  onFormSubmit() {
    if (this.patientForm.valid) {
      const bodyObject: IPatients = {
        name: this.patientForm.value?.name,
        phone: this.patientForm.value?.phone,
        email: this.patientForm.value?.email,
        date: this.patientForm.value?.date.format('DD-MM-YYYY'),
        time: this.patientForm.value?.time,
      };
      if (bodyObject) {
        this._patientsService.postPatients(bodyObject).subscribe((result) => {
          alert('suc add patient');
          console.log('respostpatient', result);
          this._router.navigate(['/preview']);
        });
      }
    }
  }
}
