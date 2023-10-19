import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductRuleService {

  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  getProductRule(action: string, body: any) {

    let url = `${this._url}/paper-market-rates/product-rule?action=${action}`
    return this.http.post(url, body ? body : {})
  }

  queryProductRule(obj: any) {
    let url = `${this._url}/paper-market-rates/product-rule/result`
    return this.http.post(url, obj)
  }

  postProductRule(obj: any) {
    let url = `${this._url}/product-rule`
    return this.http.post(url, obj)
  }

  getProductRuleTable() {
    let url = `${this._url}/product-rule`
    return this.http.get(url)
  }

  deleteProduct(id: any) {
    let url = `${this._url}/product-rule/${id}`
    return this.http.delete(url)
  }
  getProductRuleById(id: any) {
    let url = `${this._url}/product-rule/${id}`
    return this.http.get(url)
  }
  updateProductRule(id: any, obj: any) {
    let url = `${this._url}/product-rule/${id}`
    return this.http.put(url, obj)
  }

  searchProduct(name: any) {
    let url = `${this._url}/product-rule/names/${name}`
    return this.http.get(url)
  }
}
