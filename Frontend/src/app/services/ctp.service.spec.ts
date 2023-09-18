import { TestBed } from '@angular/core/testing';

import { CtpService } from './ctp.service';

describe('CtpService', () => {
  let service: CtpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CtpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
