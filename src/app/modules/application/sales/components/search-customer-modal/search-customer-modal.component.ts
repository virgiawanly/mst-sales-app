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
import { checkmarkCircleOutline, searchOutline } from 'ionicons/icons';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { Customer } from 'src/types/customers';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { Pagination } from 'src/types/pagination';

@Component({
  selector: 'app-search-customer-modal',
  templateUrl: './search-customer-modal.component.html',
  styleUrls: ['./search-customer-modal.component.scss'],
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
export class SearchCustomerModalComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();

  @Input({ required: true }) isOpen: boolean = false;
  @Input({ required: false }) selectedId: number | null = null;
  @Output() selected: EventEmitter<Customer> = new EventEmitter<Customer>();
  @Output() modalDismiss: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('customerSearchInput', { static: false }) customerSearchInput: any;

  isLoadingCustomers: boolean = false;
  customers: Customer[] = [];
  customersSearch: string = '';
  customersSearchPlaceholder: string = 'start-searching-placeholder';
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
    addIcons({ searchOutline, checkmarkCircleOutline });
  }

  onDidPresent() {
    // Autofocus search input
    setTimeout(() => {
      this.customerSearchInput?.nativeElement?.focus();
    }, 100);
  }

  ngOnInit() {
    this.customersSearchDebounce.pipe(debounceTime(500), takeUntil(this._unsubscribe$)).subscribe((search: string) => {
      if (!search) {
        this.customers = [];
        this.customersSearchPlaceholder = 'start-searching-placeholder';
        return;
      }

      this.customersSearch = search;
      this.customersPagination.page = 1;
      this.customersSearchPlaceholder = 'try-adjusting-query-placeholder';
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

  getNameInitials(name: string): string {
    return name
      .split(' ')
      .map((name) => name.charAt(0))
      .slice(0, 2)
      .join('');
  }

  selectCustomer(customer: Customer) {
    this.selected.emit(customer);
    this.modalDismiss.emit();
  }
}
