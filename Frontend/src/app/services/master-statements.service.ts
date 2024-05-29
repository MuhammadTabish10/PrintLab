import { PaginationResponse } from './../Model/PaginationResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/Environments/environment';
import { MasterCustomerStatement } from '../Model/MasterCustomerStatement';
import { PaginatorState } from 'primeng/paginator';

@Injectable({
  providedIn: 'root'
})
export class MasterStatementsService {
  private readonly BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) { }


  // Get All MasterStatements of customer
  public getCustomerMasterStatements(pageState?: PaginatorState, search?: MasterCustomerStatement): Observable<PaginationResponse<MasterCustomerStatement>> {
    let params = new HttpParams();
    if (pageState?.hasOwnProperty('page') && pageState?.hasOwnProperty('rows')) {
      params = params.set('page-number', pageState?.page!);
      params = params.set('page-size', pageState?.rows!);
    } else {
      params = params.set('page-number', 0);
      params = params.set('page-size', 10);
    }
    return this.http.post<PaginationResponse<MasterCustomerStatement>>(`${this.BASE_URL}/get-all/customer-master-statements`, search ? search : {}, { params });
  }

  //Post master statements of customer statements
  public saveCustomerMasterStatements(masterStatements: MasterCustomerStatement): Observable<MasterCustomerStatement> {
    return this.http.post<MasterCustomerStatement>(`${this.BASE_URL}/save/customer-master-statement`, masterStatements);
  }
}
