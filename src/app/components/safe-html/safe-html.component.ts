import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-safe-html',
  template: '<div [innerHTML]="safeHtml"></div>',
  standalone: true,
  imports: [CommonModule]
})
export class SafeHtmlComponent implements OnChanges {
  @Input() html: string = '';
  safeHtml: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['html']) {
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.html);
    }
  }
}
