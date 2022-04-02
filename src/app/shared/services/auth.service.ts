import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "../models/auth-data.model";
import { UIService } from "../UIService/ui.service";

@Injectable({ providedIn: 'root' })

export class AuthService {
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private uiService: UIService
  ) {}

  initAuthListener() {
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.router.navigate(['/sidenav']);
        // localStorage.setItem('activeLink', 'dashboard');
        this.uiService.showSuccessToast('You are succesfully logged in!', 'Login Successful');
      } else {
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  };

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afauth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result: any) => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error: any) => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showWarningToast(error.message, 'Registration Error');
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afauth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result: any) => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error: any) => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showWarningToast(error.message, 'Login Error');
      });
  }

  logout() {
    this.afauth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
