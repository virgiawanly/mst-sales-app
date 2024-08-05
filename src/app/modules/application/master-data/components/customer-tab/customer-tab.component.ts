import { Component, OnInit } from '@angular/core';
import { RefresherCustomEvent, ToastController } from '@ionic/angular';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';
import { HttpService } from 'src/app/core/services/http.service';
import { CustomerCardComponent } from 'src/app/shared/components/customers/customer-card/customer-card.component';
import { Customer } from 'src/types/customers';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { Pagination } from 'src/types/pagination';

@Component({
  selector: 'app-customer-tab',
  templateUrl: './customer-tab.component.html',
  styleUrls: ['./customer-tab.component.scss'],
  standalone: true,
  imports: [IonIcon, CustomerCardComponent],
})
export class CustomerTabComponent implements OnInit {
  isLoadingCustomers: boolean = false;
  customers: Customer[] = [];
  customersSearch: string = '';
  customersPagination: Pagination = {
    size: 10,
    totalItems: 0,
    totalPages: 0,
    page: 1,
  };

  constructor(
    private _httpService: HttpService,
    private _toastController: ToastController
  ) {
    addIcons({ searchOutline });
  }

  ngOnInit() {
    this.getCustomers();
  }

  getCustomers(loadMore: boolean = false) {
    return new Promise((resolve, reject) => {
      this.isLoadingCustomers = true;
      this._httpService
        .get('web/customer', {
          params: {
            size: this.customersPagination.size,
            page: this.customersPagination.page,
            search: this.customersSearch ?? '',
          },
        })
        .subscribe({
          next: (res: any) => {
            if (loadMore) {
              const newCustomers = res.data.data || [];
              this.customers = [...this.customers, ...newCustomers];
            } else {
              this.customers = res.data.data || [];
            }

            this.customersPagination.page = res.data.current_page;
            this.customersPagination.totalItems = res.data.total;
            resolve(res);
          },
          error: (error: HttpFormattedErrorResponse) => {
            if (error.status !== 401) {
              this._toastController
                .create({
                  message: error.message,
                  duration: 3000,
                  position: 'bottom',
                })
                .then((toast) => {
                  toast.present();
                });
            }

            reject(error);
          },
        })
        .add(() => {
          this.isLoadingCustomers = false;
        });
    });
  }

  loadMoreAvailableVouchers(event: any) {
    this.customersPagination.page += 1;
    this.getCustomers(true).finally(() => event.target.complete());
  }

  refreshTab(event: RefresherCustomEvent) {
    this.customersPagination.page = 1;
    this.getCustomers(false).finally(() => event.target.complete());
  }
}
