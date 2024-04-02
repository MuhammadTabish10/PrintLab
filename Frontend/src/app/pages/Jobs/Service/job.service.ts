import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { JobProcessedDetails } from 'src/app/Model/ProcessDetails';
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
  getProcessedJobDetailsByProductionId(id:number): Observable<JobProcessedDetails[]> {
    const url = `${this.BASE_URL}/job-details/by-production/${id}`;
    return this.http.get<JobProcessedDetails[]>(url);
  }

  // Post production job
  postProductionJob(job: ProductionJob): Observable<ProductionJob> {
    const url = `${this.BASE_URL}/production-jobs`;
    return this.http.post<ProductionJob>(url, job);
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
}
