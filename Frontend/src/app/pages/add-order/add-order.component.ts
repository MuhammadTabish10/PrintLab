import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from 'src/Environments/environment';
import { CustomerService } from 'src/app/services/customer.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ProductRuleService } from 'src/app/services/product-rule.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit {

  productArray: any = []
  productName: any = ''
  customersArray: any = []
  selectedCustomer: any = {}
  customerDesign: string = 'Customer will provide the design'
  printLabDesign: string = 'Design by PrintLab'
  totalAmount: any
  sizeValue: any
  jobFrontValue: any
  sideOptionValue: any
  impositionValue: any
  jobBackValue: any
  qtyValue: any
  design: any
  designValue = true
  imgUrl: string = ''
  pdfUrl: string = ''
  idFromQueryParam!: number
  buttonName: string = 'Add'
  orderToUpdate: any
  productToUpdate: any
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
  optionsGsm: any;
  selectedGsm: any;
  isJobColorBackHidden: boolean = false;
  categoryArray: any;
  category: any = [];
  placeholderText: any = {
    product: 'Select Product',
    paper: 'Select Paper',
    category: 'Select Category',
    size: 'Select Size',
    quantity: 'Select Quantity',
    printSide: 'Select Print Side',
    frontColor: 'Select Front Color',
    backColor: 'Select Back Color',
  };

  constructor(private orderService: OrdersService, private router: Router,
    private productService: ProductRuleService, private route: ActivatedRoute,
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
      paper: this.paperStockItem.paperStock,
      category: this.category.name,
      sizeValue: this.sizeValue.productSize,
      inch: this.sizeValue.inch,
      mm: this.sizeValue.mm,
      gsm: +this.selectedGsm.name,
      quantity: +this.qtyValue.name,
      jobColorsFront: +this.jobFrontValue.name,
      sideOptionValue: this.sideOptionValue.name,
      impositionValue: this.impositionValue,
      jobColorsBack: this.jobBackValue ? +this.jobBackValue.name : null
    }
    this.orderService.calculations(obj).subscribe(res => {
      let obj: any
      obj = res
      this.totalAmount = Math.round(obj.TotalProfit * 100) / 100
    }, error => {
      error.error ? this.showError(error) : console.log("Failed to calculate and no exception found error in exception contains null error = ", error);
      this.visible = true;
    })
  }

  addOrder() {
    debugger
    if (Number.isNaN(this.idFromQueryParam)) {
      let obj = {
        product: this.productName,
        paper: this.paperStockItem.paperStock,
        category: this.category.name,
        size: JSON.stringify(this.sizeValue),
        gsm: +this.selectedGsm.name,
        quantity: +this.qtyValue.name,
        price: this.totalAmount,
        providedDesign: this.designValue,
        url: this.imgUrl,
        sideOptionValue: this.sideOptionValue.name,
        impositionValue: this.impositionValue,
        jobColorsFront: +this.jobFrontValue.name,
        jobColorsBack: this.jobBackValue ? +this.jobBackValue.name : null,
        customer: Object.keys(this.selectedCustomer).length === 0 ? { id: 0 } : this.selectedCustomer
      }
      this.orderService.addOrder(obj).subscribe(res => {
        this.router.navigateByUrl('/orders')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    } else {
      let obj = {
        id: this.idFromQueryParam,
        product: this.productName,
        paper: this.paperStockItem.paperStock,
        category: this.category.name,
        size: JSON.stringify(this.sizeValue),
        gsm: +this.selectedGsm.name,
        quantity: +this.qtyValue.name,
        price: this.totalAmount,
        providedDesign: this.designValue,
        url: this.imgUrl,
        sideOptionValue: this.sideOptionValue.name,
        impositionValue: this.impositionValue,
        jobColorsFront: +this.jobFrontValue.name,
        jobColorsBack: this.jobBackValue ? +this.jobBackValue.name : null,
        customer: Object.keys(this.selectedCustomer).length === 0 ? { id: 0 } : this.selectedCustomer
      }
      this.orderService.updateOrder(this.idFromQueryParam, obj).subscribe(res => {
        this.router.navigateByUrl('/orders')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    }
  }

  toggleFields(title: any) {
    this.cdr.detectChanges();
    this.productName = title.title;
    this.machineId = title.pressMachine.id;
    debugger
    this.paperStock = title.productRulePaperStockList ? title.productRulePaperStockList : null;

    if (typeof title.category === 'string') {
      const categories = title.category.split(',').map((category: string) => ({ name: category.trim() }));
      this.categoryArray = categories;
    } else {
      this.categoryArray = null;
    }
    const parsedSize = title.size ? JSON.parse(title.size) : null;
    if (parsedSize) {
      this.size = parsedSize;
    } else {
      this.size = null;
    }

    const parsedQty = title.quantity ? JSON.parse(title.quantity) : null;
    if (parsedQty) {
      this.quantity = parsedQty.map((item: any) => ({ name: item }));
    } else {
      this.quantity = null;
    }

    this.impositionValue = title.impositionValue;

    this.printSide = title.printSide ? [{ name: title.printSide }] : null;

    const parsedFrontColors = title.jobColorFront ? JSON.parse(title.jobColorFront) : null;
    if (parsedFrontColors) {
      this.jobFront = parsedFrontColors.map((item: any) => ({ name: item }));
    } else {
      this.jobFront = null;
    }

    const parsedBackColors = title.jobColorBack ? JSON.parse(title.jobColorBack) : null;
    if (parsedBackColors) {
      this.jobColorBack = parsedBackColors.map((item: any) => ({ name: item }));
    } else {
      this.jobColorBack = null;
    }

    this.gsms = title.productRulePaperStockList ? title.productRulePaperStockList : null;
  }

  jobColorOptions(value: any) {
    debugger
    const singleSide = "SINGLE_SIDED";
    this.isJobColorBackHidden = value.name.toLowerCase() === singleSide.toLowerCase();
  }


  designToggle(design: any) {
    this.design = design
    this.design == this.customerDesign ? this.designValue = true : this.designValue = false
  }

  getProducts() {
    this.productService.getProductRuleTable().subscribe(res => {
      this.productArray = res;
      debugger
      if (this.productArray.length === 1) {
        this.toggleFields(this.productArray[0]);
      }
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

            if (fileType === 'image') {
              debugger
              this.imgUrl = environment.baseUrl + response;
            } else if (fileType === 'pdf') {
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
    debugger
    this.dynamicFields = value.paperStock;
    let fgsm = this.gsms!.find((item: any) => item.paperStock == this.dynamicFields)
    if (fgsm) {
      this.foundGsm = true
      let i = 1
      let sGsm = JSON.parse(fgsm.gsm);
      this.optionsGsm = sGsm.map((g: any) => {
        return {
          id: i++,
          name: g,
          status: 'Active'
        }
      })
    }
  }

  putValuesOnUpdate() {
    this.productArray.forEach((el: any) => {
      el.title == this.orderToUpdate.product ? this.productToUpdate = el : null
    })
    this.toggleFields(this.productToUpdate)
    debugger
    const conditionBackColor = this.orderToUpdate.jobColorsBack ? this.orderToUpdate.jobColorsBack.toString() : ''
    const foundPaperStockItem = this.paperStock != null ? this.paperStock.find((item: { paperStock: any; }) => item.paperStock === this.orderToUpdate.paper) : null;
    this.gsmFields(foundPaperStockItem)
    debugger
    const parseSize = JSON.parse(this.orderToUpdate.size);
    const foundsizeItem = this.size != null ? this.size.find((item: { label: any; }) => item.label === parseSize.label) : null;
    const foundQtyItem = this.quantity != null ? this.quantity.find((item: { name: any; }) => item.name === this.orderToUpdate.quantity.toString()) : null;
    const foundSideOptItem = this.printSide != null ? this.printSide.find((item: { name: any; }) => item.name === this.orderToUpdate.sideOptionValue) : null;
    const foundFrontColorItem = this.jobFront != null ? this.jobFront.find((item: { name: any; }) => item.name === this.orderToUpdate.jobColorsFront.toString()) : null;
    const foundBackColorItem = this.jobColorBack != null ? this.jobColorBack.find((item: { name: any; }) => item.name === conditionBackColor) : null;
    const foundGsmItem = this.optionsGsm != null ? this.optionsGsm.find((item: { name: any; }) => item.name === this.orderToUpdate.gsm.toString()) : null;
    this.paperStockItem = foundPaperStockItem
    this.sizeValue = foundsizeItem
    this.qtyValue = foundQtyItem
    this.sideOptionValue = foundSideOptItem
    this.jobFrontValue = foundFrontColorItem
    this.jobColorOptions(this.sideOptionValue)
    this.jobBackValue = foundBackColorItem
    this.selectedGsm = foundGsmItem
  }

  transformUpingSizes(fullSize: any): { size: string, inch: string | null, mm: string | null } {
    const inputString = fullSize;
    const sizeMatch = inputString.match(/\[(.*?)\]/);
    const inchMatch = inputString.match(/Inch\s*:\s*([0-9.]+)"x([0-9.]+)"/);
    const mmMatch = inputString.match(/Mm\s*:\s*([0-9.]+)\"x([0-9.]+)"/);
    debugger
    const size = sizeMatch ? sizeMatch[1] : null;
    const inch = inchMatch ? inchMatch[1] + "x" + inchMatch[2] : null;
    const mm = mmMatch ? mmMatch[1] + "x" + mmMatch[2] : null;

    return {
      size: size,
      inch: inch,
      mm: mm
    };
  }


  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
