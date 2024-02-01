import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-print',
  templateUrl: './invoice-print.component.html',
  styleUrls: ['./invoice-print.component.css']
})
export class InvoicePrintComponent implements OnInit {


  ngOnInit(): void {

  }

  print() {

    window.print();
  }
}
