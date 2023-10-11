import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InterceptorService } from './interceptor.service';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaperStockService {

  _url = environment.baseUrl

  constructor(private http: HttpClient, private interceptor: InterceptorService) { }

  getBrandsByName(){
    let url = `${this._url}/product-field/name/Brands`
    return this.http.get(url)
  }

  addPaperStock(obj:any){
    let url = `${this._url}/paper-stock`
    return this.http.post(url, obj)
  }

  getAllPaperStock():any {
    let url = `${this._url}/paper-stock`
    return this.http.get(url)
  }

  getById(id: any) {
    let url = `${this._url}/paper-stock/${id}`
    return this.http.get(url)
  }

  updatePaperStock(id:any , obj:any){
    let url = `${this._url}/paper-stock/${id}`
    return this.http.put(url, obj)
  }

  deletePaperStock(id:any){
    let url = `${this._url}/paper-stock/${id}`
    return this.http.delete(url)
  }

  searchPaperStock(title: any) {

    let url = `${this._url}/paper-stock/names/${title}`
    return this.http.get(url)
  }
}
