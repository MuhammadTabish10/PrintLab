import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';
import { InterceptorService } from './interceptor.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  _url = environment.baseUrl
  // jsonUrl = "http://localhost:3000"


  constructor(private http: HttpClient, private interceptor: InterceptorService) { }

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

  updatePermissionOfRoles(permission: any , id:any): Observable<any> {
    let url = `${this._url}/role/`
    return this.http.put(url+id,permission)
  }
}
