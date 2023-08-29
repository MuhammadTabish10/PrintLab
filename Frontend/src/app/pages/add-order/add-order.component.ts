import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  jobBack: any = {}
  visible: boolean = false
  error: string = ''

  constructor(private orderService: OrdersService, private router: Router, private productService: ProductService, private route: ActivatedRoute, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.getProducts()
    this.getCustomers()
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.buttonName = 'Update'
        this.orderService.getOrderById(this.idFromQueryParam).subscribe(res => {
          this.orderToUpdate = res
          this.selectedCustomer = this.orderToUpdate.customer
          this.totalAmount = this.orderToUpdate.price
          this.imgUrl = this.orderToUpdate.url
          this.designValue = this.orderToUpdate.providedDesign
          this.designValue ? this.design = this.customerDesign : this.design = this.printLabDesign
          this.productArray.forEach((el: any) => {
            el.title == this.orderToUpdate.product ? this.productToUpdate = el : null
          })
          this.toggleFields(this.productToUpdate)
          this.selectedProduct.forEach((el: any) => {
            el.productField.name.toLowerCase().replace(/\s/g, '') == 'gsm' ? this.gsmValue = this.orderToUpdate.gsm : null
          })
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
      el.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(front)' ? this.jobFrontValue = el.selected.productFieldValue.name : null
      el.name.toLowerCase().replace(/\s/g, '') == 'printside' ? this.sideOptionValue = el.selected.productFieldValue.name : null
      el.name.toLowerCase().replace(/\s/g, '') == 'imposition' ? this.impositionValue = el.selected.productFieldValue.name : null
      el.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(back)' ? this.jobBackValue = el.selected.productFieldValue.name : null
      el.name.toLowerCase().replace(/\s/g, '') == 'paperstock' ? this.sheetValue = el.selected.productFieldValue.name : null
    })
    if (this.sideOptionValue.toLowerCase().replace(/\s/g, '') == "singlesided") {
      this.jobBackValue = null
      this.impositionValue = false
    }
    let obj = {
      productValue: this.productName,
      paper: this.paperValue,
      sizeValue: this.sizeValue,
      gsm: this.gsmValue,
      jobColorsFront: this.jobFrontValue,
      sheetSizeValue: "18\"x23\"",
      sideOptionValue: this.sideOptionValue,
      impositionValue: this.impositionValue,
      jobColorsBack: this.jobBackValue
    }
    this.orderService.calculations(obj).subscribe(res => {

      this.totalAmount = res
    }, error => {
      this.error = error.error.error
      this.visible = true;
    })
  }

  addOrder() {
    this.selectedProdDefArray.forEach((el: any) => {
      el.name.toLowerCase().replace(/\s/g, '') == 'quantity' ? this.qtyValue = el.selected.productFieldValue.name : null
    })
    if (Number.isNaN(this.idFromQueryParam)) {
      let obj = {
        product: this.productName,
        paper: this.paperValue,
        size: this.sizeValue,
        sheetSizeValue: "18\"x23\"",
        gsm: this.gsmValue,
        quantity: this.qtyValue,
        price: Math.round(this.totalAmount * 100) / 100,
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
        price: Math.round(this.totalAmount * 100) / 100,
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
    title.productDefinitionFieldList.forEach((el: any) => {
      el.isPublic ? this.selectedProduct.push(el) : null
      el.productField.name.toLowerCase().replace(/\s/g, '') == 'imposition' ? this.impositionValue = el.selectedValues[0].value : null
    })
    this.selectedProdDefArray = []
  }

  selectProductDef(product: any, productDef: any) {

    if (product.productField.name.toLowerCase().replace(/\s/g, '') == 'printside' && productDef.productFieldValue.name.toLowerCase().replace(/\s/g, '') == 'singlesided') {
      this.selectedProduct.forEach((el: any) => {
        if (el.productField.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(back)') {
          let i = this.selectedProduct.indexOf(el)
          this.jobBack = this.selectedProduct[i]
          this.selectedProduct.splice(i, 1)
        }
      })
    } else if (product.productField.name.toLowerCase().replace(/\s/g, '') == 'printside' && productDef.productFieldValue.name.toLowerCase().replace(/\s/g, '') == 'doublesided' && this.impositionValue == "true") {
      this.selectedProduct.forEach((el: any) => {
        if (el.productField.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(back)') {
          let i = this.selectedProduct.indexOf(el)
          this.jobBack = this.selectedProduct[i]
          this.selectedProduct.splice(i, 1)
        }
      })
    } else if (product.productField.name.toLowerCase().replace(/\s/g, '') == 'printside' && productDef.productFieldValue.name.toLowerCase().replace(/\s/g, '') == 'doublesided' && this.impositionValue == "false") {
      this.jobBack ? this.selectedProduct.push(this.jobBack) : null
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
      // this.titleArray = this.productArray.map((product: any) => product.title)
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
}
