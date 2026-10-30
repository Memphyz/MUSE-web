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
export type PanelScenario =
  'route' | 'radar' | 'bump' | 'rain' | 'tunnel' | 'night' | 'monument' | 'rejoin';

/** A point on the ground, in meters: x to the right, y ahead. */
type Ground = readonly [number, number];

interface Dot {
  x: number;
  y: number;
  r: number;
  state: 'idle' | 'lit' | 'over';
}

interface Marker {
  icon: string;
  x: number;
  y: number;
  radar: boolean;
}

interface Chip {
  icon: string;
  text: string;
  width: number;
}

const DOT_COUNT = 24;
const SPEEDO = { x: 80, y: 254, r: 47 };
const SWEEP_START = 135;
const SWEEP_TOTAL = 270;
/** The limit tick always sits at 75% of the sweep, as on the firmware. */
const LIMIT_AT = 0.75;
const LOOP_MS = 6000;

// Camera of the firmware 2.6: pitched 45°, focal distance 540 px, pivot on the puck.
const CENTER = 180;
const MAP_BOTTOM = 204;
const FOCAL = 540;
const PITCH = Math.PI / 4;
/** Meters from the puck to the top edge of the screen. */
const VIEW_RANGE_M = 200;
/** Ground kept in front of and behind the puck before projecting, in px. */
const NEAR_PX = -60;
const FAR_PX = 2400;

// The block around the next turn, with the turn at (0, 0).
const AVENUES: readonly (readonly Ground[])[] = [
  [
    [-500, 0],
    [500, 0],
  ],
  [
    [-55, -700],
    [-55, 500],
  ],
];
const STREETS: readonly (readonly Ground[])[] = [
  [
    [-500, -45],
    [500, -45],
  ],
  [
    [-500, -95],
    [500, -95],
  ],
  [
    [-500, -150],
    [500, -150],
  ],
  [
    [-500, -205],
    [500, -205],
  ],
  [
    [-500, 55],
    [500, 55],
  ],
  [
    [-500, 115],
    [500, 115],
  ],
  [
    [0, -700],
    [0, 500],
  ],
  [
    [50, -700],
    [50, 500],
  ],
  [
    [105, -700],
    [105, 500],
  ],
  [
    [-110, -700],
    [-110, 500],
  ],
  [
    [-140, -260],
    [70, 160],
  ],
];
const ROUTE_TURN: readonly Ground[] = [
  [0, -700],
  [0, 0],
  [500, 0],
];
const ROUTE_STRAIGHT: readonly Ground[] = [
  [0, -700],
  [0, 800],
];
const ROUTE_REJOIN: readonly Ground[] = [
  [-500, 0],
  [500, 0],
];
/** Slow stretch on the cross street, painted as the route border. */
const TRAFFIC: readonly Ground[] = [
  [25, 0],
  [500, 0],
];

/**
 * A living replica of the MUSE panel as the firmware 2.6 draws it on the
 * 360x360 round display: the app's map colors in perspective, the blue arrow
 * with a white ring, and the bottom card with the speedometer, the maneuver in
 * a blue square and the distance. Pure SVG + signals.
 */
