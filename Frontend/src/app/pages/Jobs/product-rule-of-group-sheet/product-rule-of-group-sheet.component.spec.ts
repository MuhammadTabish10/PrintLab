import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRuleOfGroupSheetComponent } from './product-rule-of-group-sheet.component';

describe('ProductRuleOfGroupSheetComponent', () => {
  let component: ProductRuleOfGroupSheetComponent;
  let fixture: ComponentFixture<ProductRuleOfGroupSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductRuleOfGroupSheetComponent]
    });
    fixture = TestBed.createComponent(ProductRuleOfGroupSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
