import { OnInit, OnDestroy } from '@angular/core';
import {
  Directive,
  Output,
  EventEmitter,
  ElementRef,
  Renderer2,
  Input,
} from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { setStyles } from './helpers';
import {
  isPositionStickySupported,
  isIntersectionObserverSupported,
} from './helpers';

enum StickyEdge {
  TOP = 'top',
  BOTTOM = 'bottom',
}

const oppositeEdge = {
  [StickyEdge.TOP]: StickyEdge.BOTTOM,
  [StickyEdge.BOTTOM]: StickyEdge.TOP,
};

@Directive({
  selector: '[stickyPlus]',
})
export class NgxStickyPlusDirective implements OnDestroy, OnInit {
  @Output() isSticky = new EventEmitter<boolean>();
  @Input() addClass = true;
  @Input() stickyClassName = 'is-sticky';
  @Input() scrollContainer: HTMLElement | undefined;

  private topSentinel: HTMLElement;
  private bottomSentinel: HTMLElement;
  private readonly unsubsribe$ = new Subject<void>();
  private edge: StickyEdge = StickyEdge.TOP;
  private offset = 0;
  private readonly stickyChange$ = new Subject<boolean>();

  private topObserver: IntersectionObserver;
  private bottomObserver: IntersectionObserver;

  constructor(
    private readonly elRef: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (
      isPositionStickySupported(window) &&
      isIntersectionObserverSupported(window)
    ) {
      this.subscribeToObservables();
      this.setEdge();
      this.prepareParentContainer();
      this.createSentinels();
      this.createObservers();
    } else {
      console.log(
        'NgxStickyPlus: Either the browser does not support position sticky or IntersectionObserver. Aborting...'
      );
    }
  }

  private subscribeToObservables(): void {
    this.stickyChange$.pipe(distinctUntilChanged()).subscribe((isSticky) => {
      this.isSticky.emit(isSticky);
      if (this.addClass) {
        this.renderer[isSticky ? 'addClass' : 'removeClass'](
          this.elRef.nativeElement,
          this.stickyClassName
        );
      }
    });
  }

  private prepareParentContainer(): void {
    const { position } = window.getComputedStyle(this.elRef.nativeElement);
    if (position !== 'relative') {
      this.renderer.setStyle(
        this.elRef.nativeElement.parentElement,
        'position',
        'relative'
      );
    }
  }

  private setEdge(): void {
    const { bottom } = this.getStyles();
    if (bottom !== 'auto') {
      this.edge = StickyEdge.BOTTOM;
    } else {
      this.edge = StickyEdge.TOP;
    }
  }

  private createSentinels(): void {
    const parentElement = this.elRef.nativeElement.parentElement;
    /* Create Sentinels */

    this.topSentinel = this.renderer.createElement('div');
    this.bottomSentinel = this.renderer.createElement('div');

    /* Set Styles */
    const baseStyles = {
      position: 'absolute',
      left: '0',
      right: '0',
    };

    setStyles(this.renderer, this.topSentinel, { ...baseStyles, top: '0' });
    setStyles(this.renderer, this.bottomSentinel, {
      ...baseStyles,
      bottom: '0',
    });

    /* Attach */
    this.renderer.appendChild(parentElement, this.topSentinel);
    this.renderer.appendChild(parentElement, this.bottomSentinel);
    this.updateSentinelStyles();
  }

  updateSentinelStyles(): void {
    const styles = this.getStyles();

    this.offset = parseInt(styles[this.edge], 10);

    /* First sentinel */
    const sentinelEdge = this.edge;
    const sentinelProp = `${sentinelEdge}Sentinel`;
    const sentinelMarginStyleProp = `margin-${sentinelEdge}`;

    const sentinelEdgeStyleValue = `calc(-${
      styles[sentinelEdge]
    } + ${styles.getPropertyValue(sentinelMarginStyleProp)})`;

    this.renderer.setStyle(
      this[sentinelProp],
      sentinelEdge,
      sentinelEdgeStyleValue
    );

    /* Second sentinel */
    const oSentinelEdge = oppositeEdge[this.edge];
    const oSentinelEdgeProp = `${oSentinelEdge}Sentinel`;
    const oSentinelMarginStyleProp = `margin-${oSentinelEdge}`;
    const oSentinelStyleHeightValue = `calc(${styles.getPropertyValue(
      sentinelEdge
    )} + ${styles.getPropertyValue(oSentinelMarginStyleProp)} + ${
      this.elRef.nativeElement.offsetHeight
    }px)`;

    this.renderer.setStyle(
      this[oSentinelEdgeProp],
      'height',
      oSentinelStyleHeightValue
    );
  }

  private getStyles(): CSSStyleDeclaration {
    return window.getComputedStyle(this.elRef.nativeElement);
  }

  private createObservers(): void {
    /* Create bottom sentinel observer */
    this.bottomObserver = new IntersectionObserver(
      this.onBottomSentinelIntercection.bind(this),
      {
        threshold: [this.edge === 'top' ? 1 : 0],
        root: this.scrollContainer,
      }
    );

    /* Create top sentinel observer */
    this.topObserver = new IntersectionObserver(
      this.onTopSentinelIntercection.bind(this),
      {
        threshold: [this.edge === 'top' ? 0 : 1],
        root: this.scrollContainer,
      }
    );

    this.bottomObserver.observe(this.bottomSentinel);
    this.topObserver.observe(this.topSentinel);
  }

  private onTopSentinelIntercection([
    { rootBounds, boundingClientRect },
  ]: IntersectionObserverEntry[]): void {
    if (
      (this.edge === 'top' &&
        boundingClientRect.bottom >= rootBounds.top &&
        boundingClientRect.bottom < rootBounds.bottom) ||
      (this.edge === 'bottom' && boundingClientRect.bottom > rootBounds.bottom)
    ) {
      this.stickyChange$.next(false);
    } else {
      this.stickyChange$.next(this.isComputedSticky(rootBounds));
    }
  }

  private onBottomSentinelIntercection([
    { rootBounds, boundingClientRect },
  ]: IntersectionObserverEntry[]): void {
    // Stopped sticking.
    if (this.edge === 'top' && boundingClientRect.top < rootBounds.top) {
      this.stickyChange$.next(false);
    } else {
      this.stickyChange$.next(this.isComputedSticky(rootBounds));
    }
  }

  private isComputedSticky(rootbounds): boolean {
    let currentPos: number;
    if (this.edge === 'top') {
      currentPos =
        this.elRef.nativeElement.getBoundingClientRect().top - rootbounds.top;
    } else {
      currentPos =
        rootbounds.height -
        this.elRef.nativeElement.getBoundingClientRect().bottom;
    }

    return this.offset >= currentPos;
  }

  ngOnDestroy(): void {
    this.bottomObserver.disconnect();
    this.topObserver.disconnect();
    this.unsubsribe$.next();
    this.unsubsribe$.complete();
  }
}
