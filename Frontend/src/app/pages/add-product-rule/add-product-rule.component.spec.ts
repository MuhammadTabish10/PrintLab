import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductRuleComponent } from './add-product-rule.component';

describe('AddProductRuleComponent', () => {
  let component: AddProductRuleComponent;
  let fixture: ComponentFixture<AddProductRuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProductRuleComponent]
    });
    fixture = TestBed.createComponent(AddProductRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
