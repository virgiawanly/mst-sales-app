import { FormControl, FormGroup, Validators } from '@angular/forms';

export class BarangForm extends FormGroup {
  constructor() {
    super({
      kode: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      nama: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      harga: new FormControl('', [Validators.required, Validators.min(0)]),
    });
  }
}
