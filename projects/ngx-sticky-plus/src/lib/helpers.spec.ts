import { Renderer2 } from '@angular/core';
import {
  isPositionStickySupported,
  isIntersectionObserverSupported,
  setStyles,
} from './helpers';

const renderer2Mock: Renderer2 = jasmine.createSpyObj('renderer2Mock', [
  'destroy',
  'createElement',
  'createComment',
  'createText',
  'destroyNode',
  'appendChild',
  'insertBefore',
  'removeChild',
  'selectRootElement',
  'parentNode',
  'nextSibling',
  'setAttribute',
  'removeAttribute',
  'addClass',
  'removeClass',
  'setStyle',
  'removeStyle',
  'setProperty',
  'setValue',
  'listen',
]);

describe('Helpers', () => {
  describe('isPositionStickySupported', () => {
    let positionReturnValue = null;
    const positionSpy = jasmine
      .createSpy('positionSpy')
      .and.returnValue(positionReturnValue);

    beforeEach(() => {
      Object.defineProperty(window.document.head.style, 'position', {
        set: positionSpy,
      });
    });

    it('Alters through browser prefixes and assigns assigns them to head styles', () => {
      isPositionStickySupported(window);

      expect(positionSpy).toHaveBeenCalledWith('sticky');
      expect(positionSpy).toHaveBeenCalledWith('-o-sticky');
      expect(positionSpy).toHaveBeenCalledWith('-webkit-sticky');
      expect(positionSpy).toHaveBeenCalledWith('-moz-sticky');
      expect(positionSpy).toHaveBeenCalledWith('-ms-sticky');
    });

    it('Returns false, if browser did not accept setting position to sticky', () => {
      const result = isPositionStickySupported(window);
      expect(result).toBeFalsy();
    });

    it('Returns true, if browser did accept setting position to sticky', () => {
      positionReturnValue = 'sticky';
      const result = isPositionStickySupported(window);
      expect(result).toBeFalsy();
    });
  });

  describe('isIntersectionObserverSupported', () => {
    it('Returns true if window contains IntersectionObserver', () => {
      const windowClone: Window = { ...window };
      (windowClone as any).IntersectionObserver = {};
      expect(isIntersectionObserverSupported(windowClone)).toBeTruthy();
    });

    it('Returns false if window does not contain IntersectionObserver Object', () => {
      const windowClone: Window = { ...window };
      delete (windowClone as any).IntersectionObserver;
      expect(isIntersectionObserverSupported(windowClone)).toBeFalsy();
    });
  });

  describe('setStyles', () => {
    it('Calls renderer2s addStyle function for each style property passed', () => {
      const dummyElement = document.createElement('div');
      setStyles(renderer2Mock, dummyElement, {
        some: 'style',
        more: 'styles',
      });

      expect(renderer2Mock.setStyle).toHaveBeenCalledTimes(2);
      expect(renderer2Mock.setStyle).toHaveBeenCalledWith(
        dummyElement,
        'some',
        'style'
      );
      expect(renderer2Mock.setStyle).toHaveBeenCalledWith(
        dummyElement,
        'more',
        'styles'
      );
    });
  });
});
