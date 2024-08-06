import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarangShowPage } from './barang-show.page';

describe('BarangShowPage', () => {
  let component: BarangShowPage;
  let fixture: ComponentFixture<BarangShowPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BarangShowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
