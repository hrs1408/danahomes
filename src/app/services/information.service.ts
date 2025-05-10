import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import e from 'express';
import { environment } from '../../environments/environment';

export interface CompanyInformation {
  id: number;
  address: string;
  hotline: string;
  email: string;
  facebook: string;
  twitter: string;
  google: string;
  zalo: string;
}

export interface InformationResponse {
  data: CompanyInformation;
  meta: {
    error: boolean;
    message: string;
    status_code: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class InformationService {
  private apiUrl = environment.apiUrl + '/information';

  constructor(private http: HttpClient) { }

  getInformation(): Observable<InformationResponse> {
    return this.http.get<InformationResponse>(`${this.apiUrl}/get`);
  }
}
