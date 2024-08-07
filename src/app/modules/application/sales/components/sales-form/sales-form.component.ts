import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { addOutline, alertCircleOutline, cubeOutline, searchOutline, swapHorizontalOutline, trashOutline } from 'ionicons/icons';
import * as moment from 'moment';
import { HttpService } from 'src/app/core/services/http.service';
import { Barang } from 'src/types/barang';
import { Customer } from 'src/types/customers';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { Sales } from 'src/types/sales';
import { SearchBarangModalComponent } from '../search-barang-modal/search-barang-modal.component';
import { SearchCustomerModalComponent } from '../search-customer-modal/search-customer-modal.component';
import { SalesDetailForm, SalesForm } from './sales-form';

@Component({
  selector: 'app-sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    SearchCustomerModalComponent,
    SearchBarangModalComponent,
  ],
})
export class SalesFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) form: SalesForm = new SalesForm();
  @Input({ required: false }) sales?: Sales | null;
  @Output() formSubmit: EventEmitter<SalesForm> = new EventEmitter<SalesForm>();

  isLoadingSalesCode: boolean = false;
  salesCode: string | null = null;

  isSearchCustomerModalOpen: boolean = false;
  selectedCustomer: Customer | null = null;

  subtotal: number = 0;
  grandTotal: number = 0;

  isAddBarangModalOpen: boolean = false;
  isChangeBarangModalOpen: boolean = false;
  detailIndexToChange: number | null = null;

  constructor(
    private _httpService: HttpService,
    private _toastController: ToastController
  ) {
    addIcons({ searchOutline, addOutline, cubeOutline, swapHorizontalOutline, trashOutline, alertCircleOutline });
  }

  ngOnInit() {
    if (!this.sales) {
      this.getSalesCode();
      this.form.patchValue({ tgl: moment().format('YYYY-MM-DD HH:mm') });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sales'] && this.sales) {
      const details: SalesDetailForm[] = this.sales.details?.map((detail) => {
        const detailForm = new SalesDetailForm();

        detailForm.patchValue({
          barang: detail.barang ?? null,
          barang_id: detail.barang_id,
          qty: detail.qty,
          diskon_pct: detail.diskon_pct,
          diskon_nilai: detail.diskon_nilai,
          harga_diskon: detail.harga_diskon,
          total: detail.total,
        });

        return detailForm;
      });

      // First, update the details to get the subtotal
      this.form.patchValue({ details: details });
      this.form.calculateSubtotal();

      // Second, update the header
      this.form.patchValue({
        tgl: moment(this.sales.tgl).format('YYYY-MM-DD HH:mm'),
        cust_id: this.sales.cust_id,
        ongkir: Number(this.sales.ongkir),
        diskon: Number(this.sales.diskon),
      });

      // Third, update additional data to display
      this.salesCode = this.sales.kode;
      this.selectedCustomer = this.sales.customer ?? null;
    }
  }

  submit() {
    this.formSubmit.emit(this.form);
  }

  getSalesCode() {
    this.isLoadingSalesCode = true;
    this._httpService
      .get(`mobile/sales/code`)
      .subscribe({
        next: (res: any) => {
          this.salesCode = res.data;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
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
        this.isLoadingSalesCode = false;
      });
  }

  openAddBarangModal() {
    this.isAddBarangModalOpen = true;
  }

  closeAddBarangModal() {
    this.isAddBarangModalOpen = false;
  }

  openChangeBarangModal(index: number) {
    this.setDetailBarangToChange(index);
    this.isChangeBarangModalOpen = true;
  }

  closeChangeBarangModal() {
    this.isChangeBarangModalOpen = false;
  }

  addDetailsBarang(barang: Barang) {
    // Find already selected item
    const selectedBarangForm = this.form.controls['details'].value.find(
      (detail: any) => detail.get('barang_id')?.value === barang.id
    );

    if (!selectedBarangForm) {
      // Push new item
      this.form.controls['details'].value.push(new SalesDetailForm(barang));
    } else {
      // Add qty to selected item
      selectedBarangForm.get('qty')?.patchValue(selectedBarangForm.get('qty')?.value + 1, { emitEvent: true });
    }

    this.form.calculateSubtotal();
  }

  getSelectedBarangIds() {
    return this.form.controls['details'].value.map((detailForm: SalesDetailForm) => detailForm.get('barang_id')?.value);
  }

  removeDetailBarang(index: number) {
    this.form.controls['details'].value.splice(index, 1);
    this.form.calculateSubtotal();
  }

  setDetailBarangToChange(index: number) {
    this.detailIndexToChange = index;
  }

  changeDetailBarang(barang: Barang) {
    if (this.detailIndexToChange === null) {
      return;
    }

    // Update selected item
    this.form.controls['details'].value[this.detailIndexToChange].patchValue({
      barang_id: barang.id,
      barang: barang,
    });

    // Recalculate line total
    this.form.controls['details'].value[this.detailIndexToChange].calculate();

    // Recalculate all lines subtotal
    this.form.calculateSubtotal();

    // Reset index to change
    this.detailIndexToChange = null;
  }

  openSearchCustomerModal() {
    this.isSearchCustomerModalOpen = true;
  }

  closeSearchCustomerModal() {
    this.isSearchCustomerModalOpen = false;
  }

  onCustomerSelected(customer: Customer) {
    this.selectedCustomer = customer;
    this.form.patchValue({ cust_id: customer.id });
  }
}
