import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductProcessService {

  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  postProductProcess(obj: any) {
    let url = `${this._url}/product-process`
    return this.http.post(url, obj)
  }

  getProductProcess() {
    let url = `${this._url}/product-process`
    return this.http.get(url)
  }

  deleteProductProcess(id: any) {
    let url = `${this._url}/product-process/${id}`
    return this.http.delete(url)
  }

  getProductProcessById(id: any) {
    let url = `${this._url}/product-process/${id}`
    return this.http.get(url)
  }

  updateProductProcess(id: any, obj: any) {
    let url = `${this._url}/product-process/${id}`
    return this.http.put(url, obj)
  }

  searchProductProcess(name: any) {
    let url = `${this._url}/product-process?name_like=${name}`
    return this.http.get(url)
  }
}