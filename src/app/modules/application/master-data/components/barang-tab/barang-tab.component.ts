import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
  RefresherCustomEvent,
  ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { BarangCardLoaderComponent } from 'src/app/shared/components/barang/barang-card-loader/barang-card-loader.component';
import { BarangCardComponent } from 'src/app/shared/components/barang/barang-card/barang-card.component';
import { Barang } from 'src/types/barang';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { Pagination } from 'src/types/pagination';

@Component({
  selector: 'app-barang-tab',
  templateUrl: './barang-tab.component.html',
  styleUrls: ['./barang-tab.component.scss'],
  standalone: true,
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonIcon,
    FormsModule,
    BarangCardComponent,
    BarangCardLoaderComponent,
    TranslateModule,
    CommonModule,
  ],
})
export class BarangTabComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();

  isLoadingBarang: boolean = false;
  barang: Barang[] = [];
  barangSearch: string = '';
  barangSearchDebounce: Subject<string> = new Subject<string>();
  barangPagination: Pagination = {
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
    this.getBarang();

    this.barangSearchDebounce.pipe(debounceTime(500), takeUntil(this._unsubscribe$)).subscribe((search: string) => {
      this.barangSearch = search;
      this.barangPagination.page = 1;
      this.getBarang();
    });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  getBarang(loadMore: boolean = false) {
    return new Promise((resolve, reject) => {
      this.isLoadingBarang = true;
      this._httpService
        .get('mobile/barang', {
          params: {
            size: this.barangPagination.size,
            page: this.barangPagination.page,
            search: this.barangSearch ?? '',
          },
        })
        .subscribe({
          next: (res: any) => {
            if (loadMore) {
              const newBarang = res.data.data || [];
              this.barang = [...this.barang, ...newBarang];
            } else {
              this.barang = res.data.data || [];
            }

            this.barangPagination.page = res.data.current_page;
            this.barangPagination.totalItems = res.data.total;
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
          this.isLoadingBarang = false;
        });
    });
  }

  loadMoreBarang(event: any) {
    this.barangPagination.page += 1;
    this.getBarang(true).finally(() => event.target.complete());
  }

  refreshTab(event: RefresherCustomEvent) {
    this.barangPagination.page = 1;
    this.barang = [];
    this.getBarang(false).finally(() => event.target.complete());
  }

  onBarangDeleted(barang: Barang) {
    // Remove deleted barang from the list
    this.barang = this.barang.filter((c) => c.id !== barang.id);

    // Update total items
    this.barangPagination.totalItems -= 1;

    // Reload the barang if the deleted barang was the last one
    if (this.barang.length === 0) {
      this.barangPagination.page = 1;
      this.barang = [];
      this.getBarang();
    }
  }
}
