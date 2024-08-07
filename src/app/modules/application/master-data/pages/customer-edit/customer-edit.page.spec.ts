import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerEditPage } from './customer-edit.page';

describe('CustomerEditPage', () => {
  let component: CustomerEditPage;
  let fixture: ComponentFixture<CustomerEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
