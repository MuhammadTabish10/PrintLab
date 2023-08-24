import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  _url = environment.baseUrl;


  constructor(private http: HttpClient) { }

  addUser(user: any) {
    let url = `${this._url}/users`
    return this.http.post(url, user)
  }

  getUsers() {
    let url = `${this._url}/users`
    return this.http.get(url)
  }

  loginUser(user: any) {
    let url = `${this._url}/currentUser`
    return this.http.post(url, user)
  }
  updateLoginUser(user: any) {
    let url = `${this._url}/currentUser`
    return this.http.put(url, user)
  }

  getcurrentUser() {
    let url = `${this._url}/currentUser`
    return this.http.get(url)
  }

}
