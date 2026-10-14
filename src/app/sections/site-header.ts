import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { DownloadButton } from '../shared/download-button';
import { MuseLogo } from '../shared/muse-logo';

const LINKS = [
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#recursos', label: 'Recursos' },
  { href: '#painel', label: 'O painel' },
  { href: '#offline', label: 'Sem internet' },
  { href: '#novidades', label: 'Novidades' },
] as const;

@Component({
  selector: 'app-site-header',
  imports: [DownloadButton, MuseLogo],
  host: {
    role: 'banner',
    '(window:scroll)': 'onScroll()',
    '[class.is-scrolled]': 'scrolled()',
  },
  template: `
    <div class="bar container">
      <a href="#inicio" class="brand" aria-label="MUSE, início da página">
        <app-muse-logo [size]="40" />
        <span class="brand__name">MUSE</span>
      </a>

      <nav class="nav" [class.nav--open]="menuOpen()" aria-label="Seções da página">
        @for (link of links; track link.href) {
          <a [href]="link.href" class="nav__link" (click)="closeMenu()">{{ link.label }}</a>
        }
        <app-download-button class="nav__cta" label="Baixar" [compact]="true" />
      </nav>

      <div class="actions">
        <app-download-button class="actions__cta" label="Baixar" [compact]="true" />
        <button
          type="button"
          class="menu"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="menu-nav"
          aria-label="Abrir o menu"
          (click)="toggleMenu()"
        >
          <span class="menu__line" [class.menu__line--x1]="menuOpen()"></span>
          <span class="menu__line" [class.menu__line--hide]="menuOpen()"></span>
          <span class="menu__line" [class.menu__line--x2]="menuOpen()"></span>
        </button>
      </div>
    </div>
  `,
  styles: `
    :host {
      position: sticky;
      top: 0;
      z-index: 50;
      display: block;
      background: rgba(255, 255, 255, 0.72);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid transparent;
      transition:
        border-color var(--dur) ease,
        box-shadow var(--dur) ease;
    }
    :host(.is-scrolled) {
      border-bottom-color: var(--outline);
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
    }
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      min-height: 76px;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--ink);
      border-radius: var(--radius-input);
    }
    .brand__name {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 24px;
      letter-spacing: 0.08em;
    }
    .nav {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .nav__link {
      display: inline-flex;
      align-items: center;
      min-height: 48px;
      padding: 0 16px;
      border-radius: var(--radius-pill);
      color: var(--ink-muted);
      font-weight: 600;
      font-size: 17px;
      text-decoration: none;
      transition:
        background var(--dur) ease,
        color var(--dur) ease;
    }
    .nav__link:hover {
      background: var(--sky-soft);
      color: var(--sky-deep);
    }
    .nav__cta {
      display: none;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .menu {
      display: none;
      width: 56px;
      height: 56px;
      border: 1px solid var(--outline);
      border-radius: var(--radius-button);
      background: var(--surface);
      cursor: pointer;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    .menu__line {
      display: block;
      width: 22px;
      height: 2.5px;
      border-radius: 2px;
      background: var(--ink);
      transition:
        transform var(--dur) var(--ease-spring),
        opacity var(--dur) ease;
    }
    .menu__line--x1 {
      transform: translateY(7.5px) rotate(45deg);
    }
    .menu__line--x2 {
      transform: translateY(-7.5px) rotate(-45deg);
    }
    .menu__line--hide {
      opacity: 0;
    }
    @media (max-width: 960px) {
      .nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        align-items: stretch;
        gap: 4px;
        padding: 12px var(--gutter) 20px;
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--outline);
        box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
        transform: translateY(-8px);
        opacity: 0;
        visibility: hidden;
        transition:
          opacity var(--dur) ease,
          transform var(--dur) var(--ease-spring),
          visibility 0s linear var(--dur);
      }
      .nav--open {
        transform: none;
        opacity: 1;
        visibility: visible;
        transition-delay: 0s;
      }
      .nav__link {
        min-height: 56px;
        font-size: 18px;
      }
      .nav__cta {
        display: inline-flex;
        margin-top: 8px;
        justify-content: center;
      }
      .actions__cta {
        display: none;
      }
      .menu {
        display: flex;
      }
    }
    @media (min-width: 961px) and (max-width: 1100px) {
      .nav__link {
        padding: 0 10px;
        font-size: 16px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  protected readonly links = LINKS;
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);

  private readonly document = inject(DOCUMENT);

  protected onScroll(): void {
    this.scrolled.set((this.document.defaultView?.scrollY ?? 0) > 8);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
