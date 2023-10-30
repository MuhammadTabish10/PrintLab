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
//
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
  fullObj: any = {};


  constructor(private paperMarketService: PaperMarketService,
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private route: ActivatedRoute) { }

  // ngOnInit(): void {
  //   this.getFilteredAndPaginatedData(null, null);
  // }


  // clear() {
  //
  //   this.getFilteredAndPaginatedData(null, null);
  // }

  // getFilteredAndPaginatedData(page?: any, search?: any) {
  //
  //   if (this.searchFromQueryParam) {
  //     page = null;
  //   }
  //   let obj: any = {};
  //   let transformedObject;
  //   if (search && !search.value) {
  //     if (search ? search[0].hasOwnProperty('paperStock') : search) {
  //       obj = search.reduce((obj: any, item: any) => {
  //         obj['paperStock'] = item.paperStock;
  //         return obj;
  //       }, {});
  //     } else if (search ? search[0].hasOwnProperty('brand') : search) {
  //       obj = search.reduce((obj: any, item: any) => {
  //         obj['brand'] = item.brand;
  //         return obj;
  //       }, {});
  //     } else if (search ? search[0].hasOwnProperty('madeIn') : search) {
  //       obj = search.reduce((obj: any, item: any) => {
  //         obj['madeIn'] = item.madeIn;
  //         return obj;
  //       }, {});
  //     } else if (search ? search[0].hasOwnProperty('gsm') : search) {
  //       obj = search.reduce((obj: any, item: any) => {
  //         obj['gsm'] = item.gsm;
  //         return obj;
  //       }, {});
  //     } else if (search ? search[0].hasOwnProperty('dimension') : search) {
  //       obj = search.reduce((obj: any, item: any) => {
  //         obj['dimension'] = item.dimension;
  //         return obj;
  //       }, {});
  //     } else if (search ? search[0].hasOwnProperty('qty') : search) {
  //       obj = search.reduce((obj: any, item: any) => {
  //         obj['qty'] = item.qty;
  //         return obj;
  //       }, {});
  //     } else if (search ? search[0].hasOwnProperty('kg') : search) {
  //       obj = search.reduce((obj: any, item: any) => {
  //         obj['kg'] = item.kg;
  //         return obj;
  //       }, {});
  //     } else if (search ? search[0].hasOwnProperty('recordType') : search) {
  //       obj = search.reduce((obj: any, item: any) => {
  //         obj['recordType'] = item.recordType;
  //         return obj;
  //       }, {});
  //     } else if (search ? search[0].hasOwnProperty('ratePkr') : search) {
  //       obj = search.reduce((obj: any, item: any) => {
  //         obj['ratePkr'] = item.ratePkr;
  //         return obj;
  //       }, {});
  //     } else if (search ? search[0].hasOwnProperty('status') : search) {
  //       obj = search.reduce((obj: any, item: any) => {
  //         obj['status'] = item.status;
  //         return obj;
  //       }, {});
  //     } else if (search ? search[0].hasOwnProperty('vendor') : search) {
  //       obj = search.reduce((obj: any, item: any) => {
  //         obj['vendor'] = item.vendor;
  //         return obj;
  //       }, {});
  //     } else if (search ? search[0].hasOwnProperty('qty') : search) {
  //       obj = search.reduce((obj: any, item: any) => {
  //         obj['qty'] = item.qty;
  //         return obj;
  //       }, {});
  //     }
  //   }
  //   if (search) {
  //     this.fullObj.push(obj);
  //     transformedObject = this.fullObj.reduce((result: any, obj: any) => {
  //       // Merge the properties of each object into the result object
  //       return { ...result, ...obj };
  //     }, {});

  //     console.log(transformedObject);
  //   }
  //
  //   const uniquePapers = new Set<string>();
  //   const uniqueBrands = new Set<string>();
  //   const uniqueMadeIn = new Set<string>();
  //   const uniqueGsms = new Set<string>();
  //   const uniqueDimensions = new Set<string>();
  //   const uniqueKg = new Set<string>();
  //   const uniqueVendor = new Set<string>();
  //   const uniqueRecordType = new Set<string>();
  //   const uniqueRate = new Set<string>();
  //   const uniqueStatus = new Set<string>();
  //   this.paperMarketService.getFilteredAndPaginatedData(page, transformedObject).subscribe((res: any) => {
  //     this.paperMarketArray = res.content;
  //     this.filterRes = res
  //
  //     this.paperMarketArray.forEach((el: any) => {
  //       const dateArray = el.timeStamp;
  //       el.timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
  //       el.timeStamp = this.datePipe.transform(el.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
  //       el.ratePkr = Math.round(el.ratePkr * 100) / 100;
  //       el.kg = Math.round(el.kg * 100) / 100;
  //       uniquePapers.add(el.paperStock);
  //       uniqueBrands.add(el.brand);
  //       uniqueMadeIn.add(el.madeIn);
  //       uniqueGsms.add(el.gsm);
  //       uniqueDimensions.add(el.dimension);
  //       uniqueKg.add(el.kg);
  //       uniqueVendor.add(el.vendor.name);
  //       uniqueRecordType.add(el.recordType);
  //       uniqueRate.add(el.ratePkr);
  //       uniqueStatus.add(el.status);
  //       this.papersToFilter = Array.from(uniquePapers).map(name => ({ paperStock: name }));
  //       this.brandsToFilter = Array.from(uniqueBrands).map(name => ({ brand: name }));
  //       this.madeInToFilter = Array.from(uniqueMadeIn).map(name => ({ madeIn: name }));
  //       this.gsmToFilter = Array.from(uniqueGsms).map(name => ({ gsm: name }));
  //       this.dimensionsToFilter = Array.from(uniqueDimensions).map(name => ({ dimension: name }));
  //       this.kgToFilter = Array.from(uniqueKg).map(name => ({ kg: name }));
  //       this.vendorToFilter = Array.from(uniqueVendor).map(name => ({ vendor: name }));
  //       this.recordToFilter = Array.from(uniqueRecordType).map(name => ({ recordType: name }));
  //       this.rateToFilter = Array.from(uniqueRate).map(name => ({ rate: name }));
  //       this.statusToFilter = Array.from(uniqueStatus).map(name => ({ status: name }));
  //     });
  //     this.paperMarketArray.length == 0 ? this.tableData = true : this.tableData = false;
  //   }, error => {
  //     this.showError(error);
  //     this.visible = true;
  //   });
  // }

  // applyQuantityFilter(quantity: any) {
  //
  //   const quantityValue = Number(quantity.value);
  //   const filter = quantity.placeholder === 'Quantity' ? [{ qty: quantityValue }] : null;
  //   this.getFilteredAndPaginatedData(null, filter);
  // }

  // applyRateFilter(rate: any) {
  //   const rateValue = Number(rate.value);
  //   const filter = rate.placeholder === 'Pkr' ? [{ ratePkr: rateValue }] : null;
  //   this.getFilteredAndPaginatedData(null, filter);
  // }

  // onDateSelect(date: any) {
  //   const uiDate = new Date("Fri Oct 20 2023 00:18:45 GMT+0500 (Pakistan Standard Time)");
  //   const formattedDate = uiDate.toISOString().slice(0, 19).replace('T', ' ');
  //   console.log("Date from Ui", formattedDate);

  // }

  ngOnInit(): void {
    this.getFilteredAndPaginatedData();
    this.getDistinctData();
  }

  clear(): void {
    this.fullObj = null;
    this.getFilteredAndPaginatedData();
  }

  getFilteredAndPaginatedData(page?: any, search?: any): void {
    debugger
    if (this.searchFromQueryParam) {
      page = null;
    }

    const transformSearch = (search: any, field: any) => {

      return search?.hasOwnProperty(field) ? { [field]: search[field] } : null;
    };

    const obj: any = {
      ...transformSearch(search, 'timeStamp'),
      ...transformSearch(search, 'paperStock'),
      ...transformSearch(search, 'brand'),
      ...transformSearch(search, 'madeIn'),
      ...transformSearch(search, 'gsm'),
      ...transformSearch(search, 'dimension'),
      ...transformSearch(search, 'qty'),
      ...transformSearch(search, 'kg'),
      ...transformSearch(search, 'recordType'),
      ...transformSearch(search, 'ratePkr'),
      ...transformSearch(search, 'status'),
      ...transformSearch(search, 'vId')
    };

    if (search) {
      this.fullObj = { ...this.fullObj, ...obj };
      console.log(this.fullObj);
    }


    this.paperMarketService.getFilteredAndPaginatedData(page, this.fullObj).subscribe(
      (res: any) => {
        this.paperMarketArray = res.content;
        this.filterRes = res;
        this.paperMarketArray.forEach((el: any) => {
          const dateArray = el.timeStamp;
          el.timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
          el.timeStamp = this.datePipe.transform(el.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
        });

        // const uniquePapers = new Set<string>();
        // const uniqueBrands = new Set<string>();
        // const uniqueMadeIn = new Set<string>();
        // const uniqueGsms = new Set<string>();
        // const uniqueDimensions = new Set<string>();
        // const uniqueKg = new Set<string>();
        // const uniqueVendor = new Set<string>();
        // const uniqueRecordType = new Set<string>();
        // const uniqueRate = new Set<string>();
        // const uniqueStatus = new Set<string>();

        // this.paperMarketArray.forEach((el: any) => {
        //   uniquePapers.add(el.paperStock);
        //   uniqueBrands.add(el.brand);
        //   uniqueMadeIn.add(el.madeIn);
        //   uniqueGsms.add(el.gsm);
        //   uniqueDimensions.add(el.dimension);
        //   uniqueKg.add(el.kg);
        //   uniqueVendor.add(el.vendor.name);
        //   uniqueRecordType.add(el.recordType);
        //   uniqueRate.add(el.ratePkr);
        //   uniqueStatus.add(el.status);
        // });

        // this.papersToFilter = Array.from(uniquePapers).map((name) => ({ paperStock: name }));
        // this.brandsToFilter = Array.from(uniqueBrands).map((name) => ({ brand: name }));
        // this.madeInToFilter = Array.from(uniqueMadeIn).map((name) => ({ madeIn: name }));
        // this.gsmToFilter = Array.from(uniqueGsms).map((name) => ({ gsm: name }));
        // this.dimensionsToFilter = Array.from(uniqueDimensions).map((name) => ({ dimension: name }));
        // this.kgToFilter = Array.from(uniqueKg).map((name) => ({ kg: name }));
        // this.vendorToFilter = Array.from(uniqueVendor).map((name) => ({ vendor: name }));
        // this.recordToFilter = Array.from(uniqueRecordType).map((name) => ({ recordType: name }));
        // this.rateToFilter = Array.from(uniqueRate).map((name) => ({ rate: name }));
        // this.statusToFilter = Array.from(uniqueStatus).map((name) => ({ status: name }));

        this.tableData = this.paperMarketArray.length === 0;
      },
      (error) => {
        this.showError(error);
        this.visible = true;
      }
    );
  }

  applyFilter(field: string, target: any): void {

    const filterValue = Number(target.value);
    const filter = field === 'qty' || field === 'ratePkr' || field === 'kg'
      ? { [field]: filterValue }
      : null;

    this.getFilteredAndPaginatedData(null, filter);
  }

  formatDateToCustomString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  onDateSelect(date: any): void {
    const uiDate = new Date(date);
    const formattedDate = this.formatDateToCustomString(uiDate);
    console.log(formattedDate);
    this.getFilteredAndPaginatedData(null, { timeStamp: formattedDate })
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

  searchPaperMarket(paperStockName: any) {
    if (paperStockName.value == '') {
      this.fullObj = null;
      this.getFilteredAndPaginatedData()
    } else {
      this.paperMarketService.searchPaperMarket(paperStockName.value).subscribe(res => {
        this.paperMarketArray = res
        this.paperMarketArray.forEach((el: any) => {

          const dateArray = el.timeStamp;
          el.timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
          el.timeStamp = this.datePipe.transform(el.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
        });
        this.paperMarketArray.length == 0 ? this.tableData = true : this.tableData = false;
      }, error => {
        this.showError(error);
        this.visible = true
      })
    }
  }
  getDistinctData() {
    this.paperMarketService.getDistinctData().subscribe((data: any) => {
      if (typeof data.paper_stock === 'string') {
        const paperStockArray = data.paper_stock.split(',');
        this.papersToFilter = paperStockArray.map((paperStock: string) => ({
          paperStock: paperStock.trim()
        }));
        const brandArray = data.brand.split(',');
        this.brandsToFilter = brandArray.map((brand: string) => ({
          brand: brand.trim()
        }));
        const madeInArray = data.made_in.split(',');
        this.madeInToFilter = madeInArray.map((madeIn: string) => ({
          madeIn: madeIn.trim()
        }));
        const gsmArray = data.gsm.split(',');
        this.gsmToFilter = gsmArray.map((gsm: number) => ({
          gsm: +gsm
        }));
        const dimensionArray = data.dimension.split(',');
        this.dimensionsToFilter = dimensionArray.map((dimension: string) => ({
          dimension: dimension.trim()
        }));
        debugger
        const vendorEntries = data.vendor.split(',');
        this.vendorToFilter = vendorEntries.map((entry: any) => {
          const [Id, name] = entry.split(':');
          return {
            vId: +Id,
            vendor: name
          };
        });
        const recordArray = data.record_type.split(',');
        this.recordToFilter = recordArray.map((record: string) => ({
          recordType: record.trim()
        }));
        const statusArray = data.status.split(',');
        this.statusToFilter = statusArray.map((status: string) => ({
          status: status.trim()
        }));

      }
    }, error => {

    })
  }
  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}

