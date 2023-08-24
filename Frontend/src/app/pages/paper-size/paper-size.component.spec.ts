import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperSizeComponent } from './paper-size.component';

describe('PaperSizeComponent', () => {
  let component: PaperSizeComponent;
  let fixture: ComponentFixture<PaperSizeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaperSizeComponent]
    });
    fixture = TestBed.createComponent(PaperSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
