import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ProductCategory } from 'src/app/Model/ProductCategory';
import { NodeService } from 'src/app/services/node.service';
import { ServiceService } from '../Service/service.service';
import { Subject, takeUntil } from 'rxjs';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { Router } from '@angular/router';
import { SuccessMessageService } from 'src/app/services/success-message.service';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.css']
})
export class ProductCategoriesComponent implements OnInit {
  files!: TreeNode[];

  visible: boolean = false;

  private destroy$ = new Subject<void>();

  productCategory: ProductCategory = {
    id: undefined,
    name: undefined,
    field: undefined,
    header: undefined,
    status: undefined,
  }
  productList: ProductCategory[] = [];

  constructor(
    private nodeService: NodeService,
    private service: ServiceService,
    private errorHandleService: ErrorHandleService,
    private router: Router,
    private successMsgService: SuccessMessageService,
  ) { }

  ngOnInit() {
    this.getProductList();
    this.files = [
      {
        data: { name: 'Root', size: '10 KB', type: 'Folder' },
        children: [
          {
            data: { name: 'Subfolder 1', size: '5 KB', type: 'Folder' },
            children: [
              { data: { name: 'File 1', size: '2 KB', type: 'File' } },
              { data: { name: 'File 2', size: '3 KB', type: 'File' } }
            ]
          },
          {
            data: { name: 'Subfolder 2', size: '3 KB', type: 'Folder' },
            children: [
              { data: { name: 'File 3', size: '1 KB', type: 'File' } }
            ]
          }
        ]
      }
    ];

  }

  editProductCategory(row: ProductCategory) {
    this.visible = true;
    this.productCategory.name = row.name;
  }

  getProductList(): void {
    this.service.getAllProductCategory().pipe(takeUntil(this.destroy$)).subscribe(
      (res: ProductCategory[]) => {
        this.productList = res;
      },
      (error: any) => this.errorHandleService.showError(error.error.error)
    );
  }

  deleteProductCategory(row: ProductCategory) {
    this.service.deleteProductCategoryById(row.id!)
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

    this.service.searchProductCategoryByName(inputValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: ProductCategory[]) => {
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

  clear() {

    if (!this.productCategory.header) {

    }
  }
}

