import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Barang } from 'src/types/barang';
import { BarangForm } from './barang-form';

@Component({
  selector: 'app-barang-form',
  templateUrl: './barang-form.component.html',
  styleUrls: ['./barang-form.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, CommonModule],
})
export class BarangFormComponent {
  @Input({ required: true }) form: BarangForm = new BarangForm();
  @Input({ required: false }) barang?: Barang | null;
  @Output() formSubmit: EventEmitter<BarangForm> = new EventEmitter<BarangForm>();

  submit() {
    this.formSubmit.emit(this.form);
  }
}
