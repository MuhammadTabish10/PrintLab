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

  ngOnInit(): void {
    this.getFilteredAndPaginatedData();
    this.getDistinctData();
  }

  clear(): void {
    this.fullObj = null;
    this.getFilteredAndPaginatedData();
  }

  getFilteredAndPaginatedData(page?: any, search?: any): void {

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
      ...transformSearch(search, 'id')
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

        const vendorEntries = data.vendor.split(',');
        this.vendorToFilter = vendorEntries.map((entry: any) => {
          const [Id, name] = entry.split(':');
          return {
            id: +Id,
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
