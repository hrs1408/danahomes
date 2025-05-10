import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ProductService, Product } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrl: './popular.component.scss'
})
export class PopularComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  swiper?: Swiper;

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

  ngAfterViewInit() {
    // Swiper sẽ được khởi tạo sau khi load dữ liệu
  }

  private loadHotProducts() {
    this.loading = true;
    this.error = null;

    this.productService.getHotProducts().subscribe({
      next: (response) => {
        this.popularProducts = response.data;
        this.loading = false;

        // Đảm bảo view đã được cập nhật
        this.cdr.detectChanges();

        // Khởi tạo Swiper sau khi view đã được cập nhật
        setTimeout(() => {
          this.initSwiper();
        });
      },
      error: (err) => {
        this.error = 'Không thể tải dự án nổi bật. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  private initSwiper() {
    if (this.popularProducts.length > 0) {
      if (this.swiper) {
        this.swiper.destroy();
      }

      this.swiper = new Swiper(this.swiperContainer.nativeElement, {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }
  }

  getMainImage(product: Product): string {
    // Trả về ảnh mặc định nếu không có ảnh
    if (!product.images || product.images.length === 0) {
      return '1CWmWfmLASqMynRs5_yYlYAv42nvy9bJ3'; // Thay thế bằng ID ảnh mặc định của bạn
    }
    return product.images[0].drive_id;
  }

  formatPrice(price: number): string {
    if (price >= 1000000000) {
      return (price / 1000000000).toFixed(2) + ' tỷ';
    } else if (price >= 1000000) {
      return (price / 1000000).toFixed(0) + ' triệu';
    }
    return price.toString();
  }

  viewDetails(productId: number) {
    this.router.navigate(['/products', productId]);
  }
}
