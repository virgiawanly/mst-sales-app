import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { cubeOutline } from 'ionicons/icons';
import { HttpService } from 'src/app/core/services/http.service';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { Sales } from 'src/types/sales';

@Component({
  selector: 'app-sales-show',
  templateUrl: './sales-show.page.html',
  styleUrls: ['./sales-show.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonSpinner,
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule,
  ],
})
export class SalesShowPage implements OnInit {
  isDeletingSales: boolean = false;
  isLoadingSales: boolean = false;
  sales: Sales | null = null;
  salesId: string | null = null;

  constructor(
    private _httpService: HttpService,
    private _toastController: ToastController,
    private _alertController: AlertController,
    private _location: Location,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _translateService: TranslateService
  ) {
    this.salesId = this._activatedRoute.snapshot.paramMap.get('id');

    addIcons({ cubeOutline });
  }

  ngOnInit() {
    if (this.salesId) {
      this.getSales();
    }
  }

  getSales() {
    this.isLoadingSales = true;
    this._httpService
      .get(`mobile/sales/${this.salesId}`)
      .subscribe({
        next: (res: any) => {
          const sales = res.data ?? null;
          if (sales) {
            this.sales = sales;
          }
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._router.navigateByUrl('/sales').then(() => {
              this._toastController.dismiss();
              this._toastController
                .create({
                  message: error.message,
                  duration: 3000,
                  position: 'top',
                })
                .then((toast) => toast.present());
            });
          }
        },
      })
      .add(() => {
        this.isLoadingSales = false;
      });
  }

  back() {
    this._location.back();
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
    if (this.isDeletingSales || !this.sales) {
      return;
    }

    this.isDeletingSales = true;
    this._httpService
      .delete(`mobile/sales/${this.sales.id}`)
      .subscribe({
        next: (res: any) => {
          this._router.navigateByUrl('/sales').then(() => {
            this._toastController.dismiss();
            this._toastController
              .create({
                message: res.message,
                position: 'top',
                duration: 3000,
              })
              .then((toast) => toast.present());
          });
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
}
