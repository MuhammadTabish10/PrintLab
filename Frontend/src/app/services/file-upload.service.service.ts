import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  _url = environment.baseUrl
  files: any;
  constructor(private http: HttpClient) { }

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    let url = `${this._url}/uping/upload`
    return this.http.get(url);
  }
}
