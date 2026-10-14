import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** 2px rounded-stroke icon set for the landing page (24x24 grid). */
const ICONS: Record<string, string> = {
  phone: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2 17h4',
  bluetooth: 'M7 7l10 10-5 5V2l5 5L7 17',
  display: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 4-3 8 3-1.5L15 15Z',
  route:
    'M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.5 15.5 15 9M9 16c3 0 5-2 6-4',
  gauge: 'M4 15a8 8 0 1 1 16 0M12 15l4-5M12 15h.01',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Zm4 4a2 2 0 0 0 4 0',
  rain: 'M7 14a4 4 0 0 1 .8-7.9A5.5 5.5 0 0 1 18 7.5a3.5 3.5 0 0 1-1 6.5H7Zm1 3-1 3m5-3-1 3m5-3-1 3',
  offline: 'M3 9c5-5 13-5 18 0M6.5 12.5c3-3 8-3 11 0M10 16a3 3 0 0 1 4 0M12 19h.01M3 3l18 18',
  traffic: 'M8 3h8v18H8zM12 7h.01M12 12h.01M12 17h.01',
  pins: 'M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Zm0-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  toll: 'M4 20V9l8-5 8 5v11M9 20v-6h6v6M12 9h.01',
  history: 'M12 8v4l3 2M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4',
  cloud: 'M7 18a4 4 0 0 1 .5-7.97A5.5 5.5 0 0 1 18 10a4 4 0 0 1-1 8H7Z',
  update: 'M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4',
  bookmark: 'M6 3h12v18l-6-4-6 4V3Z',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  gps: 'M12 2v3m0 14v3M2 12h3m14 0h3M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
  chip: 'M7 7h10v10H7zM10 3v4m4-4v4m-4 10v4m4-4v4M3 10h4m-4 4h4m10-4h4m-4 4h4',
  print: 'M6 9V4h12v5M6 14H4a2 2 0 0 1-2-2V9h20v3a2 2 0 0 1-2 2h-2m-12 6h12v-6H6v6Z',
  check: 'M5 12.5 10 17 19 7',
  star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z',
  sparkle:
    'M12 3v4m0 10v4M3 12h4m10 0h4M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5L12 8Z',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  shield: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Zm-3 9 2 2 4-4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z',
  wind: 'M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h8a2 2 0 1 1-2 2',
  drag: 'M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01',
  search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm5 11.5L20 20',
  calendar:
    'M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm3-2v4m8-4v4M4 10h16',
  brazil: 'M12 3 21 12l-9 9-9-9 9-9Zm0 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  file: 'M7 3h7l5 5v13H7V3Zm7 0v5h5M10 13h5m-5 4h5',
  install: 'M12 3v10m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2',
  key: 'M8 14a5 5 0 1 0-1-9.9A5 5 0 0 0 8 14Zm3-3 9-9m-3 3 2 2m-5 1 2 2',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 5h.01M12 11v6',
  github:
    'M12 3a9 9 0 0 0-2.8 17.5c.4.1.6-.2.6-.4v-1.6c-2.5.5-3-1.1-3-1.1-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-2-.2-4.1-1-4.1-4.4 0-1 .3-1.8.9-2.4-.1-.2-.4-1.2.1-2.4 0 0 .8-.2 2.5.9a8.6 8.6 0 0 1 4.6 0c1.7-1.1 2.5-.9 2.5-.9.5 1.2.2 2.2.1 2.4.6.6.9 1.4.9 2.4 0 3.4-2.1 4.2-4.1 4.4.3.3.6.8.6 1.6v2.4c0 .2.2.5.6.4A9 9 0 0 0 12 3Z',
};

@Component({
  selector: 'app-icon',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="stroke()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path [attr.d]="path()" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
      color: inherit;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<string>();
  readonly size = input(24);
  readonly stroke = input(2);

  protected readonly path = computed(() => ICONS[this.name()] ?? ICONS['info']);
}
