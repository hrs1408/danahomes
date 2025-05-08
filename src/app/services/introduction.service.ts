import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface IntroductionImage {
  id: number;
  file_name: string;
  drive_id: string;
  file_type: string;
  parent_id: number;
  product_detail_id: number | null;
}

export interface IntroductionData {
  id: number;
  title: string;
  content: string;
  active: string;
  image_id: number;
  image: IntroductionImage;
}

export interface IntroductionResponse {
  data: IntroductionData;
  meta: {
    error: boolean;
    message: string | null;
  };
  status_code: number;
}

@Injectable({
  providedIn: 'root'
})
export class IntroductionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getIntroduction(): Observable<IntroductionResponse> {
    return this.http.get<IntroductionResponse>(`${this.apiUrl}/introduction/get`);
  }
}
