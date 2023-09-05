import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  error:string=''
  visible!:boolean
  ordersArray: any = []
  pending: String = 'Pending'
  recieved: String = 'Recieved'
  canceled: String = 'Canceled'
  sortedOrders: any;
  editOrderArray: any
  tableData: Boolean = false
  currentUser: any
  search: string = ''

  constructor(private orderService: OrdersService, private router: Router) { }

  ngOnInit(): void {
    this.getOrders()
    this.orderService.update$.subscribe(res => {
      this.ordersArray = res
      this.getOrders()
    }, error => {
      this.error = error.error.error
      this.visible = true
    })
  }

  getOrders() {
    this.orderService.getOrders().subscribe(res => {
      this.ordersArray = res;
      this.ordersArray.length == 0 ? this.tableData = true : this.tableData == false
    }, error => {
      this.error = error.error.error
      this.visible = true
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
      this.error = error.error.error
      this.visible = true
    })
  }

  statusSorting(find: any) {
    this.orderService.statusSorting(find).subscribe(res => {
      this.ordersArray = res
    }, error => {
      this.error = error.error.error
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
        this.error = error.error.error
        this.visible = true
      })
    }
  }
}
