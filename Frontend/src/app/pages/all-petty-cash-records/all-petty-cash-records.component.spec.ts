import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPettyCashRecordsComponent } from './all-petty-cash-records.component';

describe('AllPettyCashRecordsComponent', () => {
  let component: AllPettyCashRecordsComponent;
  let fixture: ComponentFixture<AllPettyCashRecordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllPettyCashRecordsComponent]
    });
    fixture = TestBed.createComponent(AllPettyCashRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
