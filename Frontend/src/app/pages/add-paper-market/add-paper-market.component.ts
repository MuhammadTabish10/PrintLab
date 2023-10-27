import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PaperMarketService } from 'src/app/services/paper-market.service';
import { SettingsService } from 'src/app/services/settings.service';
import { VendorService } from 'src/app/services/vendor.service';
import { ProductProcessService } from 'src/app/services/product-process.service';
import { PaperStockService } from 'src/app/services/paper-stock.service';

@Component({
  selector: 'app-add-paper-market',
  templateUrl: './add-paper-market.component.html',
  styleUrls: ['./add-paper-market.component.css'],
})
export class AddPaperMarketComponent implements OnInit {
  quantityArray: number[] = [500, 100];
  statusArray: string[] = ['Hoarding', 'In Stock', 'Out of stock'];
  visible: boolean = false;
  error: string = '';
  buttonName: string = 'Add';
  timeStampValue: string = '';
  statusValue: string = '';
  paperStockValue: any = {};
  gsmValue: string = '';
  lengthValue!: number;
  widthValue!: number;
  brandValue: string = '';
  madeInValue: string = '';
  kgValue: string = '';
  dimensionValue: string = '';
  qtyValue: number | undefined;
  rateValue: number | undefined;
  verifiedValue: boolean = true;
  noteValue: string = '';
  idFromQueryParam: number | undefined;
  rateToUpdate: any = {};
  paperStockArray: any[] = [];
  gsmArray: any = [];
  paperStockIndex: any;
  vendorArray: any[] = [];
  vendorValue: any = {};
  disabled: boolean = false;
  productProcessArray: any[] = [];
  pressProcess: any;
  extractedPaperStock: any[] = [];
  extractedBrands: any[] = [];

  constructor(
    private paperMarketService: PaperMarketService,
    private route: ActivatedRoute,
    private router: Router,
    private settingservice: SettingsService,
    private vendorService: VendorService,
    private productProcess: ProductProcessService,
    private messageService: MessageService,
    private paperStockService: PaperStockService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.idFromQueryParam = +param['id'];
      this.buttonName = Number.isNaN(this.idFromQueryParam) ? 'Add' : 'Update';
    });

    this.initializeData();
  }

  initializeData(): void {
    forkJoin([
      this.getPaperMarketById(),
      this.getProductProcess(),
    ])
      .pipe(
        switchMap(([paperMarketData, vendors]) => {
          this.rateToUpdate = paperMarketData;
          this.vendorArray = vendors;
          return this.extractPaperStock().pipe(
            map((paperStockData) => [paperMarketData, vendors, paperStockData])
          );
        })
      )
      .subscribe(
        ([paperMarketData, vendors, paperStockData]) => {
          this.rateToUpdate = paperMarketData;
          this.getGsm(this.rateToUpdate.paperStock);
          this.vendorArray = vendors;
          this.extractedPaperStock = paperStockData;
          if (!Number.isNaN(this.idFromQueryParam)) {
            this.updateComponentData();
          }
        },
        (error) => {
          this.visible = true;
          this.showError(error);
        }
      );
  }

  getPaperMarketById(): Observable<any> {
    return Number.isNaN(this.idFromQueryParam)
      ? of({})
      : this.paperMarketService.getPaperMarketById(this.idFromQueryParam);
  }

  extractPaperStock(): Observable<any> {
    return this.paperStockService.getAllPaperStock();
  }

  getProductProcess(): Observable<any[]> {
    return this.productProcess.getProductProcess().pipe(
      switchMap((res: any) => {
        this.productProcessArray = res;
        const pressProcess = this.productProcessArray.find(
          (process) =>
            process.name.toLowerCase() === 'papermart' ||
            process.name.toLowerCase() === 'papermart'
        );

        if (pressProcess) {
          return this.getVendors(pressProcess.id);
        } else {
          return of([]);
        }
      })
    );
  }

  getVendors(processId: any): Observable<any> {
    return this.vendorService.getVendorByProductProcess(processId);
  }

  updateComponentData() {
    this.extractedPaperStock.forEach((el) => {
      if (el.name === this.rateToUpdate.paperStock) {
        this.paperStockValue = el;
      }
    });

    this.extractedBrands = this.paperStockValue.brands

    this.extractedBrands.forEach((brand: any) => {
      if (brand.name === this.rateToUpdate.brand) {
        this.brandValue = brand
      }
    });
    debugger
    this.timeStampValue = this.formatDate(this.rateToUpdate.timeStamp);
    this.madeInValue = this.rateToUpdate.madeIn;
    this.lengthValue = this.rateToUpdate.length;
    this.widthValue = this.rateToUpdate.width;
    this.dimensionValue = this.rateToUpdate.dimension;
    this.qtyValue = this.rateToUpdate.qty;
    this.kgValue = this.rateToUpdate.kg.toFixed(2);
    this.vendorValue = this.vendorArray.find((v: any) => v.name === this.rateToUpdate.vendor.name);
    this.rateValue = this.rateToUpdate.ratePkr.toFixed(2);
    this.statusValue = this.rateToUpdate.status;
    this.noteValue = this.rateToUpdate.notes;
    this.verifiedValue = this.rateToUpdate.verified;
    this.addSpacesToDimensionValue();
  }

  formatDate(timestampArray: number[]): string {
    const [year, month, day] = timestampArray;
    const monthString = (month < 10 ? '0' : '') + month;
    const dayString = (day < 10 ? '0' : '') + day;

    return `${year}-${monthString}-${dayString}`;
  }


  addPapermarketRate() {
    this.removeSpacesFromDimensionValue();
    let obj = {
      paperStock: this.paperStockValue.name,
      brand: this.brandValue,
      madeIn: this.madeInValue,
      gsm: this.gsmValue,
      length: this.lengthValue,
      width: this.widthValue,
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
    this.getBrands(papervalue);
    this.settingservice.getGsmByPaperStock(papervalue).subscribe(res => {
      this.gsmArray = res
      this.gsmValue = this.rateToUpdate.gsm
      
    }, error => {
      this.showError(error);
      this.visible = true;
    })
  }

  getBrands(paperValue: string) {
    debugger
    if(this.extractedPaperStock.length > 0 ){
     let paper = this.extractedPaperStock.find(p=> p.name === paperValue)
     this.extractedBrands = paper.brands
    }
  }

  get id(): boolean {
    return Number.isNaN(this.idFromQueryParam)
  }

  dimension() {
    debugger
    this.lengthValue != undefined && this.widthValue != undefined ? this.dimensionValue = this.lengthValue + '" x ' + this.widthValue + '"' : this.dimensionValue = ''
  }

  removeSpacesFromDimensionValue() {
    this.dimensionValue = this.dimensionValue.replace(/\s+/g, '');
  }

  addSpacesToDimensionValue() {
    const parts = this.dimensionValue.split('x');
    this.dimensionValue = parts.join(' x ');
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }

}