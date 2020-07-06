# ngx-sticky-plus

An Angular 2+ directive that emits an event when an element that has `position: sticky` became sticky and optionally adds a CSS class. This enables developers to add special styling e.g a box-shadow when element becomes sticky. Described functionality is currently not supported natively by browsers.

[Demo](https://jbchr.github.io/ngx-sticky-plus/sticky-header)

## Features

- 🦈 Very performant (using IntersectionObserver instead of scroll event)
- 🐑 Supports top / bottom stickyness
- 🐧 Supports sticky elements within scroll containers

## Disclaimer

This is not a polyfill for [position: sticky](https://caniuse.com/#feat=css-sticky). If the browser does not support position sticky, then also this library will do nothing.

## Side Effects

There are two side effects that you should be aware of:

- The library adds `position: relative` to the parent element of the sticky element
- The library adds two invisible elements to the parent element of the sticky element

This is required for the approach that was taken here. If you want to read more about this approach i recomment to read [this blog post by Google](https://developers.google.com/web/updates/2017/09/sticky-headers) that inspired this library.

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
<header style="position: sticky; top: 0" (stickyPlus)="someFn($event)"></header>
```

## API

| Attribute       | Type                  | Default     | Description                                                                       |
| --------------- | --------------------- | ----------- | --------------------------------------------------------------------------------- |
| isSticky        | EventEmitter<Boolean> | -           | Fires an event when the stickyness of an element changes                          |
| addClass        | Boolean               | true        | If the directive should add a css class to the element when it becomes stuck      |
| stickyClassName | String                | 'is-sticky' | The classname of the class that is added to the element.                          |
| scrollContainer | ElementRef            | -           | If used inside a scroll container a reference to the container needs to be passed |

## Roadmap

- [ ] Support Angular Universal
- [ ] Have decent test coverage

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- [This lib is inspired by a Google Blog Post](https://developers.google.com/web/updates/2017/09/sticky-headers)
