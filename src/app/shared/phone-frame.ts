import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface PhoneShot {
  src: string;
  alt: string;
}

/**
 * A phone bezel around one or more app screenshots. With several shots the
 * parent drives `active`; the others crossfade underneath.
 */
@Component({
  selector: 'app-phone-frame',
  imports: [NgOptimizedImage],
  template: `
    <div class="phone" [style.width.px]="width()">
      <div class="phone__screen">
        @for (shot of shots(); track shot.src; let i = $index) {
          <img
            [ngSrc]="shot.src"
            [alt]="shot.alt"
            width="640"
            height="1365"
            [priority]="i === 0 && priority()"
            class="phone__shot"
            [class.phone__shot--active]="i === active()"
          />
        }
      </div>
      <span class="phone__speaker" aria-hidden="true"></span>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .phone {
      position: relative;
      aspect-ratio: 1116 / 2380;
      border-radius: 44px;
      padding: 12px;
      background: linear-gradient(160deg, #1f2937, #0f172a 60%, #1e293b);
      box-shadow:
        0 0 0 2px #334155,
        0 30px 60px rgba(15, 23, 42, 0.25),
        inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    }
    .phone__screen {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 34px;
      overflow: hidden;
      background: #f8fafc;
    }
    .phone__shot {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
      opacity: 0;
      transform: scale(1.03);
      transition:
        opacity 700ms var(--ease-out),
        transform 1200ms var(--ease-out);
    }
    .phone__shot--active {
      opacity: 1;
      transform: none;
    }
    .phone__speaker {
      position: absolute;
      top: 22px;
      left: 50%;
      width: 72px;
      height: 6px;
      margin-left: -36px;
      border-radius: 999px;
      background: #0b1220;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneFrame {
  readonly shots = input.required<readonly PhoneShot[]>();
  readonly active = input(0);
  readonly width = input(300);
  readonly priority = input(false);
}
