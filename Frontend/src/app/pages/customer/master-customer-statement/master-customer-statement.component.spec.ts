import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterCustomerStatementComponent } from './master-customer-statement.component';

describe('MasterCustomerStatementComponent', () => {
  let component: MasterCustomerStatementComponent;
  let fixture: ComponentFixture<MasterCustomerStatementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MasterCustomerStatementComponent]
    });
    fixture = TestBed.createComponent(MasterCustomerStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
