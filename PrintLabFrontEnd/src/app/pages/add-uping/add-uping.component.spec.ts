import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpingComponent } from './add-uping.component';

describe('AddUpingComponent', () => {
  let component: AddUpingComponent;
  let fixture: ComponentFixture<AddUpingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpingComponent]
    });
    fixture = TestBed.createComponent(AddUpingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
