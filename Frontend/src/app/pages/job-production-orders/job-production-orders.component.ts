import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-job-production-orders',
  templateUrl: './job-production-orders.component.html',
  styleUrls: ['./job-production-orders.component.css']
})
export class JobProductionOrdersComponent {

  error: string = ''
  visible!: boolean
  ordersArray: any = []
  tableData: Boolean = false
  search: string = ''


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

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
