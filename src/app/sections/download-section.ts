import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { RELEASES_PAGE } from '../core/release-snapshot';
import { ReleaseService } from '../core/release.service';
import { RevealDirective } from '../core/reveal.directive';
import { DownloadButton } from '../shared/download-button';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-download-section',
  imports: [DownloadButton, Icon, RevealDirective],
  template: `
    <section class="section" id="baixar">
      <div class="container">
        <div class="card" appReveal>
          <div class="card__copy">
            <span class="card__eyebrow"><app-icon name="install" [size]="18" /> Baixar</span>
            <h2>Bora rodar?</h2>
            <p class="card__lead">
              O botão baixa direto a versão mais nova publicada. Depois da primeira instalação, o
              app se atualiza sozinho: você nunca mais volta aqui, a não ser para mostrar para um
              amigo.
            </p>

            <div class="card__cta">
              <app-download-button label="Baixar o MUSE" (started)="markStarted()" />
              @if (started()) {
                <p class="card__started" role="status">
                  <app-icon name="check" [size]="20" />
                  O download começou. Quando terminar, toque no arquivo para instalar.
                </p>
              }
            </div>

            <dl class="meta">
              <div>
                <dt>Versão</dt>
                <dd class="mono">{{ release.app().version }}</dd>
              </div>
              <div>
                <dt>Tamanho</dt>
                <dd class="mono">{{ release.sizeLabel() }}</dd>
              </div>
              <div>
                <dt>Publicado em</dt>
                <dd>{{ release.publishedLabel() }}</dd>
              </div>
              <div>
                <dt>Arquivo</dt>
                <dd class="mono">{{ release.app().file }}</dd>
              </div>
            </dl>
          </div>

          <div class="card__steps">
            <h3>Como instalar</h3>
            <ol class="steps">
              <li>
                <span class="steps__number mono">1</span>
                <div>
                  <strong>Baixe o instalador</strong>
                  <p>No celular Android, toque no botão. O arquivo vai para a pasta Downloads.</p>
                </div>
              </li>
              <li>
                <span class="steps__number mono">2</span>
                <div>
                  <strong>Permita a instalação</strong>
                  <p>
                    Na primeira vez, o Android pergunta se pode instalar apps vindos do navegador. É
                    só aceitar.
                  </p>
                </div>
              </li>
              <li>
                <span class="steps__number mono">3</span>
                <div>
                  <strong>Abra o app e conecte o painel</strong>
                  <p>
                    Ligue a moto, digite no app o código de 6 dígitos que aparece no painel, e boa
                    viagem.
                  </p>
                </div>
              </li>
            </ol>

            <ul class="requirements" aria-label="Requisitos">
              <li><app-icon name="phone" [size]="18" /> Android 8.0 ou mais novo</li>
              <li><app-icon name="bluetooth" [size]="18" /> Bluetooth</li>
              <li><app-icon name="gps" [size]="18" /> GPS</li>
            </ul>

            <p class="fallback">
              Prefere ver todas as versões?
              <a [href]="releasesPage" target="_blank" rel="noopener"
                >Abra a página de versões no GitHub</a
              >.
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .card {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
      gap: 48px;
      padding: 56px;
      border-radius: var(--radius-panel);
      background:
        radial-gradient(60% 80% at 100% 0%, rgba(254, 243, 199, 0.8), transparent 70%),
        linear-gradient(160deg, #eff6ff, #dbeafe);
      border: 1px solid var(--sky-soft);
      box-shadow: var(--shadow-active);
    }
    .card__eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: var(--radius-pill);
      background: #fff;
      color: var(--sky-deep);
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 20px;
    }
    .card__lead {
      margin-top: 16px;
      font-size: 19px;
      line-height: 30px;
      color: var(--ink-muted);
      max-width: 540px;
    }
    .card__cta {
      margin-top: 32px;
      display: grid;
      gap: 16px;
      justify-items: start;
    }
    .card__started {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 18px;
      border-radius: var(--radius-pill);
      background: var(--leaf-soft);
      color: var(--leaf-ink);
      font-weight: 600;
      font-size: 16px;
      animation: pop 480ms var(--ease-spring) both;
    }
    @keyframes pop {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
    }
    .meta {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px 24px;
      margin: 36px 0 0;
    }
    .meta div {
      padding: 14px 18px;
      border-radius: var(--radius-input);
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.9);
    }
    .meta dt {
      font-size: 14px;
      line-height: 20px;
      color: var(--ink-subtle);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .meta dd {
      margin: 2px 0 0;
      font-size: 17px;
      line-height: 26px;
      font-weight: 600;
      color: var(--ink);
      overflow-wrap: anywhere;
    }
    .card__steps {
      padding: 32px;
      border-radius: var(--radius-card);
      background: #fff;
      border: 1px solid var(--outline);
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .steps {
      display: grid;
      gap: 20px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .steps li {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    .steps__number {
      flex: none;
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--sun);
      color: var(--ink);
      font-weight: 700;
      font-size: 18px;
    }
    .steps strong {
      display: block;
      font-size: 18px;
      line-height: 26px;
    }
    .steps p {
      color: var(--ink-muted);
      font-size: 16px;
      line-height: 25px;
      margin-top: 2px;
    }
    .requirements {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .requirements li {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: var(--radius-pill);
      background: var(--surface-sunken);
      color: var(--ink-muted);
      font-size: 15px;
      font-weight: 600;
    }
    .fallback {
      color: var(--ink-muted);
      font-size: 16px;
      line-height: 24px;
    }
    @media (max-width: 960px) {
      .card {
        grid-template-columns: 1fr;
        padding: 32px;
        gap: 32px;
      }
    }
    @media (max-width: 520px) {
      .card {
        padding: 24px 20px;
      }
      .meta {
        grid-template-columns: 1fr;
      }
      .card__steps {
        padding: 24px 20px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadSection {
  protected readonly release = inject(ReleaseService);
  protected readonly releasesPage = RELEASES_PAGE;
  protected readonly started = signal(false);

  protected markStarted(): void {
    this.started.set(true);
  }
}
