import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/Environments/environment';
import { CustomerService } from 'src/app/services/customer.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit {

  productArray: any = []
  productName: any = ''
  selectedProdDefArray: any = []
  customersArray: any = []
  selectedCustomer: any = {}
  selectedProduct: any = []
  customerDesign: string = 'Customer will provide the design'
  printLabDesign: string = 'Design by PrintLab'
  totalAmount: any
  paperValue: any
  sizeValue: any
  gsmValue: any
  jobFrontValue: any
  sideOptionValue: any
  impositionValue: any
  jobBackValue: any
  sheetValue: any
  qtyValue: any
  design: any
  designValue = true
  imgUrl: string = ''
  idFromQueryParam!: number
  buttonName: string = 'Add'
  orderToUpdate: any
  productToUpdate: any
  valuesToUpdate: any = []
  jobBack: any = null
  visible: boolean = false
  error: string = ''
  machineId!: number

  constructor(private orderService: OrdersService, private router: Router, private productService: ProductService, private route: ActivatedRoute, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.getCustomers()
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
        this.getProducts()
      } else {
        this.buttonName = 'Update'
        this.orderService.getOrderById(this.idFromQueryParam).subscribe(res => {
          this.orderToUpdate = res
          this.selectedCustomer = this.orderToUpdate.customer
          this.totalAmount = this.orderToUpdate.price
          this.imgUrl = this.orderToUpdate.url
          this.designValue = this.orderToUpdate.providedDesign
          this.designValue ? this.design = this.customerDesign : this.design = this.printLabDesign
          this.getProducts()
        }, error => {
          this.error = error.error.error
          this.visible = true;
        })
      }
    })
  }

  calculate() {
    this.selectedProdDefArray.forEach((el: any) => {
      el.name.toLowerCase().replace(/\s/g, '') == 'paperstock' ? this.paperValue = el.selected.productFieldValue.name : null
      el.name.toLowerCase().replace(/\s/g, '') == 'size' ? this.sizeValue = el.selected.productFieldValue.name : null
      el.name.toLowerCase().replace(/\s/g, '') == 'gsm' ? this.gsmValue = el.selected.productFieldValue.name : null
      el.name.toLowerCase().replace(/\s/g, '') == 'quantity' ? this.qtyValue = el.selected.productFieldValue.name : null
      el.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(front)' ? this.jobFrontValue = el.selected.productFieldValue.name : null
      el.name.toLowerCase().replace(/\s/g, '') == 'printside' ? this.sideOptionValue = el.selected.productFieldValue.name : null
      el.name.toLowerCase().replace(/\s/g, '') == 'imposition' ? this.impositionValue = el.selected.productFieldValue.name : null
      el.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(back)' ? this.jobBackValue = el.selected.productFieldValue.name : null
      el.name.toLowerCase().replace(/\s/g, '') == 'paperstock' ? this.sheetValue = el.selected.productFieldValue.name : null
    })
    if (this.sideOptionValue != undefined) {
      if (this.sideOptionValue == "SINGLE_SIDED") {
        this.jobBackValue = null
        this.impositionValue = false
      }
    }
    let obj = {
      pressMachineId: this.machineId,
      productValue: this.productName,
      paper: this.paperValue,
      sizeValue: this.sizeValue,
      gsm: this.gsmValue,
      quantity: this.qtyValue,
      jobColorsFront: this.jobFrontValue,
      sheetSizeValue: "18\"x23\"",
      sideOptionValue: this.sideOptionValue,
      impositionValue: this.impositionValue,
      jobColorsBack: this.jobBackValue
    }
    this.orderService.calculations(obj).subscribe(res => {
      let obj: any
      obj = res
      this.totalAmount = Math.round(obj.TotalProfit * 100) / 100
    }, error => {
      this.error = error.error.error
      this.visible = true;
    })
  }

  addOrder() {
    if (Number.isNaN(this.idFromQueryParam)) {
      let obj = {
        product: this.productName,
        paper: this.paperValue,
        size: this.sizeValue,
        sheetSizeValue: "18\"x23\"",
        gsm: this.gsmValue,
        quantity: this.qtyValue,
        price: this.totalAmount,
        providedDesign: this.designValue,
        url: this.imgUrl,
        sideOptionValue: this.sideOptionValue,
        impositionValue: this.impositionValue,
        jobColorsFront: this.jobFrontValue,
        jobColorsBack: this.jobBackValue,
        customer: this.selectedCustomer
      }
      this.orderService.addOrder(obj).subscribe(res => {
        this.router.navigateByUrl('/orders')
      }, error => {
        this.error = error.error.error
        this.visible = true;
      })
    } else {
      let obj = {
        id: this.idFromQueryParam,
        product: this.productName,
        paper: this.paperValue,
        size: this.sizeValue,
        sheetSizeValue: "18\"x23\"",
        gsm: this.gsmValue,
        quantity: this.qtyValue,
        price: this.totalAmount,
        providedDesign: this.designValue,
        url: this.imgUrl,
        sideOptionValue: this.sideOptionValue,
        impositionValue: this.impositionValue,
        jobColorsFront: this.jobFrontValue,
        jobColorsBack: this.jobBackValue,
        customer: this.selectedCustomer
      }
      this.orderService.updateOrder(this.idFromQueryParam, obj).subscribe(res => {
        this.router.navigateByUrl('/orders')
      }, error => {
        this.error = error.error.error
        this.visible = true;
      })
    }
  }

  toggleFields(title: any) {
    this.selectedProduct = []
    this.productName = title.title
    this.machineId = title.pressMachine.id
    title.productDefinitionFieldList.forEach((el: any) => {
      el.isPublic ? this.selectedProduct.push(el) : null
      el.productField.name.toLowerCase().replace(/\s/g, '') == 'imposition' ? this.impositionValue = el.selectedValues[0].value : null
      if (!Number.isNaN(this.idFromQueryParam) && this.orderToUpdate.jobColorsBack == null && el.productField.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(back)') {
        let index = this.selectedProduct.findIndex((item: any) => item.id == el.id)
        this.selectedProduct.splice(index, 1)
      }
    })
    this.selectedProdDefArray = []
  }

  selectProductDef(product: any, productDef: any) {
    debugger
    this.totalAmount = null
    if (product.productField.name.toLowerCase().replace(/\s/g, '') == 'printside' && productDef.productFieldValue.name == 'SINGLE_SIDED') {
      this.selectedProduct.forEach((el: any) => {
        if (el.productField.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(back)') {
          let i = this.selectedProduct.indexOf(el)
          this.jobBack = this.selectedProduct[i]
          this.selectedProduct.splice(i, 1)
        }
      })
    } else if (product.productField.name.toLowerCase().replace(/\s/g, '') == 'printside' && productDef.productFieldValue.name == 'DOUBLE_SIDED' && this.impositionValue == "true") {
      this.selectedProduct.forEach((el: any) => {
        if (el.productField.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(back)') {
          let i = this.selectedProduct.indexOf(el)
          this.jobBack = this.selectedProduct[i]
          this.selectedProduct.splice(i, 1)
        }
      })
    } else if (product.productField.name.toLowerCase().replace(/\s/g, '') == 'printside' && productDef.productFieldValue.name == 'DOUBLE_SIDED' && this.impositionValue == "false") {
      this.jobBack != null ? this.selectedProduct.push(this.jobBack) : null
    }
    let obj = {
      id: product.id,
      name: product.productField.name,
      selected: productDef
    }
    if (this.selectedProdDefArray.length == 0) {
      this.selectedProdDefArray.push(obj)
    } else {
      let flag = false
      for (const el of this.selectedProdDefArray) {
        if (el.id == product.id) {
          const i = this.selectedProdDefArray.indexOf(el)
          this.selectedProdDefArray[i] = obj
          flag = false
          break
        } else {
          flag = true
        }
      }
      flag ? this.selectedProdDefArray.push(obj) : null
    }
  }

  designToggle(design: any) {
    this.design = design
    this.design == this.customerDesign ? this.designValue = true : this.designValue = false
  }

  getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.productArray = res
      !Number.isNaN(this.idFromQueryParam) ? this.putValuesOnUpdate() : null
    }, error => {
      this.error = error.error.error
      this.visible = true;
    })
  }

  getCustomers() {
    this.customerService.getCustomer().subscribe(res => {
      this.customersArray = res
    }, error => {
      this.error = error.error.error
      this.visible = true;
    })
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.orderService.postImage(formData).subscribe(response => {
      this.imgUrl = environment.baseUrl + response
    }, error => {
      this.error = error.error.error
      this.visible = true;
    });
  }

  putValuesOnUpdate() {
    this.productArray.forEach((el: any) => {
      el.title == this.orderToUpdate.product ? this.productToUpdate = el : null
    })
    this.toggleFields(this.productToUpdate)
    this.selectedProduct.forEach((el: any) => {
      if (el.productField.name.toLowerCase().replace(/\s/g, '') == 'paperstock') {
        this.paperValue = this.orderToUpdate.paper
        let item;
        el.selectedValues.forEach((subEl: any) => {
          if (subEl.productFieldValue.name == this.paperValue) {
            this.valuesToUpdate.push(subEl)
            item = subEl
          }
        });
        this.selectedProdDefArray.push({
          id: el.id,
          name: el.productField.name,
          selected: item
        })
      } else if (el.productField.name.toLowerCase().replace(/\s/g, '') == 'gsm') {
        this.gsmValue = this.orderToUpdate.gsm
        let item;
        el.selectedValues.forEach((subEl: any) => {
          if (subEl.productFieldValue.name == this.gsmValue) {
            this.valuesToUpdate.push(subEl)
            item = subEl
          }
        });
        this.selectedProdDefArray.push({
          id: el.id,
          name: el.productField.name,
          selected: item
        })
      } else if (el.productField.name.toLowerCase().replace(/\s/g, '') == 'size') {
        this.sizeValue = this.orderToUpdate.size
        let item;
        el.selectedValues.forEach((subEl: any) => {
          if (subEl.productFieldValue.name == this.sizeValue) {
            this.valuesToUpdate.push(subEl)
            item = subEl
          }
        });
        this.selectedProdDefArray.push({
          id: el.id,
          name: el.productField.name,
          selected: item
        })
      } else if (el.productField.name.toLowerCase().replace(/\s/g, '') == 'quantity') {
        this.qtyValue = this.orderToUpdate.quantity
        let item;
        el.selectedValues.forEach((subEl: any) => {
          if (subEl.productFieldValue.name == this.qtyValue) {
            this.valuesToUpdate.push(subEl)
            item = subEl
          }
        });
        this.selectedProdDefArray.push({
          id: el.id,
          name: el.productField.name,
          selected: item
        })
      } else if (el.productField.name.toLowerCase().replace(/\s/g, '') == 'printside') {
        this.sideOptionValue = this.orderToUpdate.sideOptionValue
        let item;
        el.selectedValues.forEach((subEl: any) => {
          if (subEl.productFieldValue.name == this.sideOptionValue) {
            this.valuesToUpdate.push(subEl)
            item = subEl
          }
        });
        this.selectedProdDefArray.push({
          id: el.id,
          name: el.productField.name,
          selected: item
        })
      } else if (el.productField.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(front)') {
        this.jobFrontValue = this.orderToUpdate.jobColorsFront
        let item;
        el.selectedValues.forEach((subEl: any) => {
          if (subEl.productFieldValue.name == this.jobFrontValue) {
            this.valuesToUpdate.push(subEl)
            item = subEl
          }
        });
        this.selectedProdDefArray.push({
          id: el.id,
          name: el.productField.name,
          selected: item
        })
      } else if (el.productField.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(back)') {
        this.jobBackValue = this.orderToUpdate.jobColorsBack
        let item;
        el.selectedValues.forEach((subEl: any) => {
          if (subEl.productFieldValue.name == this.jobBackValue) {
            this.valuesToUpdate.push(subEl)
            item = subEl
          }
        });
        this.selectedProdDefArray.push({
          id: el.id,
          name: el.productField.name,
          selected: item
        })
      }
    })
  }
}
