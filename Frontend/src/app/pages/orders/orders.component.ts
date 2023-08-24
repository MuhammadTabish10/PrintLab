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
  ordersArray: any = []
  pending: String = 'Pending'
  recieved: String = 'Recieved'
  canceled: String = 'Canceled'
  sortedOrders: any;
  editOrderArray: any
  tableData: Boolean = false
  currentUser: any
  search: string = ''

  constructor(private orderService: OrdersService, private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
    this.getOrders()
    this.orderService.update$.subscribe(res => {
      this.ordersArray = res
      this.getOrders()
    })
  }

  getOrders() {
    this.orderService.getOrders().subscribe(res => {
      debugger
      this.ordersArray = res;
      console.log(this.ordersArray);
      this.ordersArray.length == 0 ? this.tableData = true : this.tableData == false
    })
  }

  editOrder(id: any) {
    this.router.navigate(['/addOrder'], { queryParams: { id: id } });
  }

  deleteOrder(id: any) {
    this.orderService.deleteOrder(id).subscribe(res => {
      this.getOrders()
    })
  }

  statusSorting(find: any) {
    this.orderService.statusSorting(find).subscribe(res => {
      this.ordersArray = res
    })
  }

  searchOrder(order: any) {
    if (this.search == '') {
      this.getOrders()
    } else {
      this.orderService.searchById(order.value).subscribe(res => {
        this.ordersArray = res
      })
    }
  }
}