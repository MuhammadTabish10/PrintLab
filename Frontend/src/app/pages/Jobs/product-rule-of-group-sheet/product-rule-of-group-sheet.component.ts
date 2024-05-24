import { ProductRuleService } from './../../../services/product-rule.service';
import { RequestBody } from './../../product-rule/RequestBody';
import { Component, OnInit } from '@angular/core';
import { BusinessUnitService } from '../../business-unit-and-processes/Service/business-unit.service';
import { BusinessUnit } from 'src/app/Model/BusinessUnit';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { ProductRule } from 'src/app/Model/ProductRule';
import { Roles } from '../../orders/orders.component';
import { RolesService } from 'src/app/services/roles.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-product-rule-of-group-sheet',
  templateUrl: './product-rule-of-group-sheet.component.html',
  styleUrls: ['./product-rule-of-group-sheet.component.css']
})
export class ProductRuleOfGroupSheetComponent implements OnInit {

  productRule: ProductRule = { ...RequestBody.productRuleBody };
  idFromQueryParams: number | null | undefined;
  productRuleList: ProductRule[] = [];
  categoryList: BusinessUnit[] = [];
  roleList: Roles[] = [];
  selectedProductRule: ProductRule | undefined | null;
  selectedStatus: boolean = false;
  isExist: boolean = false;
  constructor(
    private businessUnitService: BusinessUnitService,
    private succesMsgService: SuccessMessageService,
    private productRuleService: ProductRuleService,
    private errorService: ErrorHandleService,
    private roleService: RolesService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.getQueryParams();
    this.getCategoryList();
    this.getAllRoles();
    if (this.idFromQueryParams) {
      this.patchValues(this.idFromQueryParams);
    } else {
      this.getAllProductRule();
    }
  }
  private getQueryParams() {
    this.route.queryParams.subscribe(
      (param: Params) => {
        this.productRule.type = param['orderType'];
        this.idFromQueryParams = param['id'];
      }, (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      })
  }
  patchValues(id: number) {
    this.productRuleService.getProductRuleById(id).subscribe(
      (res: ProductRule) => {
        this.getSelectedProductRule(res.groupSheetOf);
        this.productRule = res;
        this.productRule.status === 'Active' ? this.selectedStatus = true : this.selectedStatus = false;
      }, (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    )
  }

  private getCategoryList(): void {
    this.businessUnitService.getBusinessUnits().subscribe(
      (res: BusinessUnit[]) => {
        this.categoryList = res;
      }, (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    );
  }
  private getAllProductRule(): void {
    this.productRuleService.getAllProductRuleWhereIsGroupSheetAndManualType()
      .subscribe((res: ProductRule[]) => {
        this.productRuleList = res;
      }, (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      })
  }

  private getAllRoles(): void {
    this.roleService.getRoles().subscribe(
      (res: any) => {
        this.roleList = res;
      }, (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    );
  }

  private getSelectedProductRule(groupSheetOf: number | null | undefined): void {
    this.productRuleService.getProductRuleById(groupSheetOf).subscribe(
      (res: ProductRule) => {
        this.selectedProductRule = res;
        this.getAllProductRule();
      }, (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    )
  }
  public submit(): void {
    this.productRule.groupSheetOf = this.selectedProductRule?.id;
    this.productRule.productName = this.selectedProductRule?.productName;
    this.selectedStatus === true ? this.productRule.status = 'Active' : this.productRule.status = 'Inactive';
    this.productRuleService.postProductRule(this.productRule).subscribe((res: any) => {
      this.succesMsgService.showSuccess('Product Rule Added Successfully');
      setTimeout(() => {
        this.router.navigate(['/ProductRule']);
      }, 2000);
    }, (error: BackendErrorResponse) => {
      this.errorService.showError(error.error.error);
    })
  }

  public onProductRuleChange(productRule: ProductRule) {
    debugger
    this.productRuleService.checkUniqueProduct(productRule.productName!, 'manual').subscribe((result: boolean) => {
      this.isExist = result;
      if (result === true) {
        const error = "This product already exist in " + this.productRule.type + " type";
        this.errorService.showError(error);
      } else {
        const success = 'This is a new product in ' + this.productRule.type + ' type';
        this.succesMsgService.showSuccess(success);
      }
    }, (err: BackendErrorResponse) => {
      this.errorService.showError(err.error.error)
    });
  }

}

