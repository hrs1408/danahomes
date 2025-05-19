import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleFormService {
  private readonly RENTAL_FORM_ID = '1FAIpQLSfoJrcqHJ46uqgEg_RqTbxWsSIzXr0Ff77FShraiMJeVSxmrA';
  private readonly SALE_FORM_ID = '1FAIpQLScsU-6o1aWHhykPBSlK-lgEYU5hycthJ0INLiBOcxED0llGng';
  private readonly FORM_BASE_URL = 'https://docs.google.com/forms/d/e';

  // Thông tin tài khoản cố định
  private readonly FIXED_USER = {
    email: 'danahomescompany@gmail.com',
    name: 'Dana Homes',
    id: 'danahomes_fixed_user'
  };

  constructor(private http: HttpClient) {}

  getFixedUser() {
    return this.FIXED_USER;
  }

  submitRentalForm(formData: any): Observable<any> {
    const formUrl = `${this.FORM_BASE_URL}/${this.RENTAL_FORM_ID}/formResponse`;
    const params = this.buildRentalFormParams(formData);
    return this.submitForm(formUrl, params);
  }

  submitSaleForm(formData: any): Observable<any> {
    const formUrl = `${this.FORM_BASE_URL}/${this.SALE_FORM_ID}/formResponse`;
    const params = this.buildSaleFormParams(formData);
    return this.submitForm(formUrl, params);
  }

  private buildRentalFormParams(formData: any): URLSearchParams {
    const params = new URLSearchParams();

    // TODO: Cập nhật các entry ID thực tế sau khi có
    const ownerInfo = formData.ownerInfo;
    const propertyInfo = formData.propertyInfo;
    const rentalInfo = formData.rentalInfo;

    // Thông tin chủ sở hữu
    params.append('entry.1872208291', ownerInfo.fullName);
    params.append('entry.265642544', ownerInfo.phone);
    params.append('entry.1930890191', ownerInfo.idNumber);

    // Thông tin bất động sản
    params.append('entry.924791401', propertyInfo.type);
    params.append('entry.1423023952', propertyInfo.address);
    params.append('entry.1924185432', propertyInfo.area);
    params.append('entry.276637145', propertyInfo.direction);
    params.append('entry.1526042079', propertyInfo.status);

    // Thông tin cho thuê
    params.append('entry.1283114364', rentalInfo.price);
    params.append('entry.1339050242', rentalInfo.deposit);
    params.append('entry.481922095', rentalInfo.paymentTerm);
    params.append('entry.915905266', rentalInfo.minContract);

    // Dịch vụ bao gồm
    const includedServices = rentalInfo.includedServices;
    let includedServicesData = '';
    if (includedServices.managementFee) includedServicesData = includedServicesData + 'Phí quản lý';
    if (includedServices.internet) includedServicesData = includedServicesData + 'Internet';
    if (includedServices.utilities) includedServicesData = includedServicesData + 'Điện/nước';
    if (includedServices.parking) includedServicesData = includedServicesData + 'Gửi xe';
    params.append('entry.1020586234', includedServicesData);

    // Đối tượng phù hợp
    const suitableFor = rentalInfo.suitableFor;
    let suitableForData = '';
    if (suitableFor.family) suitableForData = suitableForData + 'Gia đình';
    if (suitableFor.worker) suitableForData = suitableForData + 'Người đi làm';
    if (suitableFor.student) suitableForData = suitableForData + 'Sinh viên';
    if (suitableFor.foreigner) suitableForData = suitableForData + 'Người nước ngoài';
    params.append('entry.1205154710', suitableForData);

    //Thời gian bàn giao
    params.append('entry.527403809', rentalInfo.deliveryTime);

    //Ảnh
    formData.propertyImages.forEach((image: string) => {
      params.append('entry.1491533249', image);
    });

    return params;
  }

  private buildSaleFormParams(formData: any): URLSearchParams {
    const params = new URLSearchParams();

    // Thông tin chủ sở hữu
    params.append('entry.1361929624', formData.ownerInfo.fullName);
    params.append('entry.1424673430', formData.ownerInfo.phone);
    params.append('entry.939404085', formData.ownerInfo.idNumber);

    // Thông tin bất động sản
    params.append('entry.611152691', formData.propertyInfo.type);
    params.append('entry.1256251643', formData.propertyInfo.address);
    params.append('entry.1827142915', formData.propertyInfo.area);
    params.append('entry.1113037031', formData.propertyInfo.direction);
    params.append('entry.235160783', formData.propertyInfo.status);

    // Thông tin pháp lý
    params.append('entry.1960898952', formData.legalInfo.legalStatus);

    // Thông tin giá
    params.append('entry.1731882114', formData.priceInfo.price);
    if (formData.priceInfo.negotiable) {
      params.append('entry.1055630953', 'Có')
    } else {
      params.append('entry.1055630953', 'Không')
    }
    if (formData.priceInfo.includeTax) {
      params.append('entry.1457925246', 'Có')
    } else {
      params.append('entry.1457925246', 'Không')
    }
    if (formData.priceInfo.bankSupport) {
      params.append('entry.278178518', 'Có')
    } else {
      params.append('entry.278178518', 'Không')
    }

    // Ảnh sổ đỏ
    params.append('entry.1370464141', formData.redBookImage);

    // Ảnh bất động sản
    formData.propertyImages.forEach((image: string) => {
      params.append('entry.490111735', image);
    });

    return params;
  }

  private submitForm(url: string, params: URLSearchParams): Observable<any> {
    return this.http.post(url, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
}
