import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { ConfettiService } from '../core/confetti.service';
import { ReleaseService } from '../core/release.service';

/**
 * Skylearn "Big Friendly Button" pointed at the latest APK. A plain anchor with
 * `download`, so the browser starts the file right away instead of opening
 * the GitHub release page. Confetti marks the moment (completion only).
 */
@Component({
  selector: 'app-download-button',
  template: `
    <a
      class="button"
      [class.button--compact]="compact()"
      [href]="release.app().url"
      [attr.download]="release.app().file"
      rel="noopener"
      (click)="celebrate($event)"
    >
      <svg class="button__icon" viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
        <path
          d="M12 3v12m0 0 5-5m-5 5-5-5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="button__label">
        <span>{{ label() }}</span>
        @if (!compact()) {
          <span class="button__meta mono">
            v{{ release.app().version }} · {{ release.sizeLabel() }} · Android
          </span>
        }
      </span>
    </a>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
    .button {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      min-height: 64px;
      padding: 12px 32px 12px 24px;
      border-radius: var(--radius-button);
      background: var(--sky-deep);
      color: #ffffff;
      font-family: var(--font-body);
      font-weight: 700;
      font-size: 20px;
      line-height: 26px;
      text-decoration: none;
      box-shadow:
        0 1px 0 0 var(--sky-bright) inset,
        0 10px 28px rgba(59, 130, 246, 0.35);
      transition:
        background var(--dur) var(--ease-spring),
        transform 120ms ease-out,
        box-shadow var(--dur) var(--ease-spring);
      position: relative;
      isolation: isolate;
      overflow: hidden;
    }
    .button::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        120deg,
        transparent 30%,
        rgba(255, 255, 255, 0.28) 50%,
        transparent 70%
      );
      transform: translateX(-120%);
      transition: transform 700ms var(--ease-out);
      pointer-events: none;
    }
    .button:hover {
      background: var(--sky-deeper);
      box-shadow:
        0 -1px 0 0 var(--sky-bright) inset,
        0 14px 32px rgba(29, 78, 216, 0.4);
      transform: translateY(-2px);
    }
    .button:hover::after {
      transform: translateX(120%);
    }
    .button:active {
      transform: scale(0.97);
      transition-duration: 120ms;
    }
    .button:focus-visible {
      outline: 3px solid var(--sky-deep);
      outline-offset: 4px;
    }
    .button__icon {
      flex: none;
      animation: bob 2.4s var(--ease-spring) infinite;
    }
    .button__label {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      text-align: left;
    }
    .button__meta {
      font-size: 14px;
      line-height: 18px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      letter-spacing: 0.02em;
      white-space: nowrap;
    }
    .button--compact {
      min-height: 56px;
      padding: 10px 22px 10px 18px;
      font-size: 17px;
      border-radius: var(--radius-pill);
      box-shadow: 0 6px 18px rgba(59, 130, 246, 0.3);
    }
    .button--compact .button__icon {
      animation: none;
      width: 20px;
      height: 20px;
    }
    @media (max-width: 480px) {
      .button {
        padding: 10px 20px 10px 18px;
        font-size: 18px;
        gap: 12px;
      }
      .button__meta {
        font-size: 13px;
      }
    }
    @keyframes bob {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(3px);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .button__icon {
        animation: none;
      }
      .button::after {
        display: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadButton {
  readonly label = input('Baixar o MUSE');
  readonly compact = input(false);
  readonly started = output<void>();

  protected readonly release = inject(ReleaseService);
  private readonly confetti = inject(ConfettiService);

  protected celebrate(event: MouseEvent): void {
    this.confetti.burst({ x: event.clientX, y: event.clientY });
    this.started.emit();
  }
}
