import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  _url = environment.baseUrl
  constructor(private http: HttpClient) { }

  getAnalaytics(){
    let url = `${this._url}/printlab-count`
    return this.http.get(url)
  }

  getChartPieData() {
    let urlPieChart = `${this._url}/printlab-count`
    return this.http.get(urlPieChart);
  }
  getChartData() {
    let urlPieChart = `${this._url}/printlab-count`
    return this.http.get(urlPieChart);
  }

}
