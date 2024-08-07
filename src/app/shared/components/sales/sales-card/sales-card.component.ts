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
import { HttpFormattedErrorResponse } from 'src/types/http';
import { Sales } from 'src/types/sales';

@Component({
  selector: 'app-sales-card',
  templateUrl: './sales-card.component.html',
  styleUrls: ['./sales-card.component.scss'],
  standalone: true,
  imports: [IonActionSheet, IonInfiniteScroll, IonIcon, RouterModule, CommonModule, TranslateModule],
})
export class SalesCardComponent {
  @Input({ required: true }) sales!: Sales;
  @Output() deleted: EventEmitter<Sales> = new EventEmitter<Sales>();

  isDeletingSales: boolean = false;
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
        this._router.navigate([`/sales/${this.sales.id}/edit`]);
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
            handler: () => this.deleteSales(),
          },
        ],
      })
      .then((alert) => alert.present());
  }

  deleteSales() {
    if (this.isDeletingSales) {
      return;
    }

    this.isDeletingSales = true;
    this._httpService
      .delete(`mobile/sales/${this.sales.id}`)
      .subscribe({
        next: (res: any) => {
          this.deleted.emit(this.sales);
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
      .add(() => (this.isDeletingSales = false));
  }

  openActionSheet() {
    this.isActionSheetOpen = true;
  }
}
