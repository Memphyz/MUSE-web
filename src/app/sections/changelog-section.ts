import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { RELEASES_PAGE } from '../core/release-snapshot';
import { ReleaseService, formatShortDate } from '../core/release.service';
import { ChangelogGroupName } from '../core/release.models';
import { RevealDirective } from '../core/reveal.directive';
import { Icon } from '../shared/icon';

const GROUP_ICONS: Record<ChangelogGroupName, string> = {
  Novidades: 'sparkle',
  Melhorias: 'star',
  Correções: 'check',
};

@Component({
  selector: 'app-changelog-section',
  imports: [Icon, RevealDirective],
  template: `
    <section class="section" id="novidades">
      <div class="container">
        <header class="section-heading" appReveal>
          <span class="eyebrow"><app-icon name="update" [size]="18" /> Novidades</span>
          <h2>O que mudou nas últimas versões</h2>
          <p>
            Esta lista vem do mesmo lugar de onde o app baixa as atualizações. É o que você vê no
            celular antes de instalar uma versão nova.
          </p>
        </header>

        <div class="versions" appReveal="80">
          <span class="badge badge--app">
            <app-icon name="phone" [size]="18" />
            App <strong class="mono">{{ release.app().version }}</strong>
          </span>
          <span class="badge badge--fw">
            <app-icon name="chip" [size]="18" />
            Painel <strong class="mono">{{ release.firmware().version }}</strong>
          </span>
          <span class="badge badge--source" [class.badge--live]="release.app().source === 'live'">
            <span class="badge__dot"></span>
            {{ release.app().source === 'live' ? 'Atualizado agora' : 'Última versão conhecida' }}
          </span>
        </div>

        <ol class="timeline">
          @for (entry of entries(); track entry.version; let first = $first) {
            <li class="entry" [appReveal]="first ? 120 : 0">
              <details class="entry__details" [open]="first">
                <summary class="entry__summary">
                  <span class="entry__marker" aria-hidden="true"></span>
                  <span class="entry__version mono">{{ entry.version }}</span>
                  <span class="entry__date">{{ shortDate(entry.date) }}</span>
                  <span class="entry__count">
                    {{ countItems(entry) }} {{ countItems(entry) === 1 ? 'mudança' : 'mudanças' }}
                  </span>
                  <app-icon name="arrow" [size]="20" class="entry__chevron" />
                </summary>
                <div class="entry__body">
                  @for (group of entry.groups; track group.name) {
                    <section class="group" [class]="'group group--' + group.name.toLowerCase()">
                      <h3>
                        <app-icon [name]="groupIcons[group.name]" [size]="18" />
                        {{ group.name }}
                      </h3>
                      <ul>
                        @for (item of group.items; track item.title) {
                          <li>
                            <strong>{{ item.title }}:</strong> {{ item.text }}
                          </li>
                        }
                      </ul>
                    </section>
                  }
                </div>
              </details>
            </li>
          }
        </ol>

        <p class="more">
          <a [href]="releasesPage" target="_blank" rel="noopener">
            Ver todas as versões no GitHub
            <app-icon name="arrow" [size]="18" />
          </a>
        </p>
      </div>
    </section>
  `,
  styles: `
    .versions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 40px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      padding: 0 16px;
      border-radius: var(--radius-pill);
      font-weight: 600;
      font-size: 16px;
    }
    .badge strong {
      font-weight: 700;
    }
    .badge--app {
      background: var(--sky-soft);
      color: var(--sky-deep);
    }
    .badge--fw {
      background: var(--leaf-soft);
      color: var(--leaf-ink);
    }
    .badge--source {
      background: var(--surface-sunken);
      color: var(--ink-muted);
    }
    .badge__dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--ink-subtle);
    }
    .badge--live .badge__dot {
      background: var(--leaf);
      box-shadow: 0 0 0 4px var(--leaf-soft);
      animation: blink 2s ease-in-out infinite;
    }
    @keyframes blink {
      50% {
        box-shadow: 0 0 0 8px rgba(220, 252, 231, 0.4);
      }
    }
    .timeline {
      position: relative;
      margin: 0;
      padding: 0 0 0 28px;
      list-style: none;
      max-width: 880px;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 8px;
      bottom: 8px;
      width: 2px;
      background: var(--outline);
    }
    .entry + .entry {
      margin-top: 16px;
    }
    .entry__details {
      border: 1px solid var(--outline);
      border-radius: var(--radius-card);
      background: #fff;
      transition:
        box-shadow var(--dur) ease,
        border-color var(--dur) ease;
    }
    .entry__details[open] {
      box-shadow: var(--shadow-card);
      border-color: var(--sky-soft);
    }
    .entry__summary {
      position: relative;
      display: flex;
      align-items: center;
      gap: 16px;
      min-height: 64px;
      padding: 12px 20px;
      cursor: pointer;
      list-style: none;
      border-radius: var(--radius-card);
    }
    .entry__summary::-webkit-details-marker {
      display: none;
    }
    .entry__summary:focus-visible {
      outline: 3px solid var(--sky);
      outline-offset: 2px;
    }
    .entry__marker {
      position: absolute;
      left: -28px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #fff;
      border: 3px solid var(--ink-faint);
      transform: translateX(-50%);
      margin-left: 9px;
    }
    .entry__details[open] .entry__marker {
      border-color: var(--sky);
      background: var(--sky);
      box-shadow: 0 0 0 4px var(--sky-soft);
    }
    .entry__version {
      font-weight: 700;
      font-size: 20px;
      color: var(--ink);
    }
    .entry__date {
      color: var(--ink-subtle);
      font-size: 16px;
    }
    .entry__count {
      margin-left: auto;
      color: var(--ink-muted);
      font-size: 15px;
      white-space: nowrap;
    }
    .entry__chevron {
      color: var(--ink-subtle);
      transform: rotate(90deg);
      transition: transform var(--dur) var(--ease-spring);
    }
    .entry__details[open] .entry__chevron {
      transform: rotate(-90deg);
    }
    .entry__body {
      padding: 4px 20px 24px;
      display: grid;
      gap: 20px;
    }
    .group h3 {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-body);
      font-size: 16px;
      line-height: 24px;
      padding: 4px 12px 4px 10px;
      border-radius: var(--radius-pill);
      margin-bottom: 12px;
    }
    .group--novidades h3 {
      background: var(--sky-soft);
      color: var(--sky-deep);
    }
    .group--melhorias h3 {
      background: var(--sun-soft);
      color: var(--sun-ink);
    }
    .group--correções h3 {
      background: var(--leaf-soft);
      color: var(--leaf-ink);
    }
    .group ul {
      margin: 0;
      padding-left: 22px;
      display: grid;
      gap: 10px;
      color: var(--ink-muted);
      font-size: 17px;
      line-height: 27px;
    }
    .group strong {
      color: var(--ink);
    }
    .more {
      margin-top: 32px;
    }
    .more a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      font-weight: 700;
      color: var(--sky-deep);
    }
    @media (max-width: 600px) {
      .entry__summary {
        flex-wrap: wrap;
        gap: 8px 12px;
      }
      .entry__count {
        margin-left: 0;
        width: 100%;
      }
      .entry__chevron {
        position: absolute;
        right: 16px;
        top: 20px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogSection {
  protected readonly release = inject(ReleaseService);
  protected readonly releasesPage = RELEASES_PAGE;
  protected readonly groupIcons = GROUP_ICONS;
  protected readonly entries = computed(() => this.release.app().changelog.slice(0, 6));

  protected shortDate(iso: string): string {
    return formatShortDate(iso);
  }

  protected countItems(entry: { groups: { items: unknown[] }[] }): number {
    return entry.groups.reduce((sum, group) => sum + group.items.length, 0);
  }
}
