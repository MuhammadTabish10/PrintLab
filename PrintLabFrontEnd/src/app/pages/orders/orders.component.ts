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

  constructor(private service: OrdersService, private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
    this.getOrders()
    this.service.update$.subscribe(res => {
      this.ordersArray = res
      this.getOrders()
    })
  }

  addOrder() {
    this.router.navigateByUrl('/addOrder')
  }

  getOrders() {
    this.loginService.getcurrentUser().subscribe(res => {
      this.currentUser = res
      for (let i = 0; i < this.currentUser.length; i++) {
        this.currentUser[0].id
      }
    })
    this.service.getOrders().subscribe(res => {
      this.ordersArray = res;
      if (this.ordersArray.length == 0) {
        this.tableData = true
      } else {
        this.tableData == false
      }
    })
  }

  statusSorting(find: any) {
    this.service.statusSorting(find).subscribe(res => {
      this.ordersArray = res
    })
  }

  deleteOrder(id: any) {
    this.service.deleteOrder(id).subscribe(res => {
      this.getOrders()
    })
  }

  searchOrder(orderId: any) {
    this.service.searchById(orderId.value).subscribe(res => {
      this.ordersArray = res
    })
  }
}