import { TestBed } from '@angular/core/testing';

import { ProductProcessService } from './product-process.service';

describe('ProductProcessService', () => {
  let service: ProductProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
