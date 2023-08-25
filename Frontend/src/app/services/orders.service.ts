import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  _url = environment.baseUrl;

  constructor(private http: HttpClient) { }

  calculations(obj: any) {
    debugger
    let url = `${this._url}/printlab-calculator`
    return this.http.post(url, obj)
  }

  addOrder(order: any) {
    debugger
    let url = `${this._url}/order`
    return this.http.post(url, order)
  }

  getOrders() {
    debugger
    let url = `${this._url}/order`;
    return this.http.get(url);
  }

  getOrderById(id: any) {
    let url = `${this._url}/order/${id}`
    return this.http.get(url)
  }

  deleteOrder(id:any){
    let url = `${this._url}/order/${id}`
    return this.http.delete(url)
  }

  updateOrder(id: any, order: any) {
    let url = `${this._url}/order/${id}`
    return this.http.put(url, order)
  }

  private update = new BehaviorSubject('')
  update$ = this.update.asObservable()
  getNewOrders(order: any) {
    this.update.next(order)
  }

  statusSorting(find: any) {
    let url = `${this._url}/order?status_like=${find}`
    return this.http.get(url)
  }

  searchById(id: any) {
    let url = `${this._url}/order/products/${id}`
    return this.http.get(url)
  }

  postImage(formData: any) {
    debugger
    let url = `${this._url}/image`
    return this.http.post(url, formData, { responseType: 'text' })
  }
}