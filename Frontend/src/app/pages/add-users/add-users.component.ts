import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/Model/User';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { RolesService } from 'src/app/services/roles.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { UserService } from 'src/app/services/user.service';
import { Roles } from 'src/app/Model/User';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit, OnDestroy {
  mode: string = 'Add';
  idFromQueryParam: number | null | undefined;
  user: User = {
    id: undefined,
    name: undefined,
    createdAt: undefined,
    email: undefined,
    password: undefined,
    phone: undefined,
    cnic: undefined,
    roles: [],
    status: undefined
  };
  roles: Roles[] = [];


  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RolesService,
    private errorService: ErrorHandleService,
    private successService: SuccessMessageService
  ) { }

  ngOnInit(): void {
    this.getRoles();
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(param => {
        this.idFromQueryParam = +param['id'] || null;
        this.mode = this.idFromQueryParam ? 'Update' : 'Add';
        if (this.idFromQueryParam) {
          this.patchValues(this.idFromQueryParam);
        }
      },
        (error) => {
          this.errorService.showError(error.error.error);
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addUser() {

    const request = this.idFromQueryParam
      ? this.userService.updateUser(this.idFromQueryParam, this.user)
      : this.userService.addUser(this.user);

    request.pipe(takeUntil(this.destroy$)).subscribe(
      () => {
        const successMsg = `User ${this.user.name} is successfully ${this.mode}d.`;
        this.successService.showSuccess(successMsg);
        setTimeout(() => {
          this.router.navigateByUrl('/user');
        }, 1000);
      },
      (error) => {
        if (error.error.text) {
          this.successService.showSuccess(error.error.text);
          this.navigateToUserList();
        }

      }
    );
  }

  getRoles() {
    this.roleService.getRoles().subscribe(
      (role: any) => {
        this.roles = role;
      },
      (error) => {
        this.errorService.showError(error.error.error);
      }
    );
  }

  navigateToUserList() {
    setTimeout(() => {
      this.router.navigateByUrl('/user');
    }, 1000);
  }

  patchValues(id: number): void {
    this.userService.getUserById(id).subscribe(
      (res: User) => {
        this.user = res;
      }, error => {
        this.errorService.showError(error.error.error);
      });
  }
}
