import { PaperSizeService } from './../../services/paper-size.service';
import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CalculatorService } from 'src/app/services/calculator.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ConfigurationTableComponent } from '../configuration-table/configuration-table.component';
import { SettingsService } from 'src/app/services/settings.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';

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
  paperMarket: any[] = [];
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
  dimension: any =[];
  paperSizesArray: any = [];
  constructor(private calculatorService: CalculatorService,
    private orderService: OrdersService,
    private renderer: Renderer2,
    private settingService: SettingsService,
    private productFieldService: ProductDefinitionService,
    private paperSizeService:PaperSizeService) { }
  ngOnInit(): void {
    this.configuration = "Configuration";
    this.fields = this.calculatorService.getFields();
    this.updateDatetime();
    setInterval(() => this.updateDatetime(), 1000);
    this.paperMarket = this.calculatorService.getPaperMarket();
    this.upping = this.calculatorService.getUpping();
    this.uppingValue = '-';
    this.getFields();
    this.getPaperSizes();
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
    // debugger
    this.loading = true;
    if (!this.receivedData || !this.receivedData.press) {
      alert('Please select a press machine and save');
      this.pressAlert = true;
      return;
    }
    this.pressAlert = false;

    if (!this.qty) {
      alert('Please decide quantity');
      this.qtyAlert = true;
      return;
    }
    this.qtyAlert = false;
    this.selectedProdDefArray.forEach((el: any) => {
      el.name == 'Paper Stock' ? this.paperValue = el.selected.productFieldValue.name : null
      if (el.name == 'Size') {
        this.sizeValue = el.selected.productFieldValue.name
      }
      // el.name == 'Size' ? this.sizeValue = el.selected.productFieldValue.name : null
      el.name == 'GSM' ? this.gsmValue = el.selected.productFieldValue.name : null
      el.name == 'JobColor(Front)' ? this.jobFrontValue = el.selected.productFieldValue.name : null
      el.name == 'Print Side' ? this.sideOptionValue = el.selected.productFieldValue.name : null
      el.name == 'Imposition' ? this.impositionValue = el.selected.productFieldValue.name : null
      el.name == 'JobColor(Back)' ? this.jobBackValue = el.selected.productFieldValue.name : null
      el.name == 'Paper Stock' ? this.sheetValue = el.selected.productFieldValue.name : null
    })
    if (this.sideOptionValue == "Single Side") {
      this.jobBackValue = null
      this.impositionValue = false
    }
    this.impositionValue == "Applied" ? this.impositionValue = "true" : this.impositionValue = "false";
    debugger
    let obj = {
      pressMachineId: this.receivedData.press,
      quantity: this.qty,
      productValue: this.productName,
      paper: this.paperValue,
      sizeValue: this.sizeValue,
      gsm: this.gsmValue,
      jobColorsFront: this.jobFrontValue,
      sheetSizeValue: this.sheetValue,
      sideOptionValue: this.sideOptionValue,
      impositionValue: this.impositionValue,
      jobColorsBack: this.jobBackValue,
      margin: this.receivedData.margin,
      setupFeee: this.receivedData.setupFee,
      cutting: this.receivedData.cutting,
      cuttingImpression: this.receivedData.impression
    }

    this.orderService.calculations(obj).subscribe(res => {
      this.calculateedObj.emit(res);
    }, error => {
      alert(error.error.error)
    })
  }
  onImpositionValueChange(): void {
    if (this.impositionValue === 'Applied' || this.sideOptionValue === 'SingleSided') {
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
      const { date, rate, qty } = this.getLastUpdatedInfoForPaperAndGSM(this.paperValue, this.gsmValue);
      this.lastUpdatedPaper = date;
      this.lastUpdatedRate = rate;
      this.lastUpdatedQty = qty;
      this.costPerSheet = this.calculateCostPerSheet(rate, qty);
    }
    this.onSheetSizeSelection();
    this.getGsm(this.paperValue);
  }

  onGSMSelection(gsmValue: any): void {
    debugger
    this.gsmValue = gsmValue;
    debugger
    const { date, rate, qty } = this.getLastUpdatedInfoForPaperAndGSM(this.paperValue, this.gsmValue);
    this.lastUpdatedPaper = date;
    this.lastUpdatedRate = rate;
    this.lastUpdatedQty = qty;
    this.costPerSheet = this.calculateCostPerSheet(rate, qty);
  }



  private getLastUpdatedInfoForPaperAndGSM(paper: string, gsm: string): { date: string, rate: string, qty: string } {
    debugger
    const matchingEntries = this.paperMarket.filter(entry =>
      entry.paperStock === paper && entry.gsm === gsm.toString()
    );

    if (matchingEntries.length > 0) {
      const latestEntry = matchingEntries.reduce((latest, entry) =>
        new Date(entry.date) > new Date(latest.date) ? entry : latest
      );

      // const latestEntryDate = new Date(latestEntry.date);
      // const currentDate = new Date();

      // if (currentDate.getTime() - latestEntryDate.getTime() >= 10 * 24 * 60 * 60 * 1000) {
      //   alert('Please update paper!');
      // }

      return {
        date: latestEntry.date,
        rate: latestEntry.rate,
        qty: latestEntry.qty
      };
    } else {
      return {
        date: 'Not found',
        rate: 'Not found',
        qty: 'Not found'
      };
    }
  }

  getGsm(papervalue: string) {
    this.settingService.getGsmByPaperStock(papervalue).subscribe(
      (res: any) => {
        this.gsmArray = res;

        // Check if there's only one GSM option available
        if (this.gsmArray.length === 1) {
          // Automatically select the only available GSM
          this.gsmValue = this.gsmArray[0];
          this.onGSMSelection(this.gsmValue);
        } else {
          // Check if the current gsmValue exists in the fetched gsmArray
          if (this.gsmValue && !this.gsmArray.includes(this.gsmValue)) {
            // If the current value is not in the fetched array, set it to the first value
            this.gsmValue = this.gsmArray.length > 0 ? this.gsmArray[0] : '';
          }
        }

      },
      (error) => {
        console.error('Error fetching GSM data:', error);
        // Handle the error as needed (e.g., show a user-friendly message)
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
    debugger
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
    // if (this.sheetValue && this.paperValue) {
    //   this.boolean = this.checkSheetSizeAvailability(this.paperValue, this.sheetValue);
    // }
    this.selectedOption = this.sheetValue;
  }
  receiveDataFromChild(obj: any) {
    this.receivedData = obj;
  }
  // checkSheetSizeAvailability(product: string, sheetSize: string): boolean {
  //   debugger
  //   const matchingEntry = this.paperMarket.find((entry) => entry.paperStock === product);
  //   if (matchingEntry && matchingEntry.dimension === sheetSize) {
  //     return matchingEntry.dimension.includes(sheetSize);
  //   }
  //   return false;
  // }

  getFields() {
    this.productFieldService.getProductDefintion().subscribe((res: { [key: string]: any }) => {
      debugger;
      let paperStockField = null;
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          const field = res[key];
          if (field.name === 'Paper Stock') {
            paperStockField = field;
            break;
          }
        }
      }

      if (paperStockField) {
        for (const value of paperStockField.productFieldValuesList) {
          this.paperStock.push(value);
        }
      }
    });
  }
  getPaperSizes() {
    this.paperSizeService.getPaperSize().subscribe(res => {
      this.paperSizesArray = res
    })
  }
}
