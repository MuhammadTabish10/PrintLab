import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtpComponent } from './ctp.component';

describe('CtpComponent', () => {
  let component: CtpComponent;
  let fixture: ComponentFixture<CtpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CtpComponent]
    });
    fixture = TestBed.createComponent(CtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
