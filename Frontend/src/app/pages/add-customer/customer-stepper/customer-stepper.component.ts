import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-stepper',
  templateUrl: './customer-stepper.component.html',
  styleUrls: ['./customer-stepper.component.css']
})
export class CustomerStepperComponent implements OnInit {
  active: string | undefined | null;

  constructor() { }
  
  ngOnInit(): void {
    this.active = "contactInfo"
  }
}
