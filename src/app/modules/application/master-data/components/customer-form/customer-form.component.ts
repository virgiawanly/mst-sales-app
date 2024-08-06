import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Customer } from 'src/types/customers';
import { CustomerForm } from './customer-form';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, CommonModule],
})
export class CustomerFormComponent {
  @Input({ required: true }) form: CustomerForm = new CustomerForm();
  @Input({ required: false }) customer?: Customer | null;
  @Output() formSubmit: EventEmitter<CustomerForm> = new EventEmitter<CustomerForm>();

  submit() {
    this.formSubmit.emit(this.form);
  }
}
