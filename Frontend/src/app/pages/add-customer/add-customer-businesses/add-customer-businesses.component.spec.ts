import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerBusinessesComponent } from './add-customer-businesses.component';

describe('AddCustomerBusinessesComponent', () => {
  let component: AddCustomerBusinessesComponent;
  let fixture: ComponentFixture<AddCustomerBusinessesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCustomerBusinessesComponent]
    });
    fixture = TestBed.createComponent(AddCustomerBusinessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
