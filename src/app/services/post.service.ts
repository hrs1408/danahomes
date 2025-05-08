import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PostImage {
  id: number;
  file_name: string;
  drive_id: string;
  file_type: string;
  parent_id: number;
  product_detail_id: number | null;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  post_type: string;
  active: string;
  image_id: number;
  image: PostImage;
  created_at: string;
}

export interface PostResponse {
  data: Post[];
  meta: {
    error: boolean;
    message: string | null;
  };
  status_code: number;
}

export interface PostDetailResponse {
  data: Post;
  meta: {
    error: boolean;
    message: string | null;
  };
  status_code: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.apiUrl}/post/get-all`);
  }

  getPostById(id: number): Observable<PostDetailResponse> {
    return this.http.get<PostDetailResponse>(`${this.apiUrl}/post/get-by-id/${id}`);
  }
}
