import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCtpComponent } from './add-ctp.component';

describe('AddCtpComponent', () => {
  let component: AddCtpComponent;
  let fixture: ComponentFixture<AddCtpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCtpComponent]
    });
    fixture = TestBed.createComponent(AddCtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
