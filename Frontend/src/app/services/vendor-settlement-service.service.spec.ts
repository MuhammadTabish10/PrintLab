import { TestBed } from '@angular/core/testing';

import { VendorSettlementServiceService } from './vendor-settlement-service.service';

describe('VendorSettlementServiceService', () => {
  let service: VendorSettlementServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorSettlementServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
