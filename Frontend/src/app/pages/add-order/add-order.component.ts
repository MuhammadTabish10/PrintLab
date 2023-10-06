import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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
  pdfUrl: string = ''
  idFromQueryParam!: number
  buttonName: string = 'Add'
  orderToUpdate: any
  productToUpdate: any
  valuesToUpdate: any = []
  jobBack: any = null
  visible: boolean = false
  error: string = ''
  machineId!: number
  fileUrl: string | null = null;
  file: File | null = null;
  paperStock: any
  paperStockItem: any
  size: any
  jobFront: any
  jobColorBack: any
  quantity: any
  printSide: any
  dynamicFields: any;
  gsms: any
  foundGsm: any;
  optionsGsm: any = [
    { name: '', value: '' }
  ];
  selectedGsm: any;
  isJobColorBackHidden: boolean = false;

  constructor(private orderService: OrdersService, private router: Router,
    private productService: ProductService, private route: ActivatedRoute,
    private customerService: CustomerService, private messageService: MessageService,
    private cdr: ChangeDetectorRef) { }

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
          debugger
          this.paperStockItem = this.orderToUpdate.paper
          this.selectedCustomer = this.orderToUpdate.customer
          this.totalAmount = this.orderToUpdate.price
          this.imgUrl = this.orderToUpdate.url
          this.designValue = this.orderToUpdate.providedDesign
          this.designValue ? this.design = this.customerDesign : this.design = this.printLabDesign
          this.getProducts()
        }, error => {
          this.showError(error);
          this.visible = true;
        })
      }
    })
  }

  calculate() {
    debugger
    if (this.sideOptionValue.name != undefined) {
      if (this.sideOptionValue.name == "SINGLE_SIDED") {
        this.jobBackValue = null
        this.impositionValue = false
      }
    }
    let obj = {
      pressMachineId: this.machineId,
      productValue: this.productName,
      paper: this.paperStockItem.name,
      sizeValue: this.sizeValue.name,
      gsm: Number(this.selectedGsm.name),
      quantity: this.qtyValue.name,
      jobColorsFront: Number(this.jobFrontValue.name),
      sideOptionValue: this.sideOptionValue.name,
      impositionValue: this.impositionValue,
      jobColorsBack: this.jobBackValue ? Number(this.jobBackValue.name) : null
    }
    this.orderService.calculations(obj).subscribe(res => {
      let obj: any
      obj = res
      this.totalAmount = Math.round(obj.TotalProfit * 100) / 100
    }, error => {
      this.showError(error);
      this.visible = true;
    })
  }

  addOrder() {
    if (Number.isNaN(this.idFromQueryParam)) {
      debugger
      let obj = {
        product: this.productName,
        paper: this.paperStockItem.name,
        size: this.sizeValue.name,
        sheetSizeValue: "18\"x23\"",
        gsm: Number(this.selectedGsm.name),
        quantity: Number(this.qtyValue.name),
        price: this.totalAmount,
        providedDesign: this.designValue,
        url: this.imgUrl,
        sideOptionValue: this.sideOptionValue.name,
        impositionValue: this.impositionValue,
        jobColorsFront: Number(this.jobFrontValue.name),
        jobColorsBack: this.jobBackValue ? Number(this.jobBackValue.name) : null,
        customer: Object.keys(this.selectedCustomer).length === 0 ? { id: 0 } : this.selectedCustomer
      }
      this.orderService.addOrder(obj).subscribe(res => {
        this.router.navigateByUrl('/orders')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
      debugger
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
        impositionValue: this.impositionValue ? this.impositionValue: null,
        jobColorsFront: this.jobFrontValue,
        jobColorsBack: this.jobBackValue,
        customer: this.selectedCustomer
      }
      this.orderService.updateOrder(this.idFromQueryParam, obj).subscribe(res => {
        this.router.navigateByUrl('/orders')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    }
  }

  // toggleFields(title: any) {
  //   this.selectedProduct = []
  //   this.productName = title.title
  //   this.machineId = title.pressMachine.id
  //   debugger
  //   title.productDefinitionFieldList.forEach((el: any) => {
  //     el.isPublic ? this.selectedProduct.push(el) : null
  //     el.productField.name.toLowerCase().replace(/\s/g, '') == 'imposition' ? this.impositionValue = el.selectedValues[0].value : null
  //     if (!Number.isNaN(this.idFromQueryParam) && this.orderToUpdate.jobColorsBack == null && el.productField.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(back)') {
  //       let index = this.selectedProduct.findIndex((item: any) => item.id == el.id)
  //       this.selectedProduct.splice(index, 1)
  //     }
  //   })
  //   this.selectedProdDefArray = []
  // }

  toggleFields(title: any) {
    this.cdr.detectChanges();
    debugger
    this.productName = title.title;
    this.machineId = title.pressMachine.id;
    this.impositionValue = title.newProduct.imposition;
    this.paperStock = title.newProduct.isPaperStockPublic ? JSON.parse(title.newProduct.paperStock) : null
    this.size = title.newProduct.isSizePublic ? JSON.parse(title.newProduct.size) : null
    this.quantity = title.newProduct.isQuantityPublic ? JSON.parse(title.newProduct.quantity) : null
    this.printSide = title.newProduct.isPrintSidePublic ? JSON.parse(title.newProduct.printSide) : null
    this.jobFront = title.newProduct.isJobColorFrontPublic ? JSON.parse(title.newProduct.jobColorFront) : null
    this.jobColorBack = title.newProduct.isJobColorBackPublic ? JSON.parse(title.newProduct.jobColorBack) : null;
    this.gsms = title.newProduct.productGsm
  }

  jobColorOptions(value: any) {
    debugger;
    const singleSide = "SINGLE_SIDED";
    this.isJobColorBackHidden = value.name.toLowerCase() === singleSide.toLowerCase();
  }




  // selectProductDef(product: any, productDef: any) {
  //   debugger
  //   this.totalAmount = null
  //   if (product.productField.name.toLowerCase().replace(/\s/g, '') == 'printside' && productDef.productFieldValue.name == 'SINGLE_SIDED') {
  //     this.selectedProduct.forEach((el: any) => {
  //       if (el.productField.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(back)') {
  //         let i = this.selectedProduct.indexOf(el)
  //         this.jobBack = this.selectedProduct[i]
  //         this.selectedProduct.splice(i, 1)
  //       }
  //     })
  //   } else if (product.productField.name.toLowerCase().replace(/\s/g, '') == 'printside' && productDef.productFieldValue.name == 'DOUBLE_SIDED' && this.impositionValue == "true") {
  //     this.selectedProduct.forEach((el: any) => {
  //       if (el.productField.name.toLowerCase().replace(/\s/g, '') == 'jobcolor(back)') {
  //         let i = this.selectedProduct.indexOf(el)
  //         this.jobBack = this.selectedProduct[i]
  //         this.selectedProduct.splice(i, 1)
  //       }
  //     })
  //   } else if (product.productField.name.toLowerCase().replace(/\s/g, '') == 'printside' && productDef.productFieldValue.name == 'DOUBLE_SIDED' && this.impositionValue == "false") {
  //     this.jobBack != null ? this.selectedProduct.push(this.jobBack) : null
  //   }
  //   let obj = {
  //     id: product.id,
  //     name: product.productField.name,
  //     selected: productDef
  //   }
  //   if (this.selectedProdDefArray.length == 0) {
  //     this.selectedProdDefArray.push(obj)
  //   } else {
  //     let flag = false
  //     for (const el of this.selectedProdDefArray) {
  //       if (el.id == product.id) {
  //         const i = this.selectedProdDefArray.indexOf(el)
  //         this.selectedProdDefArray[i] = obj
  //         flag = false
  //         break
  //       } else {
  //         flag = true
  //       }
  //     }
  //     flag ? this.selectedProdDefArray.push(obj) : null
  //   }
  // }

  designToggle(design: any) {
    this.design = design
    this.design == this.customerDesign ? this.designValue = true : this.designValue = false
  }

  getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.productArray = res
      !Number.isNaN(this.idFromQueryParam) ? this.putValuesOnUpdate() : null
    }, error => {
      this.showError(error);
      this.visible = true;
    })
  }

  getCustomers() {
    this.customerService.getCustomer().subscribe(res => {
      this.customersArray = res
    }, error => {
      this.showError(error);
      this.visible = true;
    })
  }

  uploadFile(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        this.orderService.postImage(formData).subscribe(
          (response) => {
            const fileType = this.determineFileType(file.name);
            debugger
            if (fileType === 'image') {
              this.imgUrl = environment.baseUrl + response;
            } else if (fileType === 'pdf') {
              // Handle PDF, e.g., display a PDF viewer or link
              // You can implement PDF viewer here
              this.pdfUrl = environment.baseUrl + response;
            } else if (fileType === 'ai') {
            } else if (fileType === 'psd') {
            } else if (fileType === 'cdr') {
            }
          },
          (error) => {
            this.showError(error);
            this.visible = true;
          }
        );
      }
    }
  }

  determineFileType(fileName: string): string {
    if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      return 'image';
    } else if (fileName.endsWith('.pdf')) {
      return 'pdf';
    } else if (fileName.endsWith('.ai')) {
      return 'ai';
    } else if (fileName.endsWith('.psd')) {
      return 'psd';
    } else if (fileName.endsWith('.cdr')) {
      return 'cdr';
    } else {
      return 'other';
    }
  }

  gsmFields(value: any) {
    this.dynamicFields = value.name;
    let fgsm = this.gsms!.find((item: any) => item.name == this.dynamicFields)
    if (fgsm) {
      this.foundGsm = true
      let sGsm = fgsm.value.replace(/,/g, ' ').split(' ');
      this.optionsGsm = sGsm.map((g: any) => {
        return {
          name: g,
          value: g
        }
      })
    }
  }


  getOptionsGsm(): any {
    return this.optionsGsm == null ? [] : this.optionsGsm
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
  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
