import { PaperSizeService } from './../../services/paper-size.service';
import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CalculatorService } from 'src/app/services/calculator.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ConfigurationTableComponent } from '../configuration-table/configuration-table.component';
import { SettingsService } from 'src/app/services/settings.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { PaperMarketService } from 'src/app/services/paper-market.service';
import { DatePipe } from '@angular/common';
import { ProductService } from 'src/app/services/product.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-calculator-header',
  templateUrl: './calculator-header.component.html',
  styleUrls: ['./calculator-header.component.css']
})
export class CalculatorHeaderComponent implements OnInit {
  @ViewChild(ConfigurationTableComponent)
  configTable!: ConfigurationTableComponent;
  @Output() calculateedObj: EventEmitter<object> = new EventEmitter();
  @Output() sheetSize: EventEmitter<any> = new EventEmitter();
  currentDatetime: string = '';
  error: any
  visible!: boolean;
  fields: any[] = [];
  productArray: any = []
  productToUpdate: any
  productName: any = ''
  selectedProduct: any = []
  impositionValue: any;
  selectedProdDefArray: any = [];
  flyer: any = []
  sizeValue: any;
  gsmValue: any;
  paperValue: any;
  jobFrontValue: any;
  sideOptionValue: any;
  jobBackValue: any;
  sheetValue: any;
  totalAmount: any;
  paperMarket: any = []
  lastUpdatedPaper: string = '';
  lastUpdatedGSM: any;
  lastUpdatedRate: any;
  lastUpdatedQty: any;
  costPerSheet: any;
  upping: any[] = [];
  uppingValue: any;
  receivedData: any;
  margin: any;
  qty: any;
  selectedOption: any;
  configuration: any;
  pressAlert: boolean = false;
  qtyAlert: boolean = false;
  boolean: any;
  loading: boolean = false;
  gsmArray: any = [];
  fieldList: any = [];
  paperStock: any = [];
  dimension: any = [];
  paperSizesArray: any = [];
  lastEntry: any;
  productDefinitionArray: any = [];
  papersStock: any[] = [];
  frontJobColors: any[] = [];
  uppingSizes: any[] = [];
  backJobColors: any[] = [];
  constructor(private calculatorService: CalculatorService,
    private orderService: OrdersService,
    private renderer: Renderer2,
    private settingService: SettingsService,
    private productFieldService: ProductDefinitionService,
    private paperSizeService: PaperSizeService,
    private papers: PaperMarketService,
    private datePipe: DatePipe,
    private productService: ProductService,
    private messageService: MessageService) { }
  ngOnInit(): void {
    this.configuration = "Configuration";
    this.fields = this.calculatorService.getFields();
    this.updateDatetime();
    setInterval(() => this.updateDatetime(), 1000);
    this.paperMarket = this.papers.getPaperMarket();
    this.upping = this.calculatorService.getUpping();
    this.uppingValue = '-';
    this.getFields();
    this.getPaperSizes();
    this.getProducts();

  }

  ngAfterViewInit() {
    this.configTable.specifications.subscribe((data: string) => {
      this.receivedData = data;
    });
  }

  private updateDatetime(): void {
    const options = {
      hour12: true
    };
    this.currentDatetime = new Date().toLocaleString(undefined, options);
  }

  calculate() {
    this.loading = true;
    this.pressAlert = false;
    if (!this.qty) {
      alert('Please decide quantity');
      this.qtyAlert = true;
      return;
    }
    this.qtyAlert = false;
    this.selectedProdDefArray.forEach((el: any) => {
      el.name == 'Paper Stock' ? this.paperValue = el.selected.productFieldValue.name : null
      el.name == 'Size' ? this.sizeValue = el.selected.productFieldValue.name : null
      el.name == 'GSM' ? this.gsmValue = el.selected.productFieldValue.name : null
      el.name == 'JobColor(Front)' ? this.jobFrontValue = el.selected.productFieldValue.name : null
      el.name == 'Print Side' ? this.sideOptionValue = el.selected.productFieldValue.name : null
      el.name == 'Imposition' ? this.impositionValue = el.selected.productFieldValue.name : null
      el.name == 'JobColor(Back)' ? this.jobBackValue = el.selected.productFieldValue.name : null
      el.name == 'Paper Stock' ? this.sheetValue = el.selected.productFieldValue.name : null
    })
    if (this.sideOptionValue == "SINGLE_SIDED") {
      this.jobBackValue = null
      this.impositionValue = false
    }
    this.impositionValue == "Applied" ? this.impositionValue = "true" : this.impositionValue = "false";
    let obj = {
      pressMachineId: this.receivedData?.press,
      quantity: this.qty,
      productValue: this.productName,
      paper: this.paperValue,
      sizeValue: this.sizeValue,
      gsm: this.gsmValue,
      jobColorsFront: this.jobFrontValue,
      sheetSizeValue: this.sheetValue,
      // sideOptionValue: this.sideOptionValue,
      impositionValue: this.impositionValue,
      jobColorsBack: this.jobBackValue,
      margin: this.receivedData?.margin,
      setupFeee: this.receivedData?.setupFee,
      cutting: this.receivedData?.cutting,
      cuttingImpression: this.receivedData?.impression
    }

    this.orderService.calculations(obj).subscribe(res => {
      this.calculateedObj.emit(res);
    }, (error) => {

      this.showError(error);
      this.visible = true;
    })
  }

