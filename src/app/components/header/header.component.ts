import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProductService, ProductCategory } from '../../services/product.service';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: any;
        Element: any;
      };
    };
  }
}

interface Language {
  code: string;
  name: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  isMobileMenuOpen = false;
  activeDropdown: string | null = null;
  currentLanguage = 'vi';
  isLanguageDropdownOpen = false;
  private readonly LANGUAGE_KEY = 'selected_language';
  categories: ProductCategory[] = [];

  languages: Language[] = [
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'en', name: 'English' },
    { code: 'ko', name: '한국어' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh-CN', name: '中文' }
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('click', () => {
        this.isLanguageDropdownOpen = false;
      });

      // Đọc ngôn ngữ đã lưu từ localStorage
      const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY);
      if (savedLanguage) {
        this.currentLanguage = savedLanguage;
        // Áp dụng ngôn ngữ đã lưu
        this.applyLanguage(savedLanguage, false);
      }
    }

    this.loadCategories();
  }

  ngAfterViewInit(): void {
    this.initializeGoogleTranslate();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  toggleDropdown(dropdown: string) {
    if (this.activeDropdown === dropdown) {
      this.activeDropdown = null;
    } else {
      this.activeDropdown = dropdown;
    }
  }

  toggleLanguageDropdown(event: Event) {
    event.stopPropagation();
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
  }

  getCurrentLanguageName(): string {
    const lang = this.languages.find(l => l.code === this.currentLanguage);
    return lang ? lang.name : 'Tiếng Việt';
  }

  changeLanguage(langCode: string, event: Event) {
    event.stopPropagation();
    this.currentLanguage = langCode;

    // Lưu ngôn ngữ vào localStorage
    localStorage.setItem(this.LANGUAGE_KEY, langCode);

    this.applyLanguage(langCode, true);
    this.isLanguageDropdownOpen = false;
  }

  private applyLanguage(langCode: string, shouldReload: boolean = true) {
    // Tìm cookie của Google Translate
    const googleTranslateCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('googtrans='));

    // Xóa cookie cũ nếu có
    if (googleTranslateCookie) {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';';
    }

    // Đặt cookie mới
    const now = new Date();
    const time = now.getTime();
    const expireTime = time + 1000 * 36000;
    now.setTime(expireTime);

    document.cookie = `googtrans=/vi/${langCode}; expires=${now.toUTCString()}; path=/`;
    document.cookie = `googtrans=/vi/${langCode}; expires=${now.toUTCString()}; path=/; domain=.${window.location.hostname};`;

    // Chỉ reload trang khi cần thiết
    if (shouldReload) {
      window.location.reload();
    }
  }

  initializeGoogleTranslate() {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.visibility = 'hidden';
    div.style.position = 'absolute';
    document.body.appendChild(div);

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'vi',
          includedLanguages: 'en,ko,ru,zh-CN',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      );
    };
  }

  private loadCategories(): void {
    this.productService.getAllCategories().subscribe({
      next: (response) => {
        if (!response.meta.error) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Lỗi khi tải danh mục:', error);
      }
    });
  }
}