@Component({
  selector: 'app-panel-dial',
  templateUrl: './panel-dial.html',
  styleUrl: './panel-dial.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelDial {
  readonly scenario = input<PanelScenario>('route');
  readonly perspective = input(true);
  readonly label = input('Painel MUSE mostrando a navegação');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly motion = inject(MotionService);

  /** Milliseconds since the loop started, driven by requestAnimationFrame. */
  private readonly clock = signal(0);
  private readonly visible = signal(true);

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
        return Math.round(46 + Math.sin(t * 0.8) * 5);
      case 'night':
        return Math.round(54 + Math.sin(t * 0.6) * 5);
      case 'rejoin':
        return Math.round(28 + Math.sin(t * 0.8) * 4);
      default:
        return Math.round(48 + Math.sin(t * 0.8) * 7);
    }
  });

  protected readonly overLimit = computed(() => this.speed() > this.limit());

  protected readonly dots = computed<Dot[]>(() => {
    const max = this.limit() / LIMIT_AT;
    const lit = Math.round((this.speed() / max) * (DOT_COUNT - 1));
    const tick = Math.round(LIMIT_AT * (DOT_COUNT - 1));
    return Array.from({ length: DOT_COUNT }, (_, index) => {
      const [x, y] = polar(SPEEDO.x, SPEEDO.y, SPEEDO.r, sweepAngle(index / (DOT_COUNT - 1)));
      const state = index > lit ? 'idle' : this.overLimit() && index > tick ? 'over' : 'lit';
      return { x, y, r: state === 'idle' ? 2 : 3, state };
    });
  });

  protected readonly limitTick = (() => {
    const angle = sweepAngle(LIMIT_AT);
    const [x1, y1] = polar(SPEEDO.x, SPEEDO.y, SPEEDO.r - 6, angle);
    const [x2, y2] = polar(SPEEDO.x, SPEEDO.y, SPEEDO.r + 6, angle);
    return { x1, y1, x2, y2 };
  })();

  /** Meters to the next maneuver, counting down over each loop. */
  protected readonly distance = computed(() => {
    const phase = (this.clock() % LOOP_MS) / LOOP_MS;
    return 190 - phase * 170;
  });

  protected readonly distanceLabel = computed(() =>
    Math.max(20, Math.round(this.distance() / 10) * 10),
  );

  protected readonly tripMinutes = computed(() => {
    const loops = Math.floor(this.clock() / LOOP_MS);
    return Math.max(2, 14 - loops);
  });

  protected readonly tripKm = computed(() => {
    const loops = Math.floor(this.clock() / LOOP_MS);
    return Math.max(0.8, 6.4 - loops * 0.4).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  });

  protected readonly eta = computed(() => {
    const minutes = 35 + this.tripMinutes();
    return `14:${minutes.toString().padStart(2, '0')}`;
  });

  /** Fill of the short progress arc at the bottom of the glass. */
  protected readonly progressDash = computed(() => {
    const phase = (this.clock() % (LOOP_MS * 12)) / (LOOP_MS * 12);
    const filled = PROGRESS_LENGTH * (0.3 + phase * 0.7);
    return `${filled} ${PROGRESS_LENGTH}`;
  });

  protected readonly progressPath = PROGRESS_PATH;

  /** Ground pixels per meter, so both views reach the same distance ahead. */
  private readonly pxPerM = computed(() => {
    if (!this.perspective()) return CENTER / VIEW_RANGE_M;
    const ahead = (CENTER * FOCAL) / (FOCAL * Math.cos(PITCH) - CENTER * Math.sin(PITCH));
    return ahead / VIEW_RANGE_M;
  });

  /** Turns a point of the block (meters, turn at the origin) into screen px. */
  private readonly toScreen = computed(() => {
    const scale = this.pxPerM();
    const pitch = this.perspective() ? PITCH : 0;
    const shift = this.distance();
    return {
      ground: ([x, y]: Ground): Ground => [x * scale, (y + shift) * scale],
      project: ([gx, gy]: Ground): Ground => {
        const inv = FOCAL / (FOCAL + gy * Math.sin(pitch));
        return [CENTER + gx * inv, CENTER - gy * Math.cos(pitch) * inv];
      },
    };
  });

  protected readonly avenues = computed(() => AVENUES.map((line) => this.path(line)).join(' '));
  protected readonly streets = computed(() => STREETS.map((line) => this.path(line)).join(' '));

  protected readonly route = computed(() => {
    switch (this.scenario()) {
      case 'tunnel':
      case 'night':
        return this.path(ROUTE_STRAIGHT);
      case 'rejoin':
        return this.path(ROUTE_REJOIN);
      default:
        return this.path(ROUTE_TURN);
    }
  });

  protected readonly traffic = computed(() =>
    this.scenario() === 'route' || this.scenario() === 'radar' ? this.path(TRAFFIC) : '',
  );

  protected readonly marker = computed<Marker | null>(() => {
    const at = MARKERS[this.scenario()];
    if (!at) return null;
    const [x, y] = this.toScreen().project(this.toScreen().ground(at.point));
    // Markers slide under the bottom card as the bike reaches them.
    if (y - 19.5 > MAP_BOTTOM) return null;
    return { icon: at.icon, x, y, radar: this.scenario() === 'radar' };
  });

  protected readonly chips = computed<Chip[]>(() => {
    const chip = CHIPS[this.scenario()];
    return chip ? [{ ...chip, width: 9 + 33 + 5 + chip.text.length * 11 + 9 }] : [];
  });

  protected readonly maneuverIcon = computed(() => {
    switch (this.scenario()) {
      case 'tunnel':
      case 'night':
        return 'assets/icons/maneuver_straight.svg';
      case 'rejoin':
        return 'assets/icons/maneuver_rejoin.svg';
      default:
        return 'assets/icons/maneuver_turn_right.svg';
    }
  });

  protected readonly animated = computed(() => !this.motion.reduced());

  constructor() {
    afterNextRender(() => this.start());
  }

  /** SVG path of a polyline, clipped to the ground in view and projected. */
  private path(line: readonly Ground[]): string {
    const { ground, project } = this.toScreen();
    const points = line.map(ground);
    let d = '';
    let open = false;
    for (let i = 1; i < points.length; i++) {
      const clipped = clip(points[i - 1], points[i]);
      if (!clipped) {
        open = false;
        continue;
      }
      const [a, b] = clipped.map(project);
      if (!open) d += `M${a[0].toFixed(1)} ${a[1].toFixed(1)}`;
      d += `L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
      open = clipped[1] === points[i];
    }
    return d;
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

const MARKERS: Partial<Record<PanelScenario, { icon: string; point: Ground }>> = {
  radar: { icon: 'assets/icons/alert_speed_radar.svg', point: [0, -70] },
  bump: { icon: 'assets/icons/alert_speed_bump.svg', point: [0, -70] },
  rain: { icon: 'assets/icons/alert_slippery_road.svg', point: [0, -70] },
  monument: { icon: 'assets/icons/alert_biker_monument.svg', point: [0, -70] },
};

const CHIPS: Partial<Record<PanelScenario, { icon: string; text: string }>> = {
  rain: { icon: 'assets/icons/weather_rain.svg', text: 'CHUVA 2.4km' },
  tunnel: { icon: 'assets/icons/state_tunnel.svg', text: 'TÚNEL' },
  night: { icon: 'assets/icons/state_unlit.svg', text: 'SEM LUZ' },
};

/** Angle, clockwise from 3 o'clock, of a fraction of the speedometer sweep. */
function sweepAngle(fraction: number): number {
  return SWEEP_START + SWEEP_TOTAL * fraction;
}

function polar(cx: number, cy: number, r: number, degrees: number): [number, number] {
  const radians = (degrees * Math.PI) / 180;
  return [cx + Math.cos(radians) * r, cy + Math.sin(radians) * r];
}

/** Cuts a ground segment to the band between NEAR_PX and FAR_PX ahead. */
function clip(a: Ground, b: Ground): [Ground, Ground] | null {
  const cut = (p: Ground, q: Ground, y: number): Ground => {
    const t = (y - p[1]) / (q[1] - p[1]);
    return [p[0] + (q[0] - p[0]) * t, y];
  };
  let p = a;
  let q = b;
  for (const [limit, inside] of [
    [NEAR_PX, (y: number) => y >= NEAR_PX],
    [FAR_PX, (y: number) => y <= FAR_PX],
  ] as const) {
    const pin = inside(p[1]);
    const qin = inside(q[1]);
    if (!pin && !qin) return null;
    if (!pin) p = cut(p, q, limit);
    else if (!qin) q = cut(p, q, limit);
  }
  return [p, q];
}

// Progress arc: radius 169.5 around the center, from 112° to 68°.
const PROGRESS_R = 169.5;
const [PROGRESS_X1, PROGRESS_Y1] = polar(CENTER, CENTER, PROGRESS_R, 112);
const [PROGRESS_X2, PROGRESS_Y2] = polar(CENTER, CENTER, PROGRESS_R, 68);
const PROGRESS_PATH = `M${PROGRESS_X1.toFixed(1)} ${PROGRESS_Y1.toFixed(1)} A${PROGRESS_R} ${PROGRESS_R} 0 0 0 ${PROGRESS_X2.toFixed(1)} ${PROGRESS_Y2.toFixed(1)}`;
const PROGRESS_LENGTH = (PROGRESS_R * 44 * Math.PI) / 180;
