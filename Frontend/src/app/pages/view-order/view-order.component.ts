import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {
  order: any
  idFromQueryParam!: number
  visible!: boolean
  error: string = ''

  constructor(private route: ActivatedRoute, private orderService: OrdersService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      this.getOrderById()
    })
  }

  getOrderById() {
    this.orderService.getOrderById(this.idFromQueryParam).subscribe(res => {
      this.order = res
    }, error => {
      this.error = error.error.error
      this.visible = true
    })
  }
}
