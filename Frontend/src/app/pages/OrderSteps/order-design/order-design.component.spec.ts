import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDesignComponent } from './order-design.component';

describe('OrderDesignComponent', () => {
  let component: OrderDesignComponent;
  let fixture: ComponentFixture<OrderDesignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDesignComponent]
    });
    fixture = TestBed.createComponent(OrderDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
