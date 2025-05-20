import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-property-consignment',
  templateUrl: './property-consignment.component.html',
  styleUrls: ['./property-consignment.component.scss'],
})
export class PropertyConsignmentComponent implements OnInit {
  activeTab: 'rent' | 'sale' = 'rent';
  consignmentForm!: FormGroup;
  isSubmitting = false;
  errorMessage = {
    property: '',
  };

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm(): void {
    if (this.activeTab === 'sale') {
      this.consignmentForm = this.fb.group({
        ownerInfo: this.fb.group({
          fullName: ['', Validators.required],
          phone: ['', Validators.required],
          idNumber: [''],
        }),
        propertyInfo: this.fb.group({
          type: ['', Validators.required],
          otherType: [''],
          address: ['', Validators.required],
          area: ['', Validators.required],
          direction: [''],
          status: ['', Validators.required],
          otherStatus: [''],
        }),
        legalInfo: this.fb.group({
          legalStatus: ['', Validators.required],
          otherLegalStatus: [''],
        }),
        priceInfo: this.fb.group({
          price: ['', Validators.required],
          negotiable: [false],
          includeTax: [false],
          bankSupport: [false],
        }),
      });
    } else {
      this.consignmentForm = this.fb.group({
        ownerInfo: this.fb.group({
          fullName: ['', Validators.required],
          phone: ['', Validators.required],
          idNumber: [''],
        }),
        propertyInfo: this.fb.group({
          type: ['', Validators.required],
          otherType: [''],
          address: ['', Validators.required],
          area: ['', Validators.required],
          direction: [''],
          status: ['', Validators.required],
          otherStatus: [''],
          currentTenantDate: [''],
        }),
        rentalInfo: this.fb.group({
          price: ['', Validators.required],
          negotiable: [false],
          includedServices: this.fb.group({
            managementFee: [false],
            internet: [false],
            utilities: [false],
            parking: [false],
            other: [false],
            otherDetail: [''],
          }),
          deposit: [''],
          paymentTerm: [''],
          minContract: [''],
          availableDate: [''],
          suitableFor: this.fb.group({
            family: [false],
            worker: [false],
            student: [false],
            foreigner: [false],
            other: [false],
            otherDetail: [''],
          }),
        }),
      });
    }
  }

  switchTab(tab: 'rent' | 'sale'): void {
    this.activeTab = tab;
    this.initForm();
  }

