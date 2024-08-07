import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarangEditPage } from './barang-edit.page';

describe('BarangEditPage', () => {
  let component: BarangEditPage;
  let fixture: ComponentFixture<BarangEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BarangEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
