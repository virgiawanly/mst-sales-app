import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonIcon, IonInfiniteScroll } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal } from 'ionicons/icons';
import { Customer } from 'src/types/customers';

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.component.html',
  styleUrls: ['./customer-card.component.scss'],
  standalone: true,
  imports: [IonInfiniteScroll, IonIcon, RouterModule],
})
export class CustomerCardComponent {
  @Input({ required: true }) customer!: Customer;

  constructor() {
    addIcons({ ellipsisHorizontal });
  }

  getNameInitials(name: string): string {
    return name
      .split(' ')
      .map((name) => name.charAt(0))
      .slice(0, 2)
      .join('');
  }
}
