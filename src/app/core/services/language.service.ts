import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public languages: string[] = ['id', 'en'];

  constructor(
    public translate: TranslateService,
    private _storageService: StorageService
  ) {
    // Add languages to translate service
    this.translate.addLangs(this.languages);

    // Set default language
    this._storageService.get('mstSales@lang').then((lang) => {
      let storageLang: any = lang ? lang : 'en';
      translate.use(storageLang?.match(/id|en/) ? storageLang : 'en');
    });
  }

  /***
   * Set language and save in cookie.
   *
   * @param  lang any
   * @return void
   */
  public setLanguage(lang: any) {
    this.translate.use(lang);
    this._storageService.set('mstSales@lang', lang);
  }
}
