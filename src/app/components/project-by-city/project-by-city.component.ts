import { Component } from '@angular/core';

interface City {
  name: string;
  image: string;
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
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_2.jpg?1730695187968'
    },
    {
      name: 'ĐÀ NẴNG',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_2.jpg?1730695187968'
    },
    {
      name: 'NGHỆ AN',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_2.jpg?1730695187968'
    },
    {
      name: 'HẢI PHÒNG',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_2.jpg?1730695187968'
    },
    {
      name: 'TP. HỒ CHÍ MINH',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_2.jpg?1730695187968'
    }
  ];
}
