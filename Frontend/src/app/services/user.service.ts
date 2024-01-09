import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { User } from '../Model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  addUser(obj: any): Observable<User> {
    let url = `${this._url}/signup`;
    return this.http.post<User>(url, obj);
  }

  getUsers(): Observable<User[]> {
    let url = `${this._url}/user`;
    return this.http.get<User[]>(url);
  }

  deleteUser(id: number): Observable<User> {
    let url = `${this._url}/user/${id}`;
    return this.http.delete<User>(url);
  }

  getUserById(id: number): Observable<User> {
    let url = `${this._url}/user/${id}`;
    return this.http.get<User>(url);
  }

  updateUser(id: number, obj: any): Observable<User> {
    let url = `${this._url}/user/${id}`;
    return this.http.put<User>(url, obj)
  }

  searchUser(name: string): Observable<User[]> {
    let url = `${this._url}/user/${name}`;
    return this.http.get<User[]>(url);
  }
}
