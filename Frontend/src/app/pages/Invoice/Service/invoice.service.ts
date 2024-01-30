import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { Invoice } from 'src/app/Model/Invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  postInvoice(obj: Invoice): Observable<Invoice> {
    debugger
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

  // saveInvoiceAndGeneratePdf(htmlContent: string, email: string): Observable<any> {
  //   debugger
  //   const printData = { htmlContent, email };
  //   return this.http.post(`${this.BASE_URL}/generate-pdf-and-send`, printData);
  // }

  saveInvoiceAndGeneratePdf(htmlContent: string, email: string): Observable<any> {
    const printData = { htmlContent, email };

    return this.http.post(`${this.BASE_URL}/generate-pdf-and-send`, printData, {
      responseType: 'arraybuffer' as 'json', // Corrected the syntax here
    }).pipe(
      tap((data: ArrayBuffer | any) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Create a link element and click it to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'print.pdf';
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);
      }),
    );
  }

}
