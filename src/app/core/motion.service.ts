import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

/** Tracks `prefers-reduced-motion` so animations can tone themselves down. */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly document = inject(DOCUMENT);
  private readonly reducedMotion = signal(false);

  readonly reduced = this.reducedMotion.asReadonly();

  constructor() {
    const view = this.document.defaultView;
    if (!view?.matchMedia) return;
    const query = view.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion.set(query.matches);
    query.addEventListener('change', (event) => this.reducedMotion.set(event.matches));
  }
}
