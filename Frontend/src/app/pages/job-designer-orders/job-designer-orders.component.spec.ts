import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDesignerOrdersComponent } from './job-designer-orders.component';

describe('JobDesignerOrdersComponent', () => {
  let component: JobDesignerOrdersComponent;
  let fixture: ComponentFixture<JobDesignerOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobDesignerOrdersComponent]
    });
    fixture = TestBed.createComponent(JobDesignerOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
