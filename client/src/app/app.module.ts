import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { RequestService } from '../services/request.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GameComponent } from './game/game.component';
import { ScoresComponent } from './scores/scores.component';


const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'me', component: GameComponent },
  { path: 'tap', component: ScoresComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    GameComponent,
    ScoresComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [AuthService, RequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
