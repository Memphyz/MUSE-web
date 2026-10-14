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

/** What the simulated handlebar panel is showing. */
export type PanelScenario = 'route' | 'radar' | 'bump' | 'rain' | 'tunnel' | 'night';

interface Dot {
  x: number;
  y: number;
  index: number;
}

const DOT_COUNT = 24;
const DIAL_CENTER = { x: 86, y: 268 };
const DIAL_RADIUS = 44;
const SWEEP_START = 135;
const SWEEP_TOTAL = 270;
const MAX_SPEED = 120;
const LOOP_MS = 6000;

/**
 * A living replica of the MUSE panel (360x360 round display, layout inspired by
 * the Beeline Moto II): map on top with the route and the next event, arrow at
 * the center, speedometer, maneuver and distance below. Pure SVG + signals.
 */
@Component({
  selector: 'app-panel-dial',
  templateUrl: './panel-dial.html',
  styleUrl: './panel-dial.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelDial {
  readonly scenario = input<PanelScenario>('route');
  readonly label = input('Painel MUSE mostrando a navegação');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly motion = inject(MotionService);

  /** Milliseconds since the loop started, driven by requestAnimationFrame. */
  private readonly clock = signal(0);
  private readonly visible = signal(true);

  protected readonly dots: readonly Dot[] = Array.from({ length: DOT_COUNT }, (_, index) => {
    const angle = ((SWEEP_START + (SWEEP_TOTAL * index) / (DOT_COUNT - 1)) * Math.PI) / 180;
    return {
      index,
      x: DIAL_CENTER.x + Math.cos(angle) * DIAL_RADIUS,
      y: DIAL_CENTER.y + Math.sin(angle) * DIAL_RADIUS,
    };
  });

  protected readonly limit = computed(() => (this.scenario() === 'tunnel' ? 80 : 60));

  protected readonly speed = computed(() => {
    const t = this.clock() / 1000;
    switch (this.scenario()) {
      case 'radar':
        return Math.round(71 + Math.sin(t * 1.3) * 3);
      case 'bump':
        return Math.round(34 + Math.sin(t * 0.9) * 6);
      case 'tunnel':
        return Math.round(76 + Math.sin(t * 0.7) * 4);
      case 'rain':
        return Math.round(52 + Math.sin(t * 0.8) * 5);
      case 'night':
        return Math.round(64 + Math.sin(t * 0.6) * 5);
      default:
        return Math.round(50 + Math.sin(t * 0.8) * 7);
    }
  });

  protected readonly overLimit = computed(() => this.speed() > this.limit());
  protected readonly litDots = computed(() => Math.round((this.speed() / MAX_SPEED) * DOT_COUNT));
  protected readonly limitDot = computed(() => Math.round((this.limit() / MAX_SPEED) * DOT_COUNT));

  /** Distance to the next maneuver, counting down over each loop. */
  protected readonly distance = computed(() => {
    const phase = (this.clock() % LOOP_MS) / LOOP_MS;
    const meters = Math.max(20, Math.round((280 - phase * 260) / 10) * 10);
    return meters;
  });

  protected readonly tripMinutes = computed(() => {
    const loops = Math.floor(this.clock() / LOOP_MS);
    return Math.max(2, 14 - loops);
  });

  protected readonly tripKm = computed(() => {
    const loops = Math.floor(this.clock() / LOOP_MS);
    return Math.max(0.8, 6.4 - loops * 0.4).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  });

  protected readonly progressDash = computed(() => {
    const phase = (this.clock() % (LOOP_MS * 12)) / (LOOP_MS * 12);
    const arcLength = 2 * Math.PI * 170 * (120 / 360);
    const filled = arcLength * (0.3 + phase * 0.7);
    return `${filled} ${arcLength}`;
  });

  protected readonly eventIcon = computed(() => {
    switch (this.scenario()) {
      case 'radar':
        return 'assets/icons/alert_speed_radar.svg';
      case 'bump':
        return 'assets/icons/alert_speed_bump.svg';
      case 'rain':
        return 'assets/icons/alert_slippery_road.svg';
      default:
        return null;
    }
  });

  protected readonly chips = computed(() => {
    switch (this.scenario()) {
      case 'tunnel':
        return [{ icon: 'assets/icons/state_tunnel.svg', text: 'TÚNEL' }];
      case 'rain':
        return [{ icon: 'assets/icons/weather_rain.svg', text: 'CHUVA 2 KM' }];
      case 'night':
        return [{ icon: 'assets/icons/state_unlit.svg', text: 'SEM LUZ' }];
      default:
        return [];
    }
  });

  protected readonly maneuverIcon = computed(() =>
    this.scenario() === 'tunnel'
      ? 'assets/icons/maneuver_straight.svg'
      : 'assets/icons/maneuver_turn_right.svg',
  );

  protected readonly eta = computed(() => {
    const minutes = 35 + this.tripMinutes();
    return `14:${minutes.toString().padStart(2, '0')}`;
  });

  protected readonly animated = computed(() => !this.motion.reduced());

  constructor() {
    afterNextRender(() => this.start());
  }

  private start(): void {
    const view = this.host.nativeElement.ownerDocument.defaultView;
    if (!view) return;

    if (this.motion.reduced()) {
      this.clock.set(2200);
      return;
    }

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => this.visible.set(entries.some((entry) => entry.isIntersecting)),
        { threshold: 0.05 },
      );
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    }

    let start = view.performance.now();
    let last = start;
    let frame = 0;
    const tick = (now: number) => {
      if (this.visible()) {
        // Keep the clock from jumping after the panel was off screen.
        if (now - last > 500) start += now - last;
        this.clock.set(now - start);
      }
      last = now;
      frame = view.requestAnimationFrame(tick);
    };
    frame = view.requestAnimationFrame(tick);
    this.destroyRef.onDestroy(() => view.cancelAnimationFrame(frame));
  }
}
