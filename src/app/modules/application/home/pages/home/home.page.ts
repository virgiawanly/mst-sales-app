import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ToastController,
  RefresherCustomEvent,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { analytics, cash, informationCircleOutline, people, statsChart } from 'ionicons/icons';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { SalesCardLoaderComponent } from 'src/app/shared/components/sales/sales-card-loader/sales-card-loader.component';
import { SalesCardComponent } from 'src/app/shared/components/sales/sales-card/sales-card.component';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { Pagination } from 'src/types/pagination';
import { Sales } from 'src/types/sales';

export interface DashboardAnalytics {
  new_customers_count: number;
  sales_average: number;
  sales_count: number;
  total_gross_sales: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
    SalesCardComponent,
    SalesCardLoaderComponent,
    RouterModule,
  ],
})
export class HomePage implements OnInit {
  date: string = moment().format('YYYY-MM-DD');

  isLoadingSales: boolean = false;
  sales: Sales[] = [];
  salesPagination: Pagination = {
    size: 10,
    totalItems: 0,
    totalPages: 0,
    page: 1,
  };

  isLoadingAnalytics: boolean = false;
  analyticsLastGenerated: string | null = null;
  analytics: DashboardAnalytics = {
    new_customers_count: 0,
    sales_average: 0,
    sales_count: 0,
    total_gross_sales: 0,
  };

  constructor(
    private _httpService: HttpService,
    private _toastController: ToastController
  ) {
    addIcons({ cash, analytics, people, statsChart, informationCircleOutline });
  }

  ngOnInit() {
    this.getSales();
    this.getAnalytics();
  }

  getSales(loadMore: boolean = false) {
    return new Promise((resolve, reject) => {
      this.isLoadingSales = true;
      this._httpService
        .get('mobile/sales', {
          params: {
            size: this.salesPagination.size,
            page: this.salesPagination.page,
            order: 'desc',
            sort: 'created_at',
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
    Promise.all([this.getSales(false), this.getAnalytics()]).finally(() => event.target.complete());
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

  getAnalytics() {
    return new Promise((resolve, reject) => {
      this.isLoadingAnalytics = true;
      this._httpService
        .get('mobile/dashboard/analytics')
        .subscribe({
          next: (res: any) => {
            this.analytics = res.data.analytics;
            this.analyticsLastGenerated = res.data.last_generated;
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
          this.isLoadingAnalytics = false;
        });
    });
  }
}
