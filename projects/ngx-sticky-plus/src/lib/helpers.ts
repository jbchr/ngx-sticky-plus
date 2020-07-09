import { Renderer2 } from '@angular/core';

/**
 * Checks if position sticky is supported by current browser
 * https://github.com/dollarshaveclub/stickybits/issues/35#issuecomment-549929578
 */
export const isPositionStickySupported = (win: Window): boolean => {
  const prefixes = ['', '-o-', '-webkit-', '-moz-', '-ms-'];
  const test = window.document.head.style;

  for (const prefix of prefixes) {
    test.position = `${prefix}sticky`;
  }

  return test.position === 'sticky' ? true : false;
};

/**
 * Checks if InersectionObserver is supported by current browser
 * https://github.com/w3c/IntersectionObserver/issues/296#issuecomment-452230176
 */
export const isIntersectionObserverSupported = (win: Window) =>
  'IntersectionObserver' in win;

/**
 * Sets multiple styles on an element using angular renderer.
 */
export const setStyles = (
  renderer: Renderer2,
  el: HTMLElement,
  styles: { [key: string]: string }
) => {
  Object.entries(styles).forEach(([key, value]) => {
    renderer.setStyle(el, key, value);
  });
};
