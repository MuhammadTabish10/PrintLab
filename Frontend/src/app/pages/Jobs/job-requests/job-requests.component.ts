import { Vendor } from './../../../Model/Vendor';
import { Component, Input, OnInit } from '@angular/core';
import { BusinessUnitProcessDto } from 'src/app/Model/BusinessUnit';
import { ProductionJob } from 'src/app/Model/ProductionJob';
import { JobService } from '../Service/job.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { JobProcessedDetails } from 'src/app/Model/ProcessDetails';
import { MenuItem } from 'primeng/api';
import { EventItem } from 'src/app/Model/EventItem';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { AuthguardService } from 'src/app/services/authguard.service';
import { DatePipe } from '@angular/common';
import { Observable, Subject, catchError, of, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProductRuleJob } from 'src/app/Model/ProductRuleJob';

@Component({
  selector: 'app-job-requests',
  templateUrl: './job-requests.component.html',
  styleUrls: ['./job-requests.component.css']
})
export class JobRequestsComponent implements OnInit {

  private destroy$ = new Subject<void>();

  openTabIndex: number | number[] | null | undefined;

  events: EventItem[] = [];

  disabledTabs: boolean[] = [];

  jobById: ProductionJob | undefined | null;

  isCurrentTabFilled: boolean = false;

  items: MenuItem[] | undefined;

  activeIndex: number = 0;


  paymentMethods: any[] = [
    {
      name: 'Cash'
    },
    {
      name: 'Credit'
    }
  ]
  // disableCheck: boolean = false;
  processedJobList: JobProcessedDetails[] = [];
  idFromQueryParam: number | null | undefined;
  productRuleJob: ProductRuleJob | null | undefined;
  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private jobService: JobService,
    private authGuardSerivce: AuthguardService,
    private errorHandleService: ErrorHandleService,
    private successMsgService: SuccessMessageService,
  ) { }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }
  
  @Input() jobProcessedActive: boolean = false;
  paymentActive: boolean = false;
  confirmationActive: boolean = false;
  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(param => {
      this.idFromQueryParam = +param['id'] || null;
    });
    if (this.idFromQueryParam && this.jobProcessedActive) {
      this.getProcessList(this.idFromQueryParam).then(() => {
        this.handleRoles();
      });
    }
  }

  private async getProcessList(id: number) {
    try {
      const productionJob: ProductionJob | undefined = await this.jobService.getProductionJobById(id).toPromise();
      this.jobById = productionJob;
      const productRuleJobs: ProductRuleJob[] | null | undefined = await this.getProductRuleJobByName(this.jobById?.productName).toPromise();
      this.productRuleJob = productRuleJobs ? productRuleJobs[0] : undefined;
      if (productRuleJobs && productRuleJobs.length && productRuleJobs.length > 0) {
        if (productRuleJobs[0].processList && productRuleJobs[0].processedDetailList.length === 0) {
          productRuleJobs[0].processedDetailList = [];
          for (let i = 0; i < productRuleJobs[0].processList.length; i++) {
            productRuleJobs[0].processedDetailList?.push({
              id: undefined,
              amount: undefined,
              vendor: undefined,
              payment: undefined,
              jobProcessed: undefined,
              status: undefined,
              processName: undefined,
              timeStamp: undefined
            });
          }
        } else if (
          productRuleJobs[0].processList &&
          productRuleJobs[0].processedDetailList.length !== productRuleJobs[0].processList.length
        ) {
          const remainingLength = productRuleJobs[0].processList.length - productRuleJobs[0].processedDetailList.length;
          for (let i = 0; i < remainingLength; i++) {
            productRuleJobs[0].processedDetailList?.push({
              id: undefined,
              amount: undefined,
              vendor: undefined,
              payment: undefined,
              jobProcessed: undefined,
              status: undefined,
              processName: undefined,
              timeStamp: undefined
            });
          }
        }
      }
    } catch (error: any) {
      this.errorHandleService.showError(error.error.error);
      throw error;
    }
  }

  submit(category: BusinessUnitProcessDto, index: number, event: EventTarget) {
    if (this.productRuleJob?.processedDetailList) {
      this.productRuleJob.processedDetailList[index].processName = category.process;
      // Get current timestamp
      const currentTimeStamp = new Date().getTime();
      // Add 5 hours in milliseconds
      const increasedTimeStamp = currentTimeStamp + (5 * 60 * 60 * 1000);
      // Create a new Date object with the increased timestamp
      const newTimeStamp = new Date(increasedTimeStamp);
      // Assign the new timestamp to the processed detail
      this.productRuleJob.processedDetailList[index].timeStamp = newTimeStamp;
      const filteredList = this.filterProcessDetailList(this.productRuleJob.processedDetailList);
      debugger
      if (filteredList.length > 0) {
        this.productRuleJob.processedDetailList = filteredList;
        this.jobService.updateProductRuleJob(this.productRuleJob.id!, this.productRuleJob).subscribe(
          (res: ProductRuleJob) => {
            this.handleRoles();
            this.getProcessList(this.idFromQueryParam!);
            this.successMsgService.showSuccess(`Job ${category.process!} processed successfully`);
          },
          (error: BackendErrorResponse) => {
            this.errorHandleService.showError(error.error.error);
          }
        );
      }
    }

  }


  private filterProcessDetailList(details: JobProcessedDetails[]): JobProcessedDetails[] {
    return details.filter(detail => detail.amount !== null && detail.amount !== undefined);
  }

  private decodeToken(): string {
    const token = localStorage.getItem('token');
    const decodedToken = this.authGuardSerivce.getDecodedAccessToken(token!);
    return decodedToken.ROLES[0];
  }

  private handleRoles() {
    const role = this.decodeToken();
    debugger
    if (role !== 'ADMIN' && this.productRuleJob?.processedDetailList && this.productRuleJob?.processedDetailList?.length > 0) {
      // this.disableCheck = true;
      this.disabledTabs = this.productRuleJob?.processedDetailList?.map(process => !!process.jobProcessed) || [];
    }
  }

  private getProductRuleJobByName(name: string | null | undefined): Observable<ProductRuleJob[] | null> {
    return this.jobService.getProductRuleJobByName(name).pipe(
      catchError((error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
        return of(null);
      })
    );
  }

}
