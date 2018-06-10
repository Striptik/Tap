import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RequestService } from '../../services/request.service';

@Component({
  templateUrl: './register.component.html',
  selector: 'form-register',
})

export class RegisterComponent {

  private requestError = '';
  private passwordError = '';
  private emailError = '';
  private firstnameError = '';
  private lastnameError = '';
  private cguError = '';
  private email: string = '';
  private password: string = '';
  private firstname: string = '';
  private lastname: string = '';
  private cgu: Boolean = false;


  constructor(private request: RequestService, private router: Router) { }

  register() {
    const checkE = this.checkEmail();
    const checkP = this.checkPassword();
    const checkF = this.checkFirstname();
    const checkL = this.checkLastname();
    const checkC = this.checkCGU();

    if (checkE && checkP && checkF && checkL && checkC) {
      const user = {
        email: this.email,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname,
      }
      this.request.register(user)
        .then(
          () => this.router.navigateByUrl('/me'),
          (err) => this.setRequestError(err)
        )
    }
  }

  checkEmail() {
    if (this.email.length === 0) {
      this.emailError = 'Complicated without it';
      return false;
    }
    if (!(/^(([^<>()\[\]\\.,;:\s@“]+(\.[^<>()\[\]\\.,;:\s@“]+)*)|(“.+“))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email))) {
      this.emailError = 'A real email please';
      return false;
    }
    return true;
  }

  checkPassword() {
    if (this.password.length < 8) {
      this.passwordError = 'At least 8 characters, RGPD bro';
      return false;
    }
      if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/).test(this.password)) {
        this.passwordError = 'a digit, lower, upper and special char mini, thanks to RGPD';
        return false;
      }
    return true;
  }

  checkFirstname() {
    if (this.firstname.length === 0) {
      this.firstnameError = 'I know that you have a firstname';
      return false;
    }
    if (!(/^[A-Za-zéàîêôïöôè \-]+$/.test(this.firstname))) {
      this.firstnameError = 'A real firstname please';
      return false;
    }
    return true;
  }

  checkLastname() {
    if (this.lastname.length === 0) {
      this.lastnameError = 'I know that you have a lastname';
      return false;
    }
    if (!(/^[A-Za-zéàîêôïöôè \-]+$/.test(this.lastname))) {
      this.lastnameError = 'A real lastname please';
      return false;
    }
    return true;
  }

  checkCGU() {
    if (this.cgu === false) {
      this.cguError = 'No Arm, no chocolate !'
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
      case 'lastname':
        this.lastnameError = '';
        break;
      case 'firstname':
        this.firstnameError = '';
        break;
      case 'cgu':
        this.cguError = '';
        break;
    }
  }


}