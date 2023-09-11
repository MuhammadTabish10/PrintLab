import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CtpService {
  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  postCtp(obj: any) {

    let url = `${this._url}/ctp`
    return this.http.post(url, obj)
  }

  getCtp() {
    let url = `${this._url}/ctp`
    return this.http.get(url)
  }

  deleteCtp(id: any) {
    let url = `${this._url}/ctp/${id}`
    return this.http.delete(url)
  }

  getCtpById(id: any) {
    let url = `${this._url}/ctp/${id}`
    return this.http.get(url)
  }

  updateCtp(id: any, obj: any) {
    let url = `${this._url}/ctp/${id}`
    return this.http.put(url, obj)
  }

  searchCtp(name: any) {
    let url = `${this._url}/ctps/${name}`
    return this.http.get(url)
  }
}
