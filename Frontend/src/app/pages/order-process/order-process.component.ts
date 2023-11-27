import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Transactions } from 'src/app/Model/transactions';

@Component({
  selector: 'app-order-process',
  templateUrl: './order-process.component.html',
  styleUrls: ['./order-process.component.css']
})
export class OrderProcessComponent implements OnInit {
  transactions: Transactions[] = [{
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
    ],
  }];
  addTransaction: boolean = false;
  visible: boolean = false;
  tID!: number
  showAddBtn: boolean = false;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  addToTransaction(): boolean {
    this.showAddBtn = false;
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
    this.showAddBtn = true;
    return this.showAddBtn;
  }

  showDialog(record: Table) {
    this.tID = record.value.length;
    this.visible = true;
  }

}
