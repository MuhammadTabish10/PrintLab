import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetBindingLaboursComponent } from './get-binding-labours.component';

describe('GetBindingLaboursComponent', () => {
  let component: GetBindingLaboursComponent;
  let fixture: ComponentFixture<GetBindingLaboursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetBindingLaboursComponent]
    });
    fixture = TestBed.createComponent(GetBindingLaboursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
