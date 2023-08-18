import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDefintionComponent } from './product-defintion.component';

describe('ProductDefintionComponent', () => {
  let component: ProductDefintionComponent;
  let fixture: ComponentFixture<ProductDefintionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDefintionComponent]
    });
    fixture = TestBed.createComponent(ProductDefintionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
