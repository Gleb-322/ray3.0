import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDate, IPatients } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  constructor(private http: HttpClient) {}

  postTimeByDate(body: IDate): Observable<IDate[]> {
    return this.http.post<IDate[]>('http://localhost:3000/patients/time', body);
  }

  postPatients(body: IPatients): Observable<IPatients> {
    return this.http.post<IPatients>('localhost:3000/patients', body);
  }
}
