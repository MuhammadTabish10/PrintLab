import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaperStockComponent } from './add-paper-stock.component';

describe('AddPaperStockComponent', () => {
  let component: AddPaperStockComponent;
  let fixture: ComponentFixture<AddPaperStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPaperStockComponent]
    });
    fixture = TestBed.createComponent(AddPaperStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
