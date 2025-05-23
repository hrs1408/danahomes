import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  };
  status_code: number;
}

@Injectable({
  providedIn: 'root'
})
export class InformationService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInformation(): Observable<InformationResponse> {
    return this.http.get<InformationResponse>(`${this.API_URL}/information/get`);
  }
}
