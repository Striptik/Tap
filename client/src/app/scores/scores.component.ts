import { Component } from '@angular/core';

import { RequestService } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './scores.component.html',
})
export class ScoresComponent {
  
  scores: Array<any> = [];
  userId: string = '';
  lastTapId: string;

  constructor(private request: RequestService, private auth: AuthService, private router: Router) {
    if (!auth.isLoggedIn()) this.router.navigateByUrl('/');
    this.getScores();
    this.userId = this.auth.getUserId();
    this.lastTapId = this.auth.lastTap.tapId;
  }

  ngOnInit() {
   
  }


  getScores(): any  {
    return this.request.getScores()
      .then(data =>  this.scores = data)
      .catch(error => {
        window.alert('Error : ' + error);
        this.router.navigateByUrl('/me');
      })
  }

}