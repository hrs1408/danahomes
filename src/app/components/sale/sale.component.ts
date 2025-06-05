import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.scss'
})
export class SaleComponent implements OnInit {
  saleProducts: Product[] = [];
  displayedProducts: Product[] = [];
  loading = false;
  error: string | null = null;
  readonly MAX_PRODUCTS = 6;
  currentPage = 0;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSaleProducts();
  }

  loadSaleProducts() {
    this.loading = true;
    this.error = null;

    this.productService.search({ product_type: 'sale' }).subscribe({
      next: (response) => {
        this.saleProducts = response.data.filter(product => product.category_id !== 7);
        this.updateDisplayedProducts();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải danh sách bất động sản bán. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  updateDisplayedProducts() {
    const start = this.currentPage * 3;
    this.displayedProducts = this.saleProducts.slice(start, start + 3);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedProducts();
    }
  }

  nextPage() {
    if ((this.currentPage + 1) * 3 < this.saleProducts.length) {
      this.currentPage++;
      this.updateDisplayedProducts();
    }
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
  }  viewProductDetail(productSlug: string) {
    this.router.navigate(['/chi-tiet', productSlug]);
  }

  getPrice(product: Product): number {
    return product?.product_detail?.price || 0;
  }

  getPriceTo(product: Product): number {
    return product?.product_detail?.price_to || 0;
  }
}
