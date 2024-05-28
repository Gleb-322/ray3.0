import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRangeDate } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class DisabledDatesService {
  constructor(private _http: HttpClient) {}

  postDisabledDates(body: IRangeDate[]): Observable<{
    body: string;
    errorMessage: string | null;
    success: boolean;
    errorCode: number;
  }> {
    return this._http.post<{
      body: string;
      errorMessage: string | null;
      success: boolean;
      errorCode: number;
    }>('http://localhost:3000/disabledDates', body);
  }

  getDisabledDates(): Observable<{
    body: IRangeDate[];
    errorMessage: string | null;
    success: boolean;
    errorCode: number;
  }> {
    return this._http.get<{
      body: IRangeDate[];
      errorMessage: string | null;
      success: boolean;
      errorCode: number;
    }>('http://localhost:3000/disabledDates');
  }

  postUnlockDisabledDates(body: IRangeDate[]): Observable<{
    body: string;
    errorMessage: string | null;
    success: boolean;
    errorCode: number;
  }> {
    return this._http.post<{
      body: string;
      errorMessage: string | null;
      success: boolean;
      errorCode: number;
    }>('http://localhost:3000/undisabledDates', body);
  }
}
