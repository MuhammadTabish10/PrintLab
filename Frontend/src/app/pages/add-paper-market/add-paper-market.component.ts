import { Component, OnInit } from '@angular/core';
import { PaperMarketComponent } from '../paper-market/paper-market.component';
import { PaperMarketService } from 'src/app/services/paper-market.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-paper-market',
  templateUrl: './add-paper-market.component.html',
  styleUrls: ['./add-paper-market.component.css']
})
export class AddPaperMarketComponent implements OnInit {

  buttonName: String = 'Add'
  dateValue: String = ''
  paperStockValue: String = ''
  gsmValue!: number
  lengthValue!: number
  widthValue!: number
  dimensionValue: String = ''
  qtyValue!: number
  rateValue!: number
  verifiedValue: boolean = true
  noteValue: String = ''
  idFromQueryParam!: number
  rateToUpdate: any = []


  constructor(private paperMarketService: PaperMarketService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      debugger
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.paperMarketService.getPaperMarketById(this.idFromQueryParam).subscribe(res => {
          debugger
          this.buttonName = 'Update'
          console.log(res);
          this.rateToUpdate = res
          this.dateValue = this.rateToUpdate.date
          this.paperStockValue = this.rateToUpdate.paperStock
          this.gsmValue = this.rateToUpdate.gsm
          this.lengthValue = this.rateToUpdate.length
          this.widthValue = this.rateToUpdate.width
          this.dimensionValue = this.rateToUpdate.dimension
          this.qtyValue = this.rateToUpdate.qty
          this.rateValue = this.rateToUpdate.ratePkr
          this.noteValue = this.rateToUpdate.notes
          this.verifiedValue = this.rateToUpdate.verified
        })
      }
    })
  }

  addPapermarketRate() {
    debugger
    console.log(this.verifiedValue);
    let obj = {
      date: this.dateValue,
      paperStock: this.paperStockValue,
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
        debugger
        this.router.navigateByUrl('/paperMarket')
      })
    } else {
      this.paperMarketService.updatePaperMarket(this.idFromQueryParam, obj).subscribe(res => {
        debugger
        this.router.navigateByUrl('/paperMarket')
      })

    }
  }

  getVerifiedValue() {
    this.verifiedValue = !this.verifiedValue
  }
}
