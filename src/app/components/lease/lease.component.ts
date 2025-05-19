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
  readonly MAX_PRODUCTS = 6;

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
        this.leaseProducts = response.data.slice(0, this.MAX_PRODUCTS);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải danh sách bất động sản cho thuê. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  formatPrice(price: number): string {
    const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedPrice + ' VNĐ';
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
