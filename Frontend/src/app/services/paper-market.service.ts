import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaperMarketService {

  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  postPaperMarket(obj: any) {

    let url = `${this._url}/paper-market-rates`
    return this.http.post(url, obj)
  }

  getPaperMarket() {
    let url = `${this._url}/paper-market-rates`
    return this.http.get(url)
  }

  deletePaperMarket(id: any) {

    let url = `${this._url}/paper-market-rates/${id}`
    return this.http.delete(url)
  }

  getPaperMarketById(id: any) {
    let url = `${this._url}/paper-market-rates/${id}`
    return this.http.get(url)
  }

  updatePaperMarket(id: any, obj: any) {

    let url = `${this._url}/paper-market-rates/${id}`
    return this.http.put(url, obj)
  }

  // searchPaperMarket(paperStock: any) {
  //   let url = `${this._url}/paper-market-rates/paper-stocks/${paperStock}`
  //   return this.http.get(url)
  // }

  getFilteredAndPaginatedData(pageInfo?: any, search?: any) {
    let params = new HttpParams();

    if (pageInfo?.hasOwnProperty('page')) {
      params = params.set('pageNumber', pageInfo.page);
    }

    let url = `${this._url}/paper-market-rates/search`;

    return this.http.post(url, search ? search : {}, { params });
  }
}
