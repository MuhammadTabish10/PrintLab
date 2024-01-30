import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { ProductCategory } from 'src/app/Model/ProductCategory';
import { ProductService } from 'src/app/Model/ProductService';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private readonly BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  postProductCategory(obj: ProductCategory): Observable<ProductCategory> {
    let url = `${this.BASE_URL}/product-category`;
    return this.http.post<ProductCategory>(url, obj);
  }

  postProductService(obj: ProductService): Observable<ProductService> {
    let url = `${this.BASE_URL}/product-and-service`;
    return this.http.post<ProductService>(url, obj);
  }


  getAllProductCategory(): Observable<ProductCategory[]> {
    let url = `${this.BASE_URL}/product-category`;
    return this.http.get<ProductCategory[]>(url);
  }
  getAllProductService(): Observable<ProductService[]> {
    let url = `${this.BASE_URL}/product-and-service`;
    return this.http.get<ProductService[]>(url);
  }

  deleteProductCategoryById(id: number): Observable<ProductCategory> {
    let url = `${this.BASE_URL}/product-category/${id}`;
    return this.http.delete<ProductCategory>(url);
  }

  deleteProductServiceById(id: number): Observable<ProductService> {
    let url = `${this.BASE_URL}/product-and-service/${id}`;
    return this.http.delete<ProductService>(url);
  }

  getProductCategoryById(id: number): Observable<ProductCategory> {
    let url = `${this.BASE_URL}/product-category/${id}`;
    return this.http.get<ProductCategory>(url);
  }
  getProductServiceById(id: number): Observable<ProductService> {
    let url = `${this.BASE_URL}/product-and-service/${id}`;
    return this.http.get<ProductService>(url);
  }

  updateProductCategory(id: number, obj: ProductCategory): Observable<ProductCategory> {
    let url = `${this.BASE_URL}/product-category/${id}`;
    return this.http.put<ProductCategory>(url, obj);
  }
  updateProductService(id: number, obj: ProductService): Observable<ProductService> {
    let url = `${this.BASE_URL}/product-and-service/${id}`;
    return this.http.put<ProductService>(url, obj);
  }

  searchProductCategoryByName(name: string): Observable<ProductCategory[]> {
    let url = `${this.BASE_URL}/product-category/${name}`;
    return this.http.get<ProductCategory[]>(url);
  }
  searchProductSubCategoryByCategory(id: number): Observable<ProductCategory[]> {
    let url = `${this.BASE_URL}/product-category/${id}`;
    return this.http.get<ProductCategory[]>(url);
  }
  searchProductServiceByName(name: string): Observable<ProductService[]> {
    let url = `${this.BASE_URL}/product-and-service/${name}`;
    return this.http.get<ProductService[]>(url);
  }
}
