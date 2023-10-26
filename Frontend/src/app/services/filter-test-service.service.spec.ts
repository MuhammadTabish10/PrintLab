import { TestBed } from '@angular/core/testing';

import { FilterTestServiceService } from './filter-test-service.service';

describe('FilterTestServiceService', () => {
  let service: FilterTestServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterTestServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
