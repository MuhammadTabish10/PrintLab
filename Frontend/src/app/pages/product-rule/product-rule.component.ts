import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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
    private messageService: MessageService
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
    }, (err) => {
      this.showError(err);
    })
  }
  getProductRule() {
    this.productRuleService.getProductRuleTable().subscribe((res: any) => {
      this.tableData = res
    })
  }
  viewProduct(id: any) {
    this.router.navigate(['/viewProductRule'], { queryParams: { id: id } });
  }

  searchProductRule(name: any) {
    if (this.search === '') {
      this.getProductRule();
    } else {
      debugger
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
