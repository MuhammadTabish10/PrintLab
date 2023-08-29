import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  _url = environment.baseUrl;


  constructor(private http: HttpClient) { }
  post(obj: any) {
    let url = `${this._url}/login`
    return this.http.post(url, obj)
  }

}
