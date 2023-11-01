import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  visible: boolean = false;
  error: string = '';
  tableData: boolean = true;
  userArray: Users[] = [];
  search: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          debugger
          this.userArray = res as Users[];
          this.tableData = this.userArray.length === 0;
        },
        (error: any) => this.showError(error)
      );
  }

  editUser(id: number) {
    this.router.navigate(['/addUser'], { queryParams: { id: id.toString() } });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => this.getUsers(),
        (error: any) => this.showError(error)
      );
  }

  searchUser(name: any) {
    if (!name.value) {
      this.getUsers();
    } else {
      this.userService.searchUser(name.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            debugger
            this.userArray = res as Users[];
            this.tableData = this.userArray.length === 0;
          },
          (error: any) => this.showError(error)
        );
    }
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
    this.visible = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

interface Users {
  id: number;
  createdAt: Date;
  name: string;
  phoneNumber: string;
  cnicNumber: string;
}
