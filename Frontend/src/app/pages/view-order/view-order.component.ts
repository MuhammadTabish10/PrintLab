import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { MessageService } from 'primeng/api';
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
  size: any;

  constructor(private route: ActivatedRoute, private orderService: OrdersService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      this.getOrderById()
    })
  }

  getOrderById() {
    this.orderService.getOrderById(this.idFromQueryParam).subscribe(res => {
      this.order = res
      this.size = JSON.parse(this.order.size)
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }
  showError(error:any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });

  }
}
