import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaperMarketService } from 'src/app/services/paper-market.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-paper-market',
  templateUrl: './paper-market.component.html',
  styleUrls: ['./paper-market.component.css']
})
export class PaperMarketComponent implements OnInit {

  error: string = ''
  visible!: boolean
  paperMarketArray: any = []
  tableData: Boolean = false
  search: string = ''
  dimensionValueToShow: any;

  constructor(private paperMarketService: PaperMarketService, private router: Router, private datePipe: DatePipe,private messageService: MessageService) { }

  ngOnInit(): void {
    this.getPaperMarketRates()
  }

  getPaperMarketRates() {
    this.paperMarketService.getPaperMarket().subscribe(res => {
      this.paperMarketArray = res;
      this.paperMarketArray.forEach((el: any) => {
        const dateArray = el.timeStamp;
        el.timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
        el.timeStamp = this.datePipe.transform(el.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
        el.ratePkr = Math.round(el.ratePkr * 100) / 100;
        el.kg = Math.round(el.kg * 100) / 100;
        const parts = el.dimension.split('x');
        el.dimension = parts.join(' x ');
      });
      this.paperMarketArray.length == 0 ? this.tableData = true : this.tableData = false;
    }, error => {
      this.showError(error);
      this.visible = true;
    });
  }


  deletePaperMarketRate(id: any) {

    this.paperMarketService.deletePaperMarket(id).subscribe(() => {
      this.getPaperMarketRates()
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  editPaperMarketRate(id: any) {
    this.router.navigate(['/addPaperMarket'], { queryParams: { id: id } });
  }

  searchPaperMarket(paperStockName: any) {
    const searchTerm = paperStockName.value.trim().toLowerCase();
    const searchWithUnderscores = searchTerm.replace(/\s+/g, '_');
    debugger
    if (!searchTerm) {
      this.getPaperMarketRates()
    } else {
      this.paperMarketService.searchPaperMarket(searchWithUnderscores).subscribe(res => {
        this.paperMarketArray = res
        this.paperMarketArray.forEach((el: any) => {
          const dateArray = el.timeStamp;
          el.timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
          el.timeStamp = this.datePipe.transform(el.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
          el.ratePkr = Math.round(el.ratePkr * 100) / 100;
          el.kg = Math.round(el.kg * 100) / 100;
        });
        this.paperMarketArray.length == 0 ? this.tableData = true : this.tableData = false;
      }, error => {
        this.showError(error);
        this.visible = true
      })
    }
  }
  
  trackByElementId(index: number, element: any): number {
    return element.id;
  }
  
  showError(error:any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
