import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PetyCashService {
  url = environment.baseUrl;

  constructor(private http: HttpClient) { }

  addPetyCash(user: any) {
    debugger
    let url = `${this.url}/user-petty-cash`
    return this.http.post(url, user)
  }

  getUserPettyCashById(userId:number) {
    let url = `${this.url}/user-petty-cash/${userId}`;
    return this.http.get(url);
  }
}
