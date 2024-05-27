import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { JobService } from '../../Jobs/Service/job.service';
import { EventItem } from 'src/app/Model/EventItem';
import { JobProcessedDetails } from 'src/app/Model/ProcessDetails';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Order } from 'src/app/Model/Order';
import { ProductRule } from 'src/app/Model/ProductRule';
import { ProductRuleService } from 'src/app/services/product-rule.service';

@Component({
  selector: 'app-order-steps',
  templateUrl: './order-steps.component.html',
  styleUrls: ['./order-steps.component.css']
})
export class OrderStepsComponent implements OnInit, OnDestroy {


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
    private productRuleService: ProductRuleService,
    private orderService: OrdersService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) { }
  isButtonActive: boolean = true;
  private subscription !: Subscription;
  ngOnInit(): void {
    this.active = 'overview';
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.idFromQueryParam = +params['id'];
      this.orderType = params['orderType'];
      const prefix = this.orderType === 'auto' ? "PL-O-" : "PL-J-";
      this.orderIdWithPrefix = prefix + this.idFromQueryParam.toString();
      if (this.idFromQueryParam) {
        this.getOrderById(this.idFromQueryParam);
      }
    });
  }

  ngOnDestroy() {

  }

  private getOrderById(id: number): void {
    this.orderService.getOrderById(id)
      .subscribe(
        (data: Order) => {
          this.orderById = data;
          this.getProductRuleByName(this.orderById.product);
          this.orderById.timeStamp = new Date(this.orderById.timeStamp[0], this.orderById.timeStamp[1] - 1, this.orderById.timeStamp[2], this.orderById.timeStamp[3], this.orderById.timeStamp[4]);
          this.orderById.timeStamp = this.datePipe.transform(this.orderById.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
          console.log(this.orderById.status);
        },
        (error) => {
          console.error('Error fetching order:', error);
        }
      );
  }

  public copyIdToClipboard(id: string): void {
    const el = document.createElement('textarea');
    el.value = id;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.successMsgService.showSuccess('Id copied to clipboard');
  }

  private getUpdatedTimeLine(id: number) {
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
      this.events = [];
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

  public getTimeLine(): void {
    this.nestedActive = 'overviewProduction';
    if (this.overviewActive) {
      this.getUpdatedTimeLine(this.productRule?.id!);
    } else {
      this.events = [];
    }
  }
  private getProductRuleByName(productName: string): void {
    this.productRuleService.searchProduct(productName).subscribe(
      (res: ProductRule[]) => {
        this.productRule = res[0];
      },
      (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      })
  }
}
