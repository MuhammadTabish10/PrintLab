import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { Order } from '../Model/Order';
import { PaginationResponse } from '../Model/PaginationResponse';
import { PaginatorState } from 'primeng/paginator';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  _url = environment.baseUrl;

  constructor(private http: HttpClient) { }

  calculations(obj: any) {
    let url = `${this._url}/printlab-calculator`
    return this.http.post(url, obj)
  }

  addOrder(order: any, createdBy: number) {
    let url = `${this._url}/order`
    return this.http.post(url, order, { params: { loggedInUser: createdBy } })
  }

  getOrders(pageState?: PaginatorState, search?: Order): Observable<PaginationResponse<Order>> {
    let params = new HttpParams();
    if (pageState?.hasOwnProperty('page') && pageState?.hasOwnProperty('rows')) {
      params = params.set('page-number', pageState?.page!);
      params = params.set('page-size', pageState?.rows!);
    } else {
      params = params.set('page-number', 0);
      params = params.set('page-size', 10);
    }
    let url = `${this._url}/get-paginated-orders`;
    return this.http.post<PaginationResponse<Order>>(url, search ? search : {}, { params });
  }

  getAssignedOrders() {
    let url = `${this._url}/assigned-orders`;
    return this.http.get(url);
  }

  saveAssignedUser(userId: number, role: string, orderId: number, logedInUser: number) {
    const url = `${this._url}/order/assignUser`;

    const params = {
      orderId: orderId,
      userId: userId,
      role: role,
      loggedInUser: logedInUser
    };

    return this.http.post(url, null, { params });
  }



  getUserByRole(role: any) {
    let url = `${this._url}/user/role/${role}`;
    return this.http.get(url);
  }

  getOrderByIdAndType(id: number, type: string): Observable<Order> {
    const params = new HttpParams().set('type', type);
    return this.http.get<Order>(`${this._url}/order/${id}`, { params });
  }

  deleteOrder(id: any) {
    let url = `${this._url}/order/${id}`
    return this.http.delete(url)
  }

  updateOrder(id: any, order: any) {
    let url = `${this._url}/order/${id}`
    return this.http.put(url, order)
  }

  statusSorting(find: any) {
    let url = `${this._url}/order?status_like=${find}`
    return this.http.get(url)
  }

  searchById(id: any) {
    let url = `${this._url}/order/products/${id}`
    return this.http.get(url)
  }

  postImage(formData: any) {
    let url = `${this._url}/image`
    return this.http.post(url, formData, { responseType: 'text' })
  }

  // Download Order Confirmation Report

  downloadOrderConfirmationReport(fileName: string, id: number | null | undefined): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf',
    });
    return this.http.get(`${this._url}/order/pdf/${fileName}/${id}`,
    {
      headers: headers,
      responseType: 'blob',
    });
  }
}
