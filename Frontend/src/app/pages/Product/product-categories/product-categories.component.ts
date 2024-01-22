import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ProductCategory } from 'src/app/Model/ProductCategory';
import { NodeService } from 'src/app/services/node.service';
import { ServiceService } from '../Service/service.service';
import { Subject, takeUntil } from 'rxjs';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessMessageService } from 'src/app/services/success-message.service';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.css']
})
export class ProductCategoriesComponent implements OnInit {
  files!: TreeNode[];

  visible: boolean = false;
  rowId: number | undefined | null;

  private destroy$ = new Subject<void>();

  productCategory: ProductCategory = {
    id: undefined,
    name: undefined,
    isSub: false,
    parent_product_category_id: {
      id: undefined,
      name: undefined,
    },
    status: undefined,
  }
  productList: TreeNode<ProductCategory>[] = [];
  mode: string = 'Save';

  constructor(
    private nodeService: NodeService,
    private service: ServiceService,
    private errorHandleService: ErrorHandleService,
    private route: ActivatedRoute,
    private router: Router,
    private successMsgService: SuccessMessageService,
  ) { }

  ngOnInit() {
    this.getProductList();
    // this.files = [
    //   {
    //     data: { name: 'Root', size: '10 KB', type: 'Folder' },
    //     children: [
    //       {
    //         data: { name: 'Subfolder 1', size: '5 KB', type: 'Folder' },
    //         children: [
    //           { data: { name: 'File 1', size: '2 KB', type: 'File' } },
    //           { data: { name: 'File 2', size: '3 KB', type: 'File' } }
    //         ]
    //       },
    //       {
    //         data: { name: 'Subfolder 2', size: '3 KB', type: 'Folder' },
    //         children: [
    //           { data: { name: 'File 3', size: '1 KB', type: 'File' } }
    //         ]
    //       }
    //     ]
    //   }
    // ];

  }

  editProductCategory(row: ProductCategory) {
    this.visible = true;
    debugger
    this.productCategory.name = row.name;
    this.rowId = row.id;
    this.mode = this.rowId ? 'Update' : 'Save';
  }

  getProductList(): void {
    this.service.getAllProductCategory().pipe(takeUntil(this.destroy$)).subscribe(
      (res: ProductCategory[]) => {
        debugger
        this.productList = res.map(category => ({
          data: category,
          children: []
        }));
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
          this.productList = res.map(category => ({
            data: category,
            children: []
          }));
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

    if (!this.productCategory) {

    }
  }

  submit() {
    debugger
    if (!this.productCategory.isSub) {
      this.productCategory.name = this.productCategory.parent_product_category_id.name
    } else {
      this.productCategory.parent_product_category_id.id = this.productCategory.id;
    }
    const serviceToCall = !this.rowId ? this.service.postProductCategory(this.productCategory)
      : this.service.updateProductCategory(this.rowId, this.productCategory);

    serviceToCall.subscribe(
      (res: ProductCategory) => {
        const successMsg = `Product Category ${this.productCategory.name} is successfully ${this.mode}d.`;
        this.successMsgService.showSuccess(successMsg);
        setTimeout(() => {
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
}

