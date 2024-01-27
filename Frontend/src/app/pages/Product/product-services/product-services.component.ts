import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from 'src/app/Model/ProductService';
import { ServiceService } from '../Service/service.service';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { Router } from '@angular/router';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { ProductField } from 'src/app/Model/ProductField';
import { ProductCategory } from 'src/app/Model/ProductCategory';

@Component({
  selector: 'app-product-services',
  templateUrl: './product-services.component.html',
  styleUrls: ['./product-services.component.css']
})
export class ProductServicesComponent {
  productList: ProductService[] = [];
  categories: ProductCategory[] = [];
  productService: ProductService = {
    id: undefined,
    name: undefined,
    productCategory: {
      name: undefined,
      id: undefined,
      status: true,
      isSub: undefined,
      parentProductCategory: {
        id: undefined,
        name: undefined,
      },
    },
    type: undefined,
    description: undefined,
    cost: undefined,
    status: undefined,
  }

  private destroy$ = new Subject<void>();
  visible: boolean = false;
  rowId: number | undefined | null;
  mode: string = 'Save';
  productTypes: ProductField | undefined | null;

  constructor(
    private service: ServiceService,
    private errorHandleService: ErrorHandleService,
    private router: Router,
    private successMsgService: SuccessMessageService,
    private productFieldService: ProductDefinitionService,
  ) { }

  ngOnInit(): void {
    this.getProductList();
    this.getProductServiceType();
    this.getCategories();
  }

  getProductList(): void {
    this.service.getAllProductService().pipe(takeUntil(this.destroy$)).subscribe(
      (res: ProductService[]) => {
        this.productList = res;
      },
      (error: any) => this.errorHandleService.showError(error.error.error)
    );
  }


  editProduct(row: ProductService) {
    this.visible = true;
    this.rowId = row.id;
    const foundProduct = this.productList.find((product: ProductService) => product.id === row.id);
    if (foundProduct) {
      this.productService = foundProduct;
    }
    this.mode = this.rowId ? 'Update' : 'Save';
  }

  deleteProduct(row: ProductService) {
    this.service.deleteProductServiceById(row.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          const result = `Product ${row.name} deleted successfully`;
          this.successMsgService.showSuccess(result);
          this.getProductList();
        },
        (error: any) => this.errorHandleService.showError(error.error.error)
      );
  }


  searchProduct(name: EventTarget | null) {

    if (!(name instanceof HTMLInputElement)) {
      return;
    }

    const inputValue = name.value.trim();

    if (!inputValue) {
      this.getProductList();
      return;
    }

    this.service.searchProductServiceByName(inputValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: ProductService[]) => {
          this.productList = res;
        },
        (error: any) => this.errorHandleService.showError(error.error.error)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  show() {
    this.visible = true;
  }

  submit() {
    debugger
    this.productService.productCategory.parentProductCategory = null;
    if (this.rowId) {
      // Assuming this.productService.productCategory is an object
      if ('name' in this.productService.productCategory) {
        delete this.productService.productCategory.name;
      }
      if ('parentProductCategory' in this.productService.productCategory) {
        delete this.productService.productCategory.parentProductCategory;
      }
      if ('status' in this.productService.productCategory) {
        delete this.productService.productCategory.status;
      }
    }

    console.log(this.productService);
    const serviceToCall = !this.rowId ? this.service.postProductService(this.productService)
      : this.service.updateProductService(this.rowId, this.productService);

    serviceToCall.subscribe(
      (res: ProductService) => {
        const successMsg = `Product and service ${this.productService.name} is successfully ${this.mode}d.`;
        this.successMsgService.showSuccess(successMsg);
        setTimeout(() => {
          this.mode = 'Save';
          this.visible = false;
          this.getProductList();
        }, 1500);
      }, error => {
        if (error.status === 400) {
          this.errorHandleService.showError("Bad Request. Please check your inputs.");
        } else {
          this.errorHandleService.showError(error.error.error);
        }
      }
    );
  }

  getProductServiceType() {
    const fieldName = 'Product_And_Service';
    fieldName.toUpperCase();
    this.productFieldService.searchProductField(fieldName).subscribe(
      (res: any) => {
        this.productTypes = res[0];
      }, err => {
      });
  }

  getCategories(): void {
    this.service.getAllProductCategory().pipe(takeUntil(this.destroy$)).subscribe(
      (res: ProductCategory[]) => {
        this.categories = res;
        debugger
      },
      (error: any) => this.errorHandleService.showError(error.error.error)
    );
  }
}
