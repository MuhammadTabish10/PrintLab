import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { OrderPaymentHistory } from '../Model/OrderPaymentHistory';

@Injectable({
  providedIn: 'root'
})
export class OrderPaymentHistoryService {

  private readonly BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getPaymentHistoryByOrderId(id: number): Observable<OrderPaymentHistory[]> {
    return this.http.get<OrderPaymentHistory[]>(`${this.BASE_URL}/get-payment-history-by-order-id/${id}`);
  }
  public saveOrderPaymentHistory(orderId: number, paymentHistoryBody: OrderPaymentHistory): Observable<OrderPaymentHistory> {
    return this.http.put<OrderPaymentHistory>(`${this.BASE_URL}/save-order-payment-history-by-order-id/${orderId}`, paymentHistoryBody);
  }
}
