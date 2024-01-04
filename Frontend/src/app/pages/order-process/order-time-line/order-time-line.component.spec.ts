import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTimeLineComponent } from './order-time-line.component';

describe('OrderTimeLineComponent', () => {
  let component: OrderTimeLineComponent;
  let fixture: ComponentFixture<OrderTimeLineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderTimeLineComponent]
    });
    fixture = TestBed.createComponent(OrderTimeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
