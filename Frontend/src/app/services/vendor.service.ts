import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  postVendor(obj: any) {
    let url = `${this._url}/vendor`
    return this.http.post(url, obj)
  }

  getVendor() {
    let url = `${this._url}/vendor`
    return this.http.get(url)
  }
  getVendorByProductProcess(processId:any) {
    let url = `${this._url}/vendor/${processId}/product-process`
    return this.http.get(url)
  }

  deleteVendor(id: any) {
    let url = `${this._url}/vendor/${id}`
    return this.http.delete(url)
  }

  deleteVendorProcess(id: any, processId: any) {
    let url = `${this._url}/vendor/${id}/${processId}`
    return this.http.delete(url)
  }

  getVendorById(id: any) {
    let url = `${this._url}/vendor/${id}`
    return this.http.get(url)
  }

  updateVendor(id: any, obj: any) {
    let url = `${this._url}/vendor/${id}`
    return this.http.put(url, obj)
  }

  searchVendor(name: any) {
    let url = `${this._url}/vendor/names/${name}`
    return this.http.get(url)
  }
}
