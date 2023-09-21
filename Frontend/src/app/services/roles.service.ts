import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';
import { InterceptorService } from './interceptor.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  // _url = environment.baseUrl
  jsonUrl = "http://localhost:3000"


  constructor(private http: HttpClient, private interceptor: InterceptorService) { }

  getRoles() {
    let url = `${this.jsonUrl}/roles`
    return this.http.get(url)
  }

  getPermissions(){
    let url = `${this.jsonUrl}/permissions`
    return this.http.get(url)
  }
}
