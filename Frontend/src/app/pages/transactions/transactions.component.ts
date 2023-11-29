import { Component } from '@angular/core';
import { Transactions } from 'src/app/Model/transactions';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  transactions!: Transactions[];
}
