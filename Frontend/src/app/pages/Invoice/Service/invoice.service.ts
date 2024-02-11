import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { Invoice } from 'src/app/Model/Invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  postInvoice(obj: Invoice): Observable<Invoice> {

    let url = `${this.BASE_URL}/save-invoice`;
    return this.http.post<Invoice>(url, obj);
  }

  getAllInvoice(): Observable<Invoice[]> {
    let url = `${this.BASE_URL}/get-invoice`
    return this.http.get<Invoice[]>(url)
  }

  deleteInvoiceById(id: number): Observable<Invoice> {
    let url = `${this.BASE_URL}/invoice/${id}`
    return this.http.delete<Invoice>(url)
  }

  getInvoiceById(id: number): Observable<Invoice> {
    let url = `${this.BASE_URL}/get-invoice-by-id/${id}`
    return this.http.get<Invoice>(url)
  }

  updateInvoice(id: number, obj: Invoice): Observable<Invoice> {
    let url = `${this.BASE_URL}/invoice/${id}`
    return this.http.put<Invoice>(url, obj)
  }

  searchInvoice(name: string): Observable<Invoice[]> {
    let url = `${this.BASE_URL}/invoice/${name}`
    return this.http.get<Invoice[]>(url)
  }

  saveInvoiceAndGeneratePdf(htmlContent: string, email: string): Observable<any> {
    const printData = { htmlContent, email };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'
    });

    return this.http.post(`${this.BASE_URL}/generate-pdf-and-send`, printData, {
      headers: headers,
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Error during PDF generation:', error);
        throw error;
      })
    );
  }

}
