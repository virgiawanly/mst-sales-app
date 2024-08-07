import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  isPlatform,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { homeOutline, listOutline, receiptOutline, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-application-layout',
  templateUrl: './application-layout.component.html',
  styleUrls: ['./application-layout.component.scss'],
  standalone: true,
  imports: [
    IonRouterOutlet,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    RouterModule,
    TranslateModule,
    CommonModule,
  ],
})
export class ApplicationLayoutComponent implements OnInit {
  constructor() {
    addIcons({ homeOutline, settingsOutline, listOutline, receiptOutline });
  }

  ngOnInit() {
    if (isPlatform('mobile')) {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#4a3cf1' });
    }
  }
}
