import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBindingLaboursComponent } from './add-binding-labours.component';

describe('AddBindingLaboursComponent', () => {
  let component: AddBindingLaboursComponent;
  let fixture: ComponentFixture<AddBindingLaboursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBindingLaboursComponent]
    });
    fixture = TestBed.createComponent(AddBindingLaboursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
