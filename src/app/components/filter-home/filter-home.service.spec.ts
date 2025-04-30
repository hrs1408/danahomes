import { TestBed } from '@angular/core/testing';

import { FilterHomeService } from './filter-home.service';

describe('FilterHomeService', () => {
  let service: FilterHomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterHomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
