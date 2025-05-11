import { Component, OnInit } from '@angular/core';
import { InformationService, CompanyInformation } from '../../services/information.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  companyInfo: CompanyInformation | null = null;

  constructor(private informationService: InformationService) {}

  ngOnInit(): void {
    this.loadCompanyInfo();
  }

  private loadCompanyInfo(): void {
    this.informationService.getInformation().subscribe({
      next: (response) => {
        if (!response.meta.error) {
          this.companyInfo = response.data;
        }
      },
      error: (error) => {
        console.error('Lỗi khi tải thông tin công ty:', error);
      }
    });
  }
}
