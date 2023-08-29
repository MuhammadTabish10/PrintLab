import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
  }

  addUser() {
    let obj = {
      name: this.userNamevalue,
      password: this.passwordValue
    }
    this.loginService.post(obj).subscribe(res => {
      this.token = res
      localStorage.setItem("token", JSON.stringify(this.token))
      this.router.navigateByUrl('/dashboard')
    })
  }
}
