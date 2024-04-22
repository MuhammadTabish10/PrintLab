import { Component, OnInit } from '@angular/core';
import { BusinessUnitService } from '../../business-unit-and-processes/Service/business-unit.service';
import { BusinessUnit, BusinessUnitProcessDto } from 'src/app/Model/BusinessUnit';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/Model/Customer';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/Model/User';
import { ProductionJob } from 'src/app/Model/ProductionJob';
import { JobService } from '../Service/job.service';
import { Business, BusinessBranch } from 'src/app/Model/Business';
import { TreeNode } from 'primeng/api';
import { ServiceService } from '../../Product/Service/service.service';
import { ProductService } from 'src/app/Model/ProductService';
import { ProductCategory } from 'src/app/Model/ProductCategory';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VendorService } from 'src/app/services/vendor.service';
import { Vendor } from 'src/app/Model/Vendor';



interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css'],
  providers: [MatDialog]
})
export class CreateJobComponent implements OnInit {

  ref: DynamicDialogRef | undefined;
  categoryList: BusinessUnit[] = [];
  sourceProducts: BusinessUnitProcessDto[] = [];
  targetProducts: BusinessUnitProcessDto[] = [];
  processCategory: BusinessUnit[] = [];
  customerList: Customer[] = [];
  productionUserList: User[] | undefined = [];
  businessList: Business[] = [];
  branchList: BusinessBranch[] = [];
  selectedBusinesses: Business[] = [];
  selectedBranches: BusinessBranch[] = [];
  productCategoryList: TreeNode<ProductCategory>[] = [];
  job: ProductionJob = {
    id: undefined,
    client: undefined,
    businessCategory: undefined,
    productionUser: undefined,
    processList: [],
    jobId: undefined,
    productCategory: undefined,
    productName: undefined,
    description: undefined,
    qty: undefined,
    rate: undefined,
    amount: undefined,
    linkedInvoice: undefined,
    privateNotes: undefined,
    orderTrackingNotes: undefined,
    productionNotes: undefined,
    proof: undefined,
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
    processedDetailList: []
  }
  uploadedFiles: any[] = [];

  idFromQueryParam: number | null | undefined;
  productAndServiceList: ProductService[] = [];
  imageObjects: { objectURL: { changingThisBreaksApplicationSecurity: string } }[] = [];
  groupVendorList: any[] = [];

  constructor(
    private businessUnitService: BusinessUnitService,
    private successService: SuccessMessageService,
    private errorService: ErrorHandleService,
    private productionJobService: JobService,
    private customerService: CustomerService,
    private productService: ServiceService,
    private vendorService: VendorService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.getCategoryList();
    this.getCustomerList();
    this.getProductList();
    this.getUserList();
    this.getAllVendors();
  }

