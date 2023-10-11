import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaperStockService {
  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  postPaperStock(obj: any) {
    let url = `${this._url}/paper-stock`
    return this.http.post(url, obj)
  }

  getPaperStockByid(id: any) {
    let url = `${this._url}/paper-stock/${id}`
    return this.http.get(url)
  }

  getPaperStock() {
    let url = `${this._url}/paper-stock`
    return this.http.get(url)
  }

  deletePaperStock(id: any) {
    let url = `${this._url}/paper-stock/${id}`
    return this.http.delete(url)
  }

  updatePaperStock(id: any, obj: any) {
    let url = `${this._url}/paperStock/${id}`
    return this.http.put(url, obj)
  }

  searchPaperStock(name: any) {
    let url = `${this._url}/paperStock/names/${name}`
    return this.http.get(url)
  }
}
