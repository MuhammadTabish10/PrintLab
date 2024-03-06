import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { Observable, of } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { Lead } from 'src/app/Model/Lead';
import { PaginationResponse } from 'src/app/Model/PaginationResponse';
import { DistinctResults } from '../get-leads/get-leads.component';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  private readonly BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  postLead(lead: Lead): Observable<Lead> {
    let url = `${this.BASE_URL}/save-lead`;
    return this.http.post<Lead>(url, lead);
  }

  // getAllLeads(): Observable<Lead[]> {
  //   let url = `${this.BASE_URL}/get-leads`;
  //   return this.http.get<Lead[]>(url)
  // }

  getAllLeads(pageState?: PaginatorState, search?: Lead): Observable<PaginationResponse<Lead>> {
    let params = new HttpParams();
    if (pageState?.hasOwnProperty('page') && pageState?.hasOwnProperty('rows')) {
      params = params.set('page-number', pageState?.page!);
      params = params.set('page-size', pageState?.rows!);
    } else {
      params = params.set('page-number', 0);
      params = params.set('page-size', 10);
    }
    let url = `${this.BASE_URL}/get-leads`;
    return this.http.post<PaginationResponse<Lead>>(url, search ? search : {}, { params });
  }

  deleteLeadById(id: number): Observable<Lead> {
    let url = `${this.BASE_URL}/lead/${id}`
    return this.http.delete<Lead>(url)
  }

  getLeadById(id: number): Observable<Lead> {
    let url = `${this.BASE_URL}/get-lead-by-id/${id}`
    return this.http.get<Lead>(url)
  }

  updateLead(id: number, obj: Lead): Observable<Lead> {
    let url = `${this.BASE_URL}/lead/${id}`
    return this.http.put<Lead>(url, obj)
  }

  updateCreateLead(id: number, obj: Lead): Observable<Lead> {
    let url = `${this.BASE_URL}/update-lead/${id}`
    return this.http.put<Lead>(url, obj)
  }

  // searchLeads(contactName: string, companyName: string): Observable<Lead[]> {
  //   let params = new HttpParams();
  //   if (contactName && companyName) {
  //     params = params.set('contactName', contactName);
  //     params = params.set('companyName', companyName);
  //   }
  //   const url = `${this.BASE_URL}/leads-by-like-search`
  //   return this.http.get<Lead[]>(url, { params })
  // }

  searchLeads(companyName: string): Observable<Lead[]> {
    let params = new HttpParams();
    params = params.set('companyName', companyName);
    const url = `${this.BASE_URL}/leads-by-companyName`
    return this.http.get<Lead[]>(url, { params })
  }

  // getDistinctData(): Observable<DistinctResults> {
  //   let url = `${this.BASE_URL}/leads/distinct-values`;
  //   return this.http.get<DistinctResults>(url);
  // }
}
