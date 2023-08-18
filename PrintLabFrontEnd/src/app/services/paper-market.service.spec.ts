import { TestBed } from '@angular/core/testing';

import { PaperMarketService } from './paper-market.service';

describe('PaperMarketService', () => {
  let service: PaperMarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaperMarketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
