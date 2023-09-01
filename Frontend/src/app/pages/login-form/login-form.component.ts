import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthguardService } from 'src/app/services/authguard.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  userNamevalue: string = ''
  passwordValue: string = ''
  token: any
  passwordToggle: string = 'password'
  showPassword: boolean = false

  constructor(private router: Router, private loginService: LoginService, private authService: AuthguardService) {
  }

  ngOnInit(): void {
  }

  addUser() {
    let obj = {
      name: this.userNamevalue,
      password: this.passwordValue
    }
    this.loginService.post(obj).subscribe(res => {
      debugger
      this.token = res
      localStorage.setItem("token", this.token.jwt)
      this.router.navigateByUrl('/dashboard')
    }, error => {
      alert(error.error.error)
    })
  }

  togglePasswordVisiblity() {
    this.passwordToggle == 'password' ? this.passwordToggle = 'text' : this.passwordToggle = 'password'
    this.showPassword = !this.showPassword
  }
}
