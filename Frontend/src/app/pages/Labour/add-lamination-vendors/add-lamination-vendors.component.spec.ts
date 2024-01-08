import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLaminationVendorsComponent } from './add-lamination-vendors.component';

describe('AddLaminationVendorsComponent', () => {
  let component: AddLaminationVendorsComponent;
  let fixture: ComponentFixture<AddLaminationVendorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLaminationVendorsComponent]
    });
    fixture = TestBed.createComponent(AddLaminationVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
