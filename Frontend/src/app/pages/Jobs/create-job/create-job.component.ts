import { Component, OnInit } from '@angular/core';
import { BusinessUnitService } from '../../business-unit-and-processes/Service/business-unit.service';
import { BusinessUnit, BusinessUnitProcessDto } from 'src/app/Model/BusinessUnit';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/Model/Customer';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/Model/User';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent implements OnInit {

  categoryList: BusinessUnit[] = [];
  sourceProducts: BusinessUnitProcessDto[] = [];
  targetProducts: BusinessUnitProcessDto[] = [];
  processCategory: BusinessUnit[] = [];
  customerList: Customer[] = [];
  productionUserList: User[] = [];

  constructor(
    private businessUnitService: BusinessUnitService,
    private errorService: ErrorHandleService,
    private customerService: CustomerService,
    private userService: UserService
  ) { }
  ngOnInit(): void {
    this.getCategoryList();
    this.getCustomerList();
    this.getUserList();
  }


  private getCategoryList(): void {
    this.businessUnitService.getBusinessUnits().subscribe(
      (res: BusinessUnit[]) => {
        this.categoryList = res;
        debugger
      }, (error: BackendErrorResponse) => {
        this.errorService.showError(error.error.error);
      }
    );
  }

  onCategoryChange(category: string): void {
    debugger
    this.businessUnitService.processListByCategoryName(category).subscribe(
      (res: BusinessUnit[]) => {
        this.processCategory = res;
        res.forEach((element: BusinessUnit) => {
          this.sourceProducts = element.processList!;
        })
        debugger
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
        debugger;
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

}
