import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

interface ProjectStatusInfo {
  text: string;
  color: string;
  backgroundColor: string;
  icon?: string;
  animationClass?: string;
}

interface SearchParams {
  product_type?: string;
  area?: string;
  price?: number;
  price_to?: number;
  address?: string;
  category_id?: number;
  name?: string;
  [key: string]: string | number | undefined;
}

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  products: Product[] = [];
  rentProducts: Product[] = [];
  saleProducts: Product[] = [];
  projectProducts: Product[] = [];
  loading = true;
  error: string | null = null;
  searchParams: SearchParams = {
    product_type: undefined,
    area: undefined,
    price: undefined,
    price_to: undefined,
    address: undefined,
    category_id: undefined,
    name: undefined
  };
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
      const searchParams: SearchParams = {};

      if (params['product_type']) {
        searchParams['product_type'] = params['product_type'];
      }

      if (params['name']) {
        searchParams['name'] = params['name'];
      }

      if (params['area']) {
        searchParams['area'] = params['area'];
      }

      if (params['category_id']) {
        const categoryId = Number(params['category_id']);
        if (!isNaN(categoryId)) {
          searchParams['category_id'] = categoryId;
        }
      }

      if (params['address']) {
        searchParams['address'] = params['address'];
      }

      if (params['price']) {
        const price = Number(params['price']);
        if (!isNaN(price)) {
          searchParams['price'] = price;
        }
      }

      if (params['price_to']) {
        const priceTo = Number(params['price_to']);
        if (!isNaN(priceTo)) {
          searchParams['price_to'] = priceTo;
        }
      }

      this.searchParams = searchParams;
      this.search();
    });
  }

  getProjectStatusInfo(slug: string): ProjectStatusInfo {
    switch (slug) {
      case 'selling':
        return {
          text: 'Đang bán',
          color: '#fff',
          backgroundColor: '#2ecc71',
          icon: 'shopping-cart',
          animationClass: 'pulse'
        };
      case 'coming_soon':
        return {
          text: 'Sắp mở bán',
          color: '#fff',
          backgroundColor: '#f1c40f',
          icon: 'clock',
          animationClass: 'bounce'
        };
      case 'delivered':
        return {
          text: 'Đã bàn giao',
          color: '#fff',
          backgroundColor: '#3498db',
          icon: 'check-circle',
          animationClass: 'fade'
        };
      case 'completed':
        return {
          text: 'Đã hoàn thành',
          color: '#fff',
          backgroundColor: '#95a5a6',
          icon: 'flag',
          animationClass: 'slide'
        };
      case 'reserved':
        return {
          text: 'Đã đặt cọc',
          color: '#fff',
          backgroundColor: '#e74c3c',
          icon: 'lock',
          animationClass: 'shake'
        };
      case 'on_hold':
        return {
          text: 'Tạm ngưng',
          color: '#fff',
          backgroundColor: '#9b59b6',
          icon: 'pause',
          animationClass: 'fade'
        };
      default:
        return {
          text: '',
          color: '#666',
          backgroundColor: '#f8f9fa'
        };
    }
  }

  private categorizeProducts(products: Product[]): void {
    if (!products) {
      this.rentProducts = [];
      this.saleProducts = [];
      this.projectProducts = [];
      return;
    }

    this.rentProducts = products.filter(p => p?.product_detail?.type_product === 'rent' && p?.category_id !== 7);
    this.saleProducts = products.filter(p => p?.product_detail?.type_product === 'sale' && p?.category_id !== 7);
    this.projectProducts = products.filter(p => p?.category_id === 7);
  }

  private search(): void {
    this.loading = true;
    this.error = null;

    // Chỉ gọi API nếu có ít nhất một tham số tìm kiếm
    const cleanParams = Object.entries(this.searchParams)
      .reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as SearchParams);

    if (Object.keys(cleanParams).length === 0) {
      this.products = [];
      this.rentProducts = [];
      this.saleProducts = [];
      this.projectProducts = [];
      this.totalResults = 0;
      this.totalPages = 0;
      this.loading = false;
      return;
    }

    this.productService.search(cleanParams).subscribe({
      next: (response) => {
        // Kiểm tra nếu data là string (lỗi) hoặc array (kết quả hợp lệ)
        if (typeof response.data === 'string') {
          // Data là string, có nghĩa là có lỗi
          this.error = response.data;
          this.products = [];
          this.rentProducts = [];
          this.saleProducts = [];
          this.projectProducts = [];
          this.totalResults = 0;
          this.totalPages = 0;
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          const allProducts = response.data;
          this.totalResults = allProducts.length;
          this.totalPages = Math.ceil(this.totalResults / this.pageSize);

          // Phân loại sản phẩm
          this.categorizeProducts(allProducts);

          // Phân trang
          const startIndex = (this.currentPage - 1) * this.pageSize;
          const endIndex = startIndex + this.pageSize;
          this.products = allProducts.slice(startIndex, endIndex);
        } else {
          this.error = response.meta?.message || 'Không có dữ liệu';
          this.products = [];
          this.rentProducts = [];
          this.saleProducts = [];
          this.projectProducts = [];
          this.totalResults = 0;
          this.totalPages = 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tìm kiếm:', error);
        this.error = 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.';
        this.products = [];
        this.rentProducts = [];
        this.saleProducts = [];
        this.projectProducts = [];
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
    const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedPrice + ' VNĐ';
  }

  formatNumber(value: number | string): string {
    if (!value) return '0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  getMainImage(product: Product): string {
    return product.images && product.images.length > 0 ? product.images[0].drive_id : '';
  }

  viewProductDetail(productId: number): void {
    this.router.navigate(['/detail', productId]);
  }

  calculatePricePerM2(price: number, area: number, priceTo?: number): string {
    if (!price || !area || area === 0) return '';

    if (priceTo) {
      const priceM2 = (price / area).toFixed(0);
      const priceToM2 = (priceTo / area).toFixed(0);
      return priceM2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ' + ' - ' + priceToM2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'VNĐ';
    }
    return (price / area).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'VNĐ';
  }

  removeFilter(filterName: keyof SearchParams): void {
    if (this.searchParams && filterName in this.searchParams) {
      const updatedParams = { ...this.searchParams };
      delete updatedParams[filterName];
      this.searchParams = updatedParams;
      this.updateSearchResults();
    }

  }

  private updateSearchResults(): void {
    this.loading = true;
    this.error = null;

    // Loại bỏ các giá trị undefined trước khi gửi request
    const cleanParams = Object.entries(this.searchParams)
      .reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as SearchParams);

    this.productService.search(cleanParams).subscribe({
      next: (response) => {
        // Kiểm tra nếu data là string (lỗi) hoặc array (kết quả hợp lệ)
        if (typeof response.data === 'string') {
          // Data là string, có nghĩa là có lỗi
          this.error = response.data;
          this.products = [];
          this.rentProducts = [];
          this.saleProducts = [];
          this.projectProducts = [];
          this.totalResults = 0;
          this.totalPages = 0;
        } else if (Array.isArray(response.data)) {
          this.products = response.data;
          this.totalResults = response.data.length;
          this.totalPages = Math.ceil(this.totalResults / this.pageSize);
          this.categorizeProducts(response.data);
        } else {
          this.products = [];
          this.rentProducts = [];
          this.saleProducts = [];
          this.projectProducts = [];
          this.totalResults = 0;
          this.totalPages = 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tìm kiếm:', error);
        this.error = 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.';
        this.loading = false;
        this.products = [];
        this.rentProducts = [];
        this.saleProducts = [];
        this.projectProducts = [];
        this.totalResults = 0;
        this.totalPages = 0;
      }
    });
  }

  // Thêm các phương thức getter để lấy số lượng sản phẩm theo từng loại
  get rentProductsCount(): number {
    return this.rentProducts.length;
  }

  get saleProductsCount(): number {
    return this.saleProducts.length;
  }

  get projectProductsCount(): number {
    return this.projectProducts.length;
  }
}
