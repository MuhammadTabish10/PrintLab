// import { DatePipe } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { PaperMarketService } from 'src/app/services/paper-market.service';
// import { MessageService } from 'primeng/api';
// import { Table } from 'primeng/table';
// @Component({
//   selector: 'app-paper-market',
//   templateUrl: './paper-market.component.html',
//   styleUrls: ['./paper-market.component.css']
// })
// export class PaperMarketComponent implements OnInit {

//   error: string = ''
//   visible!: boolean
//   paperMarketArray: any = []
//   tableData: Boolean = false
//   search: string = ''

//   constructor(private paperMarketService: PaperMarketService, private router: Router, private datePipe: DatePipe, private messageService: MessageService) { }

//   ngOnInit(): void {
//     this.getPaperMarketRates()
//   }

//   getSeverity(status: string) {
//     switch (status.toLowerCase()) {
//       case 'unqualified':
//         return 'danger';

//       case 'qualified':
//         return 'success';

//       case 'new':
//         return 'info';

//       case 'negotiation':
//         return 'warning';

//       case 'renewal':
//         return '';
//       default:
//         return 'info';
//     }
//   }

//   clear(table: Table) {
//     table.clear();
//   }

//   getPaperMarketRates() {
//     this.paperMarketService.getPaperMarket().subscribe(res => {
//       this.paperMarketArray = res;
//       this.paperMarketArray.forEach((el: any) => {

//         const dateArray = el.timeStamp;
//         el.timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
//         el.timeStamp = this.datePipe.transform(el.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
//         el.ratePkr = Math.round(el.ratePkr * 100) / 100;
//         el.kg = Math.round(el.kg * 100) / 100;
//       });
//       this.paperMarketArray.length == 0 ? this.tableData = true : this.tableData = false;
//     }, error => {
//       this.showError(error);
//       this.visible = true;
//     });
//   }


//   deletePaperMarketRate(id: any) {

//     this.paperMarketService.deletePaperMarket(id).subscribe(() => {
//       this.getPaperMarketRates()
//     }, error => {
//       this.showError(error);
//       this.visible = true
//     })
//   }

//   editPaperMarketRate(id: any) {
//     this.router.navigate(['/addPaperMarket'], { queryParams: { id: id } });
//   }

//   searchPaperMarket(paperStockName: any) {
//     if (this.search == '') {
//       this.getPaperMarketRates()
//     } else {
//       this.paperMarketService.searchPaperMarket(paperStockName.value).subscribe(res => {
//         this.paperMarketArray = res
//         this.paperMarketArray.forEach((el: any) => {
//           debugger
//           const dateArray = el.timeStamp;
//           el.timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
//           el.timeStamp = this.datePipe.transform(el.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
//           el.ratePkr = Math.round(el.ratePkr * 100) / 100;
//           el.kg = Math.round(el.kg * 100) / 100;
//         });
//         this.paperMarketArray.length == 0 ? this.tableData = true : this.tableData = false;
//       }, error => {
//         this.showError(error);
//         this.visible = true
//       })
//     }
//   }
//   showError(error: any) {
//     this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { PaperMarketService } from 'src/app/services/paper-market.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-paper-market',
  templateUrl: './paper-market.component.html',
  styleUrls: ['./paper-market.component.css']
})

export class PaperMarketComponent implements OnInit {
  papersToFilter: any = [];
  statuses!: any[];
  activityValues: number[] = [0, 100];
  error: string = ''
  visible!: boolean
  paperMarketArray: any = []
  tableData: Boolean = false
  search: string = ''
  brandsToFilter: any = [];
  madeInToFilter: any = [];
  gsmToFilter: any = [];
  dimensionsToFilter: any = [];
  kgToFilter: any = [];
  vendorToFilter: any = [];
  recordToFilter: any = [];
  rateToFilter: any = [];
  statusToFilter: any = [];
  filterRes: any;
  pageNumber: number = 0;
  lastPage: number = 7;
  http: any;
  searchFromQueryParam: any;
  rateFilter: number | undefined;


  constructor(private paperMarketService: PaperMarketService,
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getFilteredAndPaginatedData(null, null);
  }


  clear() {
    debugger
    this.getFilteredAndPaginatedData(null, null);
  }

