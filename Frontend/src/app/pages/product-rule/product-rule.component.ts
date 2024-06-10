import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ProductRuleService } from 'src/app/services/product-rule.service';
import { JobService } from '../Jobs/Service/job.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { ProductRule } from 'src/app/Model/ProductRule';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { RequestBody } from './RequestBody';
import { PaginatorState } from 'primeng/paginator';
import { PaginationResponse } from 'src/app/Model/PaginationResponse';

@Component({
  selector: 'app-product-rule',
  templateUrl: './product-rule.component.html',
  styleUrls: ['./product-rule.component.css']
})
export class ProductRuleComponent implements OnInit {
  productRuleBody: ProductRule =
    { ...RequestBody.productRuleBody };
  paginatedProductRule: PaginationResponse<ProductRule> | undefined;
  gsm: string[] = [];
  search: string | undefined | null;
  items: MenuItem[] | undefined;
  selectedStatus: boolean | undefined | null;

  constructor(
    private productRuleService: ProductRuleService,
    private successService: SuccessMessageService,
    private errorService: ErrorHandleService,
    private messageService: MessageService,
    private jobService: JobService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initializeItems();
    this.getProductRule();
  }
  initializeItems() {
    this.items = [
      {
        label: '+ New Product',
        items: [
          {
            label: 'Auto',
            icon: 'pi pi-spin pi-cog',
            routerLink: "/addProductRule",
            queryParams: { orderType: 'auto' }
          },
          {
            label: 'Manual',
            icon: 'pi pi-wrench',
            routerLink: '/add-product-rule-job',
            queryParams: { orderType: 'manual' }
          },
          {
            label: 'Group Sheet',
            icon: 'pi pi-id-card',
            routerLink: '/add-product-rule-group-sheet',
            queryParams: { orderType: 'groupSheet' }
          },
        ]
      },
    ]
  }

  editProduct(id: number, type: string) {
    const conditionalRoute = type === 'auto' ? '/addProductRule' : type === 'manual' ?
      '/add-product-rule-job' : '/add-product-rule-group-sheet';
    this.router.navigate([conditionalRoute], { queryParams: { id: id, orderType: type } });
  }
  viewProduct(id: number) {
    this.router.navigate(['/viewProductRule'], { queryParams: { id: id } });
  }
  deleteProduct(id: number) {
    this.productRuleService.deleteProduct(id).subscribe(
      () => {
        this.getProductRule();
      },
      (err: BackendErrorResponse) => {
        this.errorService.showError(err.error.error);
      }
    );
  }

  public getProductRule(pageState?: PaginatorState, body?: ProductRule): void {
    this.productRuleService.getProductRuleTable(pageState, body).subscribe(
      (res: PaginationResponse<ProductRule>) => {
        this.paginatedProductRule = res;
      }, (error: BackendErrorResponse) => {
        this.errorService?.showError(error?.error?.error);
      });
  }
  public clearSearch() {
    this.productRuleBody = { ...RequestBody.productRuleBody };
    this.getProductRule(undefined, this.productRuleBody);
  }
  public onStatusChange(): void {
    if (this.selectedStatus === true) {
      this.productRuleBody.status = 'Active';
    } else if (this.selectedStatus === false) {
      this.productRuleBody.status = 'inActive';
    } else {
      this.productRuleBody.status = null;
    }
    this.getProductRule(undefined, this.productRuleBody);
  }
}
