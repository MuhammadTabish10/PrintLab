import { TestBed } from '@angular/core/testing';

import { OrderPaymentHistoryService } from './order-payment-history.service';

describe('OrderPaymentHistoryService', () => {
  let service: OrderPaymentHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderPaymentHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
