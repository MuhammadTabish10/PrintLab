import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthguardService } from 'src/app/services/authguard.service';
import { Observable, Subject, catchError, map, takeUntil } from 'rxjs';
import { Order } from 'src/app/Model/Order';
import { PaginatorState } from 'primeng/paginator';
import { PaginationResponse } from 'src/app/Model/PaginationResponse';
import { DatePipe } from '@angular/common';
import { Business } from 'src/app/Model/Business';
import { CustomerService } from 'src/app/services/customer.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { BusinessUnitService } from '../business-unit-and-processes/Service/business-unit.service';
import { BusinessUnit } from 'src/app/Model/BusinessUnit';
import { GlobalVariables } from '../add-order/GlobalVariables';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { User } from 'src/app/Model/User';

export interface Roles {
  name?: string;

}
export interface AssignedUser {
  designer?: string;
  production?: string;
  plateSetter?: string;
};
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {

  error: string = ''
  visible!: boolean
  tableData: Boolean = false
  search: string = ''
  roleArray: Roles[] | undefined;
  userArray: any;
  selectedRole: any;
  selectedUser: any;
  selectedOrderId: any;
  assignedUsers: any;
  plzSelect: boolean = false;
  processOptions: boolean = false;
  orderId: number = 0;
  idFromQueryParam: number | undefined | null;
  currentUserDetail: any = {};
  role: string | undefined | null;
  buttonOption: boolean = true;
  items: MenuItem[] | undefined;
  private destroy$ = new Subject<void>();
  paginatedOrders: PaginationResponse<Order> | undefined | null;
  order: Order = { ...GlobalVariables.order }
  businessList: Business[] = []
  renderTableNow: boolean = false;
  combinedFilterValue: string = '';
  selectedDate: Date | null = null;
  createdBy: User = {
    id: undefined,
    createdAt: undefined,
    name: undefined,
    email: undefined,
    password: undefined,
    phone: undefined,
    cnic: undefined,
    roles: [],
    status: undefined
  };
  constructor(
    private successHandleService: SuccessMessageService,
    private businessUnitService: BusinessUnitService,
    private errorHandleService: ErrorHandleService,
    private customerService: CustomerService,
    private authService: AuthguardService,
    private orderService: OrdersService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.cdr.detectChanges();
    this.accessQueryParams();
    this.initializeItems();
    this.initializeRoles();
    this.getBusinessList();
    this.getUserDetails();
    this.getOrders()
  }

  private accessQueryParams(): void {
    this.route.queryParams.subscribe(
      (param: Params) => {
        this.idFromQueryParam = +param['id'];
      }, (error) => {
        throw new Error(error);
      })
  }

  private initializeRoles(): void {
    this.roleArray = [
      { name: "ROLE_DESIGNER" },
      { name: "ROLE_PRODUCTION" },
      { name: "ROLE_PLATE_SETTER" }
    ]
  }

  private initializeItems(): void {
    this.items = [
      {
        label: 'Add Order',
        icon: 'pi pi-cart-plus',
        items: [
          {
            label: 'Auto',
            icon: 'pi pi-spin pi-cog',
            routerLink: "/addOrder",
            queryParams: { orderType: 'auto' }
          },
          {
            label: 'Manual',
            icon: 'pi pi-wrench',
            routerLink: '/addOrder',
            queryParams: { orderType: 'manual' }
          },
          {
            label: 'Group Sheet',
            icon: 'pi pi-id-card',
            queryParams: { orderType: 'groupSheet' }
          },
        ]
      },
    ]
  }
  getBusinessList() {
    this.customerService.getAllBusinesses().subscribe(
      (res: Business[]) => {
        this.businessList = res;
      }, (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      }
    )
  }

  public getOrders(pageState?: PaginatorState, order?: Order): void {
    if (this.createdBy && order) {
      this.order.createdBy = this.createdBy;
    }
    this.renderTableNow = false;
    this.orderService.getOrders(pageState, order!).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      async (res: PaginationResponse<Order>) => {
        this.paginatedOrders = res;
        if (this.paginatedOrders?.content) {
          if (this.role !== "ROLE_ADMIN") {
            this.paginatedOrders.content = res.content.filter((order: Order) => {
              return this.doesCreatedByMatch(order);
            });
            this.buttonOption = false;
          } else {
            this.paginatedOrders.content = res.content;
          }
          await this.transformOrders();
          if (this.isAllReady()) {
            this.renderTableNow = true;

          }
        }
      },
      (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
        this.visible = true;
      }
    );
  }

  public async transformOrders() {
    if (this.paginatedOrders?.content) {
      for (const element of this.paginatedOrders.content) {
        const businessCategoryId = parseInt(element.businessCategory!);
        if (!isNaN(businessCategoryId)) {
          // businessCategory is a string containing a number, transform it
          try {
            const businessCategory = await this.getBusinessCategoryById(businessCategoryId).toPromise();
            element.businessCategory = businessCategory ?? '';
          } catch (error) {
            console.error(error);
          }
        }
        this.transformTimeStamp(this.paginatedOrders.content);
        if (element.size && this.isJsonString(element.size)) {
          element.size = JSON.parse(element.size!).inch;
        }
      }
    }
  }

  private isAllReady(): boolean {
    // Check if all necessary data is ready
    return !!this.paginatedOrders && !!this.paginatedOrders.content;
  }

  getBusinessCategoryById(businessCategory: number): Observable<string | null | undefined> {
    return this.businessUnitService.getBusinessUnitById(businessCategory).pipe(
      map((res: BusinessUnit) => {
        return res.name;
      }),
      catchError((error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
        throw error;
      })
    );
  }

  isJsonString(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  getUsersByRole(role: any) {
    this.orderService.getUserByRole(role.name).subscribe(res => {
      this.userArray = res
    }, (error: BackendErrorResponse) => {
      this.errorHandleService.showError(error.error.error);
    })
  }

  editOrder(id: number, type: string) {
    this.router.navigate(['/addOrder'], { queryParams: { id: id, orderType: type } });
  }

  viewOrder(id: number, type: string) {
    this.router.navigate(['/viewOrder'], { queryParams: { id: id, orderType: type } });
  }

  deleteOrder(id: number, type: string) {
    this.orderService.deleteOrder(id).subscribe(() => {
      this.getOrders()
    }, error => {
      this.errorHandleService.showError(error.error.error);
      this.visible = true
    })
  }

  assignOrder(getById: number) {
    this.showDialog(getById);
  }

  showDialog(getById: number) {
    this.selectedRole = null;
    this.selectedUser = null;
    this.visible = true;
    this.selectedOrderId = getById;
  }

  saveOrder(user?: any, role?: any, orderId?: number, logedInUser?: any) {
    this.orderService.saveAssignedUser(user?.id, role?.name, orderId ? orderId : 0, logedInUser?.userId).subscribe(
      (res: any) => {
        this.plzSelect = false;
        this.visible = false;
        this.getOrders();
      }, err => {
        this.plzSelect = true;
      });
  }
  orderProcessCtp(orderId: number) {
    this.router.navigate(['/order-timeline'], { queryParams: { id: orderId } });
  }

  onRowClick(event: MouseEvent, orderId: number, type: string): void {
    // Check if the click occurred on a button
    const isButton = (event.target as HTMLElement).tagName === 'BUTTON' ||
      (event.target as HTMLElement).tagName === 'SMALL' ||
      (event.target as HTMLElement).tagName === 'I';

    if (!isButton) {
      // If the click didn't occur on a button, navigate to order overview
      this.router.navigate(['/order-overview'],
        {
          queryParams: {
            id: orderId,
            orderType: type
          }
        });
    }
  }

  private doesCreatedByMatch(order: any): boolean {
    return (order.createdBy && order.createdBy.id === this.currentUserDetail.userId) ||
      (order.designer && order.designer.id === this.currentUserDetail.userId);
  }

  private getUserDetails(): void {
    this.currentUserDetail = JSON.parse(this.authService.token).userDetails;
    this.role = this.currentUserDetail.authorities[0].authority;
  }

  private transformTimeStamp(orderList: Order[]): Order[] {
    return orderList.map((el: Order) => {
      const dateArray = el.timeStamp;
      if (dateArray && Array.isArray(dateArray)) {
        const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5], dateArray[6] / 1000000);
        el.timeStamp = this.datePipe.transform(date, 'EEEE, MMMM d, yyyy, h:mm a');
      }
      return el;
    });
  }
  onDateSelect(date: any): void {
    const uiDate = new Date(date);
    const formattedDate = this.formatDateToCustomString(uiDate);
    console.log(formattedDate);
    this.order.timeStamp = formattedDate;
    this.getOrders(undefined, this.order);
  }
  formatDateToCustomString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  public clearOrderTable(): void {
    this.order = { ...GlobalVariables.order };
    this.getOrders(undefined, this.order);
  }

  updateCombinedFilter(date: Date | null) {
    // This method updates the combined filter value when the date is selected from the calendar
    if (date) {
      // Format the selected date as needed
      const formattedDate = date.toISOString().slice(0, 10); // Assuming ISO date format YYYY-MM-DD
      this.combinedFilterValue = formattedDate;
    } else {
      this.combinedFilterValue = ''; // Reset filter value if date is cleared
    }
    this.getOrders(); // Update orders based on combined filter value
  }
}
