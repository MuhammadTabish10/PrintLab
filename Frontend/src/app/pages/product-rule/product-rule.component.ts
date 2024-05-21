import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ProductRuleService } from 'src/app/services/product-rule.service';
import { JobService } from '../Jobs/Service/job.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { forkJoin } from 'rxjs';
import { ProductRuleJob } from 'src/app/Model/ProductRuleJob';
import { SuccessMessageService } from 'src/app/services/success-message.service';

@Component({
  selector: 'app-product-rule',
  templateUrl: './product-rule.component.html',
  styleUrls: ['./product-rule.component.css']
})
export class ProductRuleComponent implements OnInit {
  productDefinitionArray: any
  tableData: any
  gsm: any = [];
  search: any
  brand: any;
  dimension: any;
  madeIn: any;
  paperStock: any;
  tableProduct: any;
  items: MenuItem[] | undefined;

  constructor(
    private productRuleService: ProductRuleService,
    private successService: SuccessMessageService,
    private messageService: MessageService,
    private jobService: JobService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Add',
        icon: 'pi pi-plus',
        items: [
          {
            label: 'Define product rule',
            icon: 'pi pi-spin pi-cog',
            routerLink: "/addProductRule",
            queryParams: { orderType: 'auto' }
          },
          {
            label: 'Define by process',
            icon: 'pi pi-wrench',
            routerLink: '/add-product-rule-job',
            queryParams: { orderType: 'manual' }
          }
        ]
      },
    ]
    this.getProductRule();
  }

  editProduct(id: any, type: string) {
    const conditionalRoute = type === 'auto' ? '/addProductRule' : '/add-product-rule-job';
    this.router.navigate([conditionalRoute], { queryParams: { id: id, orderType: type } });
  }

  deleteProduct(id: any, orderType: string) {

    if (orderType === 'auto') {
      this.productRuleService.deleteProduct(id).subscribe((res: any) => {
        this.getProductRule();
      }, (err) => {
        this.showError(err);
      })
    } else {
      this.jobService.deleteProductRuleJob(id).subscribe((res: void) => {
        const message = `Product Rule ${id} deleted successfully`;
        this.successService.showSuccess(message);
        this.getProductRule();
      }, (error: any) => {
        this.showError(error);
      })
    }
  }
  // getProductRule() {
  //   const productRuleAuto$ = this.productRuleService.getProductRuleTable();
  //   const productRuleManual$ = this.jobService.getAllProductRuleJob();

  //   forkJoin([productRuleAuto$, productRuleManual$]).subscribe(
  //     ([autoData, manualData]: [any, ProductRuleJob[]]) => {

  //       autoData.forEach((item: any) => {
  //         item.category = JSON.parse(item.category);
  //       });

  //       manualData = manualData.map((item: ProductRuleJob) => {
  //         return {
  //           ...item,
  //           title: item.productName
  //         };
  //       });
  //       const mergedData = [...autoData, ...manualData];
  //       // Assign mergedData to your tableData
  //       this.tableData = mergedData;
  //       console.log(this.tableData);
  //     },
  //     (error: any) => {
  //       this.showError(error);
  //     }
  //   );

  // }
private getProductRule(): void{
  this.productRuleService.getProductRuleTable().subscribe((res:any)=>{
    this.tableData = res;
  },(error: BackendErrorResponse)=>{});
}

  viewProduct(id: any) {
    this.router.navigate(['/viewProductRule'], { queryParams: { id: id } });
  }

  searchProductRule(name: any) {
    if (this.search === '') {
      this.getProductRule();
    } else {
      this.productRuleService.searchProduct(name.value).subscribe(res => {
        this.tableData = res
      }, error => {
        this.showError(error);
      })
    }
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
