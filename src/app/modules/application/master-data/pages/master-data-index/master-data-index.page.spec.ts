import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterDataIndexPage } from './master-data-index.page';

describe('MasterDataIndexPage', () => {
  let component: MasterDataIndexPage;
  let fixture: ComponentFixture<MasterDataIndexPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDataIndexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
