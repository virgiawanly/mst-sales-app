import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal } from 'ionicons/icons';

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.component.html',
  styleUrls: ['./customer-card.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class CustomerCardComponent {
  constructor() {
    addIcons({ ellipsisHorizontal });
  }
}
