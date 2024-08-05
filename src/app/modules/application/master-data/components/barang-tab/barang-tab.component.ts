import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, ellipsisHorizontal, searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-barang-tab',
  templateUrl: './barang-tab.component.html',
  styleUrls: ['./barang-tab.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class BarangTabComponent {
  constructor() {
    addIcons({ ellipsisHorizontal, add, searchOutline });
  }
}
