import { Component, OnInit } from '@angular/core';
import { FilterHomeService, Province, District } from './filter-home.service';

@Component({
  selector: 'app-filter-home',
  templateUrl: './filter-home.component.html',
  styleUrls: ['./filter-home.component.scss']
})
export class FilterHomeComponent implements OnInit {
  activeTab: 'sale' | 'rent' = 'sale';
  isAdvancedSearch = false;

  // Data cho locations
  provinces: Province[] = [];
  districts: District[] = [];
  selectedProvince: string = '';
  selectedDistrict: string = '';

  // Data cho form search
  searchForm = {
    propertyType: '',
    keyword: '',
    province: '',
    district: '',
    areaFrom: null as number | null,
    areaTo: null as number | null,
    priceFrom: null as number | null,
    priceTo: null as number | null
  };

  constructor(private readonly locationService: FilterHomeService) {}

  ngOnInit() {
    this.loadProvinces();
  }

  loadProvinces() {
    this.locationService.getProvinces().subscribe({
      next: (data) => {
        this.provinces = data;
      },
      error: (error) => {
        console.error('Error loading provinces:', error);
      }
    });
  }

  onProvinceChange(event: any) {
    const provinceCode = event.target.value;
    this.searchForm.province = provinceCode;
    this.searchForm.district = ''; // Reset district when province changes
    this.districts = []; // Clear districts

    if (provinceCode) {
      this.loadDistricts(Number(provinceCode));
    }
  }

  loadDistricts(provinceCode: number) {
    this.locationService.getDistrictsByProvinceCode(provinceCode).subscribe({
      next: (data: any) => {
        this.districts = data.districts;
      },
      error: (error) => {
        console.error('Error loading districts:', error);
      }
    });
  }

  onDistrictChange(event: any) {
    this.searchForm.district = event.target.value;
  }

  onSearch() {
    console.log('Search with params:', this.searchForm);
    // Implement your search logic here
  }

  switchTab(tab: 'sale' | 'rent') {
    this.activeTab = tab;
    const wrapper = document.querySelector('.tabs-wrapper');
    if (tab === 'rent') {
      wrapper?.classList.add('rent-active');
    } else {
      wrapper?.classList.remove('rent-active');
    }
  }

  toggleAdvancedSearch() {
    this.isAdvancedSearch = !this.isAdvancedSearch;
    const moreBtn = document.querySelector('.more-btn');
    if (this.isAdvancedSearch) {
      moreBtn?.classList.add('active');
    } else {
      moreBtn?.classList.remove('active');
    }
  }
}
