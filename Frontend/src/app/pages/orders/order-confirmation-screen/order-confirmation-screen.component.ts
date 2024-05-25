import { GlobalVariables } from './../../add-order/GlobalVariables';
import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { saveAs } from 'file-saver';
import { ActivatedRoute, Params } from '@angular/router';
import { Order } from 'src/app/Model/Order';
import { BusinessBranch } from 'src/app/Model/Business';
@Component({
  selector: 'app-order-confirmation-screen',
  templateUrl: './order-confirmation-screen.component.html',
  styleUrls: ['./order-confirmation-screen.component.css']
})
export class OrderConfirmationScreenComponent implements OnInit {
  order: Order = { ...GlobalVariables.order };
  idFromParam: number | null | undefined;
  branchesList: BusinessBranch[] = [];

  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.accessParams();
  }

  private accessParams() {
    this.route.queryParams.subscribe(
      (params: Params) => {
        this.idFromParam = params['id'];
        if (this.idFromParam) {
          this.getOrderById(this.idFromParam);
        }
      });
  }

  private getOrderById(id: number) {
    this.orderService.getOrderByIdAndType(id, 'manual').subscribe(
      (response: Order) => {
        this.order = response;
        this.branchesList = this.extractBranches(this.order);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  extractBranches(order: Order): BusinessBranch[] {
    if (order.businesses) {
      return order.businesses.flatMap(business => business.businessBranchList || []);
    }
    return [];
  }

  public download(id: number | null | undefined): void {
    const fileName = `Order confirmation - PL-KHI-${id} - PRINTLAB`;
    this.orderService.downloadOrderConfirmationReport(fileName, id).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, `${fileName}.pdf`);
      },
      (error) => {
        console.error('Download error:', error);
      }
    );
  }
}

