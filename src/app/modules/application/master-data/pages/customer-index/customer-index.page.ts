import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-customer-index',
  templateUrl: './customer-index.page.html',
  styleUrls: ['./customer-index.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CustomerIndexPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
