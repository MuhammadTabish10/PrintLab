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

    let url = `${this.url}/user-petty-cash`
    return this.http.post(url, user)
  }

  getPettyCashById(pettyCashId: number) {
    let url = `${this.url}/user-petty-cash/${pettyCashId}`;
    return this.http.get(url);
  }

  updatePettyCashRecordById(recordId: number, obj: any) {
    let url = `${this.url}/user-petty-cash/${recordId}`;
    return this.http.put(url, obj)
  }

  getUserPettyCashById(userId: number) {
    let url = `${this.url}/user-petty-cash/user/${userId}`;
    return this.http.get(url);
  }

  deletePettyCashById(pettyCashId: number) {
    let url = `${this.url}/user-petty-cash/${pettyCashId}`
    return this.http.delete(url)
  }
}
