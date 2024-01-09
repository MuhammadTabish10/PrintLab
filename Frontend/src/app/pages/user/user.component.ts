import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/Model/User';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  userArray: User[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
    private datePipe: DatePipe,
    private errorService: ErrorHandleService,
    private successService: SuccessMessageService,
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: User[]) => {

          this.userArray = res;
          this.userArray.forEach((el: User) => {
            const dateArray = el.createdAt;
            if (Array.isArray(dateArray)) {
              el.createdAt = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
              el.createdAt = this.datePipe.transform(el.createdAt, 'EEEE, MMMM d, yyyy, h:mm a');
            }
          });
        },
        (error) => {
          this.errorService.showError(error.error.error);
        }
      );
  }

  editUser(id: number) {
    this.router.navigate(['/addUser'], { queryParams: { id: id } });
  }

  petyCash(id: number) {
    this.router.navigate(['/userPetyCash'], { queryParams: { id: id } });
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          const result = `User ${user.name} deleted successfully`;
          this.successService.showSuccess(result);
          this.getUsers();
        },
        (error) => {
          this.errorService.showError(error.error.error);
        }
      );
  }

  searchUser(name: EventTarget) {

    if (!(name instanceof HTMLInputElement)) {
      return;
    }

    const inputValue = name.value.trim();
    if (!inputValue) {
      this.getUsers();
      return;
    }

    this.userService.searchUser(inputValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: User[]) => {
          this.userArray = res;
          this.userArray.forEach((el: User) => {
            const dateArray = el.createdAt;
            if (Array.isArray(dateArray)) {
              el.createdAt = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
              el.createdAt = this.datePipe.transform(el.createdAt, 'EEEE, MMMM d, yyyy, h:mm a');
            }
          });
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
}

