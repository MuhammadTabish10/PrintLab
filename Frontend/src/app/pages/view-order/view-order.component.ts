import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { MessageService } from 'primeng/api';
import { ProductRuleService } from 'src/app/services/product-rule.service';
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
  productRule: any;
  gsm: any;
  material: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrdersService,
    private messageService: MessageService,
    private productRuleService: ProductRuleService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      this.getOrderById()
    })
  }

  getOrderById() {
    this.orderService.getOrderById(this.idFromQueryParam).subscribe(res => {
      this.order = res
      this.size = JSON.parse(this.order.size);
      this.getProductRuleById(this.order.productRule);
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }
  getProductRuleById(id: number) {
    this.productRuleService.getProductRuleById(id).subscribe(res => {
      this.productRule = res;
      this.productRule.ctp.vendor.vendorProcessList.forEach((element: any) => {
        this.material.push(element.materialType);
      });

    }, error => { });
  }
  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });

  }

  getFormattedMaterials(): string {
    return this.material
      .filter(material => material !== null)
      .join(', ');
  }
}
