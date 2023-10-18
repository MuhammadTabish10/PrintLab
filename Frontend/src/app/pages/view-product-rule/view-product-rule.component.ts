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
  tableData: any;
  gsm: any;
  idFromQueryParam!: number
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
          debugger
          this.tableData = res.filter((item: any) => item.id === this.idFromQueryParam).flatMap((item: any) => item.productRulePaperStockList);
          this.gsm = this.tableData.map((item: any) => JSON.parse(item.gsm));
        }

      },
      (error: any) => {
        console.error(error);
      }
    );
  }
}
