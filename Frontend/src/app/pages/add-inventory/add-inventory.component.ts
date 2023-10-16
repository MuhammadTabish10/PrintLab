import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';
import { PaperSizeService } from 'src/app/services/paper-size.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { VendorService } from 'src/app/services/vendor.service';
import { MessageService } from 'primeng/api';
import { forkJoin, map, of } from 'rxjs';
import { PaperStockService } from 'src/app/services/paper-stock.service';
@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css']
})
export class AddInventoryComponent implements OnInit {

  visible: boolean = false
  error: string = ''
  buttonName: string = 'Add'
  idFromQueryParam!: number
  gsmSelectedValues: any = []
  sizeSelectedValues: any = []
  brandSelectedValues: any = []
  gsm: any = []
  size: any = []


  paperStockArray: any = []
  gsmArray: any = []
  paperSizeArray: any = []
  quantityArray: any = [100, 500]
  vendorArray: any = []
  brandArray: any = []
  statusArray: any = ['Hoarding', 'In Stock', 'Out of stock']
  inventoryToUpdate: any = {}

  paperStockValue: any = {}
  gsmValues: any = []
  sizeValues: any = []
  quantityValue!: number
  madeInValue: string = ''
  brandValue: any = [];
  vendorValue: any = {}
  rateValue!: number
  statusValue: string = ''

