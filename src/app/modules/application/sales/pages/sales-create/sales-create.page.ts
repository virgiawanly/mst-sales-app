import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, IonFooter } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http.service';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { SalesDetailForm, SalesForm } from '../../components/sales-form/sales-form';
import { SalesFormComponent } from '../../components/sales-form/sales-form.component';

@Component({
  selector: 'app-sales-create',
  templateUrl: './sales-create.page.html',
  styleUrls: ['./sales-create.page.scss'],
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
    SalesFormComponent,
  ],
})
export class SalesCreatePage {
  isSubmitting: boolean = false;
  salesForm: SalesForm = new SalesForm();

  constructor(
    private _httpService: HttpService,
    private _toastController: ToastController,
    private _location: Location,
    private _router: Router,
    private _translateService: TranslateService
  ) {}

  submit() {
    this.salesForm.markAllAsTouched();

    if (this.salesForm.invalid || this.salesForm.disabled || this.isSubmitting) {
      return;
    }

    const details = this.salesForm.get('details')?.value?.map((detail: SalesDetailForm) => {
      return {
        barang_id: detail.get('barang_id')?.value ?? '',
        qty: detail.get('qty')?.value ?? 0,
        diskon_pct: detail.get('diskon_pct')?.value ?? 0,
      };
    });

    if (details.length === 0) {
      this._toastController.dismiss();
      this._toastController
        .create({
          message: this._translateService.instant('please-add-at-least-one-item'),
          duration: 3000,
          position: 'top',
        })
        .then((toast) => toast.present());
      return;
    }

    const payload = {
      tgl: this.salesForm.get('tgl')?.value ?? '',
      cust_id: this.salesForm.get('cust_id')?.value ?? '',
      ongkir: this.salesForm.get('ongkir')?.value ?? 0,
      diskon: this.salesForm.get('diskon')?.value ?? 0,
      details: details,
    };

    this.isSubmitting = true;
    this.salesForm.disable();
    this._httpService
      .post('web/sales', payload)
      .subscribe({
        next: (res: any) => {
          this.salesForm.reset();
          this._router.navigateByUrl('/sales', { replaceUrl: true }).then(() => {
            this._toastController
              .create({
                message: res.message,
                duration: 3000,
                position: 'top',
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
                duration: 3000,
                position: 'top',
              })
              .then((toast) => toast.present());
          }
        },
      })
      .add(() => {
        this.salesForm.enable();
        this.isSubmitting = false;
      });
  }

  back() {
    this._location.back();
  }
}
