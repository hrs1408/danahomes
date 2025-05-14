import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  slug: string;
  name: string;
  icon: string;
}

export interface CategoryResponse {
  data: Category[];
  meta: {
    error: boolean;
    message: string;
  };
  status_code: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.API_URL}/category/get-all`);
  }
}