  constructor(
    private inventoryService: InventoryService,
    private vendorService: VendorService,
    private router: Router,
    private route: ActivatedRoute,
    private productFieldService: ProductDefinitionService,
    private paperStock: PaperStockService,
    private paperSizeService: PaperSizeService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id'];
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add';
      } else {
        this.buttonName = 'Update';
      }
    });

    forkJoin([
      this.getVendors(),
      this.getPaperStockAndBrand(),
      this.getGsm(),
      this.getPaperSize(),
      this.getInventoryById()
    ]).subscribe(
      ([vendors, paperStockAndBrand, Gsm, paperSize, inventoryData]) => {
        this.vendorArray = vendors;
        this.paperStockArray = paperStockAndBrand[0];
        this.gsmArray = Gsm[0];

        this.paperSizeArray = paperSize;
        this.inventoryToUpdate = inventoryData;
        if (!Number.isNaN(this.idFromQueryParam)) {

          let vendorIndex = this.vendorArray.findIndex((el: any) => el.name === this.inventoryToUpdate.vendor.name)
          this.vendorValue = this.vendorArray[vendorIndex]
          let paperIndex = this.paperStockArray.findIndex((el: any) => el.name == this.inventoryToUpdate.paperStock)
          this.paperStockValue = this.paperStockArray[paperIndex]
          this.gsmValues = this.gsmArray.filter((el: any) => JSON.parse(this.inventoryToUpdate.availableGsm).includes(el.name))
          this.onChangePaperStock(this.paperStockValue);
          let brandIndex = this.brandArray.findIndex((el: any) => el.name == this.inventoryToUpdate.brandName)
          this.brandValue = this.brandArray[brandIndex]
          this.sizeValues = this.paperSizeArray.filter((el: any) => JSON.parse(this.inventoryToUpdate.availableSizes).includes(el.label))
          this.madeInValue = this.inventoryToUpdate.madeIn;
          this.rateValue = this.inventoryToUpdate.rate;
          this.quantityValue = this.inventoryToUpdate.qty;
          this.statusValue = this.inventoryToUpdate.status;
          this.gsmSelectedValues = JSON.parse(this.inventoryToUpdate.availableGsm);
          this.sizeSelectedValues = JSON.parse(this.inventoryToUpdate.availableSizes);
        }
      },
      error => {
        this.visible = true;
        this.showError(error);
      }
    );
  }

  getInventoryById() {
    if (!Number.isNaN(this.idFromQueryParam)) {
      return this.inventoryService.getInventoryById(this.idFromQueryParam);
    } else {
      return of({});
    }
  }

  getVendors() {
    return this.vendorService.getVendor();
  }

  getGsm() {
    return this.productFieldService.getProductField().pipe(
      map(res => {
        let pfArr: any = [];
        pfArr = res;
        let gsmArray: any[] = [];

        pfArr.forEach((el: any) => {
          if (el.name.toLowerCase().replace(/\s/g, '') === 'gsm') {
            gsmArray = el.productFieldValuesList;
          }
        });
        return [gsmArray];
      })
    );
  }

  getPaperStockAndBrand() {
    return this.paperStock.getAllPaperStock().pipe(
      map(res => {
        let papers: any = [];
        papers = res;
        return [papers];
      })
    );
  }

  onChangePaperStock(value: any) {
    this.brandArray = value.brands
  }

  getPaperSize() {
    return this.paperSizeService.getPaperSize();
  }

  composeSizeValues(o: any) {
    let flag = false
    if (this.sizeValues.length == 0) {
      if (o.hasOwnProperty('itemValue')) {
        this.sizeValues.push(o.itemValue)
      } else {
        this.sizeValues = o.value
      }
    } else {
      if (o.hasOwnProperty('itemValue')) {
        for (let i = 0; i < this.sizeValues.length; i++) {
          if (this.sizeValues[i].id == o.itemValue.id) {
            this.sizeValues.splice(i, 1)
            flag = false
            break
          } else {
            flag = true
          }
        }
      } else {
        if (this.paperSizeArray.length == this.sizeValues.length) {
          this.sizeValues = []
        } else {
          this.sizeValues = []
          this.sizeValues = o.value
        }
      }
    }
    flag ? this.sizeValues.push(o.itemValue) : null
  }

  composeGsmValues(o: any) {
    let flag = false
    if (this.gsmValues.length == 0) {
      if (o.hasOwnProperty('itemValue')) {
        this.gsmValues.push(o.itemValue)
      } else {
        this.gsmValues = o.value
      }
    } else {
      if (o.hasOwnProperty('itemValue')) {
        for (let i = 0; i < this.gsmValues.length; i++) {
          if (this.gsmValues[i].id == o.itemValue.id) {
            this.gsmValues.splice(i, 1)
            flag = false
            break
          } else {
            flag = true
          }
        }
      } else {
        if (this.paperSizeArray.length == this.gsmValues.length) {
          this.gsmValues = []
        } else {
          this.gsmValues = []
          this.gsmValues = o.value
        }
      }
    }
    flag ? this.gsmValues.push(o.itemValue) : null
  }


  addInventory() {
    let gsms: any = []
    let sizes: any = []
    this.gsmValues.forEach((el: any) => gsms.push(el.name))
    this.sizeValues.forEach((el: any) => sizes.push(el.label));
    if (Number.isNaN(this.idFromQueryParam)) {
      let obj = {
        paperStock: this.paperStockValue.name,
        availableGsm: JSON.stringify(gsms),
        availableSizes: JSON.stringify(sizes),
        qty: this.quantityValue,
        madeIn: this.madeInValue,
        brandName: this.brandValue.name,
        vendor: { id: this.vendorValue.id },
        rate: this.rateValue,
        status: this.statusValue
      }
      this.inventoryService.postInventory(obj).subscribe(() => {
        this.router.navigateByUrl('/inventory')
      }, error => {
        this.visible = true
        this.showError(error);
      })
    } else {

      let obj = {
        id: this.idFromQueryParam,
        created_at: this.inventoryToUpdate.created_at,
        paperStock: this.paperStockValue.name,
        availableGsm: JSON.stringify(gsms),
        availableSizes: JSON.stringify(sizes),
        qty: this.quantityValue,
        madeIn: this.madeInValue,
        brandName: this.brandValue.name,
        vendor: { id: this.vendorValue.id },
        rate: this.rateValue,
        status: this.statusValue
      }
      this.inventoryService.updateInventory(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/inventory')
      }, error => {
        this.visible = true
        this.showError(error);
      })
    }
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
