import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  productDefArray: any = []
  titleArray: any = []
  productName: any = ''
  selectedProdDefArray: any = []
  customersArray: any = []
  selectedCustomer: any = {}

  constructor(private orderService: OrdersService, private router: Router, private productService: ProductService, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.getProducts()
    this.getCustomers()
  }

  calculate() {
    let obj = {
      productValue: this.productName,
      jobColorsFront: 1,
      sizeValue: "A4",
      paper: "Glossy/ArtPaper",
      gsm: 113,
      sheetSizeValue: "18\"x23\"",
      sideOptionValue: "Double Sided",
      impositionValue: "Applied",
      jobColorsBack: 1
    }
  }

  getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.productArray = res
      console.log(this.productArray);
      this.titleArray = this.productArray.map((product: any) => product.productDefinitionField.find((field: any) => field.name === 'Title'))
    })
  }

  getCustomers() {
    this.customerService.getCustomer().subscribe(res => {
      this.customersArray = res
    })
  }

  toggleCustomer(customer: any) {
    this.selectedCustomer = customer
  }

  toggleFields(title: any) {
    debugger
    this.productName = title.value
    this.productArray.find((product: any) => {
      product.productDefinitionField.forEach((el: any) => {
        el.value == title.value ? this.productDefArray = product.productDefinitionField : null
      })
    })
    this.productDefArray = this.productDefArray.filter((item: any) => item.hasOwnProperty("productFieldValuesList"))
    this.productDefArray = this.productDefArray.filter((item: any) => item.public);
    this.selectedProdDefArray.splice(0, this.selectedProdDefArray.length)
  }

  selectProductDef(product: any, productDef: any) {
    let productFieldArr = []
    productFieldArr.push(productDef)
    let obj = {
      id: product.id,
      name: product.name,
      public: product.public,
      productField: productFieldArr
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
}