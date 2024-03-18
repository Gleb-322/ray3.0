import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAdmin } from '../types/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  postLoginAdmin(
    body: IAdmin
  ): Observable<{
    body: { admin: IAdmin; token: string };
    success: boolean;
    errorCode: number;
  }> {
    return this.http.post<{
      body: { admin: IAdmin; token: string };
      success: boolean;
      errorCode: number;
    }>('http://localhost:3000/admin/login', body);
  }
}
