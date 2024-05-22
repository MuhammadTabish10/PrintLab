import { ProductRuleService } from './../../../services/product-rule.service';
import { RequestBody } from './../../product-rule/RequestBody';
import { Component, OnInit } from '@angular/core';
import { BusinessUnitService } from '../../business-unit-and-processes/Service/business-unit.service';
import { BusinessUnit } from 'src/app/Model/BusinessUnit';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { ProductRule } from 'src/app/Model/ProductRule';
import { Roles } from '../../orders/orders.component';

@Component({
  selector: 'app-product-rule-of-group-sheet',
  templateUrl: './product-rule-of-group-sheet.component.html',
  styleUrls: ['./product-rule-of-group-sheet.component.css']
})
export class ProductRuleOfGroupSheetComponent implements OnInit {

  productRule: ProductRule = { ...RequestBody.productRuleBody };
  productRuleList: ProductRule[] = [];
  categoryList: BusinessUnit[] = [];
  roleList: Roles[] = [];
  constructor(
    private businessUnitService: BusinessUnitService,
    private productRuleService: ProductRuleService,
    private errorService: ErrorHandleService,
  ) { }
  ngOnInit(): void {
    this.getCategoryList();
    this.getAllProductRule();
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

  public submit(): void { }
}
