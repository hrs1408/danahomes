import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProductImage {
  id: number;
  file_name: string;
  drive_id: string;
  file_type: string;
  parent_id: number;
  product_detail_id: number;
}

export interface ProductTag {
  id: number;
  slug: string;
  name: string;
  color: string;
}

export interface AddressDetail {
  id: number;
  address: string;
  province: string;
  district: string;
  ward: string;
  google_address_link: string;
}

export interface ProductDetail {
  id: number;
  price: number;
  price_to?: number;
  area: number;
  bedroom: number;
  bathroom: number;
  type_product: 'rent' | 'sale' | 'project';
  project_status?: 'available' | 'sold' | 'pending';
  project_type?: string;
  investor?: string;
  utilities: string;
  interiol: string;
  interior?: string;
  content?: string;
  type_of_investment?: string;
  eletric_price?: number;
  water_price?: number;
  internet_price?: number;
  legal_documents?: string;
  form_of_ownership?: string;
  management_and_operation_unit?: string;
  project_scale?: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  category_id: number;
  product_parent_id?: number;
  address_detail: AddressDetail;
  product_detail: ProductDetail;
  tag: ProductTag[];
  images: ProductImage[];
}

export interface ProductCategory {
  id: number;
  slug: string;
  name: string;
  icon: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    error: boolean;
    message: string;
  };
  status_code: number;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  productId?: number;
}

export interface SearchParams {
  product_type?: string;
  name?: string;
  area?: string;
  category_id?: number;
  address?: string;
  price?: number;
  price_to?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/get-all`);
  }
  getProductById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/product/get-by-id/${id}`);
  }

  getProductBySlug(slug: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/product/get-by-slug/${slug}`);
  }

  getProductsByCategory(categoryId: number): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/get-by-category/${categoryId}`);
  }

  getProductsByCategorySlug(categorySlug: string): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/get-by-category-slug/${categorySlug}`);
  }

  getAllCategories(): Observable<ApiResponse<ProductCategory[]>> {
    return this.http.get<ApiResponse<ProductCategory[]>>(`${this.apiUrl}/category/get-all`);
  }

  getRelatedProducts(productId: number, type: string): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products/related`, {
      params: {
        id: productId.toString(),
        type
      }
    });
  }

  submitContactForm(data: ContactFormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/contact`, data);
  }

  getProductByParent(parentId: number): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/get-by-parent/${parentId}`);
  }

  search(params: SearchParams): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/search`, {
      params: params as any
    });
  }

  getHotProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/get-hot-product`);
  }

  getProductsAddress(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/get-all-product-address`);
  }
}
