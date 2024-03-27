import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { BusinessUnit, BusinessUnitProcessDto } from 'src/app/Model/BusinessUnit';

@Injectable({
  providedIn: 'root'
})
export class BusinessUnitService {
  private readonly BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  postBusinessUnit(businessUnit: BusinessUnit): Observable<BusinessUnit> {
    const url = `${this.BASE_URL}/business-unit-categories`;
    return this.http.post<BusinessUnit>(url, businessUnit);
  }

  // Retrieve all business unit categories
  getBusinessUnits(): Observable<BusinessUnit[]> {
    const url = `${this.BASE_URL}/business-unit-categories`;
    return this.http.get<BusinessUnit[]>(url);
  }

  // Retrieve a specific business unit category by ID
  getBusinessUnitById(id: number): Observable<BusinessUnit> {
    const url = `${this.BASE_URL}/business-unit-categories/${id}`;
    return this.http.get<BusinessUnit>(url);
  }

  getBusinessUnitByName(name?: string): Observable<Boolean> {
    const url = `${this.BASE_URL}/business-unit-categories/check/${name}`;
    return this.http.get<Boolean>(url);
  }

  // Update an existing business unit category
  putBusinessUnit(id: number, businessUnit: BusinessUnit): Observable<BusinessUnit> {
    const url = `${this.BASE_URL}/business-unit-categories/${id}`;
    return this.http.put<BusinessUnit>(url, businessUnit);
  }

  // Delete a business unit category by ID
  deleteBusinessUnit(id: number): Observable<void> {
    const url = `${this.BASE_URL}/business-unit-categories/${id}`;
    return this.http.delete<void>(url);
  }
  deleteProcess(id: number): Observable<void> {
    const url = `${this.BASE_URL}/business-unit-categories/process/${id}`;
    return this.http.delete<void>(url);
  }
  processListByCategoryName(category: string): Observable<BusinessUnit[]> {
    const url = `${this.BASE_URL}/business-unit-categories/categories/${category}`;
    return this.http.get<BusinessUnit[]>(url);
  }
}
