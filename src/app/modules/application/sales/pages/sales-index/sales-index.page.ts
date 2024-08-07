import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
  ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, searchOutline } from 'ionicons/icons';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { SalesCardLoaderComponent } from 'src/app/shared/components/sales/sales-card-loader/sales-card-loader.component';
import { SalesCardComponent } from 'src/app/shared/components/sales/sales-card/sales-card.component';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { Pagination } from 'src/types/pagination';
import { Sales } from 'src/types/sales';

@Component({
  selector: 'app-sales-index',
  templateUrl: './sales-index.page.html',
  styleUrls: ['./sales-index.page.scss'],
  standalone: true,
  imports: [
    IonFabButton,
    IonFab,
    IonContent,
    IonToolbar,
    IonTitle,
    IonHeader,
    IonRefresherContent,
    IonRefresher,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonIcon,
    FormsModule,
    SalesCardComponent,
    SalesCardLoaderComponent,
    TranslateModule,
    CommonModule,
    RouterModule,
  ],
})
export class SalesIndexPage implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();

  isLoadingSales: boolean = false;
  sales: Sales[] = [];
  salesSearch: string = '';
  salesSearchDebounce: Subject<string> = new Subject<string>();
  salesPagination: Pagination = {
    size: 10,
    totalItems: 0,
    totalPages: 0,
    page: 1,
  };

  constructor(
    private _httpService: HttpService,
    private _toastController: ToastController
  ) {
    addIcons({ searchOutline, add });
  }

  ngOnInit() {
    this.getSales();

    this.salesSearchDebounce.pipe(debounceTime(500), takeUntil(this._unsubscribe$)).subscribe((search: string) => {
      this.salesSearch = search;
      this.salesPagination.page = 1;
      this.getSales();
    });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  getSales(loadMore: boolean = false) {
    return new Promise((resolve, reject) => {
      this.isLoadingSales = true;
      this._httpService
        .get('mobile/sales', {
          params: {
            size: this.salesPagination.size,
            page: this.salesPagination.page,
            search: this.salesSearch ?? '',
          },
        })
        .subscribe({
          next: (res: any) => {
            if (loadMore) {
              const newSales = res.data.data || [];
              this.sales = [...this.sales, ...newSales];
            } else {
              this.sales = res.data.data || [];
            }

            this.salesPagination.page = res.data.current_page;
            this.salesPagination.totalItems = res.data.total;
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
          this.isLoadingSales = false;
        });
    });
  }

  loadMoreSales(event: any) {
    this.salesPagination.page += 1;
    this.getSales(true).finally(() => event.target.complete());
  }

  refreshPage(event: RefresherCustomEvent) {
    this.salesPagination.page = 1;
    this.sales = [];
    this.getSales(false).finally(() => event.target.complete());
  }

  onSalesDeleted(sales: Sales) {
    // Remove deleted sales from the list
    this.sales = this.sales.filter((c) => c.id !== sales.id);

    // Update total items
    this.salesPagination.totalItems -= 1;

    // Reload the sales if the deleted sales was the last one
    if (this.sales.length === 0) {
      this.salesPagination.page = 1;
      this.sales = [];
      this.getSales();
    }
  }
}
