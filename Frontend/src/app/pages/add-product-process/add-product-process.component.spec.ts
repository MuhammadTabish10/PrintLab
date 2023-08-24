import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductProcessComponent } from './add-product-process.component';

describe('AddProductProcessComponent', () => {
  let component: AddProductProcessComponent;
  let fixture: ComponentFixture<AddProductProcessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProductProcessComponent]
    });
    fixture = TestBed.createComponent(AddProductProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
