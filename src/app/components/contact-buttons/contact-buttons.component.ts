import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-contact-buttons',
  templateUrl: './contact-buttons.component.html',
  styleUrls: ['./contact-buttons.component.scss']
})
export class ContactButtonsComponent implements OnInit {
  showScrollTop = false;
  isMenuOpen = false;

  constructor() { }

  ngOnInit(): void {
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
