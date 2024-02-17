import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private router: Router,
    private authService: AuthguardService,
  ) {
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const decodedToken = this.authService.getDecodedAccessToken(token!);
    this.userName = decodedToken.sub;
    this.role = decodedToken.ROLES[0];
  }

  logout() {
    if (this.authService.token) {
      localStorage.removeItem("token")
      this.router.navigateByUrl('/login')
    }
  }

}
