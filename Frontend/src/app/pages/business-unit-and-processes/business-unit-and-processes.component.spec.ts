import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessUnitAndProcessesComponent } from './business-unit-and-processes.component';

describe('BusinessUnitAndProcessesComponent', () => {
  let component: BusinessUnitAndProcessesComponent;
  let fixture: ComponentFixture<BusinessUnitAndProcessesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessUnitAndProcessesComponent]
    });
    fixture = TestBed.createComponent(BusinessUnitAndProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
