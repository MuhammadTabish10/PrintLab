import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  addUser(obj: any) {
    let url = `${this._url}/signup`
    return this.http.post(url, obj)
  }

  getUsers() {
    let url = `${this._url}/user`
    return this.http.get(url)
  }

  deleteUser(id: number) {
    let url = `${this._url}/user/${id}`
    return this.http.delete(url)
  }

  getUserById(id: number) {
    let url = `${this._url}/user/${id}`
    return this.http.get(url)
  }

  updateUser(id: number, obj: any) {
    let url = `${this._url}/user/${id}`
    return this.http.put(url, obj)
  }

  searchUser(name: any) {
    let url = `${this._url}/user/${name}`
    return this.http.get(url)
  }
}
