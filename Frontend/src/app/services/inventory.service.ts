import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  postInventory(obj: any) {
    let url = `${this._url}/inventory`
    return this.http.post(url, obj)
  }

  getInventory() {
    let url = `${this._url}/inventory`
    return this.http.get(url)
  }

  deleteInventory(id: any) {
    let url = `${this._url}/inventory/${id}`
    return this.http.delete(url)
  }

  getInventoryById(id: any) {
    let url = `${this._url}/inventory/${id}`
    return this.http.get(url)
  }

  updateInventory(id: any, obj: any) {
    let url = `${this._url}/inventory/${id}`
    return this.http.put(url, obj)
  }

  searchInventory(name: any) {
    let url = `${this._url}/inventorys/${name}`
    return this.http.get(url)
  }
}
