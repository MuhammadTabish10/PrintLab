import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PaperMarketService } from 'src/app/services/paper-market.service';
import { ProductRuleService } from 'src/app/services/product-rule.service';

@Component({
  selector: 'app-add-product-rule',
  templateUrl: './add-product-rule.component.html',
  styleUrls: ['./add-product-rule.component.css']
})
export class AddProductRuleComponent implements OnInit {
  productName: string = ''
  paperStock: any
  vendor: any
  brand: any
  madeIn: any
  dimensions: any
  gsm: any
  containers: Container[] = [];
  pressVendor: any
  press: any
  plateVendor: any
  plates: any
  productRule: any
  paperMarketArray: any = [];


  constructor(private paperMarketService: PaperMarketService,
    private productRuleService: ProductRuleService) { }

  ngOnInit(): void {
    this.productRuleService.getProductRule('paper', null).subscribe((productRule: any) => {
      console.log(productRule)
      let paper = productRule.map((p: any) => {
        return {
          name: p
        }
      })
      this.addContainer(paper);
    }, err => {
      console.log(err);
    })
  }


  addContainer(paper?: any) {
    if (this.containers.length === 0) {
      let newContainer: Container = {
        allPaper: paper,
        paper: null,
        vendor: null,
        brand: null,
        madeIn: null,
        dimension: null,
        gsm: null
      };

      this.containers.push(newContainer);
    }
  }

  changePaper(i: any, value: any) {
    debugger
    this.containers[i].paper = value;
    this.productRuleService.getProductRule('vendor', { paperStock: value.name }).subscribe((v: any) => {
      let vendors = v.map((vend: any) => {
        return {
          name: vend
        }
      })
      this.containers[i].allVendor = vendors;

    }, err => {

    })
  }

  changeVendor(i: any, value: any) {
    debugger
    this.containers[i].vendor = value;
    this.productRuleService.getProductRule('brand',
      {
        paperStock: this.containers[i].paper.name,
        vendorId: 3
      }).subscribe((b: any) => {
        const brandsArray = JSON.parse(b[0]);
        const brands = brandsArray.map((brand: any) => {
          return {
            name: brand
          }
        });
        this.containers[i].allBrand = brands;
      }, err => {
        console.log(err);
      });
  }

  changeBrand(i: any, value: any) {
    debugger
    this.containers[i].brand = value;
    const brandNames = this.containers[i].brand.map((brand: any) => brand.name);
    const brandString = JSON.stringify(brandNames);
    this.productRuleService.getProductRule('madein',
      {
        paperStock: this.containers[i].paper.name,
        vendorId: 3,
        brand: brandString
      }).subscribe((m: any) => {
        const madeIn = m.map((made: any) => {
          return {
            name: made
          }
        });
        this.containers[i].allMadeIn = madeIn;
      }, err => {
        console.log(err);
      });
  }

  changeMadeIn(i: any, value: any) {
    debugger
    this.containers[i].madeIn = value;
    const brandNames = this.containers[i].brand.map((brand: any) => brand.name);
    const brandString = JSON.stringify(brandNames);
    this.productRuleService.getProductRule('dimension',
      {
        paperStock: this.containers[i].paper.name,
        vendorId: 3,
        brand: brandString,
        madeIn: this.containers[i].madeIn.name
      }).subscribe((d: any) => {
        const dimensions = d.map((dimen: any) => {
          debugger
          return {
            name: dimen
          }
        });
        this.containers[i].allDimension = dimensions;
      }, err => {
        console.log(err);
      });
  }

  getPaper(): any {
    this.productRuleService.getProductRule('paper', null).subscribe(res => {
      console.log(res);
      return null;
    }, error => {
      console.log(error);
    });
  }

  deleteContainer(index: number) {

    if (index >= 0 && index < this.containers.length) {
      this.containers.splice(index, 1);
    }
  }

  getProductRule() {
    // this.productRuleService.getProductRule().subscribe(res => {
    //   this.productRule = res
    // }, error => {
    //   console.log(error);
    // });
  }
}

export interface Container {
  paper?: any;
  allPaper?: any;
  vendor?: any
  allVendor?: any
  brand?: any
  allBrand?: any
  madeIn?: any
  allMadeIn?: any
  dimension?: any
  allDimension?: any
  gsm?: any
  allGsm?: any
}
