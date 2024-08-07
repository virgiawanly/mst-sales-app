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
import { cubeOutline, ellipsisHorizontal } from 'ionicons/icons';
import { HttpService } from 'src/app/core/services/http.service';
import { Barang } from 'src/types/barang';
import { HttpFormattedErrorResponse } from 'src/types/http';

@Component({
  selector: 'app-barang-card',
  templateUrl: './barang-card.component.html',
  styleUrls: ['./barang-card.component.scss'],
  standalone: true,
  imports: [IonActionSheet, IonInfiniteScroll, IonIcon, RouterModule, CommonModule, TranslateModule],
})
export class BarangCardComponent {
  @Input({ required: true }) barang!: Barang;
  @Output() deleted: EventEmitter<Barang> = new EventEmitter<Barang>();

  isDeletingBarang: boolean = false;
  isActionSheetOpen: boolean = false;
  actionSheetButtons: any[] = [];

  constructor(
    private _router: Router,
    private _httpService: HttpService,
    private _translateService: TranslateService,
    private _alertController: AlertController,
    private _toastController: ToastController
  ) {
    addIcons({ ellipsisHorizontal, cubeOutline });

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

  handleActionSheet(event: any) {
    this.isActionSheetOpen = false;
    const action = event.detail?.data?.action;

    if (action === 'edit') {
      // Let the action sheet close before navigating to the edit page
      setTimeout(() => {
        this._router.navigate([`/master-data/barang/${this.barang.id}/edit`]);
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
            handler: () => this.deleteBarang(),
          },
        ],
      })
      .then((alert) => alert.present());
  }

  deleteBarang() {
    if (this.isDeletingBarang) {
      return;
    }

    this.isDeletingBarang = true;
    this._httpService
      .delete(`mobile/barang/${this.barang.id}`)
      .subscribe({
        next: (res: any) => {
          this.deleted.emit(this.barang);
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
      .add(() => (this.isDeletingBarang = false));
  }

  openActionSheet() {
    this.isActionSheetOpen = true;
  }
}
