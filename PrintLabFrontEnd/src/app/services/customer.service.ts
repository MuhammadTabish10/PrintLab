import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  _url = environment.jsonUrl

  constructor(private http: HttpClient) { }

  postCustomer(obj: any) {
    let url = `${this._url}/customer`
    return this.http.post(url, obj)
  }

  getCustomer() {
    let url = `${this._url}/customer`
    return this.http.get(url)
  }

  deleteCustomer(id: any) {
    let url = `${this._url}/customer/${id}`
    return this.http.delete(url)
  }

  getCustomerById(id: any) {
    let url = `${this._url}/customer?id_like=${id}`
    return this.http.get(url)
  }

  updateCustomer(id: any, obj: any) {
    let url = `${this._url}/customer/${id}`
    return this.http.put(url, obj)
  }

  searchCustomer(paperStock: any) {
    let url = `${this._url}/customer?paperStock_like=${paperStock}`
    return this.http.get(url)
  }
}
