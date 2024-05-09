import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { MessageService } from 'primeng/api';
import { ProductRuleService } from 'src/app/services/product-rule.service';
import { JobService } from '../Jobs/Service/job.service';
import { ProductionJob } from 'src/app/Model/ProductionJob';
import { ProductRuleJob } from 'src/app/Model/ProductRuleJob';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
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
  orderType: string | undefined | null;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private orderService: OrdersService,
    private messageService: MessageService,
    private productRuleService: ProductRuleService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param: Params) => {
      this.idFromQueryParam = +param['id'];
      this.orderType = param['orderType'];
      this.getOrderById()
    })
  }

  getOrderById() {

    const serviceToCall = this.orderType === 'auto'
      ? this.orderService.getOrderById(this.idFromQueryParam)
      : this.jobService.getProductionJobById(this.idFromQueryParam);

    serviceToCall
      .subscribe((res: any | ProductionJob) => {
        this.order = res
        debugger
        if (this.orderType === 'auto') {
          this.size = JSON.parse(this.order.size);
          this.getProductRuleById(this.order.productRule)
        } else {
          this.getProductRuleJobByName(this.order.productName);
        }
      }, error => {
        this.showError(error)
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

  getProductRuleJobByName(productName: string | null | undefined): void {
    this.jobService.getProductRuleJobByName(productName).subscribe(
      (res: ProductRuleJob[]) => {
        this.productRule = res[0];
      }, (error: BackendErrorResponse) => {
        this.showError(error.error.error);
      });
  }
}
