import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "../models/auth-data.model";
import { UIService } from "../UIService/ui.service";

@Injectable({ providedIn: 'root' })

export class AuthService {
  private isAuthenticated = false;
  isAlreadyLogin = false;

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private uiService: UIService
  ) {}

  initAuthListener() {
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;

        if(this.isAlreadyLogin == false){
          this.router.navigate(['/sidenav']);
          this.isAlreadyLogin = true;
        }

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
    this.isAlreadyLogin = false;
    this.uiService.showSuccessToast('You are succesfully logged out!', 'Logout Successful');
  }

  onForgotPassword(email: string){
    this.afauth.sendPasswordResetEmail(email).then(() => {
      this.uiService.showSuccessToast("Password reset email has been sent to: " + email + '!', "Success")
    }, err => {
      this.uiService.showErrorToast("no email found, or something went wrong", "Error")
    })
  }


  isAuth() {
    return this.isAuthenticated;
  }
}
