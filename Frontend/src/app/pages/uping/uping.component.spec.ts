import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpingComponent } from './uping.component';

describe('UpingComponent', () => {
  let component: UpingComponent;
  let fixture: ComponentFixture<UpingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpingComponent]
    });
    fixture = TestBed.createComponent(UpingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
