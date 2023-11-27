import { Component } from '@angular/core';
import { Transactions } from 'src/app/Model/transactions';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
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
    ]
  }];
}
