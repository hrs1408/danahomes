import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InformationService, CompanyInformation } from '../../services/information.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  @Input() byModal = false;
  companyInfo: CompanyInformation | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private informationService: InformationService
  ) {
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      address: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      content: ['', Validators.required],
      productLink: ['']
    });
  }

  ngOnInit(): void {
    this.loadCompanyInfo();
  }

  private loadCompanyInfo(): void {
    this.informationService.getInformation().subscribe({
      next: (response) => {
        if (!response.meta.error) {
          this.companyInfo = response.data;
        }
      },
      error: (error) => {
        console.error('Lỗi khi tải thông tin công ty:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formData = new FormData();

      // Map form fields to Google Form fields với entry ID chính xác
      formData.append('entry.1348537145', this.contactForm.value.fullName);
      formData.append('entry.338049320', this.contactForm.value.address || '');
      formData.append('entry.2018706474', this.contactForm.value.phone);
      formData.append('entry.351127077', this.contactForm.value.email || '');
      formData.append('entry.1731357089', this.contactForm.value.content);
      formData.append('entry.165271468', this.contactForm.value.productLink || '');

      // Gửi form đến Google Forms
      this.http
        .post(
          'https://docs.google.com/forms/d/e/1FAIpQLSfJWW50QDcK6S2SCn8EWAKhRlHMeg91k-ZDQsap7Wp3bF84XQ/formResponse',
          formData
        )
        .subscribe({
          next: () => {
            this.isSubmitting = false;
            this.toastr.success('Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm.', 'Thành công');
            this.contactForm.reset();
          },
          error: () => {
            // Google Form luôn trả về lỗi CORS nhưng vẫn submit thành công
            this.isSubmitting = false;
            this.toastr.success('Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm.', 'Thành công');
            this.contactForm.reset();
          }
        });
    } else {
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      this.toastr.error('Vui lòng điền đầy đủ thông tin bắt buộc');
    }
  }
}
