import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorSettlementService {

  _url = environment.baseUrl

  constructor(private http:HttpClient) { }

  getVendorSettlementById(id:number) {
    let url = `${this._url}/vendor-settlement/${id}`
    return this.http.get(url)
  }
  

}
