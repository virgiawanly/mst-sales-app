import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarangIndexPage } from './barang-index.page';

describe('BarangIndexPage', () => {
  let component: BarangIndexPage;
  let fixture: ComponentFixture<BarangIndexPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BarangIndexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
