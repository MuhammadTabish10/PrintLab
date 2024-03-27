import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductRuleService } from 'src/app/services/product-rule.service';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

@Component({
  selector: 'app-view-product-rule',
  templateUrl: './view-product-rule.component.html',
  styleUrls: ['./view-product-rule.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        animate('1.3s', keyframes([
          style({ transform: 'translateY(100%)', opacity: 0 }),
          style({ transform: 'translateY(10%)', opacity: 0.6 }),
          style({ transform: 'translateY(0)', opacity: 1 }),
        ])),
      ]),
    ]),
  ],
})
export class ViewProductRuleComponent implements OnInit {
  paperStockData: any;
  gsm: any;
  idFromQueryParam!: number
  pressData: any;
  productRuleData: any;
  frontColors: any;
  backColors: any;
  qty: any;
  paperSize: any = [];
  ctpData: any;
  categoryList: any = [];

  constructor(private productRuleService: ProductRuleService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param: any) => {
      this.idFromQueryParam = +param['id'];
    });
    this.getProductRule();
  }


  getProductRule() {
    this.productRuleService.getProductRuleTable().subscribe(
      (res: any) => {
        if (Array.isArray(res)) {

          this.productRuleData = res.filter((item: any) => item.id === this.idFromQueryParam).flatMap((item: any) => item);
          this.paperStockData = res.filter((item: any) => item.id === this.idFromQueryParam).flatMap((item: any) => item.productRulePaperStockList);
          this.pressData = res.filter((item: any) => item.id === this.idFromQueryParam).flatMap((item: any) => item.pressMachine);
          this.ctpData = res.filter((item: any) => item.id === this.idFromQueryParam).flatMap((item: any) => item.ctp);
          this.gsm = this.paperStockData.map((item: any) => JSON.parse(item.gsm));
          this.frontColors = this.productRuleData.map((item: any) => JSON.parse(item.jobColorFront));
          this.backColors = this.productRuleData.map((item: any) => item.jobColorBack ? JSON.parse(item.jobColorBack) : null);
          this.qty = this.productRuleData.map((item: any) => JSON.parse(item.quantity));
          const sizeArray = JSON.parse(this.productRuleData[0].size);
          const categoryArry = JSON.parse(this.productRuleData[0].category);
          for (const size of sizeArray) {
            this.paperSize.push(size.label);
          }
          debugger
          for (const category of categoryArry) {
            this.categoryList.push(category.name);
          }
          console.log(this.paperSize);
        }

      },
      (error: any) => {
        console.error(error);
      }
    );
  }
}
