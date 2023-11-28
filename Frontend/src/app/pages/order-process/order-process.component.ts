import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Transactions } from 'src/app/Model/transactions';

@Component({
  selector: 'app-order-process',
  templateUrl: './order-process.component.html',
  styleUrls: ['./order-process.component.css']
})
export class OrderProcessComponent implements OnInit {
  transactions: Transactions[] = [
    {
      id: 1,
      plateDimension: '450 x 370 mm',
      vendor: 'Sidra Ctp',
      qty: 8,
      unitPrice: 220,
      amount: 1000,
      user: 'Admin',
      paymentMode: [
        { name: 'Cash' },
        { name: 'Credit' }
      ]
    }
  ];
  plateDimension: any = '450 x 370 mm';
  vendor: any = [{
    vendor: 'Sidra Ctp'
  }];
  qty: any = 8;
  unitPrice: any = 220;
  amount: any = 1000;
  user: any = [{ name: 'Admin' }];
  paymentMode: any = [{ name: 'Cash' }, { name: 'Credit' }];


  addTransaction: boolean = false;
  visible: boolean = false;
  tID!: number
  showRejected: boolean = false;
  showAccepted: boolean = false;

  ngOnInit(): void {

  }

  addToTransaction(): boolean {
    debugger
    this.showRejected = false;
    this.showAccepted = true;
    this.addTransaction = true;
    return this.addTransaction;
  }

  deleteTransaction(id: number): boolean {
    debugger
    this.visible = false;
    this.addTransaction = false;
    return this.addTransaction;
  }

  reject(): boolean {
    this.addTransaction = false;
    this.showRejected = true;
    return this.showRejected;
  }

  showDialog() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

}
