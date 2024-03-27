import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUpingComponent } from './view-uping.component';

describe('ViewUpingComponent', () => {
  let component: ViewUpingComponent;
  let fixture: ComponentFixture<ViewUpingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUpingComponent]
    });
    fixture = TestBed.createComponent(ViewUpingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
