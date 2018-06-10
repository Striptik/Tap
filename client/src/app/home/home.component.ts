import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './home.component.html',
})

export class HomeComponent {
  private showRegister = false;
  private showLogin = true;

  constructor(private auth: AuthService, private router: Router) {
    if (auth.isLoggedIn()) this.router.navigateByUrl('/me');
  }

  toggleComponent(type) {
    if (type === 'login') {
      this.showLogin = true;
      this.showRegister = false;
    } else {
      this.showLogin = false;
      this.showRegister = true;
    }
  }

}