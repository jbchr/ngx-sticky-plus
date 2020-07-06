# ngx-sticky-plus

An Angular 2+ directive that emits an event when an element that has `position: sticky` became sticky and optionally adds a CSS class. This enables developers to add special styling e.g a box-shadow when element becomes sticky. Described functionality is currently not supported natively by browsers.

## Features

- 🦈 Very performant (using IntersectionObserver instead of scroll event)
- 🐑 Supports top / bottom stickyness
- 🐧 Supports sticky elements within scroll containers

## Getting Started

Install the package with npm

```
npm install ngx-sticky-plus
```

or use yarn

```
yarn add ngx-sticky-plus
```

then add the lib module to your app or feature module:

```typescript
import { NgxStickyPlusModule } from "ngx-sticky-plus";

@NgModule({
  declarations: [],
  imports: [NgxStickyPlusModule],
  providers: [],
})
export class AppModule {}
```

Now you can use the directive inside your templates:

```html
<header style="position: sticky; top: 0" (stuck)="someFn($event)"></header>
```

## API

| Attribute       | Type                  | Default    | Description                                                                                                               |
| --------------- | --------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| isSticky        | EventEmitter<Boolean> | -          | Fires an event when the stickyness of an element changes                                                                  |
| addClass        | Boolean               | true       | If the directive should add a css class to the element when it becomes stuck                                              |
| stickyClassName | String                | 'is-stuck' | The classname of the class that is added to the element.                                                                  |
| scrollContainer | ElementRef            | -          | If you use the directive on an element inside a scrolling element you need to pass the scrolling container as a reference |

## Roadmap

- [ ] Support Angular Universal
- [ ] Have decent test coverage

## Disclaimer

This is not a polyfill for [position: sticky](https://caniuse.com/#feat=css-sticky). If the browser does not support position sticky, then also this library will do nothing.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- [This lib is inspired by a Google Blog Post](https://developers.google.com/web/updates/2017/09/sticky-headers)
