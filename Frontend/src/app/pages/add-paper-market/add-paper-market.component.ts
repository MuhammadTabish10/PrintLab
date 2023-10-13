import { ProductDefinitionService } from './../../services/product-definition.service';
import { Component, OnInit } from '@angular/core';
import { PaperMarketComponent } from '../paper-market/paper-market.component';
import { PaperMarketService } from 'src/app/services/paper-market.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';
import { VendorService } from 'src/app/services/vendor.service';
import { MessageService } from 'primeng/api';
import { ProductProcessService } from 'src/app/services/product-process.service';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-add-paper-market',
  templateUrl: './add-paper-market.component.html',
  styleUrls: ['./add-paper-market.component.css']
})
export class AddPaperMarketComponent implements OnInit {

  quantityArray: any = [500, 100]
  statusArray: any = ['Hoarding', 'In Stock', 'Out of stock']
  visible: boolean = false
  error: string = ''
  buttonName: String = 'Add'
  timeStampValue: String = ''
  statusValue: string = ''
  paperStockValue: any = {}
  gsmValue: string = ''
  lengthValue!: number
  widthValue!: number
  brandValue: string = ''
  madeInValue: string = ''
  kgValue: string = ''
  dimensionValue: String = ''
  qtyValue!: number
  rateValue!: number
  verifiedValue: boolean = true
  noteValue: String = ''
  idFromQueryParam!: number
  rateToUpdate: any = []
  paperStockArray: any = []
  gsmArray: any = []
  paperStockIndex: any
  vendorArray: any = []
  vendorValue!: any;
  disabled: boolean = false;
  productProcessArray: any[] = [];
  pressProcess: any;


  constructor(private paperMarketService: PaperMarketService, private route: ActivatedRoute,
    private router: Router, private productFieldService: ProductDefinitionService,
    private settingservice: SettingsService, private vendorService: VendorService,
    private productProcess: ProductProcessService, private messageService: MessageService) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id'];
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add';
      } else {
        this.buttonName = 'Update';
      }
    });

    forkJoin([
      this.getPaperMarketById(),
      this.getProductFields(),
      this.getProductProcess(),
    ]).subscribe(
      ([paperMarketData, paperStockArray, vendors]) => {
        // Handle the responses here

        this.rateToUpdate = paperMarketData;
        this.paperStockArray = paperStockArray;
        this.getGsm(this.rateToUpdate.paperStock)
        this.vendorArray = vendors
        if (!Number.isNaN(this.idFromQueryParam)) {
          paperStockArray.forEach(el => {
            el.name == this.rateToUpdate.paperStock ? this.paperStockValue = el : null;
          });
          this.timeStampValue = this.formatDate(this.rateToUpdate.timeStamp);
          this.brandValue = this.rateToUpdate.brand;
          this.madeInValue = this.rateToUpdate.madeIn;
          this.lengthValue = this.rateToUpdate.length;
          this.widthValue = this.rateToUpdate.width;
          this.dimensionValue = this.rateToUpdate.dimension;
          this.qtyValue = this.rateToUpdate.qty;
          this.kgValue = this.rateToUpdate.kg.toFixed(2);
          this.vendorValue = this.vendorArray.find((v: any) => v.name == this.rateToUpdate.vendor.name);
          this.rateValue = this.rateToUpdate.ratePkr.toFixed(2);
          this.statusValue = this.rateToUpdate.status;
          this.noteValue = this.rateToUpdate.notes;
          this.verifiedValue = this.rateToUpdate.verified;
        }
      },
      error => {
        this.visible = true;
        this.showError(error);
      }
    );
  }

  getProductFields() {
    return this.productFieldService.getProductField().pipe(
      map(res => {
        let arr: any = []
        arr = res
        let paperStockArray: any[] = [];

        arr.forEach((element: any) => {
          element.name.toLowerCase().replace(/\s/g, '') == 'paperstock' ? paperStockArray = element.productFieldValuesList : null
        });


        return paperStockArray;
      })
    );
  }

  getProductProcess(): Observable<any[]> {
    return this.productProcess.getProductProcess().pipe(
      switchMap((res: any) => {
        if (Array.isArray(res)) {
          this.productProcessArray = res;

          let pressProcess: any;

          for (const process of this.productProcessArray) {
            if (process.name === 'PaperMart' || process.name === 'paperMart') {
              pressProcess = process;
              break;
            }
          }

          if (pressProcess) {
            const pressProcessId = pressProcess.id;
            return this.getVendors(pressProcessId);
          }
        }
        return of([]);
      })
    );
  }


  getVendors(processId: any): Observable<any> {
    return this.vendorService.getVendorByProductProcess(processId);
  }



  getPaperMarketById() {
    if (!Number.isNaN(this.idFromQueryParam)) {
      return this.paperMarketService.getPaperMarketById(this.idFromQueryParam);
    } else {
      return of({});
    }
  }


  formatDate(timestampArray: number[]): string {
    const [year, month, day] = timestampArray;
    const monthString = (month < 10 ? '0' : '') + month;
    const dayString = (day < 10 ? '0' : '') + day;

    return `${year}-${monthString}-${dayString}`;
  }


  addPapermarketRate() {

    let obj = {
      paperStock: this.paperStockValue.name,
      brand: this.brandValue,
      madeIn: this.madeInValue,
      gsm: this.gsmValue,
      length: this.lengthValue,
      width: this.lengthValue,
      dimension: this.dimensionValue,
      qty: this.qtyValue,
      kg: this.kgValue,
      vendor: { id: this.vendorValue.id },
      ratePkr: this.rateValue,
      notes: this.noteValue,
      status: this.statusValue
    }

    if (Number.isNaN(this.idFromQueryParam)) {
      this.paperMarketService.postPaperMarket(obj).subscribe(res => {
        this.router.navigateByUrl('/paperMarket')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    } else {
      this.paperMarketService.updatePaperMarket(this.idFromQueryParam, obj).subscribe(res => {
        this.router.navigateByUrl('/paperMarket')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    }
  }

  getGsm(papervalue: string) {
    this.settingservice.getGsmByPaperStock(papervalue).subscribe(res => {
      this.gsmArray = res
      this.gsmValue = this.rateToUpdate.gsm
    }, error => {
      this.showError(error);
      this.visible = true;
    })
  }

  get id(): boolean {
    return Number.isNaN(this.idFromQueryParam)
  }

  dimension() {
    this.lengthValue != undefined && this.widthValue != undefined ? this.dimensionValue = this.lengthValue + '" x ' + this.widthValue + '"' : this.dimensionValue = ''
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }

}
