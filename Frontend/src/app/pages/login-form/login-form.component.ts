import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { AuthguardService } from 'src/app/services/authguard.service';
import { LoginService } from 'src/app/services/login.service';



@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  visible: boolean = false;
  error: string = ''
  userNamevalue: string = ''
  passwordValue: string = ''
  token: any
  passwordToggle: string = 'password'
  showPassword: boolean = false

  constructor(private router: Router, private loginService: LoginService,private messageService: MessageService) {
  }

  ngOnInit(): void {
    localStorage.removeItem('token')
  }


  addUser() {
    let obj = {
      name: this.userNamevalue,
      password: this.passwordValue
    }
    this.loginService.post(obj).subscribe(res => {
      this.token = res;
      localStorage.setItem("token", this.token.jwt);
      localStorage.setItem("isLoggedIn", "true");
      this.router.navigateByUrl('/dashboard');
    }, error => {
      this.showError(error);
      this.visible = true;
    })
  }


  togglePasswordVisiblity() {
    this.passwordToggle == 'password' ? this.passwordToggle = 'text' : this.passwordToggle = 'password'
    this.showPassword = !this.showPassword
  }
  showError(error:any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });

  }
}
