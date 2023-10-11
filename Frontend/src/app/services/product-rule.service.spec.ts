import { TestBed } from '@angular/core/testing';

import { ProductRuleService } from './product-rule.service';

describe('ProductRuleService', () => {
  let service: ProductRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
