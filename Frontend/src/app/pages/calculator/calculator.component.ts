import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CalculatorHeaderComponent } from '../calculator-header/calculator-header.component';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  visible!: boolean
  error: string = ''

  @ViewChild(CalculatorHeaderComponent)
  calculation!: CalculatorHeaderComponent;
  receivedData: any;
  ngOnInit(): void {
  }
  constructor() { }
  ngAfterViewInit() {
    this.calculation.calculateedObj.subscribe((data: any) => {
      this.receivedData = data;
    }, () => {
      // this.error = 'Press'
      this.visible = true;
    });
  }
}
