import { FormControl, FormGroup, Validators } from '@angular/forms';

export class CustomerForm extends FormGroup {
  constructor() {
    super({
      kode: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      nama: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      telp: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    });
  }
}
