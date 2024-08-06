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
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http.service';
import { Customer } from 'src/types/customers';
import { HttpFormattedErrorResponse } from 'src/types/http';

@Component({
  selector: 'app-customer-show',
  templateUrl: './customer-show.page.html',
  styleUrls: ['./customer-show.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSpinner,
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule,
  ],
})
export class CustomerShowPage implements OnInit {
  isLoadingCustomer: boolean = false;
  isDeletingCustomer: boolean = false;
  customer: Customer | null = null;
  customerId: string | null = null;

  constructor(
    private _location: Location,
    private _httpService: HttpService,
    private _toastController: ToastController,
    private _alertController: AlertController,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _translateService: TranslateService
  ) {
    this.customerId = this._activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.customerId) {
      this.getCustomer();
    } else {
      this._router.navigateByUrl('/master-data', { replaceUrl: true });
    }
  }

  getCustomer() {
    this.isLoadingCustomer = true;
    this._httpService
      .get(`web/customer/${this.customerId}`)
      .subscribe({
        next: (res: any) => {
          this.customer = res.data ?? null;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._router.navigateByUrl('/master-data', { replaceUrl: true }).then(() => {
              this._toastController
                .create({
                  message: error.message,
                  position: 'top',
                  duration: 3000,
                })
                .then((toast) => toast.present());
            });
          }
        },
      })
      .add(() => {
        this.isLoadingCustomer = false;
      });
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
    if (this.isDeletingCustomer || !this.customer) {
      return;
    }

    this.isDeletingCustomer = true;
    this._httpService
      .delete(`web/customer/${this.customer.id}`)
      .subscribe({
        next: (res: any) => {
          this._router.navigateByUrl('/master-data', { replaceUrl: true }).then(() => {
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
      .add(() => (this.isDeletingCustomer = false));
  }

  back() {
    this._location.back();
  }
}
