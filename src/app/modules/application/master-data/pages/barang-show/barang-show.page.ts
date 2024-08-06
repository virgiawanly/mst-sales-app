import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonContent,
  IonHeader,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http.service';
import { Barang } from 'src/types/barang';
import { HttpFormattedErrorResponse } from 'src/types/http';

@Component({
  selector: 'app-barang-show',
  templateUrl: './barang-show.page.html',
  styleUrls: ['./barang-show.page.scss'],
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
export class BarangShowPage implements OnInit {
  isLoadingBarang: boolean = false;
  isDeletingBarang: boolean = false;
  barang: Barang | null = null;
  barangId: string | null = null;

  constructor(
    private _location: Location,
    private _httpService: HttpService,
    private _toastController: ToastController,
    private _alertController: AlertController,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _translateService: TranslateService
  ) {
    this.barangId = this._activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.barangId) {
      this.getBarang();
    } else {
      this._router.navigateByUrl('/master-data', { replaceUrl: true });
    }
  }

  getBarang() {
    this.isLoadingBarang = true;
    this._httpService
      .get(`web/barang/${this.barangId}`)
      .subscribe({
        next: (res: any) => {
          this.barang = res.data ?? null;
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
        this.isLoadingBarang = false;
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
            handler: () => this.deleteBarang(),
          },
        ],
      })
      .then((alert) => alert.present());
  }

  deleteBarang() {
    if (this.isDeletingBarang || !this.barang) {
      return;
    }

    this.isDeletingBarang = true;
    this._httpService
      .delete(`web/barang/${this.barang.id}`)
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
      .add(() => (this.isDeletingBarang = false));
  }

  back() {
    this._location.back();
  }
}
