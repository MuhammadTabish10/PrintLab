import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaperMarketComponent } from './add-paper-market.component';

describe('AddPaperMarketComponent', () => {
  let component: AddPaperMarketComponent;
  let fixture: ComponentFixture<AddPaperMarketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPaperMarketComponent]
    });
    fixture = TestBed.createComponent(AddPaperMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
