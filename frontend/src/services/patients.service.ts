import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IDate, IPatients } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  constructor(private http: HttpClient) {}

  postTimeByDate(body: IDate): Observable<{
    body: string[];
    errorMessage: string | null;
    success: boolean;
    errorCode: number;
  }> {
    return this.http.post<{
      body: string[];
      errorMessage: string | null;
      success: boolean;
      errorCode: number;
    }>('http://localhost:3000/patients/time', body);
  }

  postPatients(body: IPatients): Observable<{
    body: IPatients;
    errorMessage: string | null;
    success: boolean;
    errorCode: number;
  }> {
    return this.http.post<{
      body: IPatients;
      errorMessage: string | null;
      success: boolean;
      errorCode: number;
    }>('http://localhost:3000/patients', body);
  }
}
