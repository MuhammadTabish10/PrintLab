import { TestBed } from '@angular/core/testing';

import { PressMachineService } from './press-machine.service';

describe('PressMachineService', () => {
  let service: PressMachineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PressMachineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
