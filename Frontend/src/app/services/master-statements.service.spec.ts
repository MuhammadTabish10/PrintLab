import { TestBed } from '@angular/core/testing';

import { MasterStatementsService } from './master-statements.service';

describe('MasterStatementsService', () => {
  let service: MasterStatementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterStatementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
