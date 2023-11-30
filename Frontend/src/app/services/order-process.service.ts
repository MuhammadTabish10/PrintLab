import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { Transactions } from '../Model/transactions';

@Injectable({
  providedIn: 'root'
})
export class OrderProcessService {

  url = environment.baseUrl;

  constructor(private http: HttpClient) { }

  addTransaction(order: any) {

    let url = `${this.url}/order-transaction`
    return this.http.post(url, order)
  }

  getOrderProcess(orderId: number, process: string) {
    let url = `${this.url}/order-transaction/order/${orderId}/process/${process}`;
    return this.http.get(url);
  }

}
