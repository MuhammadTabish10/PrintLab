import { Component } from '@angular/core';
import { Transactions } from 'src/app/Model/transactions';

@Component({
  selector: 'app-transaction-record',
  templateUrl: './transaction-record.component.html',
  styleUrls: ['./transaction-record.component.css']
})
export class TransactionRecordComponent {
  transactions!: Transactions[];

  addTransaction() { }
}
