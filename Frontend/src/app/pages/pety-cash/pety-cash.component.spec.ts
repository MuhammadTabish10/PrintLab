import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetyCashComponent } from './pety-cash.component';

describe('PetyCashComponent', () => {
  let component: PetyCashComponent;
  let fixture: ComponentFixture<PetyCashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetyCashComponent]
    });
    fixture = TestBed.createComponent(PetyCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
