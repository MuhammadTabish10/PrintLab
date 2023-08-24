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

  deleteSelectedField(id: any, pfId: any, selectedId: any) {
    debugger
    let url = `${this._url}/product-definition/${id}/${pfId}/product-definition-field/${selectedId}/selected-value`
    return this.http.delete(url)
  }

  deleteProcess(id: any, processId: any) {
    debugger
    let url = `${this._url}/product-definition/${id}/${processId}/product-definition-process`
    return this.http.delete(url)
  }

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
    debugger
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
    let url = `${this._url}/product-definition/titles/${title}`
    return this.http.get(url)
  }

  getById(id: any) {
    let url = `${this._url}/product-definition/${id}`
    return this.http.get(url)
  }

  updateProduct(id: any, obj: any) {
    debugger
    let url = `${this._url}/product-definition/${id}`
    return this.http.put(url, obj)
  }

  private update = new BehaviorSubject('')
  update$ = this.update.asObservable()
  getNewProducts(products: any) {
    this.update.next(products)
  }
}