import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxStickyPlusModule } from 'ngx-sticky-plus';
import { StickyHeaderComponent } from './sticky-header.component';
import { StickyFooterComponent } from './sticky-footer.component';
import { RouterModule } from '@angular/router';
import { ScrollContainerComponent } from './scroll-container.component';

import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppComponent,
    StickyHeaderComponent,
    StickyFooterComponent,
    ScrollContainerComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgxStickyPlusModule,
    RouterModule.forRoot([
      { path: 'sticky-header', component: StickyHeaderComponent },
      { path: 'sticky-footer', component: StickyFooterComponent },
      { path: 'scroll-container', component: ScrollContainerComponent },
      { path: '', redirectTo: '/sticky-header', pathMatch: 'full' },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
