import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { JobService } from '../../Jobs/Service/job.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { BusinessUnitService } from '../../business-unit-and-processes/Service/business-unit.service';
import { BusinessUnit } from 'src/app/Model/BusinessUnit';

@Component({
  selector: 'app-order-over-view',
  templateUrl: './order-over-view.component.html',
  styleUrls: ['./order-over-view.component.css']
})
export class OrderOverViewComponent implements OnInit {
  orderById: any = {};
  idFromQueryParam: number | undefined | null;
  parsedSize: string | undefined | null;
  orderType: string | undefined | null;
  category: string | null | undefined;

  constructor(
    private businessUnitService: BusinessUnitService,
    private errorService: ErrorHandleService,
    private orderService: OrdersService,
    private jobService: JobService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idFromQueryParam = +params['id'];
      this.orderType = params['orderType'];

      if (this.idFromQueryParam && this.orderType === 'auto') {
        this.getOrderById(this.idFromQueryParam);
      } else {
        this.getJobbyId(this.idFromQueryParam);
      }
    });
  }

  getJobbyId(id: number) {
    this.jobService.getProductionJobById(id).subscribe(
      (res) => {
        this.orderById = res;

        this.getCategoryById(+this.orderById.productCategory);
        const size = this.orderById.size.trim();
        const parts = size.split(/[×x]/).map((part: string) => part.trim());
        const formattedSize = parts.join(' x ');
        this.parsedSize = formattedSize;
        console.log(this.orderById);
      }, (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
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
    const parsedSize = JSON.parse(sizeString);
    const [width, height] = parsedSize.inch.split('x').map((value: any) => value.trim());
    this.parsedSize = width + " x " + height
    return this.parsedSize;
  }

  getCategoryById(id: number): void {
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
