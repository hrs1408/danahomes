import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { DomSanitizer, SafeHtml, Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

// Khai báo biến L để tránh lỗi khi chạy SSR
declare let L: any;

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
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, AfterViewInit {
  readonly PROJECT_CATEGORY_ID = 7;
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  currentImageIndex = 0;
  private map: any = null;
  private marker: any = null;

  contactForm!: FormGroup;
  submitting = false;
  relatedProducts: Product[] = [];
  projectProducts: Product[] = [];
  isProject = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private meta: Meta,
    private title: Title,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initContactForm();
  }

  private initContactForm(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      message: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProductDetail(Number(productId));
      }
    });
  }

  ngAfterViewInit(): void {
    // Map sẽ được khởi tạo sau khi có dữ liệu sản phẩm
  }

  private loadProductDetail(productId: number): void {
    this.loading = true;
    this.error = null;
    this.productService.getProductById(productId).subscribe({
      next: (response) => {
        if (!response.meta.error) {
          this.product = response.data;
          this.isProject = this.product.category_id === this.PROJECT_CATEGORY_ID;
          this.updateMetaTags();

          if (this.isProject) {
            this.loadProjectProducts();
          } else {
            this.loadRelatedProducts();
          }

          if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
              this.initMap();
            });
          }
        } else {
          this.error = response.meta.message;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải chi tiết sản phẩm:', error);
        this.error = 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  private initMap(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.product || !this.product.address_detail.google_address_link) return;

    // Import Leaflet động khi cần thiết
    import('leaflet').then((L) => {
      // Lấy tọa độ từ google_address_link
      const match = this.product?.address_detail.google_address_link.match(/mlat=(-?\d+\.\d+)&mlon=(-?\d+\.\d+)/);
      if (!match) return;

      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);

      // Nếu map đã tồn tại, xóa nó đi
      if (this.map) {
        this.map.remove();
      }

      // Khởi tạo map mới
      this.map = L.map('map', ).setView([lat, lng], 16);

      // Thêm OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© Danahomes'
      }).addTo(this.map);

      // Thêm marker
      const icon = L.icon({
        iconUrl: 'https://www.openstreetmap.org/assets/leaflet/dist/images/marker-icon-3d253116ec4ba0e1f22a01cdf1ff7f120fa4d89a6cd0933d68f12951d19809b4.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      this.marker = L.marker([lat, lng], { icon }).addTo(this.map);
      this.marker.bindPopup(this.product?.name || '').openPopup();
    });
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  nextImage(): void {
    if (this.product && this.product.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
    }
  }

  prevImage(): void {
    if (this.product && this.product.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  getCurrentImage(): string {
    if (this.product && this.product.images.length > 0) {
      return this.product.images[this.currentImageIndex].drive_id;
    }
    return '';
  }

  private loadRelatedProducts(): void {
    if (!this.product) return;

    this.productService.getProductsByCategory(this.product.category_id).subscribe({
      next: (response) => {
        if (!response.meta.error) {
          // Lọc bỏ chính sản phẩm hiện tại
          this.relatedProducts = response.data.filter(p => p.id !== this.product?.id).slice(0, 3);
        }
      },
      error: (error) => {
        console.error('Lỗi khi tải sản phẩm cùng danh mục:', error);
      }
    });
  }

  private loadProjectProducts(): void {
    if (!this.product) return;

    this.productService.getProductByParent(this.product.id).subscribe({
      next: (response) => {
        if (!response.meta.error) {
          this.projectProducts = response.data;
        }
      },
      error: (error) => {
        console.error('Lỗi khi tải sản phẩm trong dự án:', error);
      }
    });
  }

  private updateMetaTags(): void {
    if (!this.product?.product_detail?.content || !this.product.images?.[0]) return;

    const description = this.product.product_detail.content.substring(0, 160);
    const imageUrl = `https://lh3.googleusercontent.com/d/${this.product.images[0].drive_id}`;

    this.title.setTitle(`${this.product.name} | Dana Homes`);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: this.product.name });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
  }

  shareOnFacebook(): void {
    if (!this.product || !isPlatformBrowser(this.platformId)) return;

    const url = window.location.href;
    const content = this.getShareContent();

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(content)}`,
      '_blank'
    );
  }

  shareOnTwitter(): void {
    if (!this.product || !isPlatformBrowser(this.platformId)) return;

    const url = window.location.href;
    const content = this.getShareContent();

    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(content)}`,
      '_blank'
    );
  }

  private getShareContent(): string {
    if (!this.product?.product_detail) return '';

    const content = this.product.product_detail.content;
    if (content) {
      return content.substring(0, 160);
    }

    return this.product.name || '';
  }

  shareOnZalo(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const url = encodeURIComponent(window.location.href);
    window.open(`https://zalo.me/share?u=${url}`, '_blank');
  }

  copyLink(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    navigator.clipboard.writeText(window.location.href).then(() => {
      this.toastr.success('Đã sao chép liên kết vào clipboard');
    });
  }

  onSubmitContact(): void {
    if (this.contactForm.valid && !this.submitting) {
      this.submitting = true;

      const formData = new FormData();

      // Map form fields to Google Form fields với entry ID chính xác
      formData.append('entry.1348537145', this.contactForm.value.name);
      formData.append('entry.338049320', this.contactForm.value.address || 'Từ sản phẩm chi tiết');
      formData.append('entry.2018706474', this.contactForm.value.phone);
      formData.append('entry.351127077', this.contactForm.value.email || '');
      formData.append('entry.1731357089', this.contactForm.value.message);
      formData.append('entry.165271468', window.location.href);

      // Gửi form đến Google Forms
      this.http
        .post(
          'https://docs.google.com/forms/d/e/1FAIpQLSfJWW50QDcK6S2SCn8EWAKhRlHMeg91k-ZDQsap7Wp3bF84XQ/formResponse',
          formData
        )
        .subscribe({
          next: () => {
            this.submitting = false;
            this.toastr.success('Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm.', 'Thành công');
            this.contactForm.reset();
          },
          error: () => {
            // Google Form luôn trả về lỗi CORS nhưng vẫn submit thành công
            this.submitting = false;
            this.toastr.success('Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm.', 'Thành công');
            this.contactForm.reset();
          }
        });
    } else {
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      this.toastr.error('Vui lòng điền đầy đủ thông tin bắt buộc');
    }
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

}
