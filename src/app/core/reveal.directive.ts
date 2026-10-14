import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Adds `is-visible` to the host once it scrolls into view. The global
 * stylesheet animates the transition; `delay` staggers siblings.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    '[style.--reveal-delay]': 'delay() + "ms"',
  },
})
export class RevealDirective {
  readonly delay = input(0, { alias: 'appReveal', transform: toDelay });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const element = this.host.nativeElement;
      if (typeof IntersectionObserver === 'undefined') {
        element.classList.add('is-visible');
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              element.classList.add('is-visible');
              observer.disconnect();
            }
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
      );
      observer.observe(element);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}

function toDelay(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}
