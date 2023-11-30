import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorSettlementServiceService {

  url = environment.baseUrl;

  constructor(private http: HttpClient) { }

  addSettlement(settlementObj: any) {
    let url = `${this.url}/vendor-settlement`
    return this.http.post(url, settlementObj)
  }

  getSettlementId(settlementId: number) {
    let url = `${this.url}/vendor-settlement/${settlementId}`;
    return this.http.get(url);
  }

  updateSettlementById(recordId: number, obj: any) {
    let url = `${this.url}/vendor-settlement/${recordId}`;
    return this.http.put(url, obj)
  }

  getVendorSettlementById(vendorId: number) {
    let url = `${this.url}/vendor-settlement/vendor/${vendorId}`;
    return this.http.get(url);
  }

  deleteSettlementById(settlementId: number) {
    let url = `${this.url}/vendor-settlement/${settlementId}`
    return this.http.delete(url)
  }
}
