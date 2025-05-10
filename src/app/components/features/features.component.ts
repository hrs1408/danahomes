import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {
  features = [
    {
      icon: 'search',
      title: 'Tìm kiếm thông tin dễ dàng',
      description: 'Không ngừng phát triển mạnh mẽ các hoạt động đầu tư xây dựng để nhanh chóng trở thành một trong những tập đoàn phát triển bất động sản hàng đầu'
    },
    {
      icon: 'gift',
      title: 'Đảm bảo quyền lợi khách hàng',
      description: 'Trải qua chặng đường 17 năm phát triển, batdongsan.vn đã trở thành một trong những chủ đầu tư mang lại đầu án với sản phẩm đa dạng đáp ứng nhu cầu của thị trường'
    },
    {
      icon: 'stopwatch',
      title: 'Tiết kiệm thời gian và chi phí',
      description: 'Tất cả các giải pháp mà batdongsan.vn cung cấp đều được phân tích một cách chuyên sâu, hướng đến phục vụ và giải quyết những vướng mắc một cách nhanh chóng như cầu của khách hàng'
    }
  ];
}
