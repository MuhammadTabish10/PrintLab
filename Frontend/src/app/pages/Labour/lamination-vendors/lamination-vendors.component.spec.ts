import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaminationVendorsComponent } from './lamination-vendors.component';

describe('LaminationVendorsComponent', () => {
  let component: LaminationVendorsComponent;
  let fixture: ComponentFixture<LaminationVendorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LaminationVendorsComponent]
    });
    fixture = TestBed.createComponent(LaminationVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