  private getCategoryList(): void {
    this.businessUnitService.getBusinessUnits().subscribe(
      (res: BusinessUnit[]) => {
        this.categoryList = res;

      }, (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    );
  }

  onCategoryChange(category: string): void {
    this.businessUnitService.processListByCategoryName(category).subscribe(
      (res: BusinessUnit[]) => {
        this.processCategory = res;
        res.forEach((element: BusinessUnit) => {
          this.sourceProducts = element.processList!;
        })

      }, (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    )
  }

  private getCustomerList() {
    this.customerService.getCustomer().subscribe(
      (res: Customer[]) => {
        this.customerList = res;
      }, (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      });
  }
  private getUserList() {
    this.userService.getUsers().subscribe(
      (res: User[]) => {
        this.productionUserList = this.hasProductionRole(res);
      },
      (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    );
  }
  hasProductionRole(res: User[]): User[] {
    return res.filter(user => {
      return user.roles?.some(role => role.name === 'ROLE_PRODUCTION');
    });
  }

  submit(): void {
    this.job.processList = this.targetProducts;
    if (this.job.productCategory.label) {
      this.job.productCategory = this.job.productCategory.label
    }
    // Assuming uploadedFiles is an array of File objects
    this.job.proof = this.uploadedFiles.map(file => {
      return { id: null, fileData: file.objectURL.changingThisBreaksApplicationSecurity };
    });
    this.selectedBusinesses.forEach(business => {
      business.businessBranchList = this.selectedBranches;
    })
    this.job.businessName = this.selectedBusinesses;
    const serviceToCall = this.job.id ? this.productionJobService.updateProductionJob(this.idFromQueryParam!, this.job) : this.productionJobService.postProductionJob(this.job);
    serviceToCall.subscribe((res: ProductionJob) => {
      this.successService.showSuccess("Job created successfully");
      setTimeout(() => {
        this.router.navigate(['/all-jobs']);
      }, 2000);
    }, (error: BackendErrorResponse) => {
      this.errorService.showError(error.error.error);
    })
  }

  getBusinessList(id: number): void {
    this.branchList = [];
    this.selectedBranches = [];
    this.selectedBusinesses = [];
    const selectedCustomer = this.customerList.find(customer => customer.id === id);
    if (!selectedCustomer) {
      return;
    }

    this.customerService.getCustomerById(selectedCustomer.id)
      .subscribe(
        (res: Customer) => {
          this.businessList = res.customerBusinessName;

          // this.businessList.forEach(business => {
          //   if (business.businessBranchList && business.businessBranchList?.length > 0) {
          //     this.branchList = business.businessBranchList;
          //   }
          // });
        },
        (error: BackendErrorResponse) => {
          this.errorService.showError(error.error.error);
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

  private getProductList(): void {
    this.productService.getAllProductCategory().subscribe(
      (res: ProductCategory[]) => {
        // Build the category tree structure using fetched data
        this.productCategoryList = this.buildCategoryTree(res);
      },
      (err: BackendErrorResponse) => {
        this.errorService.showError(err.error.error);
      }
    );
  }

  // Function to transform a single product category into a TreeNode object
  private transformCategory(category: ProductCategory): TreeNode<ProductCategory> {
    // Generate key for the category, use 'root' if no ID is present
    const categoryKey = category.id ? category.id.toString() : 'root';

    // Create a TreeNode object for the category
    const treeNode: TreeNode<ProductCategory> = {
      key: categoryKey,
      label: category.name || '',
      data: category,
      children: []
    };

    return treeNode; // Return the created TreeNode
  }

  // Recursion function to build the category tree structure
  private buildCategoryTree(categories: ProductCategory[], parentId?: number): TreeNode<ProductCategory>[] {

    const parentCategories = categories.filter(category => category.parentProductCategory?.id === parentId);

    return parentCategories.map(parent => {

      const treeNode = this.transformCategory(parent);

      // Recursively build children for the parent category
      treeNode.children = this.buildCategoryTree(categories, parent?.id!);

      return treeNode; // Return the TreeNode for the parent category
    });
  }

  getProductNameList(productCategory: TreeNode<ProductCategory>): void {
    this.job.productName = null;
    this.productAndServiceList = [];
    this.job.description = null;
    this.job.qty = null;
    this.job.rate = null;
    this.job.amount = null;
    if (productCategory && productCategory.children && productCategory.children.length > 0) {
      return;
    }
    this.productService.searchProductServiceNameByCategory(+productCategory?.key!).subscribe(res => {
      this.productAndServiceList = res;
    });
  }

  calculateAmount(value: ProductionJob) {

    if (value.qty && value.rate) {
      value.amount = value.qty * value.rate;
    } else {
      value.amount = 0;
    }
  }

  AutoFillOthers(product: ProductionJob): void {

    const selectedProduct = this.productAndServiceList.find(p => p.name === product.productName);
    if (selectedProduct) {
      this.getDataForOtherFields(selectedProduct);
    } else {
      this.emptyAutoFilledFields(product);
    }
  }

  getDataForOtherFields(selectedProduct: ProductService) {

    this.job.description = selectedProduct.description;
    this.job.rate = selectedProduct.cost;
  }

  emptyAutoFilledFields(product: ProductionJob) {
    product.description = null;
    product.rate = null;
  }

  onUpload(event: UploadEvent) {
    for (let file of event.files) {
      // Check if the file already exists in uploadedFiles array
      if (!this.isFileAlreadyUploaded(file)) {
        
        this.uploadedFiles.push(file);
      }
    }

    // Convert FileList to an array and then map over it to extract objectURLs
    const filesArray = Array.from(this.uploadedFiles);
    this.imageObjects = filesArray.map((file: any) => ({ objectURL: file.objectURL }));
  }

  isFileAlreadyUploaded(newFile: any): boolean {
    // Check if newFile exists in uploadedFiles array based on name
    return this.uploadedFiles.some((file: any) => file.name === newFile.name);
  }


  openImage(imageUrl: string): void {
    this.dialog.open(ImageViewerComponent, {
      data: { imageUrl }
    });
  }
  onRemove(event: any) {
    const index = this.uploadedFiles.indexOf(event.file);
    const indexImg = this.imageObjects.findIndex(img => img.objectURL === event.file.objectURL);

    if (index !== -1) {
      this.uploadedFiles.splice(index, 1);
    }

    if (indexImg !== -1) {
      this.imageObjects.splice(indexImg, 1);
    }
  }

  onClear(event: any) {
    this.uploadedFiles = [];
    this.imageObjects = [];
  }

  copyText(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied successfully');
    }).catch((error) => {
      console.error('Could not copy text: ', error);
    });
  }
  // private getAllVendors(): void {
  //   this.vendorService.getVendor().subscribe(
  //     (res: any) => {
  //       // Map vendors to groupVendorList
  //       this.groupVendorList = [
  //         {
  //           label: 'Vendors',
  //           items: res.map((vendor: any) => ({ label: vendor.name }))
  //         }
  //       ];

  //       // Add productionUserList to groupVendorList
  //       this.groupVendorList.push({
  //         label: 'Production Users',
  //         items: this.productionUserList.map((user: any) => ({
  //           label: user.name,
  //           value: user.name
  //         }))
  //       });
  //     },
  //     (error: BackendErrorResponse) => {
  //       this.errorService.showError(error.error.error);
  //     }
  //   );
  // }


  private getAllVendors(): void {
    this.groupVendorList = [];

    // Fetch vendors from vendorService
    this.vendorService.getVendor().subscribe(
      (res: any) => {
        // Map vendors to groupVendorList under 'Vendors' group
        const vendors = res.map((vendor: any) => ({ label: vendor.name, value: vendor.id }));
        this.groupVendorList.push({ label: 'Vendors', items: vendors });

        // Check if productionUserList exists and is not empty
        if (this.productionUserList && this.productionUserList.length > 0) {
          // Map production users to groupVendorList under 'Production Users' group
          const productionUsers = this.productionUserList.map((user: any) => ({
            label: user.name,
            value: user.id
          }));
          this.groupVendorList.push({ label: 'Production Users', items: productionUsers });
        }
      },
      (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    );
  }

}
