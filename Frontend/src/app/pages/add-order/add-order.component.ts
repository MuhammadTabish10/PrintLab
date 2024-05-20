import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, TreeNode } from 'primeng/api';
import { environment } from 'src/Environments/environment';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { Business, BusinessBranch } from 'src/app/Model/Business';
import { Customer } from 'src/app/Model/Customer';
import { ProductCategory } from 'src/app/Model/ProductCategory';
import { ProductionJob } from 'src/app/Model/ProductionJob';
import { AuthguardService } from 'src/app/services/authguard.service';
import { CustomerService } from 'src/app/services/customer.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ProductRuleService } from 'src/app/services/product-rule.service';
import { ServiceService } from '../Product/Service/service.service';
import { ProductService } from 'src/app/Model/ProductService';
import { JobService } from '../Jobs/Service/job.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { BusinessUnitService } from '../business-unit-and-processes/Service/business-unit.service';
import { BusinessUnit, BusinessUnitProcessDto } from 'src/app/Model/BusinessUnit';
import { ProductRuleJob } from 'src/app/Model/ProductRuleJob';
import { Order } from 'src/app/Model/Order';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit {

  productArray: any = []
  productName: any = ''
  selectedCustomer: string | undefined | null
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
  productRuleId: number = 0;
  currentUserDetail: any;

  customerList: Customer[] = [];
  businessList: Business[] = [];
  branchList: BusinessBranch[] = [];
  selectedBusinesses: Business[] = [];
  selectedBranches: BusinessBranch[] = [];
  orderType: string | undefined | null;
  job: Order = {
    id: undefined,
    customer: undefined,
    businessCategory: undefined,
    productionUser: undefined,
    processList: [],
    jobId: undefined,
    productCategory: undefined,
    product: undefined,
    description: undefined,
    qty: undefined,
    rate: undefined,
    amount: undefined,
    linkedInvoice: undefined,
    privateNotes: undefined,
    orderTrackingNotes: undefined,
    productionNotes: undefined,
    ctpFileName: undefined,
    locationOfFile: undefined,
    sentOn: undefined,
    designPackageFile: undefined,
    locationOfDesignFile: undefined,
    jobStartDate: undefined,
    productionStartDate: undefined,
    productionEndDate: undefined,
    packingAndQADate: undefined,
    deliveryDate: undefined,
    sendTo: undefined,
    expiryDate: undefined,
    processedDetailList: [],
    category: undefined,
    size: undefined,
    type: undefined,
    paper: undefined,
    gsm: undefined,
    quantity: undefined,
    price: undefined,
    jobColorsFront: undefined,
    sideOptionValue: undefined,
    impositionValue: undefined,
    jobColorsBack: undefined,
    providedDesign: undefined,
    url: undefined,
    productRule: undefined,
    status: undefined,
    ctpProcess: undefined,
    pressMachineProcess: undefined,
    paperMarketProcess: undefined,
    designer: undefined,
    production: undefined,
    plateSetter: undefined,
    isRejected: false,
    timeStamp: undefined,
    createdBy: undefined,
    assignedBy: undefined,
    titleId: undefined
  }
  categoryList: BusinessUnit[] = [];
  // productAndServiceList: ProductService[] = [];
  productRuleJobList: ProductRuleJob[] = [];

  constructor(private orderService: OrdersService, private router: Router,
    private productRuleService: ProductRuleService, private route: ActivatedRoute,
    private customerService: CustomerService, private messageService: MessageService,
    private businessUnitService: BusinessUnitService,
    private successService: SuccessMessageService,
    private productionJobService: JobService,
    private authService: AuthguardService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getCustomerList();
    this.getUserDetails();
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      this.orderType = param['orderType']
      console.log(this.orderType);

      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
        this.orderType === 'auto' ? this.getProducts() : this.getProductList();
      } else {
        this.buttonName = 'Update'
        if (this.orderType === 'auto') {
          this.orderService.getOrderByIdAndType(this.idFromQueryParam,this.orderType).subscribe(res => {
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
        } else {
        }
      }
    })
  }

  calculate() {

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

    if (Number.isNaN(this.idFromQueryParam)) {
      let obj = {
        product: this.productName,
        productRule: this.productRuleId,
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
        type: this.orderType,
        customer: { id: +this.selectedCustomer! } || { id: 0 }
      }
      this.orderService.addOrder(obj, this.currentUserDetail.userId).subscribe(res => {
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
        type: this.orderType,
        customer: { id: +this.selectedCustomer! } || { id: 0 }
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
    this.emptyAllFields()
    this.cdr.detectChanges();

    this.productRuleId = title.id;
    this.productName = title.title;
    this.machineId = title.pressMachine.id;
    this.paperStock = title.productRulePaperStockList ? title.productRulePaperStockList : null;

    if (typeof title.category === 'string') {
      const categories = JSON.parse(title.category)
      const name = categories.map((item: any) => ({ name: item.name }));
      this.categoryArray = name;
    } else {
      this.categoryArray = null;
    }
    if (this.categoryArray.length === 1) {
      this.category = this.categoryArray[0];
    } else {
      this.category = this.categoryArray;
    }

    const parsedSize = title.size ? JSON.parse(title.size) : null;
    if (parsedSize) {
      this.size = parsedSize;
    } else {
      this.size = null;
    }
    if (this.size.length === 1) {
      this.sizeValue = this.size[0];
    }
    const parsedQty = title.quantity ? JSON.parse(title.quantity) : null;
    if (parsedQty) {
      this.quantity = parsedQty.map((item: any) => ({ name: item }));
    } else {
      this.quantity = null;
    }
    if (this.quantity.length === 1) {
      this.qtyValue = this.quantity[0];
    }
    this.impositionValue = title.impositionValue;

    this.printSide = title.printSide ? [{ name: title.printSide }] : null;
    if (this.printSide.length === 1) {
      this.sideOptionValue = this.printSide[0];
      this.jobColorOptions(this.sideOptionValue);
    }
    const parsedFrontColors = title.jobColorFront ? JSON.parse(title.jobColorFront) : null;
    if (parsedFrontColors) {
      this.jobFront = parsedFrontColors.map((item: any) => ({ name: item }));
    } else {
      this.jobFront = null;
    }

    if (this.jobFront.length === 1) {
      this.jobFrontValue = this.jobFront[0];
    }

    const parsedBackColors = title.jobColorBack ? JSON.parse(title.jobColorBack) : null;
    if (parsedBackColors) {
      this.jobColorBack = parsedBackColors.map((item: any) => ({ name: item }));
    } else {
      this.jobColorBack = null;
    }

    if (this.jobColorBack) {
      if (this.jobColorBack.length === 1) {
        this.jobBackValue = this.jobColorBack[0];
      }
    }


    this.gsms = title.productRulePaperStockList ? title.productRulePaperStockList : null;

    if (this.paperStock.length === 1) {
      this.paperStockItem = this.paperStock[0];
      this.gsmFields(this.paperStockItem);
    } else {
      this.gsmFields(null);
    }
  }

  jobColorOptions(value?: any) {
    const singleSide = "SINGLE_SIDED";
    this.isJobColorBackHidden = value?.name.toLowerCase() === singleSide.toLowerCase();
  }


  designToggle(design: any) {
    this.design = design
    this.design == this.customerDesign ? this.designValue = true : this.designValue = false
  }

  getProducts() {
    this.productRuleService.getProductRuleTable().subscribe(res => {
      this.productArray = res;

      if (this.productArray.length === 1) {
        this.toggleFields(this.productArray[0]);
      }
      !Number.isNaN(this.idFromQueryParam) ? this.putValuesOnUpdate() : null
    }, error => {
      this.showError(error);
      this.visible = true;
    })
  }

  private getCustomerList() {
    this.customerService.getCustomer().subscribe(
      (res: Customer[]) => {
        this.customerList = res;
      }, (error: BackendErrorResponse) => {
        this.showError(error.error.error);
      });
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

    this.dynamicFields = value?.paperStock;
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
      if (this.optionsGsm.length === 1) {
        this.selectedGsm = this.optionsGsm[0];
      }
    } else {
      this.foundGsm = false;
    }
  }

  putValuesOnUpdate() {
    this.productArray.forEach((el: any) => {
      el.title == this.orderToUpdate.product ? this.productToUpdate = el : null
    })
    this.toggleFields(this.productToUpdate)

    const conditionBackColor = this.orderToUpdate.jobColorsBack ? this.orderToUpdate.jobColorsBack.toString() : ''
    const foundPaperStockItem = this.paperStock != null ? this.paperStock.find((item: { paperStock: any; }) => item.paperStock === this.orderToUpdate.paper) : null;
    this.gsmFields(foundPaperStockItem)
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

    if (foundSideOptItem) {
      this.sideOptionValue = foundSideOptItem
    }
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

    const size = sizeMatch ? sizeMatch[1] : null;
    const inch = inchMatch ? inchMatch[1] + "x" + inchMatch[2] : null;
    const mm = mmMatch ? mmMatch[1] + "x" + mmMatch[2] : null;

    return {
      size: size,
      inch: inch,
      mm: mm
    };
  }

  emptyAllFields() {
    this.paperStockItem = null;
    this.category = null;
    this.sizeValue = null;
    this.qtyValue = null;
    this.sideOptionValue = null;
    this.jobFrontValue = null;
    this.jobBackValue = null;
    this.selectedGsm = null;
  }


  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }

  getUserDetails() {
    this.currentUserDetail = JSON.parse(this.authService.token).userDetails
  }

  getBusinessList(id: string): void {
    this.branchList = [];
    this.selectedBranches = [];
    this.selectedBusinesses = [];
    const selectedCustomer = this.findCustomerById(id);
    if (!selectedCustomer) {
      return;
    }
    this.customerService.getCustomerById(selectedCustomer.id)
      .subscribe(
        (res: Customer) => {
          this.businessList = res.customerBusinessName;
        },
        (error: BackendErrorResponse) => {
          this.showError(error.error.error);
        }
      );
  }

  getBrancheList(selectedBusiness: Business[]): void {
    this.branchList = [];
    this.selectedBranches = [];
    if (selectedBusiness.length === 0) {
      return;
    }

    selectedBusiness.forEach((business: Business) => {
      if (business.businessBranchList && business.businessBranchList.length > 0) {
        business.businessBranchList.forEach((branch: BusinessBranch) => {
          this.branchList.push(branch);
        });
      }
    });
  }

  // Define a method to find the customer object by id
  findCustomerById(id: string | undefined | null): Customer | undefined {
    return this.customerList?.find(customer => customer?.id === id);
  }

  findCategoryById(id: string | undefined | null): BusinessUnit | undefined {
    return this.categoryList?.find(category => category?.id === id);
  }

  private getProductList(): void {
    this.businessUnitService.getBusinessUnits().subscribe(
      (res: BusinessUnit[]) => {
        this.categoryList = res;
      },
      (err: BackendErrorResponse) => {
        this.showError(err.error.error);
      }
    );
  }

  getProductNameList(id: number): void {
    debugger
    this.productRuleJobList = [];
    this.job.product = null;
    this.job.category = null;
    this.job.size = null;
    this.businessUnitService.getBusinessUnitById(id).subscribe(
      (res: BusinessUnit) => {
        if (res.processList) {
           // Initialize a Map to store unique items keyed by productName
          const uniqueProductRuleJobList = new Map<string, ProductRuleJob>();
          res.processList?.forEach((element: BusinessUnitProcessDto) => {
            if (element.productRuleJobList) {
              element.productRuleJobList.forEach((item) => {
                // Use productName as key to ensure uniqueness
                if (item.productName) {
                  uniqueProductRuleJobList.set(item.productName, item as ProductRuleJob);
                }
              });
            }
          });
           // Convert Map values to an array
          this.productRuleJobList = Array.from(uniqueProductRuleJobList.values());
        }
      },
      (err: BackendErrorResponse) => {
        this.showError(err.error.error);
      });
  }


  calculateAmount(value: Order) {
    if (value.qty && value.rate) {
      value.amount = value.qty * value.rate;
      this.totalAmount = value.amount;
    } else {
      value.amount = 0;
    }
  }

  addJob(): void {
    this.transformProductCategory();
    this.assignJobProperties();
    const serviceToCall = this.job.id
      ? this.orderService.updateOrder(this.idFromQueryParam!, this.job)
      : this.orderService.addOrder(this.job, this.currentUserDetail.userId);
    serviceToCall.subscribe(
      (res: any) => this.handleSuccessForJob(res),
      (error: BackendErrorResponse) => {
        this.showError(error.error.error);
      }
    );
  }

  transformProductCategory(): void {
    if (this.job?.productCategory.label) {
      this.job.productCategory = this.job.productCategory.label;
    }
  }

  assignJobProperties(): void {
    this.job.type = this.orderType;
    this.job.customer = this.findCustomerById(this.selectedCustomer);
    this.selectedBusinesses.forEach(business => {
      business.businessBranchList = this.selectedBranches;
    });
    this.job.businesses = this.selectedBusinesses;
  }

  handleSuccessForJob(res: ProductionJob): void {
    this.successService.showSuccess("Job created successfully");
    setTimeout(() => {
      this.router.navigate(['/order-overview'], { queryParams: { id: res.id, orderType: 'manual' } });
    }, 2000);
  }

  getDetails(name: string): void {
    const productRule = this.productRuleJobList.find(item => item.productName === name);
    if (productRule) {
      this.categoryArray = JSON.parse(productRule.sizeCategory!)
      this.size = JSON.parse(productRule.size!)
      this.sizeValue = this.size;
      console.log(this.sizeValue);
    }
  }
  getSize(name: string): void {
    this.sizeValue = this.size.filter((item: any) => item.category === name);
    this.cdr.detectChanges();
    console.log(this.sizeValue);

  }
}
