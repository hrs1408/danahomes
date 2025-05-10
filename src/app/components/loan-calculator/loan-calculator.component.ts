import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: {
    month: number;
    remainingPrincipal: number;
    monthlyPayment: number;
    principal: number;
    interest: number;
    totalPaid: number;
  }[];
}

@Component({
  selector: 'app-loan-calculator',
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.scss']
})
export class LoanCalculatorComponent implements OnInit {
  loanForm: FormGroup;
  result: LoanResult | null = null;
  showSchedule = false;

  constructor(private fb: FormBuilder) {
    this.loanForm = this.fb.group({
      loanAmount: ['', [Validators.required, Validators.min(1000000)]],
      loanTerm: ['', [Validators.required, Validators.min(1), Validators.max(360)]],
      interestRate: ['', [Validators.required, Validators.min(0.1), Validators.max(20)]]
    });
  }

  ngOnInit(): void {
    // Giá trị mặc định
    this.loanForm.patchValue({
      loanAmount: 1000000000,
      loanTerm: 240,
      interestRate: 8.5
    });
    this.calculateLoan();
  }

  calculateLoan(): void {
    if (this.loanForm.invalid) return;

    const loanAmount = this.loanForm.value.loanAmount;
    const loanTerm = this.loanForm.value.loanTerm;
    const annualInterestRate = this.loanForm.value.interestRate;
    const monthlyInterestRate = annualInterestRate / 12 / 100;

    // Tính PMT (Khoản thanh toán hàng tháng)
    const monthlyPayment = this.calculateMonthlyPayment(loanAmount, monthlyInterestRate, loanTerm);
    const totalPayment = monthlyPayment * loanTerm;
    const totalInterest = totalPayment - loanAmount;

    // Tính lịch trả nợ
    const schedule = this.calculateAmortizationSchedule(
      loanAmount,
      monthlyInterestRate,
      loanTerm,
      monthlyPayment
    );

    this.result = {
      monthlyPayment,
      totalPayment,
      totalInterest,
      schedule
    };
  }

  private calculateMonthlyPayment(principal: number, monthlyRate: number, term: number): number {
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) /
      (Math.pow(1 + monthlyRate, term) - 1)
    );
  }

  private calculateAmortizationSchedule(
    principal: number,
    monthlyRate: number,
    term: number,
    monthlyPayment: number
  ) {
    let remainingPrincipal = principal;
    const schedule = [];
    let totalPaid = 0;

    for (let month = 1; month <= term; month++) {
      const interest = remainingPrincipal * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      remainingPrincipal -= principalPaid;
      totalPaid += monthlyPayment;

      schedule.push({
        month,
        remainingPrincipal: Math.max(0, remainingPrincipal),
        monthlyPayment,
        principal: principalPaid,
        interest,
        totalPaid
      });
    }

    return schedule;
  }

  toggleSchedule(): void {
    this.showSchedule = !this.showSchedule;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatPercent(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  }
}
