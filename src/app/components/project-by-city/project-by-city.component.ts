import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

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
      name: 'Hà Nội',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_1.jpg?1730695187968',
      projectCount: 17
    },
    {
      name: 'Đà Nẵng',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_2.jpg?1730695187968',
      projectCount: 17
    },
    {
      name: 'Nghệ An',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_3.jpg?1730695187968',
      projectCount: 17
    },
    {
      name: 'Hải Phòng',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_4.jpg?1730695187968',
      projectCount: 17
    },
    {
      name: 'Thành phố Hồ Chí Minh',
      image: 'https://bizweb.dktcdn.net/100/393/384/themes/894826/assets/da_5.jpg?1730695187968',
      projectCount: 17
    }
  ];

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  searchByCity(cityName: string) {
    // Chuyển hướng đến trang search với params
    this.router.navigate(['/search'], {
      queryParams: {
        address: cityName
      }
    });
  }
}
