import { Component } from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  listOutline,
  receiptOutline,
  settingsOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-application-layout',
  templateUrl: './application-layout.component.html',
  styleUrls: ['./application-layout.component.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class ApplicationLayoutComponent {
  constructor() {
    addIcons({ homeOutline, settingsOutline, listOutline, receiptOutline });
  }
}
