import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { DomSanitizer, SafeHtml, Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { SafeHtmlComponent } from '../../components/safe-html/safe-html.component';
import type { Map, Marker } from 'leaflet';

// Khai báo biến L để tránh lỗi khi chạy SSR

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

interface BaseBlock {
  id: string;
  type: string;
  order: number;
}

interface HeadingBlock extends BaseBlock {
  content: string;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  alignment: 'left' | 'center' | 'right';
  color: string;
  fontSize: number;
}

interface ButtonBlock extends BaseBlock {
  text: string;
  url: string;
  target: '_self' | '_blank';
  style: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  size: 'small' | 'large';
  fullWidth: boolean;
  alignment: 'left' | 'center' | 'right';
}

interface SliderBlock extends BaseBlock {
  type: 'slider';
  images: {
    url: string;
    title?: string;
    description?: string;
  }[];
}

interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  content: string;
  title?: string;
}

interface ListBlock extends BaseBlock {
  type: 'list';
  items: {
    title: string;
    description?: string;
    icon?: string;
  }[];
  style: 'bullet' | 'number' | 'icon';
}

interface ImageListBlock extends BaseBlock {
  type: 'image-list';
  items: {
    image: string;
    title?: string;
    description?: string;
  }[];
  layout: 'grid' | 'carousel';
  columns: 2 | 3 | 4;
}

interface VideoBlock extends BaseBlock {
  type: 'video';
  url: string;
  title?: string;
  description?: string;
  autoplay?: boolean;
  controls?: boolean;
  poster?: string;
}

interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  images: {
    url: string;
    thumbnail?: string;
    title?: string;
    description?: string;
  }[];
  layout: 'masonry' | 'grid';
  columns: 2 | 3 | 4;
  spacing: number;
}

interface ImageBoxBlock extends BaseBlock {
  type: 'image-box';
  image: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  title: string;
  description: string;
  layout: 'left' | 'right' | 'top' | 'bottom' | 'overlay';
  titleTag: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  imageRounded: boolean;
  imageShadow: boolean;
  backgroundColor?: string;
  textColor?: string;
  padding: number;
  spacing: number;
}

interface LayoutSection {
  id: string;
  columns: number;
  columnGap: number;
  blocks: {
    columnIndex: number;
    block: ContentBlock;
  }[];
}

type ContentBlock = HeadingBlock | ButtonBlock | SliderBlock | ParagraphBlock | ListBlock | ImageListBlock | VideoBlock | GalleryBlock | ImageBoxBlock;

