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
  selector: "app-job-requests",
  templateUrl: "./job-requests.component.html",
  styleUrls: ["./job-requests.component.css"],
})
export class JobRequestsComponent implements OnInit {
  openTabIndex: number | number[] | null | undefined;
  idFromQueryParam: number | null | undefined;
  productRule: ProductRule | null | undefined;
  private destroy$ = new Subject<void>();
  isCurrentTabFilled: boolean = false;
  orderById: Order | undefined;
  disabledTabs: boolean[] = [];
  paymentMethods: { name: string }[] = [{ name: "Cash" }, { name: "Credit" }];

  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private orderService: OrdersService,
    private authGuardService: AuthguardService,
    private errorHandleService: ErrorHandleService,
    private productRuleService: ProductRuleService,
    private successMsgService: SuccessMessageService
  ) {}

  @Input() jobProcessedActive: boolean = false;

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.idFromQueryParam = +params["id"] || null;
        if (this.idFromQueryParam && this.jobProcessedActive) {
          this.getProcessList(this.idFromQueryParam).then(() =>
            this.handleRoles()
          );
        }
      });
  }

  /**
   * Fetches the process list for a given order ID.
   * @param id The ID of the order.
   */
  private async getProcessList(id: number) {
    try {
      const productionJob = await this.getOrderByIdAndType(id);
      this.orderById = productionJob;

      if (productionJob) {
        const productRuleJobs = await this.getProductRuleJobByName(
          productionJob.product!
        );
        if (productRuleJobs && productRuleJobs.length > 0) {
          this.productRule = productRuleJobs[0];
          this.initializeProcessedDetailList(this.productRule);
        }
      }
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Fetches an order by its ID and type.
   * @param id The ID of the order.
   * @param type The type of the order.
   * @returns The fetched order.
   */
  private async getOrderByIdAndType(id: number): Promise<Order | undefined> {
    return this.orderService.getOrderById(id).toPromise();
  }

  /**
   * Fetches product rule jobs by product name.
   * @param productName The name of the product.
   * @returns A list of product rules.
   */
  private async getProductRuleJobByName(
    productName: string
  ): Promise<ProductRule[] | undefined> {
    if (!productName) return undefined;
    return this.productRuleService.searchProduct(productName).toPromise();
  }

  /**
   * Initializes the processed detail list for a product rule.
   * @param productRule The product rule to initialize.
   */
  private initializeProcessedDetailList(productRule: ProductRule) {
    const processList = productRule.processList || [];
    let processedDetailList = productRule.processedDetailList || [];

    if (processedDetailList.length === 0) {
      processedDetailList = this.createProcessedDetailList(processList.length);
    } else if (processedDetailList.length !== processList.length) {
      const remainingLength = processList.length - processedDetailList.length;
      processedDetailList = [
        ...processedDetailList,
        ...this.createProcessedDetailList(remainingLength),
      ];
    }

    productRule.processedDetailList = processedDetailList;
  }

  /**
   * Creates a list of processed detail items with undefined values.
   * @param length The number of items to create.
   * @returns A list of processed detail items.
   */
  private createProcessedDetailList(length: number): JobProcessedDetails[] {
    return Array.from({ length }, () => ({
      id: undefined,
      amount: undefined,
      vendor: undefined,
      payment: undefined,
      jobProcessed: undefined,
      status: undefined,
      processName: undefined,
      timeStamp: undefined,
      description: undefined,
      order: {
        id: this.idFromQueryParam,
      },
    }));
  }

  /**
   * Handles errors by showing an error message and rethrowing the error.
   * @param error The error to handle.
   */
  private handleError(error: any) {
    this.errorHandleService.showError(error.error?.error);
    throw error;
  }

  /**
   * Submits the processed job details.
   * @param category The process category details.
   * @param index The index of the detail to update.
   * @param event The event triggering the submission.
   */
  // submit(category: BusinessUnitProcessDto, index: number, event: EventTarget) {
  //   if (this.productRule?.processedDetailList) {
  //     this.productRule.processedDetailList[index].processName = category.process;

  //     const currentTimeStamp = new Date().getTime();
  //     const increasedTimeStamp = currentTimeStamp + (5 * 60 * 60 * 1000);
  //     const newTimeStamp = new Date(increasedTimeStamp);
  //     this.productRule.processedDetailList[index].timeStamp = newTimeStamp;

  //     const filteredList = this.filterProcessDetailList(this.productRule.processedDetailList);

  //     if (filteredList.length > 0) {
  //       this.productRule.processedDetailList = filteredList;
  //       this.productRuleService.updateProductRule(this.productRule.id!, this.productRule).subscribe(
  //         (res: ProductRule) => {
  //           this.handleRoles();
  //           this.getProcessList(this.idFromQueryParam!);
  //           this.successMsgService.showSuccess(`Job ${category.process!} processed successfully`);
  //         },
  //         (error: BackendErrorResponse) => {
  //           this.errorHandleService.showError(error.error.error);
  //         }
  //       );
  //     }
  //   }
  // }

  submit(category: BusinessUnitProcessDto, index: number, event: EventTarget) {
    if (this.productRule?.processedDetailList) {
      this.productRule.processedDetailList[index].processName =
        category.process;

      const currentTimeStamp = new Date().getTime();
      const increasedTimeStamp = currentTimeStamp + 5 * 60 * 60 * 1000;
      const newTimeStamp = new Date(increasedTimeStamp);
      this.productRule.processedDetailList[index].timeStamp = newTimeStamp;

      // Ensure the order property is correctly set
      this.productRule.processedDetailList.forEach((detail) => {
        detail.order = { id: this.idFromQueryParam };
      });

      const filteredList = this.filterProcessDetailList(
        this.productRule.processedDetailList
      );

      if (filteredList.length > 0) {
        this.productRule.processedDetailList = filteredList;
        this.productRuleService
          .updateProductRule(this.productRule.id!, this.productRule)
          .subscribe(
            (res: ProductRule) => {
              this.handleRoles();
              this.getProcessList(this.idFromQueryParam!);
              this.successMsgService.showSuccess(
                `Job ${category.process!} processed successfully`
              );
            },
            (error: BackendErrorResponse) => {
              this.errorHandleService.showError(error.error.error);
            }
          );
      }
    }
  }

  /**
   * Filters the process detail list to exclude items with null or undefined amounts.
   * @param details The list of process details.
   * @returns A filtered list of process details.
   */
  private filterProcessDetailList(
    details: JobProcessedDetails[]
  ): JobProcessedDetails[] {
    return details.filter(
      (detail) => detail.amount !== null && detail.amount !== undefined
    );
  }

  /**
   * Decodes the token to get the user role.
   * @returns The user role.
   */
  private decodeToken(): string {
    const token = localStorage.getItem("token");
    const decodedToken = this.authGuardService.getDecodedAccessToken(token!);
    return decodedToken.ROLES[0];
  }

  /**
   * Handles role-based logic for the component.
   */
  private handleRoles() {
    const role = this.decodeToken();
    if (role !== "ADMIN" && this.productRule?.processedDetailList?.length) {
      this.disabledTabs =
        this.productRule.processedDetailList.map(
          (process) => !!process.jobProcessed
        ) || [];
    }
  }
}
