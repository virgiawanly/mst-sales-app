import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonModal,
  ToastController,
  IonBackButton,
  IonToolbar,
  IonHeader,
  IonTitle,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, cubeOutline, searchOutline } from 'ionicons/icons';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { Barang } from 'src/types/barang';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { Pagination } from 'src/types/pagination';

@Component({
  selector: 'app-search-barang-modal',
  templateUrl: './search-barang-modal.component.html',
  styleUrls: ['./search-barang-modal.component.scss'],
  standalone: true,
  imports: [
    IonTitle,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonInfiniteScrollContent,
    IonContent,
    IonModal,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    CommonModule,
    TranslateModule,
    FormsModule,
  ],
})
export class SearchBarangModalComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();

  @Input({ required: true }) isOpen: boolean = false;
  @Input({ required: false }) selectedIds: number[] = [];
  @Output() selected: EventEmitter<Barang> = new EventEmitter<Barang>();
  @Output() modalDismiss: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('barangSearchInput', { static: false }) barangearchInput: any;

  isLoadingBarang: boolean = false;
  barang: Barang[] = [];
  barangSearch: string = '';
  barangSearchPlaceholder: string = 'start-searching-placeholder';
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
    addIcons({ searchOutline, checkmarkCircleOutline, cubeOutline });
  }

  onDidPresent() {
    // Autofocus search input
    setTimeout(() => {
      this.barangearchInput?.nativeElement?.focus();
    }, 100);
  }

  ngOnInit() {
    this.barangSearchDebounce.pipe(debounceTime(500), takeUntil(this._unsubscribe$)).subscribe((search: string) => {
      if (!search) {
        this.barang = [];
        this.barangSearchPlaceholder = 'start-searching-placeholder';
        return;
      }

      this.barangSearch = search;
      this.barangPagination.page = 1;
      this.barangSearchPlaceholder = 'try-adjusting-query-placeholder';
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
        .get('web/barang', {
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

  selectBarang(barang: Barang) {
    this.selected.emit(barang);
    this.modalDismiss.emit();
  }
}
