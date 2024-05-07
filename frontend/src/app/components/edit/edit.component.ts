import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

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

const moment = _rollupMoment || _moment;

const lang = moment.locale('ru');

@Component({
  selector: 'app-add-edit',
  templateUrl: './edit.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: lang },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EditComponent {
  editForm: FormGroup;
  buttonText = 'изменить запись';
  buttonCancelText = 'отмена';
  timeStatus = false;
  editStatus = false;
  arrEditTime: string[] = [];
  cisDateFormat: string | undefined = '';
  minDate: Moment = moment(new Date());
  matcher = new MyErrorStateMatcher();
  constructor(
    private _formBuilder: FormBuilder,
    private _dateAdapter: DateAdapter<Date>,
    private _patientsService: PatientsService,
    private _adminService: AdminService,
    private _dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: IPatients
  ) {
    this.editForm = this._formBuilder.group({
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

    console.log(this.editData);

    if (this.editData) {
      this.editForm.controls['name'].setValue(this.editData.name);
      this.editForm.controls['phone'].setValue(this.editData.phone);
      this.editForm.controls['email'].setValue(this.editData.email);
      this.editForm.controls['date'].setValue(
        moment(this.editData.date, 'DD-MM-YYYY')
      );
      this.editForm.controls['time'].setValue(this.editData.time);

      if (this.editData.date) {
        const bodyObject = {
          date: this.editData.date,
        };
        this._patientsService.postTimeByDate(bodyObject).subscribe((result) => {
          if (result.body.length > 0) {
            this.arrEditTime = result.body;
            this.arrEditTime.push(this.editData.time!);
            this.arrEditTime.sort();
            this.timeStatus = true;
          }
        });
      }
    }
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
        date: this.editForm.value?.date.format('DD-MM-YYYY'),
        time: this.editForm.value?.time,
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
