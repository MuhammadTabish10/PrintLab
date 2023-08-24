import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  postSettings(obj: any) {
    let url = `${this._url}/setting`
    return this.http.post(url, obj)
  }

  getSettings() {
    let url = `${this._url}/setting`
    return this.http.get(url)
  }

  deleteSettings(id: any) {
    let url = `${this._url}/setting/${id}`
    return this.http.delete(url)
  }

  getSettingsById(id: any) {
    let url = `${this._url}/setting/${id}`
    return this.http.get(url)
  }

  updateSettings(id: any, obj: any) {
    let url = `${this._url}/setting/${id}`
    return this.http.put(url, obj)
  }

  searchSettings(key: any) {
    let url = `${this._url}/setting/keys/${key}`
    return this.http.get(url)
  }
}