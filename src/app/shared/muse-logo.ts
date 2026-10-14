import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The MUSE mark: the round panel with the GPS cursor from the printed face. */
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
      <rect width="64" height="64" rx="18" class="logo__bg" />
      <circle
        cx="32"
        cy="32"
        r="19"
        fill="none"
        class="logo__ring"
        stroke-width="4"
        stroke-linecap="round"
        stroke-dasharray="86 34"
        transform="rotate(120 32 32)"
      />
      <path d="M32 18 L41 40 L32 35 L23 40 Z" class="logo__cursor" />
      <circle cx="32" cy="32" r="2.5" class="logo__dot" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
    .logo__bg {
      fill: var(--ink);
    }
    .logo__ring {
      stroke: var(--sky);
      transition: stroke var(--dur) var(--ease-spring);
    }
    .logo__cursor {
      fill: #ffffff;
    }
    .logo__dot {
      fill: var(--sun);
    }
    :host-context(a:hover) .logo__ring,
    :host-context(a:focus-visible) .logo__ring {
      stroke: var(--sky-bright);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MuseLogo {
  readonly size = input(40);
}