interface PageContent {
  blocks: (ContentBlock | LayoutSection)[];
}

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, AfterViewInit {
  readonly PROJECT_CATEGORY_ID = 7;
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  currentImageIndex = 0;
  map: Map | null = null;
  marker: Marker | null = null;
  pageContent: PageContent | null = null;

  contactForm!: FormGroup;
  submitting = false;
  relatedProducts: Product[] = [];
  projectProducts: Product[] = [];
  isProject = false;

  currentSlideIndex = 0;

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
            // Parse page builder content if exists
            if (this.product.product_detail.content) {
              try {
                this.pageContent = JSON.parse(this.product.product_detail.content);
              } catch (e) {
                console.error('Lỗi khi parse page builder content:', e);
              }
            }
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

  private async initMap(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.product?.address_detail?.google_address_link) return;

    const match = this.product.address_detail.google_address_link.match(/mlat=(-?\d+\.\d+)&mlon=(-?\d+\.\d+)/);
    if (!match) return;

    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);

    try {
      const L = await import('leaflet');

      if (this.map) {
        this.map.remove();
      }

      this.map = L.map('map').setView([lat, lng], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© Danahomes'
      }).addTo(this.map);

      const customIcon = L.icon({
        iconUrl: 'https://www.openstreetmap.org/assets/leaflet/dist/images/marker-icon-3d253116ec4ba0e1f22a01cdf1ff7f120fa4d89a6cd0933d68f12951d19809b4.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });

      this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
      this.marker.bindPopup(this.product?.name || '').openPopup();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
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

  renderBlock(block: ContentBlock): string {
    let html = '';
    switch (block.type) {
      case 'heading':
        const headingBlock = block as HeadingBlock;
        html = `
          <${headingBlock.level} style="
            color: ${headingBlock.color};
            font-size: ${headingBlock.fontSize}px;
            text-align: ${headingBlock.alignment};
          ">
            ${headingBlock.content}
          </${headingBlock.level}>
        `;
        break;

      case 'button':
        const buttonBlock = block as ButtonBlock;
        html = `
          <div style="text-align: ${buttonBlock.alignment}">
            <a href="${buttonBlock.url}"
               target="${buttonBlock.target}"
               class="btn btn-${buttonBlock.style} btn-${buttonBlock.size}"
               style="${buttonBlock.fullWidth ? 'width: 100%;' : ''}">
              ${buttonBlock.text}
            </a>
          </div>
        `;
        break;

      case 'paragraph':
        const paragraphBlock = block as ParagraphBlock;
        html = `
          <div class="paragraph-block">
            ${paragraphBlock.title ? `<h3>${paragraphBlock.title}</h3>` : ''}
            <div class="paragraph-content">${paragraphBlock.content}</div>
          </div>
        `;
        break;

      case 'list':
        const listBlock = block as ListBlock;
        const listItems = listBlock.items.map(item => {
          const icon = item.icon ? `<i class="${item.icon}"></i>` : '';
          return `
            <li>
              ${icon}
              <div class="list-item-content">
                <h4>${item.title}</h4>
                ${item.description ? `<p>${item.description}</p>` : ''}
              </div>
            </li>
          `;
        }).join('');

        html = `
          <ul class="list-block list-style-${listBlock.style}">
            ${listItems}
          </ul>
        `;
        break;

      case 'image-list':
        const imageListBlock = block as ImageListBlock;
        const imageItems = imageListBlock.items.map(item => `
          <div class="image-list-item">
            <img src="${item.image}" alt="${item.title || ''}" />
            ${item.title ? `<h4>${item.title}</h4>` : ''}
            ${item.description ? `<p>${item.description}</p>` : ''}
          </div>
        `).join('');

        html = `
          <div class="image-list-block layout-${imageListBlock.layout}" style="
            display: grid;
            grid-template-columns: repeat(${imageListBlock.columns}, 1fr);
            gap: 20px;
          ">
            ${imageItems}
          </div>
        `;
        break;

      case 'video':
        const videoBlock = block as VideoBlock;
        html = `
          <div class="video-block">
            ${videoBlock.title ? `<h3>${videoBlock.title}</h3>` : ''}
            <video
              src="${videoBlock.url}"
              ${videoBlock.poster ? `poster="${videoBlock.poster}"` : ''}
              ${videoBlock.controls ? 'controls' : ''}
              ${videoBlock.autoplay ? 'autoplay' : ''}
              style="width: 100%;"
            ></video>
            ${videoBlock.description ? `<p>${videoBlock.description}</p>` : ''}
          </div>
        `;
        break;

      case 'gallery':
        const galleryBlock = block as GalleryBlock;
        const galleryItems = galleryBlock.images.map(image => `
          <div class="gallery-item">
            <img src="${image.url}" alt="${image.title || ''}" />
            ${image.title ? `<h4>${image.title}</h4>` : ''}
            ${image.description ? `<p>${image.description}</p>` : ''}
          </div>
        `).join('');

        html = `
          <div class="gallery-block layout-${galleryBlock.layout}" style="
            display: grid;
            grid-template-columns: repeat(${galleryBlock.columns}, 1fr);
            gap: ${galleryBlock.spacing}px;
          ">
            ${galleryItems}
          </div>
        `;
        break;

      case 'image-box':
        const imageBoxBlock = block as ImageBoxBlock;
        const imageBoxContent = `
          <div class="image-box-content" style="
            background-color: ${imageBoxBlock.backgroundColor || 'transparent'};
            color: ${imageBoxBlock.textColor || 'inherit'};
            padding: ${imageBoxBlock.padding}px;
          ">
            <img
              src="${imageBoxBlock.image.url}"
              alt="${imageBoxBlock.image.alt}"
              ${imageBoxBlock.image.width ? `width="${imageBoxBlock.image.width}"` : ''}
              ${imageBoxBlock.image.height ? `height="${imageBoxBlock.image.height}"` : ''}
              class="${imageBoxBlock.imageRounded ? 'rounded' : ''} ${imageBoxBlock.imageShadow ? 'shadow' : ''}"
            />
            <${imageBoxBlock.titleTag}>${imageBoxBlock.title}</${imageBoxBlock.titleTag}>
            <p>${imageBoxBlock.description}</p>
          </div>
        `;

        html = `
          <div class="image-box-block layout-${imageBoxBlock.layout}" style="gap: ${imageBoxBlock.spacing}px;">
            ${imageBoxContent}
          </div>
        `;
        break;

      default:
        html = '';
    }
    return html;
  }

  renderLayoutSection(section: LayoutSection): string {
    const columnWidth = `${100 / section.columns}%`;
    const columnBlocks = Array.from({ length: section.columns }, (_, i) => {
      const blocksInColumn = section.blocks
        .filter(b => b.columnIndex === i)
        .map(b => this.renderBlock(b.block))
        .join('');
      return `<div class="layout-column" style="width: ${columnWidth};">${blocksInColumn}</div>`;
    }).join('');

    return `
      <div class="layout-section" style="display: flex; gap: ${section.columnGap}px;">
        ${columnBlocks}
      </div>
    `;
  }

  isLayoutSection(block: ContentBlock | LayoutSection): block is LayoutSection {
    return 'columns' in block && 'blocks' in block;
  }

  isHeadingBlock(block: ContentBlock | LayoutSection): block is HeadingBlock {
    return 'type' in block && block.type === 'heading';
  }

  isButtonBlock(block: ContentBlock | LayoutSection): block is ButtonBlock {
    return 'type' in block && block.type === 'button';
  }

  isSliderBlock(block: ContentBlock | LayoutSection): block is SliderBlock {
    return 'type' in block && block.type === 'slider';
  }

  isParagraphBlock(block: ContentBlock | LayoutSection): block is ParagraphBlock {
    return 'type' in block && block.type === 'paragraph';
  }

  isListBlock(block: ContentBlock | LayoutSection): block is ListBlock {
    return 'type' in block && block.type === 'list';
  }

  isImageListBlock(block: ContentBlock | LayoutSection): block is ImageListBlock {
    return 'type' in block && block.type === 'image-list';
  }

  isVideoBlock(block: ContentBlock | LayoutSection): block is VideoBlock {
    return 'type' in block && block.type === 'video';
  }

  isGalleryBlock(block: ContentBlock | LayoutSection): block is GalleryBlock {
    return 'type' in block && block.type === 'gallery';
  }

  isImageBoxBlock(block: ContentBlock | LayoutSection): block is ImageBoxBlock {
    return 'type' in block && block.type === 'image-box';
  }

  getColumnBlocks(section: LayoutSection, columnIndex: number): ContentBlock[] {
    return section.blocks
      .filter(block => block.columnIndex === columnIndex)
      .map(block => block.block);
  }

  onImageError(event: any): void {
    event.target.src = 'https://cdn3.iconfinder.com/data/icons/it-and-ui-mixed-filled-outlines/48/default_image-1024.png';
  }

  // Slider methods
  prevSlide(layoutBlock: SliderBlock): void {
    const totalSlides = layoutBlock.images?.length || 0;
    this.currentSlideIndex = (this.currentSlideIndex - 1 + totalSlides) % totalSlides;
  }

  nextSlide(layoutBlock: SliderBlock): void {
    const totalSlides = layoutBlock.images?.length || 0;
    this.currentSlideIndex = (this.currentSlideIndex + 1) % totalSlides;
  }

  goToSlide(index: number, layoutBlock: SliderBlock): void {
    const totalSlides = layoutBlock.images?.length || 0;
    if (index >= 0 && index < totalSlides) {
      this.currentSlideIndex = index;
    }
  }
}
