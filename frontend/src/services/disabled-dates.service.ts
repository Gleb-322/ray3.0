import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRangeDate } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class DisabledDatesService {
  constructor(private _http: HttpClient) {}

  getDisabledDates(): Observable<{
    body: IRangeDate[] | null;
    errorMessage: string | null;
    errorCode: number;
  }> {
    return this._http.get<{
      body: IRangeDate[] | null;
      errorMessage: string | null;
      errorCode: number;
    }>('http://localhost:3000/disabledDates');
  }

  postDisabledDates(body: IRangeDate[]): Observable<{
    body: string | null;
    errorMessage: string | null;
    errorCode: number;
  }> {
    return this._http.post<{
      body: string | null;
      errorMessage: string | null;
      errorCode: number;
    }>('http://localhost:3000/disabledDates', body);
  }

  postUnlockDisabledDates(body: IRangeDate[]): Observable<{
    body: string | null;
    errorMessage: string | null;
    errorCode: number;
  }> {
    return this._http.post<{
      body: string | null;
      errorMessage: string | null;
      errorCode: number;
    }>('http://localhost:3000/undisabledDates', body);
  }
}
