import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingIndexPage } from './setting-index.page';

describe('SettingIndexPage', () => {
  let component: SettingIndexPage;
  let fixture: ComponentFixture<SettingIndexPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingIndexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
