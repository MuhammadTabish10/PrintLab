import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSettlementsComponent } from './all-settlements.component';

describe('AllSettlementsComponent', () => {
  let component: AllSettlementsComponent;
  let fixture: ComponentFixture<AllSettlementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllSettlementsComponent]
    });
    fixture = TestBed.createComponent(AllSettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
