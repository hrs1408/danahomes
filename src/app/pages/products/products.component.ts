import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, ProductCategory } from '../../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  readonly PROJECT_CATEGORY_ID = 7;
  products: Product[] = [];
  categories: ProductCategory[] = [];
  loading = true;
  error: string | null = null;

  // Phân trang
  currentPage = 1;
  pageSize = 9;
  totalPages = 0;
  paginatedProducts: Product[] = [];

  // Lọc
  selectedCategory: number | null = null;
  isProjectCategory = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = Number(params['category']);
        this.isProjectCategory = this.selectedCategory === this.PROJECT_CATEGORY_ID;
        this.loadProductsByCategory(this.selectedCategory);
      } else {
        this.loadAllProducts();
      }
    });
  }

  private loadAllProducts(): void {
    this.loading = true;
    this.error = null;
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        if (!response.meta.error) {
          this.products = response.data;
          this.totalPages = Math.ceil(this.products.length / this.pageSize);
          this.updatePaginatedProducts();
        } else {
          this.error = response.meta.message;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải sản phẩm:', error);
        this.error = 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  private loadProductsByCategory(categoryId: number): void {
    this.loading = true;
    this.error = null;
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (response) => {
        console.log('Response from API:', response); // Thêm log để debug
        this.products = response.data;
        this.totalPages = Math.ceil(this.products.length / this.pageSize);
        this.updatePaginatedProducts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải sản phẩm theo danh mục:', error);
        this.error = 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  private loadCategories(): void {
    this.productService.getAllCategories().subscribe({
      next: (response) => {
        if (!response.meta.error) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Lỗi khi tải danh mục:', error);
      }
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  viewCategory(categoryId: number): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }

  viewAllProducts(): void {
    this.router.navigate(['/products']);
  }

  viewProductDetail(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedProducts();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getMainImage(product: Product): string {
    return product.images && product.images.length > 0 ? product.images[0].drive_id : '';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }
}
