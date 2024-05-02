import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-over-view',
  templateUrl: './order-over-view.component.html',
  styleUrls: ['./order-over-view.component.css']
})
export class OrderOverViewComponent implements OnInit {
  orderById: any = {};
  idFromQueryParam: number | undefined | null;
  parsedSize: any = {};

  constructor(
    private route: ActivatedRoute,
    private orderService: OrdersService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idFromQueryParam = +params['id'];
      if (this.idFromQueryParam) {
        this.getOrderById(this.idFromQueryParam);
      }
    });
  }

  getOrderById(id: number): void {
    this.orderService.getOrderById(id).subscribe(
      (data) => {
        this.orderById = data;
        this.parseSize(this.orderById.size);
      },
      (error) => {
        console.error('Error fetching order:', error);
      }
    );
  }

  parseSize(sizeString: string): any {
    debugger
    const parsedSize = JSON.parse(sizeString);
    const [width, height] = parsedSize.inch.split('x').map((value: any) => value.trim());
    this.parsedSize = width + " x " + height
    return this.parsedSize;
  }
}
