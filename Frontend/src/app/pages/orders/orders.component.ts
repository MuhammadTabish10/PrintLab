import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthguardService } from 'src/app/services/authguard.service';
import { JobService } from '../Jobs/Service/job.service';
import { Subject, takeUntil } from 'rxjs';
import { Table } from 'primeng/table';
import { Order } from 'src/app/Model/Order';
import { PaginatorState } from 'primeng/paginator';
import { PaginationResponse } from 'src/app/Model/PaginationResponse';

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
  order: Order = {
    id: undefined,
    product: undefined,
    paper: undefined,
    sizeCategory: undefined,
    size: undefined,
    gsm: undefined,
    quantity: undefined,
    amount: undefined,
    jobColorsFront: undefined,
    sideOptionValue: undefined,
    impositionValue: undefined,
    jobColorsBack: undefined,
    providedDesign: undefined,
    url: undefined,
    productRule: undefined,
    status: undefined,
    type: undefined,
    ctpProcess: undefined,
    pressMachineProcess: undefined,
    paperMarketProcess: undefined,
    designer: undefined,
    production: undefined,
    plateSetter: undefined,
    isRejected: false,
    timeStamp: undefined,
    createdBy: undefined,
    assignedBy: undefined,
    customer: undefined,
    businessCategory: undefined,
    productionUser: undefined,
    titleId: undefined,
    jobId: undefined,
    productCategory: undefined,
    description: undefined,
    rate: undefined,
    linkedInvoice: undefined,
    privateNotes: undefined,
    orderTrackingNotes: undefined,
    productionNotes: undefined,
    ctpFileName: undefined,
    locationOfFile: undefined,
    sentOn: undefined,
    designPackageFile: undefined,
    locationOfDesignFile: undefined,
    jobStartDate: undefined,
    productionStartDate: undefined,
    productionEndDate: undefined,
    packingAndQADate: undefined,
    deliveryDate: undefined,
    expiryDate: undefined,
    sendTo: undefined,
    processedDetailList: []
  }

  constructor(
    private orderService: OrdersService,
    private jobService: JobService,
    private router: Router,
    private authService: AuthguardService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
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
          }
        ]
      },
    ]
    this.getOrders()
    this.getUserDetails();
    this.cdr.detectChanges();

    this.roleArray = [
      { name: "ROLE_DESIGNER" },
      { name: "ROLE_PRODUCTION" },
      { name: "ROLE_PLATE_SETTER" }
    ]
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id'];
    }, error => {
      this.showError(error);
    })
  }

  getOrders(pageState?: PaginatorState, order?: Order): void {
    debugger
    this.orderService.getOrders(pageState, order!).pipe(takeUntil(this.destroy$)).subscribe(
      (res: PaginationResponse<Order>) => {
        if (this.paginatedOrders?.content) {
          if (this.role !== "ROLE_ADMIN") {
            this.paginatedOrders.content = res.content.filter(
              (order: Order) => {
                return this.doesCreatedByMatch(order);
              });
            this.buttonOption = false;
          } else {
            this.paginatedOrders.content = res.content;
          }
          this.tableData = this.paginatedOrders.content.length === 0;
          this.paginatedOrders.content.forEach((element: Order) => {
            if (element.size && this.isJsonString(element.size)) {
              debugger
              element.size = JSON.parse(element.size!).inch;
            }
          });
          console.log(this.paginatedOrders.content);
        }
      },
      error => {
        this.showError(error);
        this.visible = true;
      }
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

  // private getOrders(): void {

  //   const orderAuto$ = this.orderService.getOrders();
  //   const jobManual$ = this.jobService.getAllProductionJobs();

  //   forkJoin([orderAuto$, jobManual$]).subscribe(
  //     ([autoData, manualData]: [any, ProductionJob[]]) => {
  //       // Process autoData
  //       if (this.role !== "ROLE_ADMIN") {
  //         this.ordersArray = autoData.filter((order: any) => this.doesCreatedByMatch(order));
  //         this.buttonOption = false;
  //       } else {
  //         this.ordersArray = autoData;
  //       }

  //       // Process manualData
  //       manualData = manualData.map((item: ProductionJob) => ({
  //         ...item,
  //         title: item.productName
  //       }));

  //       // Merge data
  //       const mergedData = [...autoData, ...manualData];

  //       // Assign mergedData to your tableData
  //       this.ordersArray = mergedData;
  //       console.log(this.ordersArray);
  //     },
  //     (error: any) => {
  //       this.showError(error);
  //       this.visible = true;
  //     }
  //   );
  // }


  getUsersByRole(role: any) {
    this.orderService.getUserByRole(role.name).subscribe(res => {
      this.userArray = res
    }, error => {
      this.showError(error);
    })
  }

  editOrder(id: number, type: string) {
    this.router.navigate(['/addOrder'], { queryParams: { id: id, orderType: type } });
  }

  viewOrder(id: number, type: string) {
    this.router.navigate(['/viewOrder'], { queryParams: { id: id, orderType: type } });
  }

  deleteOrder(id: number, type: string) {
    // if (type === 'auto') {
    //   this.deleteAutoOrder(id);
    // } else {
    //   this.deleteManualOrder(id);
    // }
    this.orderService.deleteOrder(id).subscribe(() => {
      this.getOrders()
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  deleteAutoOrder(id: number) {
    this.orderService.deleteOrder(id).subscribe(() => {
      this.getOrders()
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  // deleteManualOrder(id: number) {
  //   this.jobService.deleteProductionJob(id).subscribe(() => {
  //     this.getOrders()
  //   }, error => {
  //     this.showError(error);
  //     this.visible = true
  //   })
  // }

  statusSorting(find: any) {
    this.orderService.statusSorting(find).subscribe(
      (res: any) => {
        this.paginatedOrders = res
      }, error => {
        this.showError(error);
        this.visible = true
      })
  }

  searchOrder(order: any) {
    if (this.search == '') {
      this.getOrders()
    } else {
      this.orderService.searchById(order.value).subscribe(
        (res: any) => {
          this.paginatedOrders = res
        }, error => {
          this.showError(error);
          this.visible = true
        })
    }
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

  // processes(orderId: number) {
  //   this.processOptions = true;
  //   this.orderId = orderId;
  // }

  orderProcessCtp(orderId: number) {
    this.router.navigate(['/order-timeline'], { queryParams: { id: orderId } });
  }

  // orderProcessPress() {
  //   this.router.navigate(['/orderProcessPress'], { queryParams: { id: this.orderId } });
  // }

  // orderProcessPaperMarket() {
  //   this.router.navigate(['/orderProcessPaperMarket'], { queryParams: { id: this.orderId } });
  // }

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

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }

  private doesCreatedByMatch(order: any): boolean {
    return (order.createdBy && order.createdBy.id === this.currentUserDetail.userId) ||
      (order.designer && order.designer.id === this.currentUserDetail.userId);
  }


  private getUserDetails(): void {
    this.currentUserDetail = JSON.parse(this.authService.token).userDetails;
    this.role = this.currentUserDetail.authorities[0].authority;
  }

  public clear(table: Table): void { }
}
