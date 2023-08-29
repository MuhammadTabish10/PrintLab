import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaperMarketService } from 'src/app/services/paper-market.service';

@Component({
  selector: 'app-paper-market',
  templateUrl: './paper-market.component.html',
  styleUrls: ['./paper-market.component.css']
})
export class PaperMarketComponent implements OnInit {

  paperMarketArray: any = []
  tableData: Boolean = false
  search: string = ''

  constructor(private paperMarketService: PaperMarketService, private router: Router) { }

  ngOnInit(): void {
    //
    this.getPaperMartetRates()
  }

  getPaperMartetRates() {
    this.paperMarketService.getPaperMarket().subscribe(res => {
      this.paperMarketArray = res
      this.paperMarketArray.length == 0 ? this.tableData = true : this.tableData = false;
    })
  }

  deletePaperMarketRate(id: any) {

    this.paperMarketService.deletePaperMarket(id).subscribe(res => {

      this.getPaperMartetRates()
    })
  }

  editPaperMarketRate(id: any) {
    this.router.navigate(['/addPaperMarket'], { queryParams: { id: id } });
  }

  searchPaperMarket(paperStockName: any) {
    if (this.search == '') {
      this.getPaperMartetRates()
    } else {
      this.paperMarketService.searchPaperMarket(paperStockName.value).subscribe(res => {
        this.paperMarketArray = res
        this.paperMarketArray.length == 0 ? this.tableData = true : this.tableData = false;
      })
    }
  }
}
