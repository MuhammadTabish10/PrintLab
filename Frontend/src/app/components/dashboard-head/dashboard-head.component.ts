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

  userName: string | undefined | null;

  constructor(
    private router: Router,
    private authService: AuthguardService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const decodedToken = this.authService.getDecodedAccessToken(token!);
    const user = decodedToken.sub;
    this.getUserName(user);
  }

  getUserName(user: string): void {
    this.userService.getUsers().subscribe((users:any) => {

      const findUserName = users.find((allUsers:any) => allUsers.email === user);
      this.userName = findUserName.name;
    }, err => {

    });
  }

  logout() {
    if (this.authService.token) {
      localStorage.removeItem("token")
      this.router.navigateByUrl('/login')
    }
  }

}
