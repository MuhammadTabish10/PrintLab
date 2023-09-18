import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaperSizeService {

  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  postPaperSize(obj: any) {
    let url = `${this._url}/paper-size`
    return this.http.post(url, obj)
  }

  getPaperSize() {
    let url = `${this._url}/paper-size`
    return this.http.get(url)
  }

  deletePaperSize(id: any) {
    let url = `${this._url}/paper-size/${id}`
    return this.http.delete(url)
  }

  getPaperSizeById(id: any) {
    let url = `${this._url}/paper-size/${id}`
    return this.http.get(url)
  }

  updatePaperSize(id: any, obj: any) {
    let url = `${this._url}/paper-size/${id}`
    return this.http.put(url, obj)
  }

  searchPaperSize(label: any) {
    let url = `${this._url}/paper-size/labels/${label}`
    return this.http.get(url)
  }
}
