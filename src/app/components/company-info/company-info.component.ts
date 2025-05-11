import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { InformationService, CompanyInformation } from '../../services/information.service';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrl: './company-info.component.scss'
})
export class CompanyInfoComponent implements OnInit, AfterViewInit {
  companyInfo: CompanyInformation | null = null;
  loading = false;
  error: string | null = null;
  private map: any = null;
  private L: any;

  constructor(
    private informationService: InformationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadCompanyInfo();
  }

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      await this.loadLeaflet();
      this.initMap();
    }
  }

  private async loadLeaflet(): Promise<void> {
    if (typeof window !== 'undefined') {
      this.L = await import('leaflet');
    }
  }

  private loadCompanyInfo(): void {
    this.loading = true;
    this.informationService.getInformation().subscribe({
      next: (response) => {
        this.companyInfo = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải thông tin công ty. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  private initMap(): void {
    if (!isPlatformBrowser(this.platformId) || !this.L) {
      return;
    }

    try {
      // Fix cho Leaflet icon
      const iconUrl = 'https://www.openstreetmap.org/assets/leaflet/dist/images/marker-icon-3d253116ec4ba0e1f22a01cdf1ff7f120fa4d89a6cd0933d68f12951d19809b4.png';
      const iconDefault = this.L.icon({
        iconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
      this.L.Marker.prototype.options.icon = iconDefault;

      // Khởi tạo map với tọa độ mặc định của Đà Nẵng
      this.map = this.L.map('map').setView([16.0544, 108.2022], 13);

      // Thêm tile layer
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© Danahomes'
      }).addTo(this.map);

      // Thêm marker
      const marker = this.L.marker([16.0544, 108.2022]).addTo(this.map);
      marker.bindPopup('Danahomes').openPopup();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }
}
