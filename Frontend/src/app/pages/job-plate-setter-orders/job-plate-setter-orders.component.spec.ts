import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPlateSetterOrdersComponent } from './job-plate-setter-orders.component';

describe('JobPlateSetterOrdersComponent', () => {
  let component: JobPlateSetterOrdersComponent;
  let fixture: ComponentFixture<JobPlateSetterOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobPlateSetterOrdersComponent]
    });
    fixture = TestBed.createComponent(JobPlateSetterOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
