import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { Customer } from "../Model/Customer";
import { Business } from '../Model/Business';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  postCustomer(obj: any) {

    let url = `${this._url}/customer`
    return this.http.post(url, obj)
  }

  getCustomer(): Observable<Customer[]> {
    let url = `${this._url}/customer`
    return this.http.get<Customer[]>(url)
  }

  deleteCustomer(id: any) {
    let url = `${this._url}/customer/${id}`
    return this.http.delete(url)
  }

  getCustomerById(id: any): Observable<Customer> {
    let url = `${this._url}/customer/${id}`
    return this.http.get<Customer>(url)
  }

  updateCustomer(id: any, obj: any) {
    let url = `${this._url}/customer/${id}`
    return this.http.put(url, obj)
  }

  searchCustomer(name: any) {
    let url = `${this._url}/customers/${name}`
    return this.http.get(url)
  }

  // Business

  getAllBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(this._url.concat('/businesses'));
  }

  getBusinessById(id: number): Observable<Business> {
    return this.http.get<Business>(`${this._url.concat('/businesses')}/${id}`);
  }

  createBusiness(business: Business): Observable<Business> {
    return this.http.post<Business>(this._url.concat('/businesses'), business);
  }

  updateBusiness(id: number, business: Business): Observable<Business> {
    return this.http.put<Business>(`${this._url.concat('/businesses')}/${id}`, business);
  }

  deleteBusiness(id: number): Observable<void> {
    return this.http.delete<void>(`${this._url.concat('/businesses')}/${id}`);
  }

  deleteBranchById(id: number): Observable<void> {
    return this.http.delete<void>(`${this._url.concat('/businesses/branch')}/${id}`);
  }
}
