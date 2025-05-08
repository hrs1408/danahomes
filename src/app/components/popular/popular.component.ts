import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Project } from '../../interfaces/project.interface';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrl: './popular.component.scss'
})
export class PopularComponent implements AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  swiper?: Swiper;

  popularProjects: Project[] = [
    {
      id: 1,
      title: 'Căn hộ Star Wish PentHouse',
      description: 'Khác hẳn với các căn hộ chung cư tầng áp mái thông thường, các căn hộ penthouse thường có diện tích lớn và khoảng sân vườn rộng rãi, góc nhìn thoáng rộng để thể hiện đẳng cấp của một căn hộ cao cấp. Penthouse sẽ được thiết kế riêng khác với các căn hộ chung cư trong cùng tòa nhà để đáp ứng tiêu chí xa hoa, sang trọng',
      location: '15 Long Biên, Hà Nội',
      bedrooms: 1,
      bathrooms: 1,
      area: 50,
      price: 15450000000,
      imageUrl: 'https://bizweb.dktcdn.net/100/393/384/products/pd-34.jpg?v=1592542128423',
      isHot: true,
      type: 'rent'
    },
    {
      id: 2,
      title: 'Biệt thự Vinhomes Ocean Park',
      description: 'Biệt thự view biển nhân tạo đầu tiên tại Hà Nội, thiết kế hiện đại sang trọng',
      location: 'Gia Lâm, Hà Nội',
      bedrooms: 4,
      bathrooms: 5,
      area: 300,
      price: 25000000000,
      imageUrl: 'https://bizweb.dktcdn.net/100/393/384/products/pd-36.jpg?v=1592542130197',
      isHot: true,
      type: 'sale'
    },
    {
      id: 3,
      title: 'Căn hộ The Manor Central Park',
      description: 'Căn hộ cao cấp view công viên trung tâm, nội thất cao cấp',
      location: 'Hoàng Mai, Hà Nội',
      bedrooms: 3,
      bathrooms: 2,
      area: 110,
      price: 8500000000,
      imageUrl: 'https://bizweb.dktcdn.net/100/393/384/products/pd-35.jpg?v=1592542129693',
      isHot: true,
      type: 'rent'
    }
  ];

  ngAfterViewInit() {
    this.initSwiper();
  }

  private initSwiper() {
    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  formatPrice(price: number): string {
    if (price >= 1000000000) {
      return (price / 1000000000).toFixed(2) + ' tỷ';
    } else if (price >= 1000000) {
      return (price / 1000000).toFixed(0) + ' triệu';
    }
    return price.toString();
  }
}
