import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, cubeOutline, peopleOutline } from 'ionicons/icons';
import { BarangTabComponent } from '../../components/barang-tab/barang-tab.component';
import { CustomerTabComponent } from '../../components/customer-tab/customer-tab.component';

@Component({
  selector: 'app-master-data-index',
  templateUrl: './master-data-index.page.html',
  styleUrls: ['./master-data-index.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    CommonModule,
    FormsModule,
    RouterModule,
    CustomerTabComponent,
    BarangTabComponent,
    TranslateModule,
  ],
})
export class MasterDataIndexPage {
  activeTab: 'customer' | 'barang' = 'customer';

  constructor() {
    addIcons({ add, peopleOutline, cubeOutline });
  }

  selectTab(tab: 'customer' | 'barang') {
    this.activeTab = tab;
  }
}
