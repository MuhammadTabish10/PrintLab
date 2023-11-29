import { TestBed } from '@angular/core/testing';

import { VendorSettlementService } from './vendor-settlement.service';

describe('VendorSettlementService', () => {
  let service: VendorSettlementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorSettlementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
