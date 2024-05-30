import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStepperComponent } from './customer-stepper.component';

describe('CustomerStepperComponent', () => {
  let component: CustomerStepperComponent;
  let fixture: ComponentFixture<CustomerStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerStepperComponent]
    });
    fixture = TestBed.createComponent(CustomerStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
