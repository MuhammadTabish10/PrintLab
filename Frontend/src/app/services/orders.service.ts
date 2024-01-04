import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
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
    let url = `${this._url}/printlab-calculator`
    return this.http.post(url, obj)
  }

  addOrder(order: any) {

    let url = `${this._url}/order`
    return this.http.post(url, order)
  }

  getOrders() {
    let url = `${this._url}/order`;
    return this.http.get(url);
  }

  getAssignedOrders() {
    let url = `${this._url}/assigned-orders`;
    return this.http.get(url);
  }

  saveAssignedUser(userId: number, role: string, orderId: number) {
    const url = `${this._url}/order/assignUser`;

    const params = {
      userId: userId,
      role: role,
      orderId: orderId
    };

    return this.http.post(url, null, { params });
  }



  getUserByRole(role: any) {
    let url = `${this._url}/user/role/${role}`;
    return this.http.get(url);
  }

  getOrderById(id: any) {
    let url = `${this._url}/order/${id}`
    return this.http.get(url)
  }

  deleteOrder(id: any) {
    let url = `${this._url}/order/${id}`
    return this.http.delete(url)
  }

  updateOrder(id: any, order: any) {
    let url = `${this._url}/order/${id}`
    return this.http.put(url, order)
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
    let url = `${this._url}/image`
    return this.http.post(url, formData, { responseType: 'text' })
  }

}
