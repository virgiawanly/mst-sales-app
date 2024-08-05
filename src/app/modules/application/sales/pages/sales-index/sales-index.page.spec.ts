import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesIndexPage } from './sales-index.page';

describe('SalesIndexPage', () => {
  let component: SalesIndexPage;
  let fixture: ComponentFixture<SalesIndexPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesIndexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
