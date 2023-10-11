import { TestBed } from '@angular/core/testing';

import { PaperStockService } from './paper-stock.service';

describe('PaperStockService', () => {
  let service: PaperStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaperStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
