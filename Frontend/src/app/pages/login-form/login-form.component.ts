import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  myForm!: FormGroup
  togglePassword: Boolean = false
  usersArray: any

  constructor(private formbuilder: FormBuilder, private router: Router, private service: LoginService) { }

  ngOnInit(): void {
    this.myForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
    this.getUsers()
  }

  getUsers() {
    this.service.getUsers().subscribe(res => {
      this.usersArray = res
    })
  }

  submit(loginForm: FormGroup) {
    debugger
    let user = {
      email: loginForm.value.email,
      password: loginForm.value.password
    }
    for (let i = 0; i < this.usersArray.length; i++) {
      debugger
      if (this.usersArray[i].email == user.email && this.usersArray[i].password == user.password) {
        this.service.updateLoginUser(user).subscribe()
      }
    }
    for (let i = 0; i < this.usersArray.length; i++) {
      // const element = array[i];
      if (this.usersArray[i].email != user.email && this.usersArray[i].password != user.password) {
        this.service.addUser(user).subscribe()
        this.service.updateLoginUser(user).subscribe()
      }
    }
    if (this.usersArray.length == 0) {
      this.service.addUser(user).subscribe()
      this.service.loginUser(user).subscribe()
    }
    this.myForm.reset()
    this.router.navigateByUrl('/')
  }

  showPassword() {
    this.togglePassword = !this.togglePassword
  }

}
