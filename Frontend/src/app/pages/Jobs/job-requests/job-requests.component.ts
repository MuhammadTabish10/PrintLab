import { ProductRuleService } from 'src/app/services/product-rule.service';
import { Component, Input, OnInit } from '@angular/core';
import { BusinessUnitProcessDto } from 'src/app/Model/BusinessUnit';
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
import { SharedStateService } from '../../OrderSteps/shared-state.service';
import { Order } from 'src/app/Model/Order';
import { ProductRule } from 'src/app/Model/ProductRule';
import { OrdersService } from 'src/app/services/orders.service';

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

  orderById: Order | undefined;

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
  productRule: ProductRule | null | undefined;
  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private orderService: OrdersService,
    private authGuardSerivce: AuthguardService,
    private errorHandleService: ErrorHandleService,
    private ProductRuleService: ProductRuleService,
    private successMsgService: SuccessMessageService,
    private sharedStateService : SharedStateService
  ) { }

  onCheckboxChange(event: any) {
    this.sharedStateService.setButtonActive(event.target.checked);
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
      const productionJob = await this.orderService.getOrderByIdAndType(id, "manual").toPromise();
      this.orderById = productionJob;
      const productRuleJobs: ProductRule[] | null | undefined = await this.getProductRuleJobByName(this.orderById?.product).toPromise();
      this.productRule = productRuleJobs ? productRuleJobs[0] : undefined;
      if (productRuleJobs && productRuleJobs.length && productRuleJobs.length > 0) {
        if (productRuleJobs[0].processList && productRuleJobs[0].processedDetailList
          && productRuleJobs[0].processedDetailList.length === 0) {
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
          productRuleJobs[0].processList && productRuleJobs[0].processedDetailList &&
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
    if (this.productRule?.processedDetailList) {
      this.productRule.processedDetailList[index].processName = category.process;
      // Get current timestamp
      const currentTimeStamp = new Date().getTime();
      // Add 5 hours in milliseconds
      const increasedTimeStamp = currentTimeStamp + (5 * 60 * 60 * 1000);
      // Create a new Date object with the increased timestamp
      const newTimeStamp = new Date(increasedTimeStamp);
      // Assign the new timestamp to the processed detail
      this.productRule.processedDetailList[index].timeStamp = newTimeStamp;
      const filteredList = this.filterProcessDetailList(this.productRule.processedDetailList);
      debugger
      if (filteredList.length > 0) {
        this.productRule.processedDetailList = filteredList;
        this.ProductRuleService.updateProductRule(this.productRule.id!, this.productRule).subscribe(
          (res: ProductRule) => {
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
    if (role !== 'ADMIN' && this.productRule?.processedDetailList && this.productRule?.processedDetailList?.length > 0) {
      // this.disableCheck = true;
      this.disabledTabs = this.productRule?.processedDetailList?.map(process => !!process.jobProcessed) || [];
    }
  }

  private getProductRuleJobByName(name: string | null | undefined): Observable<ProductRule[] | null> {
    return this.ProductRuleService.searchProduct(name!).pipe(
      catchError((error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
        return of(null);
      })
    );
  }

}
