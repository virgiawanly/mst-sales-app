import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { HttpFormattedErrorResponse } from 'src/types/http';
import { BarangForm } from '../../components/barang-form/barang-form';
import { BarangFormComponent } from '../../components/barang-form/barang-form.component';

@Component({
  selector: 'app-barang-create',
  templateUrl: './barang-create.page.html',
  styleUrls: ['./barang-create.page.scss'],
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
    BarangFormComponent,
    TranslateModule,
  ],
})
export class BarangCreatePage {
  isSubmitting: boolean = false;
  barangForm: BarangForm = new BarangForm();

  constructor(
    private _location: Location,
    private _httpService: HttpService,
    private _toastController: ToastController,
    private _router: Router
  ) {}

  submit() {
    this.barangForm.markAllAsTouched();

    if (this.barangForm.invalid || this.barangForm.disabled || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.barangForm.disable();
    this._httpService
      .post('web/barang', this.barangForm.value)
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
