import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface UsersInterface {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  exp: number;
  taps: Array<TapInterface>
  // iat: number;
}

export interface UsersInfoInterface {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  taps: Array<TapInterface>
}

export interface TapInterface {
  score: number,
  createdAt?: Date,
  updatedAt?: Date,
  userId?: string | UsersInfoInterface
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = '';
  private infos: UsersInterface = null;

  constructor(private router: Router) {
    this.infos = this.extractUsersInformations();
   }

  private extractUsersInformations(): UsersInterface {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    }
    return null;
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
    this.token = token;
    this.infos = this.extractUsersInformations();
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  public getFirstname(): string {
    return this.infos.firstname;
  }

  public getLastname(): string {
    return this.infos.lastname;
  }

  public getEmail(): string {
    return this.infos.email;
  }

  public getExp(): number {
    return this.infos.exp;
  }

  public getUserId(): string {
    return this.infos._id;
  }

  public getTaps(): Array<TapInterface> {
    return this.infos.taps;
  }

  public setTaps(taps: Array<TapInterface>): void {
    this.infos.taps = taps;
  }

  public isLoggedIn(): boolean {
    return this.infos !== null && this.infos.exp && (this.infos.exp > (Date.now() / 1000)) || false;
  }

  public logout(): void {
    this.token = '';
    this.infos = null;
    window.localStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }

}