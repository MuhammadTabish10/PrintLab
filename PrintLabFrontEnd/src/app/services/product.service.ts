import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  getProducts() {
    let url = `${this._url}/product-definition`
    return this.http.get(url)
  }

  getVendorByProcessId(id: any) {
    // debugger
    let url = `${this._url}/vendor/${id}/product-process`
    return this.http.get(url)
  }

  addProduct(obj: any) {
    let url = `${this._url}/product-definition`
    return this.http.post(url, obj)
  }

  deleteProduct(id: any) {
    debugger
    let url = `${this._url}/product-definition/${id}`
    return this.http.delete(url)
  }

  searchProduct(title: any) {
    debugger
    // let url = `${this._url}/productDefinition/${id}/?id_like=${id}`
    let url = `${this._url}/productDefinition?title=${title}`
    return this.http.get(url)
  }

  getById(id: any) {
    let url = `${this._url}/product-definition/${id}`
    return this.http.get(url)
  }

  updateProduct(id: any, obj: any) {
    debugger
    let url = `${this._url}/productDefinition/${id}`
    return this.http.put(url, obj)
  }

  private update = new BehaviorSubject('')
  update$ = this.update.asObservable()
  getNewProducts(products: any) {
    this.update.next(products)
  }
}