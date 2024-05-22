import { RequestBody } from './../../product-rule/RequestBody';
import { Component, OnInit } from '@angular/core';
import { JobService } from '../Service/job.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { BusinessUnit, BusinessUnitProcessDto } from 'src/app/Model/BusinessUnit';
import { BusinessUnitService } from '../../business-unit-and-processes/Service/business-unit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { UpingService } from 'src/app/services/uping.service';
import { ProductRuleService } from 'src/app/services/product-rule.service';
import { ProductRule } from 'src/app/Model/ProductRule';
import { Roles } from 'src/app/Model/User';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-product-rule-job',
  templateUrl: './product-rule-job.component.html',
  styleUrls: ['./product-rule-job.component.css']
})
export class ProductRuleJobComponent implements OnInit {
  private uppingArraySubject = new Subject<any[]>();
  uppingArray$: Observable<any[]> = this.uppingArraySubject.asObservable();
  categoryArray: any;
  category: any;
  valid: string = 'Valid';
  invalid: string = 'Please fill out this field.';
  selectedCategories: string[] = [];
  selectedSizes: { category: string, size: string }[] = [];
  uppingArray: any
  upping: any;
  productRuleJob: ProductRule = { ...RequestBody.productRuleBody };
  isExist: boolean = false;
  categoryList: BusinessUnit[] = [];
  processCategory: BusinessUnit[] = [];
  sourceProducts: BusinessUnitProcessDto[] = [];
  targetProducts: BusinessUnitProcessDto[] = [];
  mode: string | undefined | null;
  idFromQueryParam: number | null | undefined;
  orderType: string | null | undefined;
  roleList: Roles[] = [];


  constructor
    (
      private productFieldService: ProductDefinitionService,
      private businessUnitService: BusinessUnitService,
      private productRuleService: ProductRuleService,
      private successService: SuccessMessageService,
      private errorService: ErrorHandleService,
      private roleService: RolesService,
      private getUpping: UpingService,
      private route: ActivatedRoute,
      private router: Router,
    ) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idFromQueryParam = +params['id'];
      this.orderType = params['orderType'];
      if (this.idFromQueryParam) {
        this.mode = "Update";
        this.getProductRuleJobById(this.idFromQueryParam);
      } else {
        this.mode = "Save";
        this.productRuleJob.type = this.orderType;
      }
    });
    this.getSizeList("Category");
    this.getAllRoles();
    this.getCategoryList();
  }

  onFocusOutEvent(productName: string) {
    this.productRuleService.checkUniqueProduct(productName).subscribe((result: boolean) => {
      this.isExist = result;
      if (result === true) {
        const error = "This product already exist.";
        this.errorService.showError(error);
      } else {
        const success = 'This is a new product';
        this.successService.showSuccess(success);
      }
    }, (err: BackendErrorResponse) => {
      this.errorService.showError(err.error.error)
    });
  }


  private getSizeList(fieldName: string) {
    this.productFieldService.getProductField().subscribe(
      (response: any) => {
        this.categoryArray = response.find((el: any) => el.name.toLowerCase() === fieldName.toLowerCase());
      },
      (error) => {
        console.error("Error:", error);
      }
    );

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

  // onCategoryChange(category: string): void {
  //   this.businessUnitService.processListByCategoryName(category).subscribe(
  //     (res: BusinessUnit[]) => {
  //       this.processCategory = res;
  //       res.forEach((element: BusinessUnit) => {
  //         if (element.processList?.includes(type === "Optional")) {
  //           this.sourceProducts = element.processList!;
  //         }
  //       })

  //     }, (error: BackendErrorResponse) => {
  //       this.errorService.showError(error.error.error);
  //     }
  //   )
  // }
  onCategoryChange(category: string): void {
    this.businessUnitService.processListByCategoryName(category).subscribe(
      (res: BusinessUnit[]) => {
        this.processCategory = res;
        const allProcesses = res.flatMap(element => element.processList || []);
        console.log(allProcesses);
        this.sourceProducts = allProcesses.filter(process => process.type?.toUpperCase() === ("Optional").toUpperCase());
        this.targetProducts = allProcesses.filter(process => process.type?.toUpperCase() === ("Compulsory").toUpperCase());
      },
      (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    );
  }


  onSizeCategoryChange(event: any) {

    this.upping = null;
    this.selectedSizes = [];
    this.getUpping.getUping().subscribe(
      (response: any) => {
        this.uppingArray = [];
        // Map the `name` property of each object in the `value` array
        this.selectedCategories = event.map((item: any) => item?.name?.toLowerCase()).filter(Boolean);
        // Filter the response based on the category names
        this.uppingArray = response.filter((el: any) => this.selectedCategories.includes(el.category.toLowerCase()))
          .map((el: any) => ({
            ...el,
            label: `[${el.productSize}], [Inch: ${el.inch}], [Mm: ${el.mm}]`,
            show: `${el.productSize} - ${el.l1} x ${el.l2} in`
          }));

        this.uppingArraySubject.next(this.uppingArray);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onUpingChange(value: any) {
    if (value.length === 0) {
      this.upping = null;
    } else {
      this.selectedSizes = [];
      this.selectedSizes = value.map((item: any) => ({
        category: item.category,
        size: item.show
      }));
      this.upping = value;
    }
  }

  getProductRuleJobById(id: number) {
    this.productRuleService.getProductRuleById(id).subscribe(
      (res: any) => {
        this.productRuleJob.businessCategory = res.businessCategory;
        res.sizeCategory = JSON.parse(res.sizeCategory!);
        const sizeArray = JSON.parse(res.size!);
        this.category = res.sizeCategory;
        this.onSizeCategoryChange(this.category);
        this.uppingArray$.subscribe((uppingArray: any[]) => {
          const matchingUppingArray = uppingArray?.filter((uppingItem: { id: number }) => {
            return sizeArray.some((sizeItem: { id: number }) => sizeItem.id === uppingItem.id);
          });
          if (matchingUppingArray.length > 0) {
            this.upping = matchingUppingArray;
          }
        });
        this.productRuleJob.productName = res.productName;
        this.targetProducts = res.processList!;
      },
      (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    );
  }

  submit() {
    this.productRuleJob.sizeCategory = JSON.stringify(this.category);
    this.productRuleJob.size = JSON.stringify(this.upping);
    this.productRuleJob.processList = this.targetProducts;

    const serviceToCall = this.idFromQueryParam
      ? this.productRuleService.updateProductRule(this.idFromQueryParam!, this.productRuleJob)
      : this.productRuleService.postProductRule(this.productRuleJob);
    serviceToCall.subscribe((res: any) => {
      this.successService.showSuccess("Process defined successfully");
      setTimeout(() => {
        this.router.navigate(['/ProductRule']);
      }, 2000);
    }, (error: BackendErrorResponse) => {
    });
  }

  getSizesForCategory(category: string): string[] {
    if (this.upping && this.upping.length > 0) {

      if (this.selectedSizes.length <= 0) {
        this.onUpingChange(this.upping);
      }
      const sizes = this.selectedSizes
        .filter(item => item.category.toLowerCase() === category.toLowerCase())
        .map(item => item.size);

      return sizes.length > 0 ? sizes : ['No sizes found'];
    } else {
      return [];
    }
  }

  getAllRoles() {
    this.roleService.getRoles().subscribe(
      (res: any) => {
        this.roleList = res;
      },
      (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    );
  }
}
