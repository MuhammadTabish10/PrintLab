import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/Environments/environment";

@Injectable({
  providedIn: "root",
})
export class JobProcessServiceService {
  _url = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getJobProcessByName(vendorName: any) {
    let url = `${this._url}/job-details/vendor/${vendorName}`;
    return this.http.get(url);
  }

  getJobProcessByNameAndDate(params: any) {
    let url = `${this._url}/job-details/vendor-by-date`;
    return this.http.get(url, { params });
  }

  postJobProcess(obj: any) {
    let url = `${this._url}/job-details/create`;
    return this.http.post(url, obj);
  }

  updateJobProcess(id: any, obj: any) {
    let url = `${this._url}/job-details/update/${id}`;
    return this.http.put(url, obj);
  }
}
