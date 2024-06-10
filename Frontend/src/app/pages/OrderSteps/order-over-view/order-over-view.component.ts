import { RequestBodyOrderPaymentHistory } from './RequestBody';
import { GlobalVariables } from './../../add-order/GlobalVariables';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { BusinessUnitService } from '../../business-unit-and-processes/Service/business-unit.service';
import { BusinessUnit } from 'src/app/Model/BusinessUnit';
import { Order } from 'src/app/Model/Order';
import { OrderPaymentHistory } from 'src/app/Model/OrderPaymentHistory';
import { OrderPaymentHistoryService } from 'src/app/services/order-payment-history.service';
import { Business, BusinessBranch } from 'src/app/Model/Business';
import { User } from 'src/app/Model/User';
import { UserService } from 'src/app/services/user.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { ProductField } from 'src/app/Model/ProductField';

@Component({
  selector: 'app-order-over-view',
  templateUrl: './order-over-view.component.html',
  styleUrls: ['./order-over-view.component.css']
})
export class OrderOverViewComponent implements OnInit {
  orderById: Order = { ...GlobalVariables.order };
  idFromQueryParam: number | undefined | null;
  orderType: string | undefined | null;
  category: string | null | undefined;
  orderPaymentHistoryList: OrderPaymentHistory[] = [];
  visible: boolean = false;
  paymentHistoryBody: OrderPaymentHistory = { ...RequestBodyOrderPaymentHistory.class };
  userList: any[] = [];
  cashTypes: ProductField | undefined | null;
  branchList: BusinessBranch[] = [];
  selectedBusiness: Business | undefined | null;
  selectedBranch: BusinessBranch | undefined | null;
  selectedUser: User | undefined | null;

  constructor(
    private orderPaymentHistoryService: OrderPaymentHistoryService,
    private productFieldService: ProductDefinitionService,
    private businessUnitService: BusinessUnitService,
    private errorService: ErrorHandleService,
    private orderService: OrdersService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.accessParams();
    this.getAllUsers();
    this.getCashTypeList("CASH_TYPES");
  }

  private accessParams() {
    this.route.queryParams.subscribe(
      (params: Params) => {
        this.idFromQueryParam = +params['id'];
        this.orderType = params['orderType'];
        this.getOrderById(this.idFromQueryParam);
        this.getPaymentHistoryByOrderId(this.idFromQueryParam);
      });
  }

  private getOrderById(id: number): void {
    this.orderService.getOrderById(id).subscribe(
      (data: Order) => {
        if (data.type === "auto") {
          this.orderById = data;
          // Parse the size only if it's a valid JSON string
          if (this.orderById.size) {
            try {
              const parsedSize = JSON.parse(this.orderById.size) as { inch: string };
              // Ensure the parsed object has the 'inch' property
              this.orderById.size = parsedSize.inch;
            } catch (e) {
              console.error('Error parsing size:', e);
            }
          } else {
            console.error('Size is null or undefined:', this.orderById.size);
          }
        } else {
          this.orderById = data;
          this.getCategoryById(+this.orderById.businessCategory!);
        }
      },
      (error) => {
        console.error('Error fetching order:', error);
      }
    );
  }

  private getCategoryById(id: number): void {
    this.businessUnitService.getBusinessUnitById(id).subscribe(
      (data: BusinessUnit) => {
        this.category = data.name;
      },
      (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    );
  }

  private getPaymentHistoryByOrderId(id: number): void {
    this.orderPaymentHistoryService.getPaymentHistoryByOrderId(id).subscribe(
      (data: OrderPaymentHistory[]) => {
        this.orderPaymentHistoryList = data;
        console.log(data);
      },
      (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    );
  }
  public show(): void {
    this.visible = true;
  }
  public clear(): void {
    this.visible = false;
  }

  submit(): void {
    this.paymentHistoryBody.businessBranch = [this.selectedBranch!];
    this.paymentHistoryBody.paymentReceivedBy = [this.selectedUser!];
    this.paymentHistoryBody.order = this.orderById;
    this.orderPaymentHistoryService.saveOrderPaymentHistory(this.idFromQueryParam!, this.paymentHistoryBody).subscribe(
      (data: OrderPaymentHistory) => {
        this.getPaymentHistoryByOrderId(this.idFromQueryParam!);
      },
      (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    )
  }
  private getAllUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.userList = data;
      },
      (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    );
  }

  getCashTypeList(field: string) {
    this.productFieldService.searchProductField(field).subscribe(
      (res: any) => {
        this.cashTypes = res[0];
      }, (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    )
  }

  getBranchList(selectedBusiness: Business): void {
    this.branchList = [];
    if (selectedBusiness.businessBranchList?.length === 0) {
      return;
    }

    selectedBusiness.businessBranchList?.forEach((branch: BusinessBranch) => {
      if (branch.branchName) {
        this.branchList.push(branch);
      }
    });
    this.paymentHistoryBody.business = [selectedBusiness];
    console.log(this.paymentHistoryBody);

  }
}
