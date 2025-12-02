// src/app/core/api/dashboard-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IbgeDataRecord } from '../models/ibge-data.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {
  // Flask está em 5000, Angular em 4200
  private readonly baseUrl = 'http://localhost:5000/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<IbgeDataRecord[]> {
    return this.http.get<IbgeDataRecord[]>(this.baseUrl);
  }
}
