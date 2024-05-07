import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAdmin, IPatients } from '../types/types';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  loginStatus = true;
  constructor(private _http: HttpClient) {}

  //login admin
  postLoginAdmin(body: IAdmin): Observable<{
    body: any;
    token: string;
    errorMessage: null | string;
    success: boolean;
    errorCode: number;
  }> {
    return this._http
      .post<{
        body: any;
        token: string;
        errorMessage: null | string;
        success: boolean;
        errorCode: number;
      }>('http://localhost:3000/admin/login', body)
      .pipe(tap(() => (this.loginStatus = true)));
  }

  // logout admin
  logOutAdmin(): void {
    this.loginStatus = false;
  }

  // get all patients
  getAllPatients(
    page: number,
    limit: number,
    keyword: string = ''
  ): Observable<{
    body: IPatients[];
    count: number | null;
    errorMessage: string | null;
    success: boolean;
    errorCode: number;
  }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    const requestOptions = { headers };

    return this._http.get<{
      body: IPatients[];
      count: number | null;
      errorMessage: string | null;
      success: boolean;
      errorCode: number;
    }>(
      `http://localhost:3000/admin/patients?page=${page}&limit=${limit}&keyword=${keyword}`,
      requestOptions
    );
  }

  //update patient
  updatePatients(body: IPatients): Observable<{
    body: IPatients;
    errorMessage: string | null;
    success: boolean;
    errorCode: number;
  }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    const requestOptions = { headers };

    return this._http.patch<{
      body: IPatients;
      errorMessage: string | null;
      success: boolean;
      errorCode: number;
    }>('http://localhost:3000/admin/patients', body, requestOptions);
  }

  // delete patient

  deletePatient(_id: string): Observable<{
    body: IPatients;
    errorMessage: string | null;
    success: boolean;
    errorCode: number;
  }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    const requestOptions = { headers };

    return this._http.delete<{
      body: IPatients;
      errorMessage: string | null;
      success: boolean;
      errorCode: number;
    }>(`http://localhost:3000/admin/patients/${_id}`, requestOptions);
  }
}
