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
  categoryList: BusinessUnit[] = [];
  roleList: Roles[] = [];
  constructor(
    private businessUnitService: BusinessUnitService,
    private errorService: ErrorHandleService,
  ) { }
  ngOnInit(): void {

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

  public submit(): void { }
}
