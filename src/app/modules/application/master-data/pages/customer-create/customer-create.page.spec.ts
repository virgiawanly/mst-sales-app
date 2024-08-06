import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerCreatePage } from './customer-create.page';

describe('CustomerCreatePage', () => {
  let component: CustomerCreatePage;
  let fixture: ComponentFixture<CustomerCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