  getFilteredAndPaginatedData(page?: any, search?: any) {
    debugger
    if (this.searchFromQueryParam) {
      page = null;
    }
    let obj: any = {};
    if (search && !search.value) {
      if (search ? search[0].hasOwnProperty('paperStock') : search) {
        obj = search.reduce((obj: any, item: any) => {
          obj['paperStock'] = item.paperStock;
          return obj;
        }, {});
      } else if (search ? search[0].hasOwnProperty('brand') : search) {
        obj = search.reduce((obj: any, item: any) => {
          obj['brand'] = item.brand;
          return obj;
        }, {});
      } else if (search ? search[0].hasOwnProperty('madeIn') : search) {
        obj = search.reduce((obj: any, item: any) => {
          obj['madeIn'] = item.madeIn;
          return obj;
        }, {});
      } else if (search ? search[0].hasOwnProperty('gsm') : search) {
        obj = search.reduce((obj: any, item: any) => {
          obj['gsm'] = item.gsm;
          return obj;
        }, {});
      } else if (search ? search[0].hasOwnProperty('dimension') : search) {
        obj = search.reduce((obj: any, item: any) => {
          obj['dimension'] = item.dimension;
          return obj;
        }, {});
      } else if (search ? search[0].hasOwnProperty('qty') : search) {
        obj = search.reduce((obj: any, item: any) => {
          obj['qty'] = item.qty;
          return obj;
        }, {});
      } else if (search ? search[0].hasOwnProperty('kg') : search) {
        obj = search.reduce((obj: any, item: any) => {
          obj['kg'] = item.kg;
          return obj;
        }, {});
      } else if (search ? search[0].hasOwnProperty('recordType') : search) {
        obj = search.reduce((obj: any, item: any) => {
          obj['recordType'] = item.recordType;
          return obj;
        }, {});
      } else if (search ? search[0].hasOwnProperty('ratePkr') : search) {
        obj = search.reduce((obj: any, item: any) => {
          obj['ratePkr'] = item.ratePkr;
          return obj;
        }, {});
      } else if (search ? search[0].hasOwnProperty('status') : search) {
        obj = search.reduce((obj: any, item: any) => {
          obj['status'] = item.status;
          return obj;
        }, {});
      } else if (search ? search[0].hasOwnProperty('vendor') : search) {
        obj = search.reduce((obj: any, item: any) => {
          obj['vendor'] = item.vendor;
          return obj;
        }, {});
      } else if (search ? search[0].hasOwnProperty('qty') : search) {
        obj = search.reduce((obj: any, item: any) => {
          obj['qty'] = item.qty;
          return obj;
        }, {});
      }
    }
    debugger
    const uniquePapers = new Set<string>();
    const uniqueBrands = new Set<string>();
    const uniqueMadeIn = new Set<string>();
    const uniqueGsms = new Set<string>();
    const uniqueDimensions = new Set<string>();
    const uniqueKg = new Set<string>();
    const uniqueVendor = new Set<string>();
    const uniqueRecordType = new Set<string>();
    const uniqueRate = new Set<string>();
    const uniqueStatus = new Set<string>();
    this.paperMarketService.getFilteredAndPaginatedData(page, obj).subscribe((res: any) => {
      this.paperMarketArray = res.content;
      this.filterRes = res
      debugger
      this.paperMarketArray.forEach((el: any) => {
        const dateArray = el.timeStamp;
        el.timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
        el.timeStamp = this.datePipe.transform(el.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
        el.ratePkr = Math.round(el.ratePkr * 100) / 100;
        el.kg = Math.round(el.kg * 100) / 100;
        uniquePapers.add(el.paperStock);
        uniqueBrands.add(el.brand);
        uniqueMadeIn.add(el.madeIn);
        uniqueGsms.add(el.gsm);
        uniqueDimensions.add(el.dimension);
        uniqueKg.add(el.kg);
        uniqueVendor.add(el.vendor.name);
        uniqueRecordType.add(el.recordType);
        uniqueRate.add(el.ratePkr);
        uniqueStatus.add(el.status);
        this.papersToFilter = Array.from(uniquePapers).map(name => ({ paperStock: name }));
        this.brandsToFilter = Array.from(uniqueBrands).map(name => ({ brand: name }));
        this.madeInToFilter = Array.from(uniqueMadeIn).map(name => ({ madeIn: name }));
        this.gsmToFilter = Array.from(uniqueGsms).map(name => ({ gsm: name }));
        this.dimensionsToFilter = Array.from(uniqueDimensions).map(name => ({ dimension: name }));
        this.kgToFilter = Array.from(uniqueKg).map(name => ({ kg: name }));
        this.vendorToFilter = Array.from(uniqueVendor).map(name => ({ vendor: name }));
        this.recordToFilter = Array.from(uniqueRecordType).map(name => ({ recordType: name }));
        this.rateToFilter = Array.from(uniqueRate).map(name => ({ rate: name }));
        this.statusToFilter = Array.from(uniqueStatus).map(name => ({ status: name }));
      });
      this.paperMarketArray.length == 0 ? this.tableData = true : this.tableData = false;
    }, error => {
      this.showError(error);
      this.visible = true;
    });
  }

  applyQuantityFilter(quantity: any) {
    debugger
    const quantityValue = Number(quantity.value);
    const filter = quantity.placeholder === 'Quantity' ? [{ qty: quantityValue }] : null;
    this.getFilteredAndPaginatedData(null, filter);
  }

  applyRateFilter(rate: any) {
    const rateValue = Number(rate.value);
    const filter = rate.placeholder === 'Pkr' ? [{ ratePkr: rateValue }] : null;
    this.getFilteredAndPaginatedData(null, filter);
  }

  onDateSelect(date: any) {
    const uiDate = new Date("Fri Oct 20 2023 00:18:45 GMT+0500 (Pakistan Standard Time)");
    const formattedDate = uiDate.toISOString().slice(0, 19).replace('T', ' ');
    console.log("Date from Ui", formattedDate);

  }

  deletePaperMarketRate(id: any) {
    this.paperMarketService.deletePaperMarket(id).subscribe(() => {
      this.getFilteredAndPaginatedData();
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  editPaperMarketRate(id: any) {
    this.router.navigate(['/addPaperMarket'], { queryParams: { id: id } });
  }

  // searchPaperMarket(search: any) {
  //   debugger

  //   } else {
  //     debugger
  //     this.paperMarketService.searchPaperMarket(null,obj).subscribe(res => {
  //       this.filterRes = res;
  //       debugger
  //       debugger
  //     }, error => {
  //       this.showError(error);
  //       this.visible = true
  //     })
  //   }
  // }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}

