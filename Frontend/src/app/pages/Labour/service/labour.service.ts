import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { BindingLabour } from 'src/app/Model/BindingLabour';
import { LaminationVendor } from 'src/app/Model/LaminationVendor';
import { UV_Vendor } from 'src/app/Model/UV_Vendor';

@Injectable({
  providedIn: 'root'
})
export class LabourService {
  private readonly BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  postBindingLabour(obj: BindingLabour): Observable<BindingLabour> {
    let url = `${this.BASE_URL}/binding-labour`;
    return this.http.post<BindingLabour>(url, obj);
  }

  postLaminationVendor(obj: LaminationVendor): Observable<LaminationVendor> {
    let url = `${this.BASE_URL}/lamination-vendor`;
    return this.http.post<LaminationVendor>(url, obj);
  }
  postUvVendor(obj: UV_Vendor): Observable<UV_Vendor> {
    let url = `${this.BASE_URL}/uv-vendor`;
    return this.http.post<UV_Vendor>(url, obj);
  }

  getAllBindingLabours(): Observable<BindingLabour[]> {
    let url = `${this.BASE_URL}/binding-labour`
    return this.http.get<BindingLabour[]>(url)
  }
  getAllLaminationVendors(): Observable<LaminationVendor[]> {
    let url = `${this.BASE_URL}/lamination-vendor`
    return this.http.get<LaminationVendor[]>(url)
  }
  getAllUvVendors(): Observable<UV_Vendor[]> {
    let url = `${this.BASE_URL}/uv-vendor`
    return this.http.get<UV_Vendor[]>(url)
  }

  deleteBindingLabourById(id: number): Observable<BindingLabour> {

    let url = `${this.BASE_URL}/binding-labour/${id}`
    return this.http.delete<BindingLabour>(url)
  }
  deleteLaminationVendorById(id: number): Observable<LaminationVendor> {
    let url = `${this.BASE_URL}/lamination-vendor/${id}`
    return this.http.delete<LaminationVendor>(url)
  }
  deleteUvVendorById(id: number): Observable<UV_Vendor> {
    let url = `${this.BASE_URL}/uv-vendor/${id}`
    return this.http.delete<UV_Vendor>(url)
  }

  getBindingLabourById(id: number): Observable<BindingLabour> {
    let url = `${this.BASE_URL}/binding-labour/${id}`
    return this.http.get<BindingLabour>(url)
  }
  getLaminationVendorById(id: number): Observable<LaminationVendor> {
    let url = `${this.BASE_URL}/lamination-vendor/${id}`
    return this.http.get<LaminationVendor>(url)
  }
  getUvVendorById(id: number): Observable<UV_Vendor> {
    let url = `${this.BASE_URL}/uv-vendor/${id}`
    return this.http.get<UV_Vendor>(url)
  }

  updateBindingLabour(id: number, obj: BindingLabour): Observable<BindingLabour> {
    let url = `${this.BASE_URL}/binding-labour/${id}`
    return this.http.put<BindingLabour>(url, obj)
  }
  updateLaminationVendor(id: number, obj: LaminationVendor): Observable<LaminationVendor> {
    let url = `${this.BASE_URL}/lamination-vendor/${id}`
    return this.http.put<LaminationVendor>(url, obj)
  }
  updateUvVendor(id: number, obj: UV_Vendor): Observable<UV_Vendor> {
    let url = `${this.BASE_URL}/uv-vendor/${id}`
    return this.http.put<UV_Vendor>(url, obj)
  }

  searchBindingLabourByName(name: string): Observable<BindingLabour[]> {

    let url = `${this.BASE_URL}/binding-labours/${name}`
    return this.http.get<BindingLabour[]>(url)
  }
  searchLaminationVendorByName(name: string): Observable<LaminationVendor[]> {
    let url = `${this.BASE_URL}/lamination-vendors/${name}`
    return this.http.get<LaminationVendor[]>(url)
  }
  searchUvVendorByName(name: string): Observable<UV_Vendor[]> {
    let url = `${this.BASE_URL}/uv-vendors/${name}`
    return this.http.get<UV_Vendor[]>(url)
  }
}
