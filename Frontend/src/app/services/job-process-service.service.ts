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

  getJobProcessByOrderIdAndPayment(orderId: any) {
    let url = `${this._url}/job-details/order/${orderId}`;
    return this.http.get(url);
  }

  postJobProcess(obj: any) {
    let url = `${this._url}/job-details/create`;
    return this.http.post(url, obj);
  }

  updateJobProcess(id: any, obj: any) {
    let url = `${this._url}/job-details/update/${id}`;
    return this.http.put(url, obj);
  }

  getExcelFileOfJobDetails(obj?: any) {
    let url = `${this._url}/job-details/export`;
    return this.http.post(url, obj, { responseType: "blob" as "json" });
  }

  downloadExcelFile(data: any, filename: string) {
    const blob = new Blob([data], { type: "application/xlsx" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}
