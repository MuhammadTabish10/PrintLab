import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductDefintionComponent } from './add-product-defintion.component';

describe('AddProductDefintionComponent', () => {
  let component: AddProductDefintionComponent;
  let fixture: ComponentFixture<AddProductDefintionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProductDefintionComponent]
    });
    fixture = TestBed.createComponent(AddProductDefintionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
