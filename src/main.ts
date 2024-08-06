import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { apiLanguageInterceptorProviders } from './app/core/interceptors/api-language.interceptor';
import { authInterceptorProviders } from './app/core/interceptors/auth.interceptor';
import { formatErrorInterceptorProviders } from './app/core/interceptors/format-error.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(IonicStorageModule.forRoot()),
    authInterceptorProviders,
    apiLanguageInterceptorProviders,
    formatErrorInterceptorProviders,
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
