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
    parentProductCategory: {
      id: undefined,
      name: undefined,
    },
    status: undefined,
  }
  productList: TreeNode<ProductCategory>[] = [];
  mode: string = 'Save';
  transFormList: any[] = [];

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
  }

  editProductCategory(row: ProductCategory) {
    this.visible = true;
    debugger
    this.productCategory.name = row.name;
    this.rowId = row.id;
    this.mode = this.rowId ? 'Update' : 'Save';
  }

  getProductList(): void {
    this.transFormList = [];
    this.files = [];
    this.service.getAllProductCategory().pipe(takeUntil(this.destroy$)).subscribe(
      (res: ProductCategory[]) => {
        debugger
        this.transFormRes(res);
        // this.productList = res.map(category => ({
        //   data: category,
        //   children: []
        // }));
        // this.productList.forEach(category => {
        //   category?.children?.push(category);
        // })
      },
      (error: any) => this.errorHandleService.showError(error.error.error)
    );
  }
  transFormRes(res: ProductCategory[]) {
    debugger
    for (let r of res) {
      if (r.parentProductCategory === null) {
        let obj = {
          data: { id: r.id, name: r.name, status: r.status, },
          children: []
        }
        this.transFormList.push(obj)
      } else {
        let findChild = this.transFormList.find(f => f.data.id === r.parentProductCategory?.id)
        if (!findChild) {
          let obj = {
            data: { id: r.id, name: r.name, status: r.status, },
            children: []
          }
          this.transFormList.push(obj)
        }
        findChild?.children.push({
          data: { id: r.id, name: r.name, status: r.status }
        })
      }
    }
    this.files = this.transFormList;
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
      this.productCategory.parentProductCategory = null;
    } else {
      this.productCategory.parentProductCategory = {
        id: this.productCategory.parentProductCategory?.id,
        name: this.productCategory.parentProductCategory?.name
      }
    }
    const serviceToCall = !this.rowId ? this.service.postProductCategory(this.productCategory)
      : this.service.updateProductCategory(this.rowId, this.productCategory);

    serviceToCall.subscribe(
      (res: ProductCategory) => {
        const successMsg = `Product Category ${this.productCategory.name} is successfully ${this.mode}d.`;
        this.successMsgService.showSuccess(successMsg);
        setTimeout(() => {
          this.visible = false;
          this.productCategory = {
            id: undefined,
            name: undefined,
            isSub: false,
            parentProductCategory: {
              id: undefined,
              name: undefined,
            },
            status: undefined,
          };
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

