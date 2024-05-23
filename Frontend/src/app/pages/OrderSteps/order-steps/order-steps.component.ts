import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { QueryParam } from 'src/app/Model/QueryParam';
import { OrdersService } from 'src/app/services/orders.service';
import { JobService } from '../../Jobs/Service/job.service';
import { EventItem } from 'src/app/Model/EventItem';
import { JobProcessedDetails } from 'src/app/Model/ProcessDetails';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { BusinessUnitProcessDto } from 'src/app/Model/BusinessUnit';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { AuthguardService } from 'src/app/services/authguard.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { SharedStateService } from '../shared-state.service';
import { Order } from 'src/app/Model/Order';
import { ProductRule } from 'src/app/Model/ProductRule';

@Component({
  selector: 'app-order-steps',
  templateUrl: './order-steps.component.html',
  styleUrls: ['./order-steps.component.css']
})
export class OrderStepsComponent implements OnInit , OnDestroy{


  private destroy$ = new Subject<void>();
  orderById: any = {};
  events: EventItem[] = [];
  jobById: Order | undefined | null;
  idFromQueryParam: number | undefined | null;
  orderIdWithPrefix: string | undefined | null;
  orderType: string | undefined | null;
  overviewActive: boolean = true;
  jobProcessedActive: boolean = false;
  paymentActive: boolean = false;
  disabledTabs: boolean[] = [];
  activeIndex: number = 0;
  confirmationActive: boolean = false;
  processedJobList: JobProcessedDetails[] = [];
  productRule: ProductRule | undefined | null
  active: string = '';
  nestedActive: string = '';

  constructor(
    private errorHandleService: ErrorHandleService,
    private successMsgService: SuccessMessageService,
    private orderService: OrdersService,
    private authGuardSerivce: AuthguardService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private sharedStateService : SharedStateService
  ) { }
  isButtonActive: boolean = true;
  private subscription !: Subscription;
  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.idFromQueryParam = +params['id'];
      this.orderType = params['orderType'];
      const prefix = this.orderType === 'auto' ? "PL-O-" : "PL-J-";
      this.orderIdWithPrefix = prefix + this.idFromQueryParam.toString();
      if (this.idFromQueryParam) {
        this.getOrderById(this.idFromQueryParam);
      }

    });
    this.subscription = this.sharedStateService.buttonActive$.subscribe(
      (isActive) => {
        this.isButtonActive = isActive;
      }
    );

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getOrderById(id: number): void {
    this.orderService.getOrderByIdAndType(id, this.orderType!)
      .subscribe(
        (data) => {
          this.orderById = data;
          debugger
          this.orderById.timeStamp = new Date(this.orderById.timeStamp[0], this.orderById.timeStamp[1] - 1, this.orderById.timeStamp[2], this.orderById.timeStamp[3], this.orderById.timeStamp[4]);
          this.orderById.timeStamp = this.datePipe.transform(this.orderById.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
          console.log(this.orderById.status);
        },
        (error) => {
          console.error('Error fetching order:', error);
        }
      );
  }

  copyIdToClipboard(id: string): void {
    const el = document.createElement('textarea');
    el.value = id;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

  }

  private getUpdatedTimeLine(id: number) {
    debugger
    this.jobService.getProcessedJobDetailsByProductRuleJobId(id).subscribe((res: JobProcessedDetails[]) => {
      this.processedJobList = res;
      this.events = [];
      this.processedJobList.forEach(job => {
        const event: EventItem = {
          status: job.processName,
          date: job.timeStamp ? this.formatDate(job.timeStamp) : null,
          icon: null,
          color: null,
          routerLink: null,
          queryParams: null,
          red: null
        };
        this.events.push(event);
      });
    }, (error: BackendErrorResponse) => {
      this.errorHandleService.showError(error.error.error);
    });
  }

  private formatDate(dateArray: number[] | Date): string | null {
    if (!Array.isArray(dateArray) || dateArray.length < 5) {
      return ''; // Invalid date format, return empty string
    }

    // Create a Date object from the array
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);

    // Format the Date object using DatePipe

    return this.datePipe.transform(date, 'EEEE, MMMM d, yyyy, h:mm a');
  }

  submit(category: BusinessUnitProcessDto, index: number, event: EventTarget) {
    // const isChecked = this.returnIfNotChecked(event);

    // if (!isChecked) {
    //   return;
    // }

    if (this.jobById?.processedDetailList) {
      this.jobById.processedDetailList[index].processName = category.process;

      // Get current timestamp
      const currentTimeStamp = new Date().getTime();

      // Add 5 hours in milliseconds
      const increasedTimeStamp = currentTimeStamp + (5 * 60 * 60 * 1000);

      // Create a new Date object with the increased timestamp
      const newTimeStamp = new Date(increasedTimeStamp);

      // Assign the new timestamp to the processed detail
      this.jobById.processedDetailList[index].timeStamp = newTimeStamp;

      const filteredList = this.filterProcessDetailList(this.jobById.processedDetailList);
      if (filteredList.length > 0) {
        this.jobById.processedDetailList = filteredList;
        this.orderService.updateOrder(this.idFromQueryParam!, this.jobById).subscribe(
          (res: any) => {
            this.handleRoles();
            this.getProcessList(this.idFromQueryParam!);
            if (this.overviewActive) {
              this.getUpdatedTimeLine(this.idFromQueryParam!);
            }
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

  // private returnIfNotChecked(event: EventTarget) {
  //   return (event as HTMLInputElement).checked;
  // }


  private decodeToken(): string {
    const token = localStorage.getItem('token');
    const decodedToken = this.authGuardSerivce.getDecodedAccessToken(token!);
    return decodedToken.ROLES[0];
  }

  private handleRoles() {

    const role = this.decodeToken();
    if (role !== 'ADMIN' && this.jobById?.processedDetailList && this.jobById?.processedDetailList?.length > 0) {
      // this.disableCheck = true;
      this.disabledTabs = this.jobById?.processedDetailList?.map(process => !!process.jobProcessed) || [];
    }
  }

  private async getProcessList(id: number) {
    return new Promise<void>((resolve, reject) => {
      this.orderService.getOrderByIdAndType(id, "manual").subscribe(
        (res: any) => {
          this.jobById = res;
          if (this.jobById?.processList && this.jobById.processedDetailList.length === 0) {
            this.jobById.processedDetailList = [];
            for (let i = 0; i < this.jobById.processList.length; i++) {
              this.jobById.processedDetailList?.push({
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
            this.jobById?.processList &&
            this.jobById.processedDetailList.length !== this.jobById.processList.length
          ) {
            const remainingLength = this.jobById.processList.length - this.jobById.processedDetailList.length;
            for (let i = 0; i < remainingLength; i++) {
              this.jobById.processedDetailList?.push({
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
          resolve();
        },
        (error: BackendErrorResponse) => {
          this.errorHandleService.showError(error.error.error);
          reject();
        }
      );
    });
  }
  getTimeLine(): void {
    this.nestedActive = 'overviewProduction';
    if (this.overviewActive) {
      this.getUpdatedTimeLine(this.productRule?.id!);
    } else {
      this.events = [];
    }
  }

}
