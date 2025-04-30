import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Province {
  code: number;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  code_name: string;
}

export interface District {
  code: number;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  code_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilterHomeService {
  private baseUrl = 'https://provinces.open-api.vn/api';

  constructor(private http: HttpClient) {}

  getProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(`${this.baseUrl}/p/`);
  }

  getDistrictsByProvinceCode(provinceCode: number): Observable<District[]> {
    return this.http.get<District[]>(`${this.baseUrl}/p/${provinceCode}?depth=2`);
  }
}
