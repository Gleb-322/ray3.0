import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAdmin, IPatients } from '../types/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  postLoginAdmin(body: IAdmin): Observable<{
    body: any;
    token: string;
    errorMessage: null | string;
    success: boolean;
    errorCode: number;
  }> {
    return this.http.post<{
      body: any;
      token: string;
      errorMessage: null | string;
      success: boolean;
      errorCode: number;
    }>('http://localhost:3000/admin/login', body);
  }

  isLoggetIn() {
    return !!localStorage.getItem('loggetIn');
  }

  getAllPatients(): Observable<{
    body: IPatients[];
    errorMessage: string | null;
    success: boolean;
    errorCode: number;
  }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    const requestOptions = { headers };

    return this.http.get<{
      body: IPatients[];
      errorMessage: string | null;
      success: boolean;
      errorCode: number;
    }>('http://localhost:3000/admin/patients', requestOptions);
  }
}
