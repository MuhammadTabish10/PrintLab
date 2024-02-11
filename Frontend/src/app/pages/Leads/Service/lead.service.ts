import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { Lead } from 'src/app/Model/Lead';

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

  getAllLeads(): Observable<Lead[]> {
    let url = `${this.BASE_URL}/get-leads`;
    return this.http.get<Lead[]>(url)
    // return of(this.dummyLeadData);
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

  searchLeads(contactName: string, companyName: string): Observable<Lead[]> {
    let params = new HttpParams();
    if (contactName && companyName) {
      params = params.set('contactName', contactName);
      params = params.set('companyName', companyName);
    }
    const url = `${this.BASE_URL}/leads-by-like-search`
    return this.http.get<Lead[]>(url, { params })
  }

  // private dummyLeadData: Lead[] = [
  //   {
  //     createdAt: "2024-01-08 17:19:05.680000",
  //     companyName: "Quality Spaces",
  //     contactName: "Usama Nadeem",
  //     status: true,
  //     id: 1,
  //     leadAddress:
  //     {
  //       country: "Pakistan",
  //       postalCode: "7104",
  //       address: "Maymar",
  //       type: "Business",
  //       city: "Karachi",
  //       status: "true",
  //       state: "Asia",
  //       id: 1,
  //     }
  //     ,
  //     about:
  //     {
  //       description: "Testing with dummy data",
  //       source: "Inbound_Call",
  //       status: "true",
  //       id: 1,
  //     },

  //     contact:
  //     {
  //       jobTitle: "Full Stack Developer",
  //       name: "Usama Nadeem",
  //       role: "Developer",
  //       status: "true",
  //       id: 1,
  //       contactDetails:
  //       {
  //         email: "usamanadeem@example.com",
  //         website: "www.example.com",
  //         landLine: "21331232",
  //         mobile: "32143242",
  //         id: 1,
  //       },
  //     }

  //   },
  // ]

}
