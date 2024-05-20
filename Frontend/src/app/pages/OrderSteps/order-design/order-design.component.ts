import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/Model/User';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { AuthguardService } from 'src/app/services/authguard.service';
import { JobService } from '../../Jobs/Service/job.service';

@Component({
  selector: 'app-order-design',
  templateUrl: './order-design.component.html',
  styleUrls: ['./order-design.component.css'],
})
export class OrderDesignComponent implements OnInit {

  orderById: any = {};
  idFromQueryParam: number | undefined | null;
  selectedDesigner: any = {};
  order: any = {};
  designerRoleList: User[] = [];
  visible: boolean = false;
  currentUserDetail: any = {};
  roleIsDesigner: boolean = false;
  orderType: string | undefined | null;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthguardService,
    private orderService: OrdersService,
    private userService: UserService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.idFromQueryParam = +params['id'];
      this.orderType = params['orderType'];
      if (this.idFromQueryParam) {
        this.getOrderById(this.idFromQueryParam);
      }
    });
    this.getUserDetails();
    this.getUserList();
  }

  getOrderById(id: number): void {
    // const serviceToCall = this.orderType === 'auto'
    //   ? this.orderService.getOrderById(id)
    //   : this.jobService.getProductionJobById(id);
    // serviceToCall
    this.orderService.getOrderByIdAndType(id, this.orderType!)
      .subscribe(
        (data) => {
          this.orderById = data;
          this.orderById.timeStamp = new Date(this.orderById.timeStamp[0], this.orderById.timeStamp[1] - 1, this.orderById.timeStamp[2], this.orderById.timeStamp[3], this.orderById.timeStamp[4]);
          this.orderById.timeStamp = this.datePipe.transform(this.orderById.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
        },
        (error) => {
          console.error('Error fetching order:', error);
        }
      );
  }

  copyIdToClipboard(id: string): void {
    const el = document.createElement('textarea');
    el.value = id;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

  }

  getUserList(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.designerRoleList = data.filter((user: User) =>
          user.roles.some(role => role.name?.toUpperCase() === 'ROLE_DESIGNER')
        );
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }
  saveOrder(user?: number, role?: string, orderId?: number | undefined | null, logedInUser?: number | null | undefined): void {
    if (user && role && orderId && logedInUser) {
      // const serviceToCall = this.orderType === 'auto'
      //   ? this.orderService.saveAssignedUser(user, role, orderId, logedInUser)
      //   : this.jobService.saveAssignedUser(user, role, orderId, logedInUser);
      //   serviceToCall
      this.orderService.saveAssignedUser(user, role, orderId, logedInUser)
        .subscribe(
          (res: any) => {
            if (this.idFromQueryParam) {
              this.getOrderById(this.idFromQueryParam);
            }
          }, (err: any) => {
            console.log(err);
          });
    }
  }

  confirm1(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });

        this.saveOrder(this.selectedDesigner, 'ROLE_DESIGNER', this.idFromQueryParam, this.currentUserDetail?.userId)
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }
  getUserDetails() {
    this.currentUserDetail = JSON.parse(this.authService.token).userDetails
    this.roleIsDesigner = this.currentUserDetail.authorities[0].authority === 'ROLE_DESIGNER'
  }
}
