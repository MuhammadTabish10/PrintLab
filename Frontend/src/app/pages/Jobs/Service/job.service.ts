import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { JobProcessedDetails } from 'src/app/Model/ProcessDetails';
import { ProductRuleJob } from 'src/app/Model/ProductRuleJob';
import { ProductionJob } from 'src/app/Model/ProductionJob';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private readonly BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  // Get all production jobs
  getAllProductionJobs(): Observable<ProductionJob[]> {
    const url = `${this.BASE_URL}/production-jobs`;
    return this.http.get<ProductionJob[]>(url);
  }

  // Get production job by ID
  getProductionJobById(id: number): Observable<ProductionJob> {
    const url = `${this.BASE_URL}/production-jobs/${id}`;
    return this.http.get<ProductionJob>(url);
  }

  // Get details of job by production iD
  getProcessedJobDetailsByProductRuleJobId(id: number): Observable<JobProcessedDetails[]> {
    const url = `${this.BASE_URL}/job-details/by-product/${id}`;
    return this.http.get<JobProcessedDetails[]>(url);
  }

  // Post production job
  postProductionJob(job: ProductionJob, id: number): Observable<ProductionJob> {
    const url = `${this.BASE_URL}/production-jobs`;
    const params = {
      loggedInUserId: id
    }
    return this.http.post<ProductionJob>(url, job, { params });
  }

  // Update production job
  updateProductionJob(id: number, job: ProductionJob): Observable<ProductionJob> {
    const url = `${this.BASE_URL}/production-jobs/${id}`;
    return this.http.put<ProductionJob>(url, job);
  }

  // Delete production job
  deleteProductionJob(id: number): Observable<void> {
    const url = `${this.BASE_URL}/production-jobs/${id}`;
    return this.http.delete<void>(url);
  }
  // Get all product Rule jobs
  getAllProductRuleJob(): Observable<ProductRuleJob[]> {
    const url = `${this.BASE_URL}/product-rule-jobs`;
    return this.http.get<ProductRuleJob[]>(url);
  }

  // Get product Rule job by ID
  getProductRuleJobById(id: number): Observable<ProductRuleJob> {
    const url = `${this.BASE_URL}/product-rule-jobs/${id}`;
    return this.http.get<ProductRuleJob>(url);
  }
  // Get product Rule job by Name
  getProductRuleJobByName(name: string | null | undefined): Observable<ProductRuleJob[]> {
    const url = `${this.BASE_URL}/product-rule-jobs/get-by-name/${name}`;
    return this.http.get<ProductRuleJob[]>(url);
  }

  // Post production job
  postProductRuleJob(job: ProductRuleJob): Observable<ProductRuleJob> {
    const url = `${this.BASE_URL}/product-rule-jobs`;
    return this.http.post<ProductRuleJob>(url, job);
  }

  // Update product Rule job
  updateProductRuleJob(id: number, job: ProductRuleJob): Observable<ProductRuleJob> {
    const url = `${this.BASE_URL}/product-rule-jobs/${id}`;
    return this.http.put<ProductRuleJob>(url, job);
  }

  // Delete production job
  deleteProductRuleJob(id: number): Observable<void> {
    const url = `${this.BASE_URL}/product-rule-jobs/${id}`;
    return this.http.delete<void>(url);
  }

  checkUniqueProduct(productName: string): Observable<boolean> {
    const url = `${this.BASE_URL}/product-rule-jobs/check-title/${productName}`;
    return this.http.get<boolean>(url);
  }

  // Assign Job
  saveAssignedUser(user: number, role: string, orderId: number, logedInUser: number): Observable<ProductionJob> {
    const url = `${this.BASE_URL}/production-jobs/assignUser`;
    const params = {
      orderId: orderId,
      userId: user,
      role: role,
      loggedInUser: logedInUser
    };
    return this.http.post<ProductionJob>(url, null, { params });
  }
}
