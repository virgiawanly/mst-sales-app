import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { LanguageService } from './core/services/language.service';
import { OverlayService } from './core/services/overlay.service';
import { ThemeService } from './core/services/theme.service';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, FormsModule],
})
export class AppComponent implements OnInit, OnDestroy {
  private _getUserSubscription$?: Subscription;
  private _darkModeSubscription$?: Subscription;
  private _languageSubscription$?: Subscription;

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _overlayService: OverlayService,
    private _themeService: ThemeService,
    private _languageService: LanguageService,
    private _translateService: TranslateService
  ) {}

  ngOnInit() {
    // Subscribe for user auth
    this._getUserSubscription$ = this._authService.observe().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this._userService.loadUserData();
      } else {
        this._userService.setUser(null);
      }
    });

    // Subscribe for app theme
    this._darkModeSubscription$ = this._themeService.isDarkMode$.subscribe((darkMode) => {
      if (darkMode) {
        document.documentElement.classList.add('ion-palette-dark'); // Ionic Class
        document.documentElement.classList.add('dark'); // Tailwind Class
      } else {
        document.documentElement.classList.remove('ion-palette-dark'); // Ionic Class
        document.documentElement.classList.remove('dark'); // Tailwind Class
      }
    });

    // Subscribe for app language
    this._languageSubscription$ = this._languageService.language$.subscribe((language) => {
      if (language) {
        this._translateService.use(language?.match(/id|en/) ? language : 'en');
      }
    });
  }

  ngOnDestroy() {
    if (this._getUserSubscription$) {
      this._getUserSubscription$.unsubscribe();
    }

    if (this._darkModeSubscription$) {
      this._darkModeSubscription$.unsubscribe();
    }

    if (this._languageSubscription$) {
      this._languageSubscription$.unsubscribe();
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this._overlayService.closeAllOverlays();
  }
}
