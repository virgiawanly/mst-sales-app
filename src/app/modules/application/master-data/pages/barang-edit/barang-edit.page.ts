import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonBackButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http.service';
import { Barang } from 'src/types/barang';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { BarangForm } from '../../components/barang-form/barang-form';
import { BarangFormComponent } from '../../components/barang-form/barang-form.component';

@Component({
  selector: 'app-barang-edit',
  templateUrl: './barang-edit.page.html',
  styleUrls: ['./barang-edit.page.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
    BarangFormComponent,
  ],
})
export class BarangEditPage implements OnInit {
  isLoadingBarang: boolean = false;
  isSubmitting: boolean = false;
  barang: Barang | null = null;
  barangForm: BarangForm = new BarangForm();
  barangId: string | null = null;

  constructor(
    private _location: Location,
    private _httpService: HttpService,
    private _toastController: ToastController,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
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
    this.barangForm.disable();
    this._httpService
      .get(`mobile/barang/${this.barangId}`)
      .subscribe({
        next: (res: any) => {
          const barang = res.data ?? null;
          if (barang) {
            const formValue = {
              nama: barang.nama,
              kode: barang.kode,
              harga: barang.harga,
            };

            this.barang = barang;
            this.barangForm.patchValue(formValue);
          }
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastController.dismiss();
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
      .add(() => {
        this.barangForm.enable();
        this.isLoadingBarang = false;
      });
  }

  submit() {
    this.barangForm.markAllAsTouched();

    if (!this.barang || this.barangForm.invalid || this.barangForm.disabled || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.barangForm.disable();
    this._httpService
      .put(`mobile/barang/${this.barangId}`, this.barangForm.value)
      .subscribe({
        next: (res: any) => {
          this._router.navigateByUrl('/master-data').then(() => {
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
            this._toastController.dismiss();
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
      .add(() => {
        this.barangForm.enable();
        this.isSubmitting = false;
      });
  }

  back() {
    this._location.back();
  }
}
