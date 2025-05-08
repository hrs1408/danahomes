import { Component, OnInit } from '@angular/core';
import { IntroductionService, IntroductionData } from '../../services/introduction.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  introduction: IntroductionData | null = null;
  safeContent: SafeHtml | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private introductionService: IntroductionService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadIntroduction();
  }

  private loadIntroduction(): void {
    this.introductionService.getIntroduction().subscribe({
      next: (response) => {
        this.introduction = response.data;
        this.safeContent = this.sanitizer.bypassSecurityTrustHtml(response.data.content);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading introduction:', error);
        this.error = 'Không thể tải thông tin giới thiệu. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }
}
