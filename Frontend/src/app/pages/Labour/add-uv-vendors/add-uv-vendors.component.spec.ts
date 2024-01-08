import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUvVendorsComponent } from './add-uv-vendors.component';

describe('AddUvVendorsComponent', () => {
  let component: AddUvVendorsComponent;
  let fixture: ComponentFixture<AddUvVendorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUvVendorsComponent]
    });
    fixture = TestBed.createComponent(AddUvVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
