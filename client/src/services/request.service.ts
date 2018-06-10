import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJs from 'crypto-js';
import { AuthService } from './auth.service';


export interface RegisterInterface {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface LoginInterface {
  email: string;
  password: string;
}

export interface ResponseInterface {
  data: any,
  message: string,
  error: object
}

export interface ErrorInterface {
  error: {
    data: any,
    message: string,
    error: any
  }
  status: number;
}

export interface HeaderAuthInterface {
  headers: {
    Authorization: string
  }
}


const urls = {
  register: '/api/user/new',
  login: '/api/user/login',
  myScore: '/api/user/myScore',
  tap: '/api/tap/new',
  scores: '/api/tap/scores',
};



@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  private setAuthorization(): HeaderAuthInterface {
    return { headers: { Authorization: `Bearer ${this.auth.getToken()}`, } };
  }

  private createSecret(score: number): any {
    return btoa(`${score}:${this.auth.getFirstname()}:${this.auth.getLastname()}/${this.auth.getUserId()}`)
    // return CryptoJs.SHA256(`${score}:${this.auth.getFirstname()}:${this.auth.getLastname()}/${this.auth.getUserId()}`);
  }

  public register(user: RegisterInterface): Promise<object> {
    return this.http.post(urls.register, user).toPromise().then(
      (resp: ResponseInterface) => {
        const { token } = resp.data;
        this.auth.setToken(token);
        return Promise.resolve(resp.data);
      },
      (error: ErrorInterface) => {
        if (error.error.err.code === 11000) {
          return Promise.reject('Email Already exists !');
        }
        return Promise.reject(error.error.message)
      }
    );
  }

  public login(user: LoginInterface): Promise<object> {
    return this.http.post(urls.login, user).toPromise().then(
      (resp: ResponseInterface) => {
        const { token } = resp.data;
        this.auth.setToken(token);
        return Promise.resolve(resp.data);
      },
      (error: ErrorInterface) => Promise.reject(error.error.message)
    );
  }

  public newScore(score: number): Promise<any> {
    const secret = this.createSecret(score);
    const newTap = { secret, score }
    const headers = this.setAuthorization();
    return this.http.post(urls.tap, newTap, headers).toPromise().then(
      (resp: ResponseInterface) => Promise.resolve(resp.data),
      (error: ErrorInterface) => Promise.reject(error.error.message)
    );
  }

  public getScores(): Promise<any> {
    const headers = this.setAuthorization();
    return this.http.get(urls.scores, headers).toPromise().then(
      (resp: ResponseInterface) => Promise.resolve(resp.data),
      (error: ErrorInterface) => Promise.reject(error.error.message)
    );
  }

  public getMyScore(): Promise<object> {
    const headers = this.setAuthorization();
    return this.http.get(urls.myScore, headers).toPromise().then(
      (resp: ResponseInterface) =>  Promise.resolve(resp.data),
      (error: ErrorInterface) => Promise.reject(error.error.message)
    );
  }
};