  async onSubmit(): Promise<void> {
    if (this.consignmentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      try {
        if (this.activeTab === 'sale') {
          let formSale = new FormData();
          // Thông tin chủ sở hữu
          formSale.append(
            'entry.1635723793',
            this.consignmentForm.value.ownerInfo.fullName
          );
          formSale.append(
            'entry.1424673430',
            this.consignmentForm.value.ownerInfo.phone
          );
          formSale.append(
            'entry.939404085',
            this.consignmentForm.value.ownerInfo.idNumber || ''
          );

          // Thông tin bất động sản
          formSale.append(
            'entry.611152691',
            this.consignmentForm.value.propertyInfo.type
          );
          formSale.append(
            'entry.1256251643',
            this.consignmentForm.value.propertyInfo.address
          );
          formSale.append(
            'entry.1827142915',
            this.consignmentForm.value.propertyInfo.area?.toString() || ''
          );
          formSale.append(
            'entry.1113037031',
            this.consignmentForm.value.propertyInfo.direction || ''
          );
          formSale.append(
            'entry.235160783',
            this.consignmentForm.value.propertyInfo.status
          );

          // Thông tin pháp lý
          formSale.append(
            'entry.1960898952',
            this.consignmentForm.value.legalInfo.legalStatus
          );

          // Thông tin giá
          formSale.append(
            'entry.1731882114',
            this.consignmentForm.value.priceInfo.price?.toString() || ''
          );
          formSale.append(
            'entry.1055630953',
            this.consignmentForm.value.priceInfo.negotiable ? 'Có' : 'Không'
          );
          formSale.append(
            'entry.1457925246',
            this.consignmentForm.value.priceInfo.includeTax ? 'Có' : 'Không'
          );
          formSale.append(
            'entry.278178518',
            this.consignmentForm.value.priceInfo.bankSupport ? 'Có' : 'Không'
          );

          // Log form data trước khi gửi
          const formObject: any = {};
          formSale.forEach((value, key) => {
            formObject[key] = value;
          });
          console.log('Form Data:', formObject);

          // Chuyển đổi FormData sang URLSearchParams
          const params = new URLSearchParams();
          Object.keys(formObject).forEach(key => {
            params.append(key, formObject[key]);
          });

          this.http
            .post(
              'https://docs.google.com/forms/d/e/1FAIpQLScsU-6o1aWHhykPBSlK-lgEYU5hycthJ0INLiBOcxED0llGng/formResponse',
              params.toString(),
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              }
            )
            .subscribe({
              next: () => {
                this.isSubmitting = false;
                this.toastr.success(
                  'Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm.',
                  'Thành công'
                );
                this.resetForm();
              },
              error: (error) => {
                // Log lỗi để debug
                console.log('Error submitting form:', error);
                // Google Form luôn trả về lỗi CORS nhưng vẫn submit thành công
                this.isSubmitting = false;
                this.toastr.success(
                  'Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm.',
                  'Thành công'
                );
                this.resetForm();
              },
            });
        } else {
          let formRental = new FormData();

          // Thông tin chủ sở hữu
          formRental.append(
            'entry.1872208291',
            this.consignmentForm.value.ownerInfo.fullName
          );
          formRental.append(
            'entry.265642544',
            this.consignmentForm.value.ownerInfo.phone
          );
          formRental.append(
            'entry.1930890191',
            this.consignmentForm.value.ownerInfo.idNumber || ''
          );

          formRental.append(
            'entry.1423023952',
            this.consignmentForm.value.propertyInfo.address
          );

          formRental.append(
            'entry.1924185432',
            this.consignmentForm.value.propertyInfo.area?.toString() || ''
          );

          formRental.append(
            'entry.276637145',
            this.consignmentForm.value.propertyInfo.direction || ''
          );

          formRental.append(
            'entry.1283114364',
            this.consignmentForm.value.rentalInfo.price?.toString() || ''
          );

          formRental.append(
            'entry.1339050242',
            this.consignmentForm.value.rentalInfo.deposit?.toString() || ''
          );

          formRental.append(
            'entry.481922095',
            this.consignmentForm.value.rentalInfo.paymentTerm?.toString() || ''
          );

          formRental.append(
            'entry.915905266',
            this.consignmentForm.value.rentalInfo.minContract?.toString() || ''
          );

          // Ngày bàn giao
          const availableDate = this.consignmentForm.value.rentalInfo.availableDate;
          if (availableDate) {
            const date = new Date(availableDate);
            formRental.append('entry.527403809_year', date.getFullYear().toString());
            formRental.append('entry.527403809_month', (date.getMonth() + 1).toString());
            formRental.append('entry.527403809_day', date.getDate().toString());
          } else {
            formRental.append('entry.527403809_year', '');
            formRental.append('entry.527403809_month', '');
            formRental.append('entry.527403809_day', '');
          }

          formRental.append(
            'entry.924791401',
            this.consignmentForm.value.propertyInfo.type
          );

          formRental.append(
            'entry.1526042079',
            this.consignmentForm.value.propertyInfo.status
          );

          formRental.append(
            'entry.494766771',
            this.consignmentForm.value.rentalInfo.negotiable ? 'Có' : 'Không'
          );

          const includedServices = this.consignmentForm.value.rentalInfo.includedServices;
          if (includedServices) {
            if (includedServices.managementFee) {
              formRental.append('entry.1020586234', 'Phí quản lý');
            }
            if (includedServices.internet) {
              formRental.append('entry.1020586234', 'Internet');
            }
            if (includedServices.utilities) {
              formRental.append('entry.1020586234', 'Điện/nước');
            }
            if (includedServices.parking) {
              formRental.append('entry.1020586234', 'Gửi xe');
            }
            if (includedServices.other && includedServices.otherDetail) {
              formRental.append('entry.1020586234', includedServices.otherDetail);
            }
          }

          // Đối tượng phù hợp
          const suitableFor = this.consignmentForm.value.rentalInfo.suitableFor;
          if (suitableFor) {
            if (suitableFor.family) {
              formRental.append('entry.1205154710', 'Gia đình');
            }
            if (suitableFor.worker) {
              formRental.append('entry.1205154710', 'Người đi làm');
            }
            if (suitableFor.student) {
              formRental.append('entry.1205154710', 'Sinh viên');
            }
            if (suitableFor.foreigner) {
              formRental.append('entry.1205154710', 'Người nước ngoài');
            }
            if (suitableFor.other && suitableFor.otherDetail) {
              formRental.append('entry.1205154710', suitableFor.otherDetail);
            }
          }

          // Log form data trước khi gửi
          const formObject: any = {};
          formRental.forEach((value, key) => {
            formObject[key] = value;
          });
          console.log('Form Data:', formObject);

          // Chuyển đổi FormData sang URLSearchParams
          const params = new URLSearchParams();
          Object.keys(formObject).forEach(key => {
            params.append(key, formObject[key]);
          });

          this.http
            .post(
              'https://docs.google.com/forms/d/e/1FAIpQLSfoJrcqHJ46uqgEg_RqTbxWsSIzXr0Ff77FShraiMJeVSxmrA/formResponse',
              params.toString(),
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              }
            )
            .subscribe({
              next: () => {
                this.isSubmitting = false;
                this.toastr.success(
                  'Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm.',
                  'Thành công'
                );
                this.resetForm();
              },
              error: () => {
                // Google Form luôn trả về lỗi CORS nhưng vẫn submit thành công
                this.isSubmitting = false;
                this.toastr.success(
                  'Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm.',
                  'Thành công'
                );
                this.resetForm();
              },
            });
        }
      } finally {
        this.isSubmitting = false;
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.consignmentForm.controls).forEach((key) => {
        const control = this.consignmentForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      this.toastr.error('Vui lòng điền đầy đủ thông tin bắt buộc');
    }
  }

  private resetForm(): void {
    this.consignmentForm.reset();
    this.errorMessage = { property: '' };
    this.isSubmitting = false;
  }
}
