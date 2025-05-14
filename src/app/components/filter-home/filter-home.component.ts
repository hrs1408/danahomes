import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilterHomeService, Province, District } from './filter-home.service';
import { CategoryService, Category } from '../../services/category.service';
// Import Swiper và các module cần thiết
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { register } from 'swiper/element/bundle';

// Đăng ký Swiper elements
register();

@Component({
  selector: 'app-filter-home',
  templateUrl: './filter-home.component.html',
  styleUrls: ['./filter-home.component.scss']
})
export class FilterHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('categorySwiper') swiperRef!: ElementRef;
  swiper!: Swiper;
  activeTab: 'sale' | 'rent' = 'sale';
  isAdvancedSearch = false;

  // Data cho locations
  provinces: Province[] = [];
  districts: District[] = [];
  selectedProvince: string = '';
  selectedDistrict: string = '';

  // Data cho categories
  categories: Category[] = [];
  loading = false;
  error: string | null = null;

  // Data cho form search
  searchForm = {
    product_type: '',
    name: '',
    area: '',
    category_id: null as number | null,
    address: '',
    price: null as number | null,
    price_to: null as number | null
  };

  constructor(
    private readonly locationService: FilterHomeService,
    private readonly categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProvinces();
    this.loadCategories();
  }

  ngAfterViewInit() {
    this.swiper = new Swiper(this.swiperRef.nativeElement, {
      modules: [Navigation, Pagination],
      slidesPerView: 'auto',
      spaceBetween: 30,
      navigation: {
        enabled: false,
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        enabled: false,
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        320: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 40
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 50
        }
      }
    });
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (!response.meta.error) {
          this.categories = response.data;
        } else {
          this.error = response.meta.message;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Không thể tải danh mục. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  loadProvinces() {
    this.locationService.getProvinces().subscribe({
      next: (data) => {
        this.provinces = data;
      },
      error: (error) => {
        console.error('Error loading provinces:', error);
      }
    });
  }

  onProvinceChange(event: any) {
    const provinceCode = event.target.value;
    const selectedProvince = this.provinces.find(p => p.code.toString() === provinceCode);

    // Reset các giá trị liên quan
    this.selectedProvince = provinceCode;
    this.selectedDistrict = '';
    this.districts = [];
    this.searchForm.address = '';

    if (selectedProvince) {
      // Lưu tên tỉnh/thành phố
      this.searchForm.address = selectedProvince.name;
      // Load danh sách quận/huyện
      this.loadDistricts(Number(provinceCode));
    }
  }

  loadDistricts(provinceCode: number) {
    this.locationService.getDistrictsByProvinceCode(provinceCode).subscribe({
      next: (data: any) => {
        this.districts = data.districts;
      },
      error: (error) => {
        console.error('Error loading districts:', error);
      }
    });
  }

  onDistrictChange(event: any) {
    const districtCode = event.target.value;
    const selectedDistrict = this.districts.find(d => d.code.toString() === districtCode);

    if (selectedDistrict) {
      // Kết hợp tên quận/huyện với tên tỉnh/thành phố
      const provinceName = this.provinces.find(p => p.code.toString() === this.selectedProvince)?.name || '';
      this.searchForm.address = `${selectedDistrict.name}, ${provinceName}`;
    }
  }

  onSearch() {
    // Xử lý dữ liệu tìm kiếm
    const searchParams: Partial<typeof this.searchForm> = {};

    // Chỉ thêm các tham số có giá trị
    if (this.searchForm.product_type) {
      searchParams.product_type = this.searchForm.product_type;
    }

    if (this.searchForm.name?.trim()) {
      searchParams.name = this.searchForm.name.trim();
    }

    if (this.searchForm.area) {
      searchParams.area = this.searchForm.area;
    }

    if (this.searchForm.category_id) {
      searchParams.category_id = this.searchForm.category_id;
    }

    if (this.searchForm.address?.trim()) {
      searchParams.address = this.searchForm.address.trim();
    }

    if (this.searchForm.price) {
      searchParams.price = this.searchForm.price;
    }

    if (this.searchForm.price_to) {
      searchParams.price_to = this.searchForm.price_to;
    }

    // Thêm loại sản phẩm dựa trên tab active
    searchParams.product_type = this.activeTab === 'sale' ? 'sale' : 'rent';

    // Chuyển hướng đến trang kết quả tìm kiếm với params
    this.router.navigate(['/search'], {
      queryParams: searchParams
    });
  }

  onCategoryClick(category: Category) {
    this.searchForm.category_id = category.id;
    this.onSearch();
  }

  switchTab(tab: 'sale' | 'rent') {
    this.activeTab = tab;
    const wrapper = document.querySelector('.tabs-wrapper');
    if (tab === 'rent') {
      wrapper?.classList.add('rent-active');
    } else {
      wrapper?.classList.remove('rent-active');
    }
  }

  toggleAdvancedSearch() {
    this.isAdvancedSearch = !this.isAdvancedSearch;
    const moreBtn = document.querySelector('.more-btn');
    if (this.isAdvancedSearch) {
      moreBtn?.classList.add('active');
    } else {
      moreBtn?.classList.remove('active');
    }
  }

  getIconClass(icon: string): string {
    if (icon.endsWith('-ant')) {
      // Xử lý icon Ant Design
      return 'anticon anticon-' + icon.replace('-ant', '');
    } else if (icon.endsWith('-mat')) {
      // Xử lý icon Material
      return 'material-icons';
    } else {
      // Mặc định sử dụng Font Awesome
      return icon;
    }
  }

  getIconContent(icon: string): string | null {
    if (icon.endsWith('-mat')) {
      // Trả về tên icon Material không có hậu tố
      return icon.replace('-mat', '');
    }
    return null;
  }
}
