import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaperMarketService {

  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  postPaperMarket(obj: any) {
    debugger
    let url = `${this._url}/paper-market-rates`
    return this.http.post(url, obj)
  }

  getPaperMarket() {
    let url = `${this._url}/paper-market-rates`
    return this.http.get(url)
  }

  deletePaperMarket(id: any) {
    debugger
    let url = `${this._url}/paper-market-rates/${id}`
    return this.http.delete(url)
  }

  getPaperMarketById(id: any) {
    let url = `${this._url}/paper-market-rates/${id}`
    return this.http.get(url)
  }

  updatePaperMarket(id: any, obj: any) {
    debugger
    let url = `${this._url}/paper-market-rates/${id}`
    return this.http.put(url, obj)
  }

  searchPaperMarket(paperStock: any) {
    let url = `${this._url}/paper-market-rates?paperStock_like=${paperStock}`
    return this.http.get(url)
  }
}