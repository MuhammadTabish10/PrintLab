import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { User } from 'src/app/Model/User';
import { AuthguardService } from 'src/app/services/authguard.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-dashboard-head',
  templateUrl: './dashboard-head.component.html',
  styleUrls: ['./dashboard-head.component.css']
})
export class DashboardHeadComponent implements OnInit {
  numOfOnlineUser: number | null | undefined;
  userName: string | undefined | null;
  role: string | undefined | null;
  menuItems!: MenuItem[];
  currentUserDetail: any;
  isCustomerSupport: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthguardService,
  ) {
  }

  ngOnInit(): void {
    this.getUserDetails();
    const token = localStorage.getItem('token');
    const decodedToken = this.authService.getDecodedAccessToken(token!);
    this.userName = decodedToken.sub;
    this.role = decodedToken.ROLES[0];
    if (this.isCustomerSupport) {
      this.menuItems = [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: '/dashboard'
        },
        {
          label: 'Orders',
          icon: 'pi pi-shopping-cart',
          items: [
            {
              label: 'New',
              icon: 'pi pi-cart-plus',
              routerLink: '/addOrder',
            },
            {
              label: 'OrderList',
              icon: 'pi pi-shopping-cart',
              routerLink: '/orders'
            }
          ]
        }
      ];
    }
  }

  logout() {
    if (this.authService.token) {
      localStorage.removeItem("token")
      this.router.navigateByUrl('/login')
    }
  }

  getUserDetails() {
    this.currentUserDetail = JSON.parse(this.authService.token).userDetails
    this.isCustomerSupport = this.currentUserDetail.authorities[0].authority === "ROLE_CUSTOMER_SUPPORT";
  }
}
