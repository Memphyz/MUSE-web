import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RELEASES_PAGE } from '../core/release-snapshot';
import { ReleaseService } from '../core/release.service';
import { Icon } from '../shared/icon';
import { MuseLogo } from '../shared/muse-logo';

@Component({
  selector: 'app-site-footer',
  imports: [Icon, MuseLogo],
  template: `
    <footer class="footer">
      <div class="container footer__grid">
        <div class="footer__brand">
          <app-muse-logo [size]="44" />
          <div>
            <p class="footer__name">MUSE</p>
            <p class="footer__tagline">Motorcycle Unified Smart Engine</p>
          </div>
        </div>

        <nav class="footer__links" aria-label="Links do rodapé">
          <a href="#como-funciona">Como funciona</a>
          <a href="#recursos">Recursos</a>
          <a href="#painel">O painel</a>
          <a href="#novidades">Novidades</a>
          <a href="#baixar">Baixar</a>
          <a [href]="releasesPage" target="_blank" rel="noopener">
            <app-icon name="github" [size]="18" /> Todas as versões
          </a>
        </nav>

        <p class="footer__versions mono">
          app {{ release.app().version }} · painel {{ release.firmware().version }}
        </p>
      </div>

      <div class="container footer__legal">
        <p>
          Dados do mapa © colaboradores do
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener"
            >OpenStreetMap</a
          >, sob a ODbL. Radares e pedágios da ANTT e do DNIT; trechos com acidentes da PRF;
          contornos dos estados do IBGE; avisos meteorológicos do INMET; previsão do Open-Meteo.
        </p>
        <p>
          O MUSE é um projeto independente. Pilote com atenção: o painel ajuda, quem decide é você.
        </p>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      border-top: 1px solid var(--outline);
      background: var(--surface);
      padding-block: 48px 32px;
    }
    .footer__grid {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 24px 40px;
    }
    .footer__brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .footer__name {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 22px;
      letter-spacing: 0.08em;
    }
    .footer__tagline {
      color: var(--ink-subtle);
      font-size: 15px;
      line-height: 22px;
    }
    .footer__links {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 8px;
    }
    .footer__links a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 44px;
      padding: 0 12px;
      border-radius: var(--radius-pill);
      color: var(--ink-muted);
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
    }
    .footer__links a:hover {
      background: var(--sky-soft);
      color: var(--sky-deep);
    }
    .footer__versions {
      color: var(--ink-subtle);
      font-size: 14px;
    }
    .footer__legal {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--outline);
      display: grid;
      gap: 8px;
      color: var(--ink-subtle);
      font-size: 15px;
      line-height: 23px;
    }
    .footer__legal a {
      color: var(--ink-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  protected readonly release = inject(ReleaseService);
  protected readonly releasesPage = RELEASES_PAGE;
}
