import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpingService {

  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  postUping(obj: any) {
    let url = `${this._url}/uping`
    return this.http.post(url, obj)
  }

  getUping() {
    let url = `${this._url}/uping`
    return this.http.get(url)
  }

  deleteUping(id: any) {
    let url = `${this._url}/uping/${id}`
    return this.http.delete(url)
  }

  deleteUpingSize(id: any, sizeId: any) {
    let url = `${this._url}/uping/${id}/${sizeId}`
    return this.http.delete(url)
  }

  getUpingById(id: any) {
    let url = `${this._url}/uping/${id}`
    return this.http.get(url)
  }

  updateUping(id: any, obj: any) {
    let url = `${this._url}/uping/${id}`
    return this.http.put(url, obj)
  }

  searchUping(size: any) {
    let url = `${this._url}/uping?productSize_like=${size}`
    return this.http.get(url)
  }
}