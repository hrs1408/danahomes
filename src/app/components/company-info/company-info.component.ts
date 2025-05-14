import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject, NgZone, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { InformationService, CompanyInformation } from '../../services/information.service';
import type { Map, Marker, Icon, IconOptions } from 'leaflet';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrl: './company-info.component.scss'
})
export class CompanyInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  companyInfo: CompanyInformation | null = null;
  loading = false;
  error: string | null = null;
  private map: Map | null = null;
  private marker: Marker | null = null;
  private defaultIcon: Icon<IconOptions> | undefined;
  private mapInitialized = false;

  constructor(
    private informationService: InformationService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCompanyInfo();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Đợi DOM render xong và các script load xong
      setTimeout(() => {
        this.initMap();
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private loadCompanyInfo(): void {
    this.loading = true;
    this.informationService.getInformation().subscribe({
      next: (response) => {
        this.companyInfo = response.data;
        this.loading = false;
        if (!this.mapInitialized && this.companyInfo) {
          this.initMap();
        }
      },
      error: (err) => {
        this.error = 'Không thể tải thông tin công ty. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  private async initMap(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || this.mapInitialized) return;

    try {
      // Load Leaflet dynamically
      const L = await import('leaflet');

      // Load Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Khởi tạo icon mặc định
      this.defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      this.ngZone.run(() => {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        if (this.map) {
          this.map.remove();
        }

        // Khởi tạo map trong NgZone
        this.map = L.map('map', {
          center: [16.0544, 108.2022],
          zoom: 13,
          attributionControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© Danahomes'
        }).addTo(this.map);

        // Thêm marker nếu có thông tin công ty
        if (this.companyInfo) {
          // Thêm logic để lấy tọa độ từ thông tin công ty
          const lat = 16.0544; // Thay bằng tọa độ thực từ API
          const lng = 108.2022; // Thay bằng tọa độ thực từ API

          if (this.marker) {
            this.marker.remove();
          }

          this.marker = L.marker([lat, lng], { icon: this.defaultIcon })
            .addTo(this.map)
            .bindPopup(this.companyInfo.address)
            .openPopup();
        }

        this.mapInitialized = true;
      });
    } catch (error) {
      console.error('Lỗi khi khởi tạo map:', error);
      this.error = 'Không thể khởi tạo bản đồ. Vui lòng thử lại sau.';
    }
  }
}
