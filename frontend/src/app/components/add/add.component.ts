import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

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

const moment = _rollupMoment || _moment;

const lang = moment.locale('ru');

@Component({
  selector: 'app-add-edit',
  templateUrl: './add.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: lang },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddComponent {
  addForm: FormGroup;
  buttonText = 'сделать запись';
  buttonCancelText = 'назад';
  timeStatus = false;
  arrTimes: string[] = [];

  minDate: Moment = moment(new Date());
  matcher = new MyErrorStateMatcher();
  constructor(
    private _formBuilder: FormBuilder,
    private _dateAdapter: DateAdapter<Date>,
    private _patientsService: PatientsService,
    private _dialogRef: MatDialogRef<AddComponent>
  ) {
    this.addForm = this._formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Zа-яА-Я\s]*$/),
      ]),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      date: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
    });
  }
  ngOnInit() {
    this._dateAdapter.setLocale('ru-RU');
  }

  weekendsDatesFilter(date: Moment | null) {
    const day = date ? date.isoWeekday() : new Date();
    return day !== 7;
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
    if (this.addForm.valid) {
      const bodyObject: IPatients = {
        name: this.addForm.value?.name,
        phone: this.addForm.value?.phone,
        email: this.addForm.value?.email,
        date: this.addForm.value?.date.format('DD-MM-YYYY'),
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
