import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleFormService } from '../../services/google-form.service';

interface ImageFile {
  file: File;
  preview: string;
  size: number;
}

@Component({
  selector: 'app-property-consignment',
  templateUrl: './property-consignment.component.html',
  styleUrls: ['./property-consignment.component.scss']
})
export class PropertyConsignmentComponent implements OnInit {
  activeTab: 'rent' | 'sale' = 'rent';
  consignmentForm!: FormGroup;

  // Ảnh sổ đỏ
  redBookImages: ImageFile[] = [];
  maxRedBookImages = 1;
  maxRedBookFileSize = 10 * 1024 * 1024; // 10MB

  // Ảnh bất động sản
  propertyImages: ImageFile[] = [];
  maxPropertyImages = 10;
  maxPropertyFileSize = 1 * 1024 * 1024; // 1MB

  isDragging = false;
  dragTarget: 'redBook' | 'property' | null = null;
  isLoading = false;
  errorMessage = {
    redBook: '',
    property: ''
  };

  constructor(
    private fb: FormBuilder,
    private googleFormService: GoogleFormService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Không cần xử lý đăng nhập nữa
  }

  private initForm(): void {
    if (this.activeTab === 'sale') {
      this.consignmentForm = this.fb.group({
        ownerInfo: this.fb.group({
          fullName: ['', Validators.required],
          phone: ['', Validators.required],
          idNumber: ['']
        }),
        propertyInfo: this.fb.group({
          type: ['', Validators.required],
          otherType: [''],
          address: ['', Validators.required],
          area: ['', Validators.required],
          direction: [''],
          status: ['', Validators.required],
          otherStatus: ['']
        }),
        legalInfo: this.fb.group({
          legalStatus: ['', Validators.required],
          otherLegalStatus: ['']
        }),
        priceInfo: this.fb.group({
          price: ['', Validators.required],
          negotiable: [false],
          includeTax: [false],
          bankSupport: [false]
        })
      });
    } else {
      this.consignmentForm = this.fb.group({
        ownerInfo: this.fb.group({
          fullName: ['', Validators.required],
          phone: ['', Validators.required],
          idNumber: ['']
        }),
        propertyInfo: this.fb.group({
          type: ['', Validators.required],
          otherType: [''],
          address: ['', Validators.required],
          area: ['', Validators.required],
          direction: [''],
          status: ['', Validators.required],
          otherStatus: [''],
          currentTenantDate: ['']
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
            otherDetail: ['']
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
            otherDetail: ['']
          })
        })
      });
    }
  }

  switchTab(tab: 'rent' | 'sale'): void {
    this.activeTab = tab;
    this.initForm();
  }

  private validateFile(file: File, maxSize: number): string | null {
    if (!file.type.startsWith('image/')) {
      return 'Chỉ chấp nhận file ảnh';
    }
    if (file.size > maxSize) {
      return `Kích thước file không được vượt quá ${maxSize / (1024 * 1024)}MB`;
    }
    return null;
  }

  private async processFiles(files: File[], type: 'redBook' | 'property'): Promise<void> {
    const targetArray = type === 'redBook' ? this.redBookImages : this.propertyImages;
    const maxImages = type === 'redBook' ? this.maxRedBookImages : this.maxPropertyImages;
    const maxFileSize = type === 'redBook' ? this.maxRedBookFileSize : this.maxPropertyFileSize;

    if (targetArray.length >= maxImages) {
      this.errorMessage[type] = `Chỉ được tải lên tối đa ${maxImages} ảnh`;
      return;
    }

    const remainingSlots = maxImages - targetArray.length;
    const validFiles = files.slice(0, remainingSlots);

    for (const file of validFiles) {
      const error = this.validateFile(file, maxFileSize);
      if (error) {
        this.errorMessage[type] = error;
        continue;
      }

      try {
        const preview = await this.getBase64(file);
        targetArray.push({
          file,
          preview,
          size: file.size
        });
        this.errorMessage[type] = '';
      } catch (error) {
        console.error('Error processing file:', error);
        this.errorMessage[type] = 'Lỗi xử lý file ảnh';
      }
    }
  }

  onFileSelected(event: Event, type: 'redBook' | 'property'): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(Array.from(input.files), type);
    }
  }

  onDragOver(event: DragEvent, type: 'redBook' | 'property'): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
    this.dragTarget = type;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    this.dragTarget = null;
  }

  onDrop(event: DragEvent, type: 'redBook' | 'property'): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    this.dragTarget = null;

    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(Array.from(files), type);
    }
  }

  removeImage(index: number, type: 'redBook' | 'property'): void {
    if (type === 'redBook') {
      this.redBookImages.splice(index, 1);
      this.errorMessage.redBook = '';
    } else {
      this.propertyImages.splice(index, 1);
      this.errorMessage.property = '';
    }
  }

  private getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  async onSubmit(): Promise<void> {
    if (this.consignmentForm.valid) {
      if (this.activeTab === 'sale') {
        // Validate images for sale form
        if (this.redBookImages.length === 0) {
          this.errorMessage.redBook = 'Vui lòng tải lên ảnh sổ đỏ';
          return;
        }
        if (this.propertyImages.length === 0) {
          this.errorMessage.property = 'Vui lòng tải lên ít nhất 1 ảnh bất động sản';
          return;
        }
      }

      this.isLoading = true;
      try {
        const formData = {
          ...this.consignmentForm.value,
          userInfo: this.googleFormService.getFixedUser() // Thêm thông tin người dùng cố định
        };

        if (this.activeTab === 'sale') {
          // Process images for sale form
          const redBookImage = await this.getBase64(this.redBookImages[0].file);
          const propertyImagePromises = this.propertyImages.map(async (img) => {
            const base64 = await this.getBase64(img.file);
            return this.compressBase64Image(base64, 1200);
          });

          formData.redBookImage = redBookImage;
          formData.propertyImages = await Promise.all(propertyImagePromises);

          this.googleFormService.submitSaleForm(formData).subscribe({
            next: (response) => {
              console.log('Form submitted successfully:', response);
              this.resetForm();
            },
            error: (error) => {
              console.error('Form submission error:', error);
              this.errorMessage.property = 'Có lỗi xảy ra khi gửi form. Vui lòng thử lại sau.';
            }
          });
        } else {
          // Process rental form submission
          const propertyImagePromises = this.propertyImages.map(async (img) => {
            const base64 = await this.getBase64(img.file);
            return this.compressBase64Image(base64, 1200);
          });

          formData.propertyImages = await Promise.all(propertyImagePromises);

          this.googleFormService.submitRentalForm(formData).subscribe({
            next: (response) => {
              console.log('Form submitted successfully:', response);
              this.resetForm();
            },
            error: (error) => {
              console.error('Form submission error:', error);
              this.errorMessage.property = 'Có lỗi xảy ra khi gửi form. Vui lòng thử lại sau.';
            }
          });
        }
      } finally {
        this.isLoading = false;
      }
    }
  }

  private resetForm(): void {
    this.consignmentForm.reset();
    this.redBookImages = [];
    this.propertyImages = [];
    this.errorMessage = { redBook: '', property: '' };
  }

  private async compressBase64Image(base64: string, maxDimension: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  }
}
