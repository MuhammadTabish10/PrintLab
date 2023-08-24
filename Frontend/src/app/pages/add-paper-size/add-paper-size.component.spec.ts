import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaperSizeComponent } from './add-paper-size.component';

describe('AddPaperSizeComponent', () => {
  let component: AddPaperSizeComponent;
  let fixture: ComponentFixture<AddPaperSizeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPaperSizeComponent]
    });
    fixture = TestBed.createComponent(AddPaperSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
