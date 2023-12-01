import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { MessageService } from 'primeng/api';

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
  styleUrls: ['./orders.component.css']
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


  constructor(private orderService: OrdersService,
    private router: Router,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) { }


  ngOnInit(): void {
    this.getOrders()
    this.cdr.detectChanges();

    this.roleArray = [
      { name: "ROLE_DESIGNER" },
      { name: "ROLE_PRODUCTION" },
      { name: "ROLE_PLATE_SETTER" }
    ]

  }

  getOrders() {
    this.orderService.getOrders().subscribe(res => {
      this.ordersArray = res;
      this.ordersArray.length == 0 ? this.tableData = true : this.tableData == false
    }, error => {
      this.showError(error);
      this.visible = true
    })
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
  saveOrder(user?: any, role?: any, orderId?: number) {

    this.orderService.saveAssignedUser(user?.id, role?.name, orderId ? orderId : 0).subscribe(
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
    this.router.navigate(['/orderProcess'], { queryParams: { id: orderId } });
  }

  // orderProcessPress() {
  //   this.router.navigate(['/orderProcessPress'], { queryParams: { id: this.orderId } });
  // }

  // orderProcessPaperMarket() {
  //   this.router.navigate(['/orderProcessPaperMarket'], { queryParams: { id: this.orderId } });
  // }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
