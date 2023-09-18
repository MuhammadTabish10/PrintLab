import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthguardService } from 'src/app/services/authguard.service';

@Component({
  selector: 'app-dashboard-head',
  templateUrl: './dashboard-head.component.html',
  styleUrls: ['./dashboard-head.component.css']
})
export class DashboardHeadComponent {

  constructor(private router: Router, private authService: AuthguardService) { }

  logout() {
    if (this.authService.token) {
      localStorage.removeItem("token")
      this.router.navigateByUrl('/login')
    }
  }
}
