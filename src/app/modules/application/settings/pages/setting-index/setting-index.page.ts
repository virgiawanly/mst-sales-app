import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { exitOutline, languageOutline, sunnyOutline } from 'ionicons/icons';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LanguageService } from 'src/app/core/services/language.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/types/users';

@Component({
  selector: 'app-setting-index',
  templateUrl: './setting-index.page.html',
  styleUrls: ['./setting-index.page.scss'],
  standalone: true,
  imports: [
    IonToggle,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
})
export class SettingIndexPage implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();

  user: User | null = null;
  language: string = 'en';
  isDarkMode: boolean = false;

  constructor(
    private _userService: UserService,
    private _themeService: ThemeService,
    private _alertController: AlertController,
    private _translateService: TranslateService,
    private _authService: AuthService,
    private _router: Router,
    private _languageService: LanguageService
  ) {
    addIcons({ sunnyOutline, languageOutline, exitOutline });
  }

  ngOnInit() {
    this._userService.user$.pipe(takeUntil(this._unsubscribe$)).subscribe((user) => {
      this.user = user;
    });

    this._themeService.isDarkMode$.pipe(takeUntil(this._unsubscribe$)).subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });

    this._languageService.language$.pipe(takeUntil(this._unsubscribe$)).subscribe((language) => {
      this.language = language;
    });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  getNameInitials(name: string): string {
    return name
      .split(' ')
      .map((name) => name.charAt(0))
      .slice(0, 2)
      .join('');
  }

  onDarkModeToggleChange(isDarkMode: boolean) {
    this._themeService.setDarkMode(isDarkMode);
  }

  onLanguageChange(lang: string) {
    this.language = lang;
    this._languageService.setLanguage(lang);
  }

  openLogoutConfirmation() {
    this._alertController
      .create({
        header: 'Logout',
        message: this._translateService.instant('are-you-sure-want-to-logout?'),
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Logout',
            handler: () => {
              this.logout();
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  logout() {
    this._authService.logout().subscribe(() => {
      this._userService.clearUserDataFromStorage();
      this._router.navigateByUrl('/auth', {
        replaceUrl: true,
      });
    });
  }
}
