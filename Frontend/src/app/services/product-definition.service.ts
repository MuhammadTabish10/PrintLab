import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductDefinitionService {

  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  postProductField(obj: any) {
    //
    let url = `${this._url}/product-field`
    return this.http.post(url, obj)
  }

  getProductDefintionById(id: any) {
    //
    let url = `${this._url}/product-field/${id}`
    return this.http.get(url)
  }

  getProductDefintion() {
    let url = `${this._url}/product-field`
    return this.http.get(url)
  }

  deleteField(id: any) {

    let url = `${this._url}/product-field/${id}`
    return this.http.delete(url)
  }

  deleteProductFieldValue(id: any, pfId: any) {
    let url = `${this._url}/product-field/${id}/${pfId}`
    return this.http.delete(url)
  }

  updateField(id: any, obj: any) {

    let url = `${this._url}/product-field/${id}`
    return this.http.put(url, obj)
  }

  searchProductField(name: any) {
    let url = `${this._url}/product-field/names/${name}`
    return this.http.get(url)
  }
}
