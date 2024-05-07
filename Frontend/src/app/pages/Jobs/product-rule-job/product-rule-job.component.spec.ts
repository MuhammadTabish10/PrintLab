import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRuleJobComponent } from './product-rule-job.component';

describe('ProductRuleJobComponent', () => {
  let component: ProductRuleJobComponent;
  let fixture: ComponentFixture<ProductRuleJobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductRuleJobComponent]
    });
    fixture = TestBed.createComponent(ProductRuleJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
