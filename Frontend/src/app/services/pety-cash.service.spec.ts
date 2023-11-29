import { TestBed } from '@angular/core/testing';

import { PetyCashService } from './pety-cash.service';

describe('PetyCashService', () => {
  let service: PetyCashService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetyCashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
