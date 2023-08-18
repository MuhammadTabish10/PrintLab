import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PressMachineService {
  _url = environment.baseUrl

  constructor(private http: HttpClient) { }

  postPressMachine(obj: any) {
    debugger
    let url = `${this._url}/press-machine`
    return this.http.post(url, obj)
  }

  getPressMachine() {
    let url = `${this._url}/press-machine`
    return this.http.get(url)
  }

  getPressMachineById(id: any) {
    debugger
    let url = `${this._url}/press-machine/${id}`
    return this.http.get(url)
  }

  deletePressMachine(id: any) {
    let url = `${this._url}/press-machine/${id}`
    return this.http.delete(url)
  }

  deletePressMachineSize(id: any, sizeId: any) {
    debugger
    let url = `${this._url}/press-machine/${id}/${sizeId}`
    return this.http.delete(url)
  }

  updatePressMachine(id: any, obj: any) {
    let url = `${this._url}/press-machine/${id}`
    return this.http.put(url, obj)
  }

  searchPressMachine(name: any) {
    let url = `${this._url}/press-machine?name_like=${name}`
    return this.http.get(url)
  }
}