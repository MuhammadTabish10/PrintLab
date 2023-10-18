import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductRuleComponent } from './view-product-rule.component';

describe('ViewProductRuleComponent', () => {
  let component: ViewProductRuleComponent;
  let fixture: ComponentFixture<ViewProductRuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProductRuleComponent]
    });
    fixture = TestBed.createComponent(ViewProductRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
