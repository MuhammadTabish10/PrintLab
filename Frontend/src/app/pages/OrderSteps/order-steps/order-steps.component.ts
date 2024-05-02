import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-steps',
  templateUrl: './order-steps.component.html',
  styleUrls: ['./order-steps.component.css']
})
export class OrderStepsComponent implements OnInit {


  orderById: any = {};
  idFromQueryParam: number | undefined | null;
  orderIdWithPrefix: string | undefined | null;

  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idFromQueryParam = +params['id'];
      this.orderIdWithPrefix = "PL-O-" + this.idFromQueryParam.toString();
      if (this.idFromQueryParam) {
        this.getOrderById(this.idFromQueryParam);
      }
    });
  }

  getOrderById(id: number): void {
    this.orderService.getOrderById(id).subscribe(
      (data) => {
        this.orderById = data;
        this.orderById.timeStamp = new Date(this.orderById.timeStamp[0], this.orderById.timeStamp[1] - 1, this.orderById.timeStamp[2], this.orderById.timeStamp[3], this.orderById.timeStamp[4]);
        this.orderById.timeStamp = this.datePipe.transform(this.orderById.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
      },
      (error) => {
        console.error('Error fetching order:', error);
      }
    );
  }

  copyIdToClipboard(id: string): void {
    const el = document.createElement('textarea');
    el.value = id;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

  }
}
