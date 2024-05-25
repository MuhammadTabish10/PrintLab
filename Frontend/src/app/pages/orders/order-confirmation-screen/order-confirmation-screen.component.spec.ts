import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmationScreenComponent } from './order-confirmation-screen.component';

describe('OrderConfirmationScreenComponent', () => {
  let component: OrderConfirmationScreenComponent;
  let fixture: ComponentFixture<OrderConfirmationScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderConfirmationScreenComponent]
    });
    fixture = TestBed.createComponent(OrderConfirmationScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
