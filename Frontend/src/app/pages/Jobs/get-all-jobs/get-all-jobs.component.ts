// import { Component, OnInit } from '@angular/core';
// import { JobService } from '../Service/job.service';
// import { ProductionJob } from 'src/app/Model/ProductionJob';
// import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
// import { ErrorHandleService } from 'src/app/services/error-handle.service';
// import { SuccessMessageService } from 'src/app/services/success-message.service';

// @Component({
//   selector: 'app-get-all-jobs',
//   templateUrl: './get-all-jobs.component.html',
//   styleUrls: ['./get-all-jobs.component.css']
// })
// export class GetAllJobsComponent implements OnInit {
//   jobList: ProductionJob[] = [];
//   visible: boolean = false;
//   job: ProductionJob = {
//     id: undefined,
//     jobId: undefined,
//     client: undefined,
//     productCategory: undefined,
//     productName: undefined,
//     description: undefined,
//     qty: undefined,
//     rate: undefined,
//     amount: undefined,
//     linkedInvoice: undefined,
//     privateNotes: undefined,
//     orderTrackingNotes: undefined,
//     productionNotes: undefined,
//     businessCategory: undefined,
//     ctpFileName: undefined,
//     locationOfFile: undefined,
//     sentOn: undefined,
//     designPackageFile: undefined,
//     locationOfDesignFile: undefined,
//     jobStartDate: undefined,
//     productionStartDate: undefined,
//     productionEndDate: undefined,
//     packingAndQADate: undefined,
//     deliveryDate: undefined,
//     expiryDate: undefined,
//     sendTo: undefined,
//     productionUser: undefined,
//     processedDetailList: [],
//     sizeCategory: undefined,
//     size: undefined,
//     type: undefined
//   };

//   constructor(
//     private successService: SuccessMessageService,
//     private errorService: ErrorHandleService,
//     private jobsService: JobService
//   ) { }
//   ngOnInit(): void {
//     this.getAllJobs();
//   }

//   private getAllJobs(): void {
//     this.jobsService.getAllProductionJobs().subscribe(
//       (res: ProductionJob[]) => {
//         this.jobList = res;

//       }, (error: BackendErrorResponse) => {
//         this.errorService.showError(error.error.error);
//       }
//     );
//   }

//   showDialog(job: ProductionJob): void {
//     this.visible = true;
//     this.job = job;
//   }
//   deleteJob(id: number): void {
//     this.jobsService.deleteProductionJob(id).subscribe(() => {
//       this.visible = false;
//       this.successService.showSuccess('Job deleted successfully');
//       this.getAllJobs();
//     }, (error: BackendErrorResponse) => {
//       this.errorService.showError(error.error.error);
//     }
//     );
//   }
// }
