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
import { Customer } from 'src/types/customers';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { CustomerForm } from '../../components/customer-form/customer-form';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.page.html',
  styleUrls: ['./customer-edit.page.scss'],
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
    CustomerFormComponent,
  ],
})
export class CustomerEditPage implements OnInit {
  isLoadingCustomer: boolean = false;
  isSubmitting: boolean = false;
  customer: Customer | null = null;
  customerForm: CustomerForm = new CustomerForm();
  customerId: string | null = null;

  constructor(
    private _location: Location,
    private _httpService: HttpService,
    private _toastController: ToastController,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
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
    this.customerForm.disable();
    this._httpService
      .get(`mobile/customer/${this.customerId}`)
      .subscribe({
        next: (res: any) => {
          const customer = res.data ?? null;
          if (customer) {
            const formValue = {
              nama: customer.nama,
              kode: customer.kode,
              telp: customer.telp,
            };

            this.customer = customer;
            this.customerForm.patchValue(formValue);
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
        this.customerForm.enable();
        this.isLoadingCustomer = false;
      });
  }

  submit() {
    this.customerForm.markAllAsTouched();

    if (!this.customer || this.customerForm.invalid || this.customerForm.disabled || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.customerForm.disable();
    this._httpService
      .put(`mobile/customer/${this.customerId}`, this.customerForm.value)
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
