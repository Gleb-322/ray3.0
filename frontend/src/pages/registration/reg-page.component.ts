import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
import { IDate, IPatients } from '../../types/types';

const moment = _rollupMoment || _moment;

const lang = moment.locale('ru');

const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-form-page',
  templateUrl: './reg-page.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: lang },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RegPageComponent implements OnInit {
  buttonText = 'записаться на прием';
  timeStatus = false;
  arrTimes: IDate[] = [];
  cisDateFormat: string | undefined = '';
  minDate = new Date();
  matcher = new MyErrorStateMatcher();
  constructor(
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private patientsService: PatientsService,
    private router: Router
  ) {}
  ngOnInit() {
    this.dateAdapter.setLocale('ru-RU');
  }

  patientForm = this.formBuilder.group({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Zа-яА-Я\s]*$/),
    ]),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
  });

  onChangeDate(event: MatDatepickerInputEvent<Moment>) {
    const date = event.value?.format().split('T')[0];
    this.cisDateFormat = date?.split('-').reverse().join('-');
    if (this.cisDateFormat) {
      const bodyObject = {
        date: this.cisDateFormat,
      };
      this.patientsService.postTimeByDate(bodyObject).subscribe((result) => {
        if (result.body.length > 0) {
          this.arrTimes = result.body;
          this.timeStatus = true;
        }
      });
    }
  }

  onFormSubmit() {
    const bodyObject = {
      name: this.patientForm.value?.name,
      phone: this.patientForm.value?.phone,
      email: this.patientForm.value?.email,
      date: this.cisDateFormat,
      time: this.patientForm.value?.time,
    };
    if (bodyObject) {
      this.patientsService.postPatients(bodyObject).subscribe((result) => {
        console.log(result.body);
        this.router.navigate(['/preview']);
      });
    }
  }
}
