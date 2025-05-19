import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ImageFile {
  file: File;
  preview: string;
}

@Component({
  selector: 'app-property-consignment',
  templateUrl: './property-consignment.component.html',
  styleUrls: ['./property-consignment.component.scss']
})
export class PropertyConsignmentComponent implements OnInit {
  activeTab: 'rent' | 'sale' = 'rent';
  consignmentForm!: FormGroup;

  // Thêm các thuộc tính xử lý ảnh
  images: ImageFile[] = [];
  maxImages = 10;
  isDragging = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}

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
          hasRedBook: [false],
          noRedBook: [false],
          mortgaged: [false],
          coOwnership: [false]
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

  // Thêm các phương thức xử lý ảnh
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(Array.from(input.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(Array.from(files));
    }
  }

  private processFiles(files: File[]): void {
    const remainingSlots = this.maxImages - this.images.length;
    const validFiles = files.slice(0, remainingSlots)
      .filter(file => file.type.startsWith('image/'));

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.images.push({
          file: file,
          preview: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }

  onSubmit(): void {
    if (this.consignmentForm.valid) {
      const formData = new FormData();

      // Thêm dữ liệu form
      Object.keys(this.consignmentForm.value).forEach(key => {
        formData.append(key, JSON.stringify(this.consignmentForm.value[key]));
      });

      // Thêm files ảnh
      this.images.forEach((image, index) => {
        formData.append(`image${index}`, image.file);
      });

      console.log('Form data ready to submit:', formData);
      // TODO: Submit to Google Form
    }
  }
}
