import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, ProductCategory } from '../../services/product.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface ProjectTypeInfo {
  text: string;
  color: string;
  backgroundColor?: string;
}

interface ProjectStatusInfo {
  text: string;
  color: string;
  backgroundColor: string;
}

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
    private router: Router,
    private sanitizer: DomSanitizer
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

  isRentalProduct(product: Product): boolean {
    return product.product_detail.type_product === 'rent';
  }

  isSaleProduct(product: Product): boolean {
    return product.product_detail.type_product === 'sale';
  }

  isProjectProduct(product: Product): boolean {
    return product.product_detail.type_product === 'project' || this.selectedCategory === this.PROJECT_CATEGORY_ID;
  }

  truncateHTML(html: string, maxLength: number = 150): SafeHtml {
    if (!html) return '';

    // Tạo một div tạm thời để parse HTML
    const div = document.createElement('div');
    div.innerHTML = html;

    // Lấy text content
    let text = div.textContent || div.innerText || '';

    // Truncate text
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '...';
    }

    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getProjectTypeInfo(slug: string): ProjectTypeInfo {
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

  getIconClass(icon: string): string {
    if (!icon) return 'fas fa-home'; // default icon

    // Kiểm tra nếu là icon của Ant Design
    if (icon.endsWith('-ant')) {
      return `anticon anticon-${icon.replace('-ant', '')}`;
    }

    // Kiểm tra nếu là icon của Material
    if (icon.endsWith('-mat')) {
      return `material-icons`;
    }

    // Trường hợp mặc định là Font Awesome
    return icon;
  }

  getIconContent(icon: string): string | null {
    // Chỉ trả về text content cho Material icons
    if (icon.endsWith('-mat')) {
      return icon.replace('-mat', '');
    }
    return null;
  }
}
