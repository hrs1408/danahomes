import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-home',
  templateUrl: './filter-home.component.html',
  styleUrls: ['./filter-home.component.scss']
})
export class FilterHomeComponent {
  activeTab: 'sale' | 'rent' = 'sale';

  switchTab(tab: 'sale' | 'rent') {
    this.activeTab = tab;
    const wrapper = document.querySelector('.tabs-wrapper');
    if (tab === 'rent') {
      wrapper?.classList.add('rent-active');
    } else {
      wrapper?.classList.remove('rent-active');
    }
  }
}
