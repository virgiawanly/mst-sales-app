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
import { CustomerForm } from '../../components/customer-form/customer-form';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.page.html',
  styleUrls: ['./customer-create.page.scss'],
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
    CustomerFormComponent,
    TranslateModule,
  ],
})
export class CustomerCreatePage {
  isSubmitting: boolean = false;
  customerForm: CustomerForm = new CustomerForm();

  constructor(
    private _location: Location,
    private _httpService: HttpService,
    private _toastController: ToastController,
    private _router: Router
  ) {}

  submit() {
    this.customerForm.markAllAsTouched();

    if (this.customerForm.invalid || this.customerForm.disabled || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.customerForm.disable();
    this._httpService
      .post('web/customer', this.customerForm.value)
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
        this.customerForm.enable();
        this.isSubmitting = false;
      });
  }

  back() {
    this._location.back();
  }
}
