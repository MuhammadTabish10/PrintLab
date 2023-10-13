import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  tableData: any[] = new Array(this.containers.length);
  filteredPapers: any;

  constructor(private paperMarketService: PaperMarketService,
    private productRuleService: ProductRuleService,
    private router: Router,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.productRuleService.getProductRule('paper', null).subscribe((productRule: any) => {
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
    } else {

      let newContainer: Container = {
        allPaper: this.filteredPapers ? this.filteredPapers : this.containers[0].allPaper,
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
    this.containers[i].paper = value;
    this.filteredPapers = this.containers[i].allPaper.filter((papers: any) => {
      return papers.name != value.name;
    });


    if (i < this.containers.length - 1) {

      for (let index = i + 1; index <= this.containers.length; index++) {
        this.pop();
      }
    }

    this.productRuleService.getProductRule('vendor', { paperStock: value.name }).subscribe((v: any) => {
      let vendors = v.map((vend: any) => {
        return {
          name: vend.name,
          id: vend.id
        }
      });
      this.containers[i].allVendor = vendors;
      debugger
    }, err => {

    });
  }


  changeVendor(i: any, value: any) {
    debugger
    this.containers[i].vendor = value;
    this.productRuleService.getProductRule('brand',
      {
        paperStock: this.containers[i].paper.name,
        vendor: { id: this.containers[i].vendor.id }
      }).subscribe((b: any) => {
        const brands = b.map((brand: any) => {
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

    this.containers[i].brand = value;
    this.productRuleService.getProductRule('madein',
      {
        paperStock: this.containers[i].paper.name,
        vendor: { id: this.containers[i].vendor.id },
        brand: this.containers[i].brand.name
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

    this.containers[i].madeIn = value;
    this.productRuleService.getProductRule('dimension',
      {
        paperStock: this.containers[i].paper.name,
        vendor: { id: this.containers[i].vendor.id },
        brand: this.containers[i].brand.name,
        madeIn: this.containers[i].madeIn.name
      }).subscribe((d: any) => {
        const dimensions = d.map((dimen: any) => {

          return {
            name: dimen
          }
        });
        this.containers[i].allDimension = dimensions;
      }, err => {
        console.log(err);
      });
  }

  changeDimension(i: any, value: any) {

    this.containers[i].dimension = value;
    this.productRuleService.getProductRule('gsm',
      {
        paperStock: this.containers[i].paper.name,
        vendor: { id: this.containers[i].vendor.id },
        brand: this.containers[i].brand.name,
        madeIn: this.containers[i].madeIn.name,
        dimension: this.containers[i].dimension.name
      }).subscribe((g: any) => {
        const gsm = g.map((gs: any) => {

          return {
            name: gs
          }
        });
        this.containers[i].allGsm = gsm;
      }, err => {
        console.log(err);
      });
  }

  pop() {

    this.containers.pop();
  }

  deleteContainer(index: any) {
    this.containers.splice(index, 1);
  }

  go(i: any) {
    if (i >= 0 && i < this.containers.length) {
      let obj = {
        paperStock: this.containers[i].paper.name,
        vendorId: this.containers[i].vendor.id,
        brand: this.containers[i].brand.name,
        madeIn: this.containers[i].madeIn.name,
        dimension: this.containers[i].dimension.name,
        gsm: this.containers[i].gsm.map((gsm: any) => parseInt(gsm.name, 10))
      }
      debugger
      this.productRuleService.postProductRule(obj).subscribe(res => {
        console.log(res);
        this.tableData[i] = res
        this.tableData.forEach((el: any) => {

          const dateArray = el.timeStamp;
          el.timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
          el.timeStamp = this.datePipe.transform(el.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
        });
      }, error => {
        console.log(error);
      })
    }
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
