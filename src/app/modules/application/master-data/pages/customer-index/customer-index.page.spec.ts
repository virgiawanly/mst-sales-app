import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerIndexPage } from './customer-index.page';

describe('CustomerIndexPage', () => {
  let component: CustomerIndexPage;
  let fixture: ComponentFixture<CustomerIndexPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerIndexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
