import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductRuleService } from 'src/app/services/product-rule.service';

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

  constructor(
    private productRuleService: ProductRuleService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getProductRule();
  }

  editProduct(id: any) {
    this.router.navigate(['/addProductRule'], { queryParams: { id: id } });
  }

  deleteProduct(id: any) {
    this.productRuleService.deleteProduct(id).subscribe((res: any) => {
      this.getProductRule()
    }, err => {
      console.log(err);
    })
  }
  getProductRule() {
    this.productRuleService.getProductRuleTable().subscribe((res: any) => {
      this.tableData = res
      this.tableProduct = this.tableData[0].productRulePaperStockList
      debugger
      this.tableProduct.forEach((element: any) => {
        this.gsm.push(JSON.parse(element.gsm));
      });
    })
  }
  searchProductRule(value: any) { }
}
