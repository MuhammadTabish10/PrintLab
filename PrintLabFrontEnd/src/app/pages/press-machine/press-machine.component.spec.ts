import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressMachineComponent } from './press-machine.component';

describe('PressMachineComponent', () => {
  let component: PressMachineComponent;
  let fixture: ComponentFixture<PressMachineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PressMachineComponent]
    });
    fixture = TestBed.createComponent(PressMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
