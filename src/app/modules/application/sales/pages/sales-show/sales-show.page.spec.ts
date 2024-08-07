import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesShowPage } from './sales-show.page';

describe('SalesShowPage', () => {
  let component: SalesShowPage;
  let fixture: ComponentFixture<SalesShowPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesShowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
