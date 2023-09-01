import { ProductDefinitionService } from './../../services/product-definition.service';
import { Component, OnInit } from '@angular/core';
import { PaperMarketComponent } from '../paper-market/paper-market.component';
import { PaperMarketService } from 'src/app/services/paper-market.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-add-paper-market',
  templateUrl: './add-paper-market.component.html',
  styleUrls: ['./add-paper-market.component.css']
})
export class AddPaperMarketComponent implements OnInit {

  quantityArray: any = [500, 1000]
  visible: boolean = false
  error: string = ''
  buttonName: String = 'Add'
  dateValue: String = ''
  paperStockValue: any = {}
  gsmValue: string = ''
  lengthValue!: number
  widthValue!: number
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

  constructor(private paperMarketService: PaperMarketService, private route: ActivatedRoute, private router: Router, private productFieldService: ProductDefinitionService, private settingservice: SettingsService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.getProductFields("")
        this.buttonName = 'Add'
      } else {
        this.paperMarketService.getPaperMarketById(this.idFromQueryParam).subscribe(res => {
          this.buttonName = 'Update'
          this.rateToUpdate = res
          this.dateValue = this.rateToUpdate.date
          this.lengthValue = this.rateToUpdate.length
          this.widthValue = this.rateToUpdate.width
          this.dimensionValue = this.rateToUpdate.dimension
          this.qtyValue = this.rateToUpdate.qty
          this.rateValue = this.rateToUpdate.ratePkr
          this.noteValue = this.rateToUpdate.notes
          this.verifiedValue = this.rateToUpdate.verified
          debugger
          console.log(this.rateToUpdate)
          this.getProductFields(this.rateToUpdate.paperStock)
          this.getGsm(this.rateToUpdate.paperStock, {})
        }, error => {
          this.error = error.error.error
          this.visible = true;
        })
      }
    })
  }

  addPapermarketRate() {
    let obj = {
      date: this.dateValue,
      paperStock: this.paperStockValue.name,
      length: this.lengthValue,
      width: this.widthValue,
      dimension: this.dimensionValue,
      qty: this.qtyValue,
      ratePkr: this.rateValue,
      verified: this.verifiedValue,
      gsm: this.gsmValue,
      notes: this.noteValue
    }
    if (Number.isNaN(this.idFromQueryParam)) {
      this.paperMarketService.postPaperMarket(obj).subscribe(res => {
        this.router.navigateByUrl('/paperMarket')
      }, error => {
        this.error = error.error.error
        this.visible = true;
      })
    } else {
      this.paperMarketService.updatePaperMarket(this.idFromQueryParam, obj).subscribe(res => {
        this.router.navigateByUrl('/paperMarket')
      }, error => {
        this.error = error.error.error
        this.visible = true;
      })
    }
  }

  getGsm(papervalue: string, obj: any) {
    debugger
    Number.isNaN(this.idFromQueryParam) ? this.paperStockIndex = this.paperStockArray.indexOf(obj) : null
    const words = papervalue.split(' ');
    const converted = words.map(word => word.toUpperCase()).join('_')
    this.settingservice.getGsmByPaperStock(converted).subscribe(res => {
      this.gsmArray = res
      this.gsmValue = this.rateToUpdate.gsm
    })
  }

  getProductFields(val: any) {
    this.productFieldService.getProductDefintion().subscribe(res => {
      let arr: any = []
      arr = res
      arr.forEach((element: any) => {
        element.name.toLowerCase().replace(/\s/g, '') == 'paperstock' ? this.paperStockArray = element.productFieldValuesList : null
      });
      if (!Number.isNaN(this.idFromQueryParam)) {
        debugger
        this.paperStockIndex = this.paperStockArray.findIndex((el: any) => el.name == val)
        this.paperStockValue = this.rateToUpdate.paperStock
      }
      console.log(this.paperStockArray);
    })
  }

  get id(): boolean {
    return Number.isNaN(this.idFromQueryParam)
  }

  dimension() {
    this.lengthValue != undefined && this.widthValue != undefined ? this.dimensionValue = this.lengthValue + '" x ' + this.widthValue + '"' : this.dimensionValue = ''
  }

  getVerifiedValue() {
    this.verifiedValue = !this.verifiedValue
  }
}
