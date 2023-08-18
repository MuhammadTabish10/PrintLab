import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  _url = environment.baseUrl;

  constructor(private http: HttpClient) { }

  calculations(obj: any) {
    let url = `${this._url}/printlab-calculator`
    return this.http.post(url, obj)
  }

  addOrder(order: any) {
    let url = `${this._url}/orders`
    return this.http.post(url, order)
  }

  getOrders() {
    let url = `${this._url}/orders`;
    return this.http.get(url);
  }

  deleteOrder(id: any) {
    let url = `${this._url}/orders/${id}`
    return this.http.delete(url, id)
  }

  getOrderById(id: any) {
    let url = `${this._url}/orders/${id}`
    return this.http.get(url)
  }

  updateOrder(id: any, editOrder: any) {
    let url = `${this._url}/orders/${id}`
    return this.http.put(url, editOrder)
  }

  private update = new BehaviorSubject('')
  update$ = this.update.asObservable()
  getNewOrders(order: any) {
    this.update.next(order)
  }

  statusSorting(find: any) {
    let url = `${this._url}/orders?status_like=${find}`
    return this.http.get(url)
  }

  searchById(id: any) {
    let url = `${this._url}/orders?id_like=${id}`
    return this.http.get(url)
  }
}