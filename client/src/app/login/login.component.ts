import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RequestService } from '../../services/request.service';

@Component({
  templateUrl: './login.component.html',
  selector: 'form-login'
})

export class LoginComponent {

  private requestError = '';
  private passwordError = '';
  private emailError = '';
  private email: string = '';
  private password: string = '';

  constructor(private request: RequestService, private router: Router) { }

  login() { 
    const checkE = this.checkEmail();
    const checkP = this.checkPassword();
    if (checkE && checkP) {
      this.request.login({ email: this.email, password: this.password })
        .then(
          (data) => this.router.navigateByUrl('/me'),
          (err) => this.setRequestError(err)
        )
    }
  }

  checkEmail() {
    if (this.email.length === 0) {
      this.emailError = 'Cannot be empty';
      return false;
    }
    if (!(/^(([^<>()\[\]\\.,;:\s@“]+(\.[^<>()\[\]\\.,;:\s@“]+)*)|(“.+“))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email))) {
      this.emailError = 'Bad format !';
      return false;
    }
    return true;
  }

  checkPassword() {
    if (this.password.length < 8) {
      this.passwordError = 'At least 8 characters';
      return false;
    }
    if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/).test(this.password)) {
      this.passwordError = 'At least one digit, lower, upper and special char';
      return false;
    }
    return true;
  }

  setRequestError(msg) {
    this.requestError = msg;
  }

  handleChange(type) {
    switch (type) {
      case 'email':
        this.emailError = '';
        break;
      case 'password':
        this.passwordError = '';
        break;
    }
  }


}