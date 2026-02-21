import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    // ✦ Angular 21 Zoneless Mode — no zone.js needed
    provideZonelessChangeDetection(),
  ],
}).catch(err => console.error(err));