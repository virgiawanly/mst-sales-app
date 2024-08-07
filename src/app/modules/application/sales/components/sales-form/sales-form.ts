import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Barang } from '../../../../../../types/barang';

export class SalesForm extends FormGroup {
  constructor() {
    super({
      tgl: new FormControl('', [Validators.required]),
      cust_id: new FormControl('', [Validators.required]),
      diskon: new FormControl('', []),
      ongkir: new FormControl('', []),
      details: new FormControl([], []),
      subtotal: new FormControl(0, []),
      total_bayar: new FormControl(0, []),
    });
  }

  onChangeDiskon() {
    const subtotal = this.get('subtotal')?.value;
    const ongkir = this.get('ongkir')?.value;
    const subtotalWithOngkir = subtotal + ongkir;
    const diskon = this.get('diskon')?.value;

    if (diskon !== null && diskon < 0) {
      this.get('diskon')?.setValue(0, { emitEvent: false });
    }

    if (diskon !== null && diskon > subtotalWithOngkir) {
      this.get('diskon')?.setValue(subtotalWithOngkir, { emitEvent: false });
    }

    this.calculateTotal();
  }

  onChangeOngkir() {
    let ongkir = this.get('ongkir')?.value;

    if (ongkir !== null && ongkir < 0) {
      ongkir = 0;
      this.get('ongkir')?.setValue(0, { emitEvent: false });
    }

    const subtotal = this.get('subtotal')?.value;
    const subtotalWithOngkir = subtotal + ongkir;
    const diskon = this.get('diskon')?.value;

    if (diskon !== null && diskon > subtotalWithOngkir) {
      this.get('diskon')?.setValue(subtotalWithOngkir, { emitEvent: false });
    }

    this.calculateTotal();
  }

  calculateSubtotal() {
    const subtotal = this.get('details')?.value?.reduce((subtotal: number, detail: SalesDetailForm) => {
      return (subtotal += Number(detail.get('total')?.value) ?? 0);
    }, 0);

    this.get('subtotal')?.setValue(subtotal);
    this.calculateTotal();
  }

  calculateTotal() {
    const diskon = Number(this.get('diskon')?.value) ?? 0;
    const ongkir = Number(this.get('ongkir')?.value) ?? 0;
    const subtotal = Number(this.get('subtotal')?.value) ?? 0;
    const subtotalWithOngkir = subtotal + ongkir;

    let diskonToApply = diskon;
    if (diskon > subtotalWithOngkir) {
      diskonToApply = subtotalWithOngkir;
      this.get('diskon')?.setValue(diskonToApply, { emitEvent: false });
    }

    this.get('total_bayar')?.setValue(subtotal - diskonToApply + ongkir);
  }
}

export class SalesDetailForm extends FormGroup {
  constructor(barang?: Barang) {
    super({
      barang: new FormControl(barang ?? null, []),
      barang_id: new FormControl(barang?.id ?? '', [Validators.required]),
      qty: new FormControl(1, [Validators.required, Validators.min(1)]),
      diskon_pct: new FormControl(0, []),
      diskon_nilai: new FormControl(0, []),
      harga_diskon: new FormControl(0, []),
      total: new FormControl(0, []),
    });

    this.calculate();
  }

  onChangeQty() {
    let qty = this.get('qty')?.value;

    if (qty !== null && qty < 1) {
      this.get('qty')?.setValue(1, { emitEvent: false });
    }

    this.calculate();
  }

  onChangeDiskonPercentage() {
    let diskonPercentage = this.get('diskon_pct')?.value;

    if (diskonPercentage !== null && (diskonPercentage < 0 || diskonPercentage > 100)) {
      if (diskonPercentage < 0) {
        diskonPercentage = 0;
      } else if (diskonPercentage > 100) {
        diskonPercentage = 100;
      }

      this.get('diskon_pct')?.setValue(diskonPercentage, { emitEvent: false });
    }

    this.calculate();
  }

  calculate() {
    const qty = this.get('qty')?.value;
    const harga = this.get('barang')?.value?.harga;
    const diskonPercentage = this.get('diskon_pct')?.value;
    const diskonValue = (harga * diskonPercentage) / 100;
    const hargaDiskon = harga - diskonValue;
    const total = hargaDiskon * qty;

    this.get('diskon_nilai')?.setValue(diskonValue);
    this.get('harga_diskon')?.setValue(hargaDiskon);
    this.get('total')?.setValue(total);
  }
}
