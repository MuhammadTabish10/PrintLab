import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { RolesService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent {
  buttonName: string = 'Add';
  nameValue: string = '';
  phoneNumber: string = '';
  cnicNumber: string = '';
  idFromQueryParam!: number;
  userToUpdate: any = [];
  error: string = '';
  visible: boolean = false;
  password: string = '';
  roles: any = [];
  rolesObj: any = [];
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private roleService: RolesService
  ) { }


  ngOnInit(): void {
    this.getRoles();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(param => {
      this.idFromQueryParam = +param['id'] || 0;
      this.buttonName = this.idFromQueryParam ? 'Update' : 'Add';

      if (this.idFromQueryParam) {
        this.userService.getUserById(this.idFromQueryParam).subscribe(
          (res: any) => {
            this.userToUpdate = res;
            this.nameValue = this.userToUpdate.name;
            this.phoneNumber = this.userToUpdate.phone;
            this.cnicNumber = this.userToUpdate.cnic;
          },
          (error: any) => {
            this.showError(error);
            this.visible = true;
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



  addUser() {
    const obj = {
      name: this.nameValue,
      password: this.password,
      phone: this.phoneNumber,
      cnic: this.cnicNumber,
      roles: { id: this.roles.id }
    };
debugger
    const request = this.idFromQueryParam ?
      this.userService.updateUser(this.idFromQueryParam, obj) :
      this.userService.addUser(obj);

    request.pipe(takeUntil(this.destroy$)).subscribe(
      () => this.router.navigateByUrl('/user'),
      (error: any) => {
        this.showError(error);
        this.visible = true;
      }
    );
  }
  getRoles() {
    this.roleService.getRoles().subscribe(role => {
      this.rolesObj = role;
    }, error => {

    });
  }
  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }

}
