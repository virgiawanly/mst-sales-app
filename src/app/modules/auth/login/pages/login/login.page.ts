import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, isPlatform } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { LoginForm } from './login-form';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginPage {
  isLoggingIn: boolean = false;
  loginForm: LoginForm = new LoginForm();
  errorMessage: string | null = null;
  year = new Date().getFullYear();

  constructor(
    private _authService: AuthService,
    private _alertController: AlertController,
    private _router: Router
  ) {}

  ionViewWillEnter() {
    if (isPlatform('mobile')) {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#4a3cf1' });
    }
  }

  login() {
    this.loginForm.markAllAsTouched();
    this.errorMessage = null;

    if (this.loginForm.invalid || this.loginForm.disabled || this.isLoggingIn) {
      return;
    }

    this.loginForm.disable();
    this.isLoggingIn = true;
    this._authService
      .login(this.loginForm.value)
      .subscribe({
        next: (res: any) => {
          this._router.navigateByUrl('/application', {
            replaceUrl: true,
          });
        },
        error: (error: HttpFormattedErrorResponse) => {
          this._alertController
            .create({
              header: 'Failed',
              message: error.message,
              buttons: ['OK'],
            })
            .then((alert) => alert.present());
        },
      })
      .add(() => {
        this.loginForm.enable();
        this.isLoggingIn = false;
      });
  }
}
