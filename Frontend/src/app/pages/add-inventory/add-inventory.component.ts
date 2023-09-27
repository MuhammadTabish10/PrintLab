import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';
import { PaperSizeService } from 'src/app/services/paper-size.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { VendorService } from 'src/app/services/vendor.service';
import { MessageService } from 'primeng/api';
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
  gsm: any = []
  size: any = []


  paperStockArray: any = []
  gsmArray: any = []
  paperSizeArray: any = []
  quantityArray: any = [100, 500]
  vendorArray: any = []
  statusArray: any = ['Hoarding', 'In stock', 'Out of stock']
  inventoryToUpdate: any = {}

  paperStockValue: any = {}
  gsmValues: any = []
  sizeValues: any = []
  quantityValue!: number
  madeInValue: string = ''
  brandValue: string = ''
  vendorValue: any = {}
  rateValue!: number
  statusValue: string = ''

  constructor(
    private inventoryService: InventoryService,
    private vendorService: VendorService,
    private router: Router,
    private route: ActivatedRoute,
    private productFieldService: ProductDefinitionService,
    private paperSizeService: PaperSizeService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.buttonName = 'Update'
        this.inventoryService.getInventoryById(this.idFromQueryParam).subscribe(res => {
          this.inventoryToUpdate = res
          this.madeInValue = this.inventoryToUpdate.madeIn
          this.brandValue = this.inventoryToUpdate.brandName
          this.rateValue = this.inventoryToUpdate.rate
          this.quantityValue = this.inventoryToUpdate.qty
          this.statusValue = this.inventoryToUpdate.status
          this.gsmSelectedValues = JSON.parse(this.inventoryToUpdate.availableGsm)
          this.sizeSelectedValues = JSON.parse(this.inventoryToUpdate.availableSizes)
        })
      }
    })
    this.getVendors()
    this.getPaperStockAndGsm()
    this.getPaperSize()
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
        brandName: this.brandValue,
        vendor: this.vendorValue.name,
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
        brandName: this.brandValue,
        vendor: this.vendorValue.name,
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

  getVendors() {
    this.vendorService.getVendor().subscribe(res => {
      this.vendorArray = res
      if (!Number.isNaN(this.idFromQueryParam)) {
        let vendorIndex = this.vendorArray.findIndex((el: any) => el.name === this.inventoryToUpdate.vendor)
        this.vendorValue = this.vendorArray[vendorIndex]
      }
    }, error => {
      this.visible = true
      this.showError(error);
    })
  }

  getPaperStockAndGsm() {
    this.productFieldService.getProductField().subscribe(res => {
      let pfArr: any = []
      pfArr = res
      pfArr.forEach((el: any) => {
        el.name.toLowerCase().replace(/\s/g, '') == 'paperstock' ? this.paperStockArray = el.productFieldValuesList : null
        el.name.toLowerCase().replace(/\s/g, '') == 'gsm' ? this.gsmArray = el.productFieldValuesList : null
      })
      if (!Number.isNaN(this.idFromQueryParam)) {
        let paperIndex = this.paperStockArray.findIndex((el: any) => el.name == this.inventoryToUpdate.paperStock)
        this.paperStockValue = this.paperStockArray[paperIndex]
        this.gsmValues = this.gsmArray.filter((el: any) => this.gsmSelectedValues.includes(el.name))
      }
    })
  }

  getPaperSize() {
    this.paperSizeService.getPaperSize().subscribe(res => {
      this.paperSizeArray = res
      if (!Number.isNaN(this.idFromQueryParam)) {
        this.sizeValues = this.paperSizeArray.filter((el: any) => this.sizeSelectedValues.includes(el.label))
      }
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }
  showError(error:any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error }); 
  }
}
