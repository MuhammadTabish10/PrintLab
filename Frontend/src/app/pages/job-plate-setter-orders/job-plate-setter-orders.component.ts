import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-job-plate-setter-orders',
  templateUrl: './job-plate-setter-orders.component.html',
  styleUrls: ['./job-plate-setter-orders.component.css']
})
export class JobPlateSetterOrdersComponent implements OnInit {

  error: string = ''
  visible!: boolean
  ordersArray: any = []
  tableData: Boolean = false
  search: string = ''
  orderId: number = 0;
  processOptions: boolean = false;


  constructor(private orderService: OrdersService,
    private router: Router,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) { }


  ngOnInit(): void {
    this.getJobOrders()
    this.cdr.detectChanges();
  }

  getJobOrders() {
    this.orderService.getAssignedOrders().subscribe(res => {
      this.ordersArray = res;
      this.ordersArray.length == 0 ? this.tableData = true : this.tableData == false
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }
  searchOrder(order: any) {
    if (this.search == '') {
      this.getJobOrders()
    } else {
      this.orderService.searchById(order.value).subscribe(res => {
        this.ordersArray = res
      }, error => {
        this.showError(error);
        this.visible = true
      })
    }
  }

  // processes(orderId: number) {
  //   this.processOptions = true;
  //   this.orderId = orderId;
  // }

  orderProcessCtp(orderId: number) {

    this.router.navigate(['/order-timeline'], { queryParams: { id: orderId } });
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
