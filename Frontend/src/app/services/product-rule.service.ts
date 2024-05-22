import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { ProductRule } from '../Model/ProductRule';
import { PaginatorState } from 'primeng/paginator';
import { PaginationResponse } from '../Model/PaginationResponse';

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

  public getProductRuleTable(pageState?: PaginatorState, body?: ProductRule): Observable<PaginationResponse<ProductRule>> {
    let params = new HttpParams();
    if (pageState?.hasOwnProperty('page') && pageState?.hasOwnProperty('rows')) {
      params = params.set('page-number', pageState?.page!);
      params = params.set('page-size', pageState?.rows!);
    } else {
      params = params.set('page-number', 0);
      params = params.set('page-size', 10);
    }
    return this.http.post<PaginationResponse<ProductRule>>(`${this._url}/get-paginated-productRule`, body ? body : {}, { params });
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

  searchProduct(name: string): Observable<ProductRule[]> {
    return this.http.get<ProductRule[]>(`${this._url}/product-rule/names/${name}`);
  }

  checkUniqueProduct(productName: string) {
    let url = `${this._url}/product-rule/check-title/${productName}`;
    return this.http.get(url);
  }
}
