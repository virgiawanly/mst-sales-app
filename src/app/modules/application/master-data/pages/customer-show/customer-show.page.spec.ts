import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerShowPage } from './customer-show.page';

describe('CustomerShowPage', () => {
  let component: CustomerShowPage;
  let fixture: ComponentFixture<CustomerShowPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerShowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
