import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  _url = environment.baseUrl
  // jsonUrl = "http://localhost:3000"


  constructor(private http: HttpClient) { }

  getRoles() {
    let url = `${this._url}/role`
    return this.http.get(url)
  }

  getPermissions(){
    let url = `${this._url}/permission`
    return this.http.get(url)
  }

  getPermissionOfRoles(id: any): any {
    const url = `${this._url}/role/${id}`;
    return this.http.get(url);
  }

  updatePermissionOfRoles(permission: any): Observable<any> {
    let url = `${this._url}/role`
    return this.http.post(url,permission)
  }
}
