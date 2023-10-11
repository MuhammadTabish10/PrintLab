import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperStockComponent } from './paper-stock.component';

describe('PaperStockComponent', () => {
  let component: PaperStockComponent;
  let fixture: ComponentFixture<PaperStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaperStockComponent]
    });
    fixture = TestBed.createComponent(PaperStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
