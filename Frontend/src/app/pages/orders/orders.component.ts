import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { MessageService } from 'primeng/api';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { AuthguardService } from 'src/app/services/authguard.service';

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
  ordersArray: any = []
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


  constructor(
    private orderService: OrdersService,
    private router: Router,
    private authService: AuthguardService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
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

  getOrders() {
    this.orderService.getOrders().subscribe(
      (res: any) => {
        if (this.role !== "ROLE_ADMIN") {
          this.ordersArray = res.filter(
            (order: any) => {
              debugger
              return this.doesCreatedByMatch(order);
            });
          this.buttonOption = false;
        } else {
          this.ordersArray = res;
        }
        this.tableData = this.ordersArray.length === 0;
      },
      error => {
        this.showError(error);
        this.visible = true;
      }
    );
  }
  getUsersByRole(role: any) {

    // this.userArray = [
    //   { name: "Usama", id: 5 }
    // ]
    this.orderService.getUserByRole(role.name).subscribe(res => {
      this.userArray = res
    }, error => {
      this.showError(error);
    })
  }

  editOrder(id: any) {
    this.router.navigate(['/addOrder'], { queryParams: { id: id } });
  }

  viewOrder(id: any) {
    this.router.navigate(['/viewOrder'], { queryParams: { id: id } });
  }

  deleteOrder(id: any) {
    this.orderService.deleteOrder(id).subscribe(() => {
      this.getOrders()
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  statusSorting(find: any) {
    this.orderService.statusSorting(find).subscribe(res => {
      this.ordersArray = res
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  searchOrder(order: any) {
    if (this.search == '') {
      this.getOrders()
    } else {
      this.orderService.searchById(order.value).subscribe(res => {
        this.ordersArray = res
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

  onRowClick(event: MouseEvent, orderId: number): void {
    // Check if the click occurred on a button
    debugger
    const isButton = (event.target as HTMLElement).tagName === 'BUTTON' ||
      (event.target as HTMLElement).tagName === 'SMALL' ||
      (event.target as HTMLElement).tagName === 'I';

    if (!isButton) {
      // If the click didn't occur on a button, navigate to order overview
      this.router.navigate(['/order-overview'], { queryParams: { id: orderId } });
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

}
