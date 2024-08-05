import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  from,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject(false);
  private _isInitialized = new BehaviorSubject(false);

  constructor(
    private _http: HttpClient,
    private _storageService: StorageService
  ) {
    // Check if the user is authenticated by checking the token.
    this._storageService.get(environment.api_token_identifier).then((token) => {
      if (token) {
        this._isAuthenticated.next(true);
      }

      this._isInitialized.next(true);
    });
  }

  /**
   * Set the API token in the storage.
   *
   * @param {string | null} token
   * @returns Promise<any>
   */
  setApiToken(token: string | null) {
    return new Promise((resolve) => {
      if (token) {
        this._storageService
          .set(environment.api_token_identifier, token)
          .then(() => resolve(true));
      } else {
        this._storageService.remove(environment.api_token_identifier);
        resolve(true);
      }
    });
  }

  /**
   * Verify the user phone number and send OTP code.
   *
   * @param {Object} credentials
   * @param {string} credentials.phone_number
   * @param {string} credentials.dial_code
   * @returns Observable<any>
   */
  verifyPhoneNumber(credentials: {
    phone_number: string;
    dial_code: string;
  }): Observable<any> {
    if (this._isAuthenticated.getValue()) {
      return throwError(() => new Error('User is already logged in.'));
    }

    return this._http.post(
      `${environment.api_url}/mobile/auth/login/verify-phone-number`,
      credentials
    );
  }

  /**
   *  Verify the OTP code received by the user.
   *
   * @param {Object} credentials
   * @param {string} credentials.phone_number
   * @param {string} credentials.dial_code
   * @param {string} credentials.otp
   */
  verifyOTP(credentials: {
    phone_number: string;
    dial_code: string;
    otp: string;
  }): Observable<any> {
    if (this._isAuthenticated.getValue()) {
      return throwError(() => new Error('User is already logged in.'));
    }

    return this._http
      .post(`${environment.api_url}/mobile/auth/login/verify-otp`, credentials)
      .pipe(
        switchMap((res: any) => {
          this.setApiToken(res.data.token);
          this._isAuthenticated.next(true);

          return of(res);
        })
      );
  }

  /**
   * Login the user using the token.
   *
   * @param {string} token
   * @returns Observable<any>
   */
  loginUsingToken(token: string): Observable<any> {
    if (this._isAuthenticated.getValue()) {
      return throwError(() => new Error('User is already logged in.'));
    }

    return from(
      new Promise((resolve) => {
        this.setApiToken(token);
        this._isAuthenticated.next(true);
        resolve(true);
      })
    );
  }

  /**
   * Logout the user.
   *
   * @returns Observable<boolean>
   */
  logout(): Observable<boolean> {
    this.setApiToken(null);
    this._isAuthenticated.next(false);

    return of(true);
  }

  /**
   * Check if the user is authenticated.
   *
   * @return boolean
   */
  check(): boolean {
    return this._isAuthenticated.getValue();
  }

  /**
   * Observe the authentication status.
   *
   * @return Observable<boolean>
   */
  observe(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  /**
   * Check if the service is initialized.
   *
   * @return Observable<boolean>
   */
  isInitialized(): Observable<boolean> {
    return this._isInitialized.asObservable();
  }
}
