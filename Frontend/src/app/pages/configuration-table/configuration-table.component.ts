import { Component, OnInit } from '@angular/core';
import { CalculatorService } from 'src/app/services/calculator.service';

@Component({
  selector: 'app-configuration-table',
  templateUrl: './configuration-table.component.html',
  styleUrls: ['./configuration-table.component.css']
})
export class ConfigurationTableComponent implements OnInit {

  fields: any[] = [];
  press: any[] = [];
  selectedPress: string = '';
  margin:any;
  setupFee:any;
  cutting:any;
  cuttingImpression:any;

  constructor(private calculator: CalculatorService) { }
  ngOnInit(): void {
    this.fields = this.calculator.getFields();
    this.press = this.calculator.getPress();
    this.selectedPress = this.press[1].press;
  }
  getSelectedPressImpressions(): string {
    const selectedMachine = this.press.find(machine => machine.press === this.selectedPress);
    return selectedMachine ? selectedMachine.impressions : '';
  }
  getSelectedPressBaseRate(): number {
    const impressions = parseFloat(this.getSelectedPressImpressions());
    return impressions;
  }
  getSelectedPressCtpRate(): string {
    const selectedMachine = this.press.find(machine => machine.press === this.selectedPress);
    return selectedMachine ? selectedMachine.ctp : '';
  }
  getBataRate():void{
  }
}
