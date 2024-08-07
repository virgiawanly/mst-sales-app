import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  AlertController,
  IonActionSheet,
  IonIcon,
  IonInfiniteScroll,
  ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal } from 'ionicons/icons';
import { HttpService } from 'src/app/core/services/http.service';
import { Customer } from 'src/types/customers';
import { HttpFormattedErrorResponse } from 'src/types/http';

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.component.html',
  styleUrls: ['./customer-card.component.scss'],
  standalone: true,
  imports: [IonActionSheet, IonInfiniteScroll, IonIcon, RouterModule, CommonModule, TranslateModule],
})
export class CustomerCardComponent {
  @Input({ required: true }) customer!: Customer;
  @Output() deleted: EventEmitter<Customer> = new EventEmitter<Customer>();

  isDeletingCustomer: boolean = false;
  isActionSheetOpen: boolean = false;
  actionSheetButtons: any[] = [];

  constructor(
    private _router: Router,
    private _httpService: HttpService,
    private _translateService: TranslateService,
    private _alertController: AlertController,
    private _toastController: ToastController
  ) {
    addIcons({ ellipsisHorizontal });
    this.actionSheetButtons = [
      {
        text: this._translateService.instant('Edit'),
        data: { action: 'edit' },
      },
      {
        text: this._translateService.instant('Delete'),
        role: 'destructive',
        data: { action: 'delete' },
      },
      {
        text: this._translateService.instant('Cancel'),
        role: 'cancel',
        data: { action: 'cancel' },
      },
    ];
  }

  getNameInitials(name: string): string {
    return name
      .split(' ')
      .map((name) => name.charAt(0))
      .slice(0, 2)
      .join('');
  }

  handleActionSheet(event: any) {
    this.isActionSheetOpen = false;
    const action = event.detail?.data?.action;

    if (action === 'edit') {
      // Let the action sheet close before navigating to the edit page
      setTimeout(() => {
        this._router.navigate([`/master-data/customers/${this.customer.id}/edit`]);
      });
    } else if (action === 'delete') {
      this.openDeleteConfirmation();
    }
  }

  openDeleteConfirmation() {
    this._alertController
      .create({
        header: this._translateService.instant('delete'),
        message: this._translateService.instant('are-you-sure-want-to-delete-this-data?'),
        buttons: [
          {
            text: this._translateService.instant('cancel'),
            role: 'cancel',
          },
          {
            text: this._translateService.instant('delete'),
            role: 'destructive',
            handler: () => this.deleteCustomer(),
          },
        ],
      })
      .then((alert) => alert.present());
  }

  deleteCustomer() {
    if (this.isDeletingCustomer) {
      return;
    }

    this.isDeletingCustomer = true;
    this._httpService
      .delete(`mobile/customer/${this.customer.id}`)
      .subscribe({
        next: (res: any) => {
          this.deleted.emit(this.customer);
          this._toastController
            .create({
              message: res.message,
              position: 'top',
              duration: 3000,
            })
            .then((toast) => toast.present());
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastController
              .create({
                message: error.message,
                position: 'top',
                duration: 3000,
              })
              .then((toast) => toast.present());
          }
        },
      })
      .add(() => (this.isDeletingCustomer = false));
  }

  openActionSheet() {
    this.isActionSheetOpen = true;
  }
}
