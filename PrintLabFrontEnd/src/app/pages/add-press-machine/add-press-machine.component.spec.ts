import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPressMachineComponent } from './add-press-machine.component';

describe('AddPressMachineComponent', () => {
  let component: AddPressMachineComponent;
  let fixture: ComponentFixture<AddPressMachineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPressMachineComponent]
    });
    fixture = TestBed.createComponent(AddPressMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
