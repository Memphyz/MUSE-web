import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { MotionService } from '../core/motion.service';

/** A number that counts up from zero when it scrolls into view. */
@Component({
  selector: 'app-count-up',
  template: `<span class="mono">{{ prefix() }}{{ display() }}{{ suffix() }}</span>`,
  styles: `
    :host {
      display: inline;
      font-variant-numeric: tabular-nums;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountUp {
  readonly value = input.required<number>();
  readonly duration = input(1400);
  readonly prefix = input('');
  readonly suffix = input('');
  readonly decimals = input(0);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly motion = inject(MotionService);
  private readonly current = signal(0);

  protected readonly display = computed(() =>
    this.current().toLocaleString('pt-BR', {
      minimumFractionDigits: this.decimals(),
      maximumFractionDigits: this.decimals(),
    }),
  );

  constructor() {
    afterNextRender(() => {
      if (this.motion.reduced() || typeof IntersectionObserver === 'undefined') {
        this.current.set(this.value());
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            this.animate();
          }
        },
        { threshold: 0.4 },
      );
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  private animate(): void {
    const view = this.host.nativeElement.ownerDocument.defaultView;
    if (!view) return;
    const target = this.value();
    const duration = this.duration();
    const start = view.performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.current.set(target * eased);
      if (progress < 1) view.requestAnimationFrame(step);
      else this.current.set(target);
    };
    view.requestAnimationFrame(step);
  }
}
