import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetUvVendorsComponent } from './get-uv-vendors.component';

describe('GetUvVendorsComponent', () => {
  let component: GetUvVendorsComponent;
  let fixture: ComponentFixture<GetUvVendorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetUvVendorsComponent]
    });
    fixture = TestBed.createComponent(GetUvVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
