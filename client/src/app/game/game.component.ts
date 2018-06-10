import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';

@Component({
  templateUrl: './game.component.html',
})

export class GameComponent {

  score = 0;
  time = 10;
  interval = null;
  taps = null;
  io = true;
  constructor(private auth: AuthService, private request: RequestService, private router: Router) {
    if (!auth.isLoggedIn) this.router.navigateByUrl('/');
    // this.taps = auth.getTaps();
    // console.log(this.taps);
  }

  decrease() {
    console.log('TIME -> ', this.time);
    this.time--;
    if (!this.time) this.finish();
  }

  tap() {
    if (!this.score) {
      this.interval = setInterval(this.decrease.bind(this), 1000);
      this.animate();
    }

    if (this.time > 0) {
      this.score++;
      this.io = !this.io;
    }
  }

  animate() {
    document.querySelector('body').style.cssText = `--time: ${this.time * 1000}ms`;
    document.getElementById('progress').className += ' start';
  }

  finish() {
    clearInterval(this.interval);
    this.request.newScore(this.score).then(
      (newUser) => {
        console.log('New SCore success ->', newUser);
        this.router.navigateByUrl('/tap');
      },
      (error) => {
        console.log('Error New Score ->', error);
        window.alert('Error when triyng to register the score');
      }
    );
  } 
}