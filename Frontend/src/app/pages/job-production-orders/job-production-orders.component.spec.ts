import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProductionOrdersComponent } from './job-production-orders.component';

describe('JobProductionOrdersComponent', () => {
  let component: JobProductionOrdersComponent;
  let fixture: ComponentFixture<JobProductionOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobProductionOrdersComponent]
    });
    fixture = TestBed.createComponent(JobProductionOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
