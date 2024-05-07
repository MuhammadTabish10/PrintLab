import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineProductRuleManualComponent } from './define-product-rule-manual.component';

describe('DefineProductRuleManualComponent', () => {
  let component: DefineProductRuleManualComponent;
  let fixture: ComponentFixture<DefineProductRuleManualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefineProductRuleManualComponent]
    });
    fixture = TestBed.createComponent(DefineProductRuleManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
