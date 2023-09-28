import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisionComponent } from './permision.component';

describe('PermisionComponent', () => {
  let component: PermisionComponent;
  let fixture: ComponentFixture<PermisionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermisionComponent]
    });
    fixture = TestBed.createComponent(PermisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
