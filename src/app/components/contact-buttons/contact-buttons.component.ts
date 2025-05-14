import { Component, OnInit, HostListener } from '@angular/core';
import { InformationService, CompanyInformation } from '../../services/information.service';

@Component({
  selector: 'app-contact-buttons',
  templateUrl: './contact-buttons.component.html',
  styleUrls: ['./contact-buttons.component.scss']
})
export class ContactButtonsComponent implements OnInit {
  showScrollTop = false;
  isMenuOpen = false;
  companyInfo: CompanyInformation | null = null;
  loading = false;
  error: string | null = null;

  constructor(private informationService: InformationService) {}

  ngOnInit(): void {
    this.loadCompanyInfo();
  }

  private loadCompanyInfo(): void {
    this.loading = true;
    this.informationService.getInformation().subscribe({
      next: (response) => {
        if (!response.meta.error) {
          this.companyInfo = response.data;
        } else {
          this.error = response.meta.message;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải thông tin công ty:', err);
        this.error = 'Không thể tải thông tin liên hệ. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    // Hiển thị nút khi scroll xuống 200px
    this.showScrollTop = window.scrollY > 200;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
