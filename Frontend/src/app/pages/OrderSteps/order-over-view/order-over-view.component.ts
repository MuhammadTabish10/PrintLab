import { GlobalVariables } from './../../add-order/GlobalVariables';
import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { JobService } from '../../Jobs/Service/job.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { BusinessUnitService } from '../../business-unit-and-processes/Service/business-unit.service';
import { BusinessUnit } from 'src/app/Model/BusinessUnit';
import { Order } from 'src/app/Model/Order';

@Component({
  selector: 'app-order-over-view',
  templateUrl: './order-over-view.component.html',
  styleUrls: ['./order-over-view.component.css']
})
export class OrderOverViewComponent implements OnInit {
  orderById: Order = { ...GlobalVariables.order };
  idFromQueryParam: number | undefined | null;
  orderType: string | undefined | null;
  category: string | null | undefined;

  constructor(
    private businessUnitService: BusinessUnitService,
    private errorService: ErrorHandleService,
    private orderService: OrdersService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.accessParams();
  }

  private accessParams() {
    this.route.queryParams.subscribe(
      (params: Params) => {
        this.idFromQueryParam = +params['id'];
        this.orderType = params['orderType'];
        this.getOrderById(this.idFromQueryParam);
      });
  }

  private getOrderById(id: number): void {
    this.orderService.getOrderById(id).subscribe(
      (data: Order) => {
        if (data.type === "auto") {
          this.orderById = data;
          // Parse the size only if it's a valid JSON string
          if (this.orderById.size) {
            try {
              const parsedSize = JSON.parse(this.orderById.size) as { inch: string };
              // Ensure the parsed object has the 'inch' property
              this.orderById.size = parsedSize.inch;
            } catch (e) {
              console.error('Error parsing size:', e);
            }
          } else {
            console.error('Size is null or undefined:', this.orderById.size);
          }
        } else {
          this.orderById = data;
          this.getCategoryById(+this.orderById.businessCategory!);
        }
      },
      (error) => {
        console.error('Error fetching order:', error);
      }
    );
  }

  private getCategoryById(id: number): void {
    this.businessUnitService.getBusinessUnitById(id).subscribe(
      (data: BusinessUnit) => {
        this.category = data.name;
      },
      (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    );
  }
}
