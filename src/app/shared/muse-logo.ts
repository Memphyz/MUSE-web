import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The MUSE mark: the black panel lit up, with the route, the arrow and the destination. Same drawing as the favicon. */
@Component({
  selector: 'app-muse-logo',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 64 64"
      role="img"
      aria-label="MUSE"
      class="logo"
    >
      <rect width="64" height="64" rx="16" class="logo__bg" />
      <circle cx="32" cy="32" r="25" class="logo__bezel" />
      <circle cx="32" cy="32" r="22" class="logo__glass" />
      <path
        d="M32 37V26q0-7 7-7h11"
        fill="none"
        class="logo__route"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M32 37V26q0-7 7-7h11"
        fill="none"
        class="logo__route-light"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="50" cy="19" r="4.5" class="logo__dot" />
      <path d="M32 34l9 17-9-5-9 5z" class="logo__cursor" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
    .logo__bg {
      fill: var(--ink);
    }
    .logo__bezel {
      fill: #111827;
    }
    .logo__glass {
      fill: #0b1220;
      stroke: #334155;
      stroke-width: 1.5;
    }
    .logo__route {
      stroke: var(--sky);
      transition: stroke var(--dur) var(--ease-spring);
    }
    .logo__route-light {
      stroke: #93c5fd;
    }
    .logo__cursor {
      fill: #ffffff;
    }
    .logo__dot {
      fill: var(--sun);
    }
    :host-context(a:hover) .logo__route,
    :host-context(a:focus-visible) .logo__route {
      stroke: var(--sky-bright);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MuseLogo {
  readonly size = input(40);
}
