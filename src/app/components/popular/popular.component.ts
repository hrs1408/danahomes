import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { Router } from '@angular/router';
interface ProjectStatusInfo {
  text: string;
  color: string;
  backgroundColor: string;
}

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrl: './popular.component.scss'
})
export class PopularComponent implements OnInit {
  popularProducts: Product[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}
  ngOnInit() {
    this.loadHotProducts();
  }

  private loadHotProducts() {
    this.loading = true;
    this.error = null;

    this.productService.getHotProducts().subscribe({
      next: (response) => {
        this.popularProducts = response.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Không thể tải dự án nổi bật. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }
  getMainImage(product: Product): string {
    if (!product.images || product.images.length === 0) {
      return '1CWmWfmLASqMynRs5_yYlYAv42nvy9bJ3'; // Thay thế bằng ID ảnh mặc định của bạn
    }
    return product.images[0].drive_id;
  }

  getGridClass(): string {
    const count = this.popularProducts.length;
    if (count <= 6) {
      return `grid-${count}`;
    }
    return 'grid-default';
  }

  formatPrice(price: number): string {
    const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedPrice + ' VNĐ';  }  viewDetails(productSlug: string) {
    this.router.navigate(['/chi-tiet', productSlug]);
  }

  getProjectStatusInfo(slug: string): ProjectStatusInfo {
    switch (slug) {
      case 'selling':
        return {
          text: 'Đang bán',
          color: '#fff',
          backgroundColor: '#2ecc71'
        };
      case 'coming_soon':
        return {
          text: 'Sắp mở bán',
          color: '#fff',
          backgroundColor: '#f1c40f'
        };
      case 'delivered':
        return {
          text: 'Đã bàn giao',
          color: '#fff',
          backgroundColor: '#3498db'
        };
      case 'completed':
        return {
          text: 'Đã hoàn thành',
          color: '#fff',
          backgroundColor: '#95a5a6'
        };
      default:
        return {
          text: '',
          color: '#666',
          backgroundColor: '#f8f9fa'
        };
    }
  }

  getProjectTypeInfo(slug: string): { text: string; color: string; backgroundColor?: string } {
    switch (slug) {
      case 'luxury_apartment':
        return {
          text: 'Căn hộ cao cấp',
          color: '#2c3e50',
          backgroundColor: '#ecf0f1'
        };
      case 'urban_area':
        return {
          text: 'Khu đô thị',
          color: '#27ae60'
        };
      case 'resort':
        return {
          text: 'Khu nghỉ dưỡng',
          color: '#3498db'
        };
      case 'complex':
        return {
          text: 'Khu phức hợp',
          color: '#8e44ad'
        };
      default:
        return {
          text: '',
          color: '#666'
        };
    }
  }
}
