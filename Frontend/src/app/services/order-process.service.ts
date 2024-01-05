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

  getPressProcess(orderId: number, process: string) {
    let url = `${this.url}/order-transaction/order/${orderId}/process/${process}`;
    return this.http.get(url);
  }
  getPaperProcess(orderId: number, process: string) {
    let url = `${this.url}/order-transaction/order/${orderId}/process/${process}`;
    return this.http.get(url);
  }

  // getAllOrderProcesses() {
  //   let url = `${this.url}/order-transaction`;
  //   return this.http.get(url);
  // }

  updateOrderProcess(orderId: number, order: any) {
    let url = `${this.url}/order-transaction/${orderId}`;
    return this.http.put(url, order)
  }

  rejectOrder(id: number, process: string, rejected: boolean) {
    let url = `${this.url}/order/${process}/${id}`;
    return this.http.put(url, rejected);
  }

  markCtpAsDone(id: number, isDone: boolean): Observable<string> {
    const url = `${this.url}/order/ctp-process/${id}`;
    return this.http.put<string>(url, null, { params: { isDone: isDone.toString() } });
  }
}
