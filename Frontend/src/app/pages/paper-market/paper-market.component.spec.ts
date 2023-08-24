import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperMarketComponent } from './paper-market.component';

describe('PaperMarketComponent', () => {
  let component: PaperMarketComponent;
  let fixture: ComponentFixture<PaperMarketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaperMarketComponent]
    });
    fixture = TestBed.createComponent(PaperMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
