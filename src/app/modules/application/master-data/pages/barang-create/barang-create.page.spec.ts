import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarangCreatePage } from './barang-create.page';

describe('BarangCreatePage', () => {
  let component: BarangCreatePage;
  let fixture: ComponentFixture<BarangCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BarangCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
