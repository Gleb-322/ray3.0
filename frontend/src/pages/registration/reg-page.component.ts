import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import 'moment/locale/ru';

const moment = _rollupMoment || _moment;

let lang = moment.locale('ru');

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

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-form-page',
  templateUrl: './reg-page.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: lang },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RegPageComponent implements OnInit {
  buttonDisabled = false;
  buttonText = 'записаться на прием';
  arrTimes: string[] = [
    '09-00',
    '09-30',
    '10-00',
    '10-30',
    '11-00',
    '11-30',
    '12-00',
    '12-30',
    '13-00',
    '13-30',
    '14-00',
    '14-30',
    '15-00',
    '15-30',
    '16-00',
    '16-30',
  ];

  minDate = new Date();
  maskPhone = /\+373\d\d\d-\d\d-\d\d\d/i;

  constructor(
    private builder: FormBuilder,
    private dateAdapter: DateAdapter<Date>
  ) {}
  ngOnInit() {
    this.dateAdapter.setLocale('ru-RU');
  }

  patientForm = this.builder.group({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    date: new FormControl(this.minDate, Validators.required),
    time: new FormControl('', Validators.required),
  });

  matcher = new MyErrorStateMatcher();

  onFormSubmit() {
    console.log(this.patientForm.value);
    // this.patientForm.reset();
  }
}
