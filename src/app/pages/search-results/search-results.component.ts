import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, SearchParams } from '../../services/product.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  searchParams: SearchParams = {};
  totalResults = 0;

  // Phân trang
  currentPage = 1;
  pageSize = 12;
  totalPages = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Chỉ lấy các tham số có giá trị
      const searchParams: SearchParams = {};

      if (params['product_type']) {
        searchParams.product_type = params['product_type'];
      }

      if (params['name']) {
        searchParams.name = params['name'];
      }

      if (params['area']) {
        searchParams.area = params['area'];
      }

      if (params['category_id']) {
        const categoryId = Number(params['category_id']);
        if (!isNaN(categoryId)) {
          searchParams.category_id = categoryId;
        }
      }

      if (params['address']) {
        searchParams.address = params['address'];
      }

      if (params['price']) {
        const price = Number(params['price']);
        if (!isNaN(price)) {
          searchParams.price = price;
        }
      }

      if (params['price_to']) {
        const priceTo = Number(params['price_to']);
        if (!isNaN(priceTo)) {
          searchParams.price_to = priceTo;
        }
      }

      this.searchParams = searchParams;
      this.search();
    });
  }

  private search(): void {
    this.loading = true;
    this.error = null;

    // Chỉ gọi API nếu có ít nhất một tham số tìm kiếm
    if (Object.keys(this.searchParams).length === 0) {
      this.products = [];
      this.totalResults = 0;
      this.totalPages = 0;
      this.loading = false;
      return;
    }

    this.productService.search(this.searchParams).subscribe({
      next: (response) => {
        if (!response.meta.error) {
          const allProducts = response.data;
          this.totalResults = allProducts.length;
          this.totalPages = Math.ceil(this.totalResults / this.pageSize);

          // Phân trang
          const startIndex = (this.currentPage - 1) * this.pageSize;
          const endIndex = startIndex + this.pageSize;
          this.products = allProducts.slice(startIndex, endIndex);
        } else {
          this.error = response.meta.message;
          this.products = [];
          this.totalResults = 0;
          this.totalPages = 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tìm kiếm:', error);
        this.error = 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.';
        this.products = [];
        this.totalResults = 0;
        this.totalPages = 0;
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.search();
    window.scrollTo(0, 0);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  getMainImage(product: Product): string {
    return product.images && product.images.length > 0 ? product.images[0].drive_id : '';
  }

  viewProductDetail(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  calculatePricePerM2(price: number, area: number): string {
    if (!price || !area || area === 0) return '';
    const pricePerM2 = price / area;
    return this.formatPrice(pricePerM2);
  }
}
