import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterHomeComponent } from './filter-home.component';

describe('FilterHomeComponent', () => {
  let component: FilterHomeComponent;
  let fixture: ComponentFixture<FilterHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
