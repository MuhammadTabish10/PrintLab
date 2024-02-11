import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetLeadsComponent } from './get-leads.component';

describe('GetLeadsComponent', () => {
  let component: GetLeadsComponent;
  let fixture: ComponentFixture<GetLeadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetLeadsComponent]
    });
    fixture = TestBed.createComponent(GetLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
