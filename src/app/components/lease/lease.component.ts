import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lease',
  templateUrl: './lease.component.html',
  styleUrl: './lease.component.scss'
})
export class LeaseComponent implements OnInit {
  leaseProducts: Product[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLeaseProducts();
  }

  loadLeaseProducts() {
    this.loading = true;
    this.error = null;

    this.productService.search({ product_type: 'rent' }).subscribe({
      next: (response) => {
        this.leaseProducts = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải danh sách bất động sản cho thuê. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  formatPrice(price: number): string {
    if (price >= 1000000000) {
      return (price / 1000000000).toFixed(2) + ' tỷ';
    }
    return (price / 1000000).toFixed(0) + ' triệu';
  }

  getMainImage(product: Product): string {
    if (!product.images || product.images.length === 0) {
      return 'assets/images/default-property.jpg';
    }
    return product.images[0].drive_id;
  }

  viewProductDetail(productId: number) {
    this.router.navigate(['/detail', productId]);
  }
}
