import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllJobsComponent } from './get-all-jobs.component';

describe('GetAllJobsComponent', () => {
  let component: GetAllJobsComponent;
  let fixture: ComponentFixture<GetAllJobsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetAllJobsComponent]
    });
    fixture = TestBed.createComponent(GetAllJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
