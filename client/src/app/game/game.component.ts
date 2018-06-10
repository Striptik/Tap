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
  display = 'game';
  button = 'my taps'
  sort = 'by score';
  lastTapId: string;

  constructor(private auth: AuthService, private request: RequestService, private router: Router) {

    if (!auth.isLoggedIn()) this.router.navigateByUrl('/');
    this.taps = auth.getTaps();
    this.lastTapId = this.auth.lastTap.tapId;
  }

  handleDisplay() {
    this.display = this.display === 'game' ? 'my taps' : 'game';
    this.button = this.button === 'game' ? 'my taps' : 'game';
  }

  handleSort() {
    if (this.sort === 'by date') {
      this.taps.sort((a: any, b: any) =>  +(new Date(b.created)) - (+new Date(a.created)));
      this.sort = 'by score';
    } else {
      this.taps.sort((a, b) => b.score - a.score)
      this.sort = 'by date';
    }
  }

  decrease() {
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
    document.querySelector('body').style.cssText = `--time: ${(this.time + 0.5) * 1000}ms`;
    document.getElementById('progress').className += ' start';
  }

  finish() {
    clearInterval(this.interval);
    this.request.newScore(this.score).then(
      (newUser) => {
        this.auth.lastTap = newUser.taps[0];
        this.auth.setTaps = newUser.taps;
        this.router.navigateByUrl('/tap');
      },
      (error) => window.alert('Error when triyng to register the score')
    );
  } 
}