import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDate, IPatients, IPhone } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  constructor(private http: HttpClient) {}

  postTimeByDate(body: IDate): Observable<{
    body: string[];
    errorMessage: string | null;
    errorCode: number;
  }> {
    return this.http.post<{
      body: string[];
      errorMessage: string | null;
      errorCode: number;
    }>('http://localhost:3000/patients/time', body);
  }

  postPatients(body: IPatients): Observable<{
    body: IPatients;
    errorMessage: string | null;
    errorCode: number;
  }> {
    return this.http.post<{
      body: IPatients;
      errorMessage: string | null;
      errorCode: number;
    }>('http://localhost:3000/patients', body);
  }

  postCheckPatient(body: IPhone): Observable<{
    body: IPatients | null;
    adminPhone: boolean;
    errorMessage: string | null;
    errorCode: number;
  }> {
    console.log(body);

    return this.http.post<{
      body: IPatients | null;
      adminPhone: boolean;
      errorMessage: string | null;
      errorCode: number;
    }>('http://localhost:3000/patients/check', body);
  }

  validatePhone(
    phone: string
  ): Observable<{ isValid: boolean; message: string | null }> {
    const objectBody = { phone };
    return this.http.post<{ isValid: boolean; message: string | null }>(
      'http://localhost:3000/patients/phone',
      objectBody
    );
  }
}
