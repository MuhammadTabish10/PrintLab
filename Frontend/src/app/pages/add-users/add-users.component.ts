import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EMPTY, Subject, of, takeUntil } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RolesService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit, OnDestroy {
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
  email: string = '';
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

    this.route.queryParams
    .pipe(
      takeUntil(this.destroy$),
      switchMap((param) => {
        this.idFromQueryParam = +param['id'] || 0;
        this.buttonName = this.idFromQueryParam ? 'Update' : 'Add';

        if (this.idFromQueryParam) {
          return this.userService.getUserById(this.idFromQueryParam);
        } else {
          return EMPTY;
        }
      })
    )
      .subscribe(
        (res?: any) => {
          debugger
          this.userToUpdate = res;
          this.email = this.userToUpdate.email;
          this.nameValue = this.userToUpdate.name;
          this.password = this.userToUpdate.password;
          this.phoneNumber = this.userToUpdate.phone;
          this.cnicNumber = this.userToUpdate.cnic;
          this.roles = this.userToUpdate.roles[0];

        },
        (error: any) => {
          this.showError(error);
          this.visible = true;
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addUser() {
    const obj = {
      email: this.email,
      name: this.nameValue,
      password: this.password,
      phone: this.phoneNumber,
      cnic: this.cnicNumber,
      roles: [{ id: this.roles.id }]
    };

    const request = this.idFromQueryParam
      ? this.userService.updateUser(this.idFromQueryParam, obj)
      : this.userService.addUser(obj);

    request.pipe(takeUntil(this.destroy$)).subscribe(
      () => this.router.navigateByUrl('/user'),
      (error: any) => {
        if (error.error.text) {
          this.showSuccess(error);
        }
        this.visible = true;
      }
    );
  }

  getRoles() {
    this.roleService.getRoles().subscribe(
      (role) => {
        this.rolesObj = role;
      },
      (error) => {
        this.showError(error);
      }
    );
  }

  showError(error: any) {

    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
  showSuccess(error: any) {

    this.messageService.add({ severity: 'success', summary: 'Success', detail: error.error.text });
    this.navigateToUserList();
  }
  navigateToUserList() {
    setTimeout(() => {
      this.router.navigateByUrl('/user');
    }, 700);
  }
}
