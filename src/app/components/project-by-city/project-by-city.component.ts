import { Component } from '@angular/core';

interface City {
  name: string;
  image: string;
  projectCount: number;
}

@Component({
  selector: 'app-project-by-city',
  templateUrl: './project-by-city.component.html',
  styleUrl: './project-by-city.component.scss'
})
export class ProjectByCityComponent {
  cities: City[] = [
    {
      name: 'HÀ NỘI',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_1.jpg?1730695187968',
      projectCount: 17
    },
    {
      name: 'ĐÀ NẴNG',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_2.jpg?1730695187968',
      projectCount: 17
    },
    {
      name: 'NGHỆ AN',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_3.jpg?1730695187968',
      projectCount: 17
    },
    {
      name: 'HẢI PHÒNG',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_4.jpg?1730695187968',
      projectCount: 17
    },
    {
      name: 'TP. HỒ CHÍ MINH',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_5.jpg?1730695187968',
      projectCount: 17
    }
  ];
}
