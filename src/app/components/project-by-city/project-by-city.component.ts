import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

interface District {
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
  districts: District[] = [
    {
      name: 'Quận Hải Châu',
      image: 'https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2023/12/14/hai-chau-1-17025207586071731071527.jpg',
      projectCount: 8
    },
    {
      name: 'Quận Thanh Khê',
      image: 'https://vietnamtourism.vn/imguploads/tourist/15Quanthanhkhe01.jpg',
      projectCount: 5
    },
    {
      name: 'Quận Sơn Trà',
      image: 'https://filesdata.cadn.com.vn/filedatacadn/media//data_news/Image/2022/th1/ng24/image0050.jpg',
      projectCount: 6
    },
    {
      name: 'Quận Ngũ Hành Sơn',
      image: 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2020/7/24/821959/Ngu-Hanh-Son-3.jpg',
      projectCount: 7
    },
    {
      name: 'Quận Liên Chiểu',
      image: 'https://image.sggp.org.vn/w1000/Uploaded/2025/chukplu/2020_07_28/2402_YEPZ.jpg.webp',
      projectCount: 4
    },
    {
      name: 'Quận Cẩm Lệ',
      image: 'https://thinkoffice.vn/wp-content/uploads/2023/03/van-phong-ao-quan-Cam-Le-3.jpg',
      projectCount: 3
    },
    {
      name: 'Huyện Hòa Vang',
      image: 'https://cly.1cdn.vn/2024/09/15/15-9-thanhtra.jpg',
      projectCount: 2
    }
  ];

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}
  searchByDistrict(districtName: string) {
    this.router.navigate(['/tim-kiem'], {
      queryParams: {
        address: districtName
      }
    });
  }
}
