import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from 'src/app/Model/ProductService';
import { ServiceService } from '../Service/service.service';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { Router } from '@angular/router';
import { SuccessMessageService } from 'src/app/services/success-message.service';

@Component({
  selector: 'app-product-services',
  templateUrl: './product-services.component.html',
  styleUrls: ['./product-services.component.css']
})
export class ProductServicesComponent {
  productList: ProductService[] = [];
  productService: ProductService = {
    id: undefined,
    name: undefined,
    category: undefined,
    type: undefined,
    desc: undefined,
    cost: undefined,
    status: undefined,
  }

  private destroy$ = new Subject<void>();
  visible: boolean = false;

  constructor(
    private service: ServiceService,
    private errorHandleService: ErrorHandleService,
    private router: Router,
    private successMsgService: SuccessMessageService,
  ) { }

  ngOnInit(): void {
    this.getProductList();
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

}
