import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductRuleService {

  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  getProductRule(action:string,body:any) {
    debugger
    let url = `${this._url}/paper-market-rates/product-rule?action=${action}`

    return this.http.post(url,body ? body : {})
  }

}
