import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
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
export class ApplicationLayoutComponent {
  constructor() {
    addIcons({ homeOutline, settingsOutline, listOutline, receiptOutline });
  }
}
