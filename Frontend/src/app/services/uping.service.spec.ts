import { TestBed } from '@angular/core/testing';

import { UpingService } from './uping.service';

describe('UpingService', () => {
  let service: UpingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
