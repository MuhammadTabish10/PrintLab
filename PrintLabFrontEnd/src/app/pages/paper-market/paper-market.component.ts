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

  constructor(private paperMarketService: PaperMarketService, private router: Router) { }

  ngOnInit(): void {
    // debugger
    this.getPaperMartetRates()
  }

  getPaperMartetRates() {
    this.paperMarketService.getPaperMarket().subscribe(res => {
      this.paperMarketArray = res
      console.log(this.paperMarketArray);
      this.paperMarketArray.length == 0 ? this.tableData = true : this.tableData = false;
    })
  }

  deletePaperMarketRate(id: any) {
    debugger
    this.paperMarketService.deletePaperMarket(id).subscribe(res => {
      debugger
      this.getPaperMartetRates()
    })
  }

  editPaperMarketRate(id: any) {
    this.router.navigate(['/addPaperMarket'], { queryParams: { id: id } });
  }

  searchPaperMarket(paperStockName: any) {
    this.paperMarketService.searchPaperMarket(paperStockName.value).subscribe(res => {
      this.paperMarketArray = res
      this.paperMarketArray.length == 0 ? this.tableData = true : this.tableData = false;
    })
  }
}