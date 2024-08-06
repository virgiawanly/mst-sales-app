import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RefresherCustomEvent, ToastController } from '@ionic/angular';
import {
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { CustomerCardLoaderComponent } from 'src/app/shared/components/customers/customer-card-loader/customer-card-loader.component';
import { CustomerCardComponent } from 'src/app/shared/components/customers/customer-card/customer-card.component';
import { Customer } from 'src/types/customers';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { Pagination } from 'src/types/pagination';

@Component({
  selector: 'app-customer-tab',
  templateUrl: './customer-tab.component.html',
  styleUrls: ['./customer-tab.component.scss'],
  standalone: true,
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonIcon,
    FormsModule,
    CustomerCardComponent,
    CustomerCardLoaderComponent,
  ],
})
export class CustomerTabComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();

  isLoadingCustomers: boolean = false;
  customers: Customer[] = [];
  customersSearch: string = '';
  customersSearchDebounce: Subject<string> = new Subject<string>();
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

    this.customersSearchDebounce.pipe(debounceTime(500), takeUntil(this._unsubscribe$)).subscribe((search: string) => {
      this.customersSearch = search;
      this.customersPagination.page = 1;
      this.getCustomers();
    });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
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

  loadMoreCustomers(event: any) {
    this.customersPagination.page += 1;
    this.getCustomers(true).finally(() => event.target.complete());
  }

  refreshTab(event: RefresherCustomEvent) {
    this.customersPagination.page = 1;
    this.customers = [];
    this.getCustomers(false).finally(() => event.target.complete());
  }
}
