import { TestBed } from '@angular/core/testing';

import { OrderProcessService } from './order-process.service';

describe('OrderProcessService', () => {
  let service: OrderProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
