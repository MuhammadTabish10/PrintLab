import { Component, OnInit, Renderer2 } from '@angular/core';
import { CalculatorService } from 'src/app/services/calculator.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-calculator-header',
  templateUrl: './calculator-header.component.html',
  styleUrls: ['./calculator-header.component.css']
})
export class CalculatorHeaderComponent implements OnInit {
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
  constructor(private calculatorService: CalculatorService, private orderService: OrdersService, private renderer: Renderer2) { }
  ngOnInit(): void {
    this.fields = this.calculatorService.getFields();
    console.log(this.fields);
    this.updateDatetime();
    setInterval(() => this.updateDatetime(), 1000);
    this.paperMarket = this.calculatorService.getPaperMarket();
    this.upping = this.calculatorService.getUpping();
    this.uppingValue = '-'
    console.log(this.fields);
  }

  private updateDatetime(): void {
    this.currentDatetime = new Date().toLocaleString();
  }

  toggleFields(title: any) {
    debugger
    this.productName = title.title
    title.productDefinitionFieldList.forEach((el: any) => {
      el.isPublic ? this.selectedProduct.push(el) : null
      el.productField.name == 'Imposition' ? this.impositionValue = el.selectedValues[0].value : null
    })
    this.selectedProdDefArray = []
    console.log(this.selectedProduct)
  }

  calculate() {
    debugger
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
    let obj = {
      productValue: this.productName,
      paper: this.paperValue,
      sizeValue: this.sizeValue,
      gsm: this.gsmValue,
      jobColorsFront: this.jobFrontValue,
      sheetSizeValue: this.sheetValue,
      sideOptionValue: this.sideOptionValue,
      impositionValue: this.impositionValue,
      jobColorsBack: this.jobBackValue
    }
    this.orderService.calculations(obj).subscribe(res => {
      debugger
      this.totalAmount = res
    }, error => {
      alert(error.error.error)
    })
    console.log(obj);
  }
  onImpositionValueChange(): void {
    if (this.impositionValue === 'Applied') {
      setTimeout(() => {
        const tdColorsElement = document.getElementById('tdColors');
        const headerAnimationElement = document.getElementById('headerAnimation');

        if (tdColorsElement && headerAnimationElement) {
          this.renderer.setStyle(tdColorsElement, 'display', 'none');
          this.renderer.setStyle(headerAnimationElement, 'display', 'none');
        }
      }, 300);
    } else {
      // Reset the display property when impositionValue is not 'Applied'
      const tdColorsElement = document.getElementById('tdColors');
      const headerAnimationElement = document.getElementById('headerAnimation');

      if (tdColorsElement && headerAnimationElement) {
        this.renderer.setStyle(tdColorsElement, 'display', 'table-cell'); // Or whatever is the original display style
        this.renderer.setStyle(headerAnimationElement, 'display', 'table-cell'); // Or whatever is the original display style
      }
    }
  }

  onPaperSelection(): void {
    const { date, rate, qty } = this.getLastUpdatedInfoForPaperAndGSM(this.paperValue, this.gsmValue);
    this.lastUpdatedPaper = date;
    this.lastUpdatedRate = rate;
    this.lastUpdatedQty = qty;

    // Calculate the cost per sheet
    this.costPerSheet = this.calculateCostPerSheet(rate, qty);

    // Rest of your logic for updating the UI or performing other actions.
  }

  onGSMSelection(): void {
    const { date, rate, qty } = this.getLastUpdatedInfoForPaperAndGSM(this.paperValue, this.gsmValue);
    this.lastUpdatedPaper = date;
    this.lastUpdatedRate = rate;
    this.lastUpdatedQty = qty;

    // Calculate the cost per sheet
    this.costPerSheet = this.calculateCostPerSheet(rate, qty);

    // Rest of your logic for updating the UI or performing other actions.
  }



  private getLastUpdatedInfoForPaperAndGSM(paper: string, gsm: string): { date: string, rate: string, qty: string } {
    const matchingEntries = this.paperMarket.filter(entry =>
      entry.paperStock === paper && entry.gsm === gsm
    );

    if (matchingEntries.length > 0) {
      const latestEntry = matchingEntries.reduce((latest, entry) =>
        new Date(entry.date) > new Date(latest.date) ? entry : latest
      );

      return {
        date: latestEntry.date,
        rate: latestEntry.rate,
        qty: latestEntry.qty
      };
    } else {
      // Return default values or empty strings if no matching entry is found.
      return {
        date: 'Not found',
        rate: 'Not found',
        qty: 'Not found'
      };
    }
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
    // Find the entry in the 'upping' array that matches the selected 'size'
    const uppingEntry = this.upping.find(entry => entry.product === selectedSize);

    // Check if a matching entry was found
    if (uppingEntry) {
      // Check if the upping entry has a property for the selected 'sheetSize'
      if (uppingEntry[selectedSheetSize]) {
        // Return the upping value for the selected 'sheetSize'
        return uppingEntry[selectedSheetSize];
      } else {
        // Handle the case where the selected 'sheetSize' is not found in the upping entry
        return null;
      }
    } else {
      // Handle the case where no matching entry is found for the selected 'size'
      return null;
    }
  }

  onSizeSelection(): void {
    // Call getUppingValue with the selected 'size' and 'sheetSize'
    this.uppingValue = this.getUppingValue(this.sizeValue, this.sheetValue);

    if (this.uppingValue !== null) {
      // Handle the upping value, e.g., assign it to a variable or perform other actions
      console.log(`Upping Value: ${this.uppingValue}`);
    } else {
      // Handle the case where no matching upping value is found
      console.log('Upping Value not found');
    }
  }

  onSheetSizeSelection(): void {
    // Call getUppingValue with the selected 'size' and 'sheetSize'
    this.uppingValue = this.getUppingValue(this.sizeValue, this.sheetValue);

    if (this.uppingValue !== null) {
      // Handle the upping value, e.g., assign it to a variable or perform other actions
      console.log(`Upping Value: ${this.uppingValue}`);
    } else {
      // Handle the case where no matching upping value is found
      console.log('Upping Value not found');
    }
  }
}