  onImpositionValueChange(): void {
    if (this.impositionValue === 'Applied' || this.sideOptionValue === 'SINGLE_SIDED') {
      setTimeout(() => {
        const tdColorsElement = document.getElementById('tdColors');
        const headerAnimationElement = document.getElementById('headerAnimation');
        if (tdColorsElement && headerAnimationElement) {
          this.renderer.setStyle(tdColorsElement, 'display', 'none');
          this.renderer.setStyle(headerAnimationElement, 'display', 'none');
        }
      }, 300);
    } else {
      const tdColorsElement = document.getElementById('tdColors');
      const headerAnimationElement = document.getElementById('headerAnimation');
      if (tdColorsElement && headerAnimationElement) {
        this.renderer.setStyle(tdColorsElement, 'display', 'table-cell');
        this.renderer.setStyle(headerAnimationElement, 'display', 'table-cell');
      }
    }
  }

  onPaperSelection(): void {
    if (this.gsmValue && this.paperValue) {
      this.getLastUpdatedInfoForPaperAndGSM(this.paperValue, this.gsmValue);
    }
    this.onSheetSizeSelection();
    this.getGsm(this.paperValue);
  }

  onGSMSelection(gsmValue: any): void {
    this.gsmValue = parseFloat(gsmValue);

    this.getLastUpdatedInfoForPaperAndGSM(this.paperValue, this.gsmValue);
  }

  private getLastUpdatedInfoForPaperAndGSM(paper: string, gsm: any) {

    this.papers.getPaperMarket().subscribe(res => {
      this.paperMarket = res;
      this.paperMarket.forEach((el: any) => {
        const dateArray = el.timeStamp;
        el.timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);

        el.timeStamp = this.datePipe.transform(el.timeStamp, 'EEEE, MMMM d, yyyy');
        el.ratePkr = Math.round(el.ratePkr * 100) / 100;
        el.kg = Math.round(el.kg * 100) / 100;
      });
      const matchingEntries = this.paperMarket.filter((entry: { paperStock: string; gsm: any }) =>
        entry.paperStock === paper && entry.gsm === gsm
      );
      console.log('Filtering by Paper:', paper);
      console.log('Filtering by GSM:', gsm);


      if (matchingEntries.length > 0) {
        this.lastEntry = matchingEntries.reduce((latest: { timeStamp: string | number | Date }, entry: { timeStamp: string | number | Date }) =>
          new Date(entry.timeStamp) > new Date(latest.timeStamp) ? entry : latest
        );

        // Calculate costPerSheet if both ratePkr and qty are available
        if (this.lastEntry?.ratePkr !== 'Not found' && this.lastEntry?.qty !== 'Not found') {
          this.costPerSheet = this.lastEntry?.ratePkr / this.lastEntry?.qty;

        } else {
          this.costPerSheet = 'Can\'t calculate';
        }
      }
    }, error => {
      this.showError(error);
      this.visible = true;
    });
  }


  getGsm(papervalue: string) {
    this.settingService.getGsmByPaperStock(papervalue).subscribe(
      (res: any) => {
        this.gsmArray = res;

        if (this.gsmArray.length) {
          this.gsmValue = this.gsmArray[0];
          this.onGSMSelection(this.gsmValue);
        } else {
          if (this.gsmValue && !this.gsmArray.includes(this.gsmValue)) {
            this.gsmValue = this.gsmArray.length > 0 ? this.gsmArray[0] : '';
          }
        }

      },
      (error) => {
        this.showError(error);
        this.visible = true;
      }
    );
  }


  private calculateCostPerSheet(rate: string, qty: string): number | string {
    const rateValue = parseFloat(rate.replace(/,/g, ''));
    const qtyValue = parseFloat(qty.replace(/,/g, ''));

    if (!isNaN(rateValue) && !isNaN(qtyValue) && qtyValue !== 0) {
      return rateValue / qtyValue;
    } else {
      return "Can't calculate";
    }
  }


  getUppingValue(selectedSize: string, selectedSheetSize: string): string | null {
    const uppingEntry = this.upping.find(entry => entry.product === selectedSize);
    if (uppingEntry && selectedSheetSize) {
      const key = `s${this.normalizeSizeValue(selectedSheetSize)}`;
      if (uppingEntry[key]) {
        return uppingEntry[key];
      }
    }
    return null;
  }

  normalizeSizeValue(selectedValue: string): string {
    return selectedValue.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }


  onSizeSelection(): void {
    this.uppingValue = this.getUppingValue(this.sizeValue, this.sheetValue);
  }

  onSheetSizeSelection(): void {
    this.uppingValue = this.getUppingValue(this.sizeValue, this.sheetValue);
    this.selectedOption = this.sheetValue;
  }
  receiveDataFromChild(obj: any) {
    this.receivedData = obj;
  }

  private getFields() {
    this.productFieldService.getProductField().subscribe((res: { [key: string]: any }) => {
      const paperStockField = this.getFieldByName(res, 'Paper Stock');
      const frontJobColorsField = this.getFieldByName(res, 'JobColor(Front)');
      const sizeField = this.getFieldByName(res, 'Size');
      const backJobColorsField = this.getFieldByName(res, 'JobColor(Back)');

      this.processFieldValues(paperStockField, this.papersStock);
      this.processFieldValues(frontJobColorsField, this.frontJobColors);
      this.processFieldValues(sizeField, this.uppingSizes);
      this.processFieldValues(backJobColorsField, this.backJobColors);
    });
  }

  private getFieldByName(fields: { [key: string]: any }, name: string): any | null {
    return Object.values(fields).find((field) => field.name === name) || null;
  }

  private processFieldValues(field: any, targetArray: any[]) {
    if (field) {
      targetArray.push(...field.productFieldValuesList);
    }
  }

  getPaperSizes() {
    this.paperSizeService.getPaperSize().subscribe(res => {

      this.paperSizesArray = res
    })
  }
  getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.productDefinitionArray = res
      console.log(this.productDefinitionArray);
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }
  showError(error:any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }

}
