import { ProductDefinitionService } from './../../services/product-definition.service';
import { Component, OnInit } from '@angular/core';
import { PaperMarketComponent } from '../paper-market/paper-market.component';
import { PaperMarketService } from 'src/app/services/paper-market.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-add-paper-market',
  templateUrl: './add-paper-market.component.html',
  styleUrls: ['./add-paper-market.component.css']
})
export class AddPaperMarketComponent implements OnInit {

  quantityArray: any = [500, 100]
  statusArray: any = ['Hoarding', 'In stock', 'Out of stock']
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
  vendorValue: any = {}

  constructor(private paperMarketService: PaperMarketService, private route: ActivatedRoute, private router: Router, private productFieldService: ProductDefinitionService, private settingservice: SettingsService, private vendorService: VendorService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.getProductFields()
        this.buttonName = 'Add'
      } else {
        this.paperMarketService.getPaperMarketById(this.idFromQueryParam).subscribe(res => {
          this.buttonName = 'Update'
          this.rateToUpdate = res
          this.timeStampValue = this.rateToUpdate.date
          this.lengthValue = this.rateToUpdate.length
          this.widthValue = this.rateToUpdate.width
          this.dimensionValue = this.rateToUpdate.dimension
          this.qtyValue = this.rateToUpdate.qty
          this.rateValue = this.rateToUpdate.ratePkr
          this.noteValue = this.rateToUpdate.notes
          this.verifiedValue = this.rateToUpdate.verified
          this.getProductFields()
          this.getGsm(this.rateToUpdate.paperStock)
        }, error => {
          this.error = error.error.error
          this.visible = true;
        })
      }
    })
    this.getVendors()
  }

  addPapermarketRate() {
    let obj = {
      timeStamp: this.timeStampValue,
      paperStock: this.paperStockValue.name,
      brand: this.brandValue,
      madeIn: this.madeInValue,
      gsm: this.gsmValue,
      length: this.lengthValue,
      width: this.lengthValue,
      dimension: this.dimensionValue,
      qty: this.qtyValue,
      kg: this.kgValue,
      vendor: this.vendorValue.name,
      ratePkr: this.rateValue,
      notes: this.noteValue,
      status: this.statusValue
    }
    debugger
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

  getGsm(papervalue: string) {
    this.settingservice.getGsmByPaperStock(papervalue).subscribe(res => {
      this.gsmArray = res
      this.gsmValue = this.rateToUpdate.gsm
    }, error => {
      this.error = error.error.error
      this.visible = true;
    })
  }

  getProductFields() {
    this.productFieldService.getProductField().subscribe(res => {
      let arr: any = []
      arr = res
      arr.forEach((element: any) => {
        element.name.toLowerCase().replace(/\s/g, '') == 'paperstock' ? this.paperStockArray = element.productFieldValuesList : null
      });
      if (!Number.isNaN(this.idFromQueryParam)) {
        this.paperStockArray.forEach((el: any) => {
          el.name == this.rateToUpdate.paperStock ? this.paperStockValue = el : null
        })
      }
    }, error => {
      this.error = error.error.error
      this.visible = true;
    })
  }

  get id(): boolean {
    return Number.isNaN(this.idFromQueryParam)
  }

  dimension() {
    debugger
    this.lengthValue != undefined && this.widthValue != undefined ? this.dimensionValue = this.lengthValue + '" x ' + this.widthValue + '"' : this.dimensionValue = ''
  }

  getVendors() {
    this.vendorService.getVendor().subscribe(res => {
      debugger
      this.vendorArray = res
    })
  }
}
