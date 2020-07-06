import { Component } from '@angular/core';
import { version } from '../../projects/ngx-sticky-plus/package.json';

@Component({
  selector: 'app-root',
  template: `<header>
      <h1>ngx-sticky-plus</h1>
      <span class="toolbar">
        <span
          >v.{{ version }} |
          <a href="https://github.com/jbchr/ngx-sticky-plus">Readme</a></span
        >
      </span>

      <nav>
        <a routerLink="/sticky-header">sticky header</a
        ><a routerLink="/sticky-footer">sticky footer</a
        ><a routerLink="/scroll-container">scroll container</a>
      </nav>
    </header>

    <main>
      <router-outlet></router-outlet>
      <main></main>
    </main> `,
})
export class AppComponent {
  title = 'ngx-sticky-plus-app';
  version = version;
}
