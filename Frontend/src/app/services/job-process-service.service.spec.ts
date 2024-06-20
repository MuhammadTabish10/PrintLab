import { TestBed } from '@angular/core/testing';

import { JobProcessServiceService } from './job-process-service.service';

describe('JobProcessServiceService', () => {
  let service: JobProcessServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobProcessServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
