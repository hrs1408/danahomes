import { Component, OnInit } from '@angular/core';
import { LeaseProperty } from '../../models/lease.model';

@Component({
  selector: 'app-lease',
  templateUrl: './lease.component.html',
  styleUrl: './lease.component.scss'
})
export class LeaseComponent implements OnInit {
  leaseProperties: LeaseProperty[] = [
    {
      id: '1',
      title: 'Căn hộ cao cấp Alpha Hill',
      price: 3456000000,
      imageUrl: 'https://bizweb.dktcdn.net/100/393/384/products/pd-22.jpg?v=1592537639157',
      bedrooms: 1,
      bathrooms: 1,
      area: 50,
      type: 'Cho thuê'
    },
    {
      id: '2',
      title: 'Biệt thự Bin Klinton Leighton Luxury Paradise Nguyễn Văn Linh',
      price: 299000000,
      imageUrl: 'https://bizweb.dktcdn.net/100/393/384/products/pd-39.jpg?v=1592550657553',
      bedrooms: 2,
      bathrooms: 2,
      area: 200,
      isHot: true,
      type: 'Cho thuê'
    },
    {
      id: '3',
      title: 'Biệt thự sân vườn sát sân bay Nội Bài',
      price: 12009000000,
      imageUrl: 'https://bizweb.dktcdn.net/100/393/384/products/pd-22.jpg?v=1592537639157',
      bedrooms: 1,
      bathrooms: 1,
      area: 100,
      isHot: true,
      type: 'Cho thuê'
    },
    {
      id: '4',
      title: 'Chung cư Platium Luxury Center Park Trần Duy Hưng',
      price: 7600000000,
      imageUrl: 'https://bizweb.dktcdn.net/100/393/384/products/pd-7.jpg?v=1592473499520',
      bedrooms: 2,
      bathrooms: 2,
      area: 100,
      isHot: true,
      type: 'Cho thuê'
    },
    {
      id: '5',
      title: 'Biệt thự Ocen Luxury Lake North West Important Key Park',
      price: 25555000000,
      imageUrl: 'https://bizweb.dktcdn.net/100/393/384/products/pd-6.jpg?v=1592474395210',
      bedrooms: 2,
      bathrooms: 2,
      area: 200,
      isHot: true,
      type: 'Cho thuê'
    },
    {
      id: '6',
      title: 'Chung cư Lux Luxury Golden Glue Nam Từ Liêm',
      price: 550000000,
      imageUrl: 'https://bizweb.dktcdn.net/100/393/384/products/pd-28.jpg?v=1592539871247',
      bedrooms: 1,
      bathrooms: 1,
      area: 300,
      isHot: true,
      type: 'Cho thuê'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  formatPrice(price: number): string {
    if (price >= 1000000000) {
      return (price / 1000000000).toFixed(3) + ' Tỷ';
    }
    return (price / 1000000).toFixed(0) + ' Triệu';
  }
}
