import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ReleaseService } from '../../core/release.service';
import { DownloadButton } from '../../shared/download-button';
import { Icon } from '../../shared/icon';
import { MuseLogo } from '../../shared/muse-logo';

/**
 * `/download`: a link to share. It starts the download of the latest APK by
 * itself and keeps a button on screen for browsers that block the automatic
 * start.
 */
@Component({
  selector: 'app-download-page',
  imports: [DownloadButton, Icon, MuseLogo, RouterLink],
  template: `
    <main class="page">
      <div class="box">
        <app-muse-logo [size]="64" />
        <h1>{{ started() ? 'O download começou' : 'Preparando o download' }}</h1>
        <p>
          @if (started()) {
            Quando terminar, toque no arquivo <span class="mono">{{ release.app().file }}</span>
            para instalar. Se nada aconteceu, use o botão abaixo.
          } @else {
            Buscando a versão mais nova publicada do MUSE.
          }
        </p>
        <app-download-button label="Baixar de novo" />
        <a routerLink="/" class="back">
          <app-icon name="arrow" [size]="18" class="back__icon" />
          Voltar para a página do MUSE
        </a>
      </div>
    </main>
  `,
  styles: `
    .page {
      min-height: 100dvh;
      display: grid;
      place-items: center;
      padding: var(--gutter);
      background: radial-gradient(60% 50% at 80% 10%, var(--sky-soft), transparent 70%), var(--bg);
    }
    .box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      max-width: 520px;
      padding: 48px 32px;
      text-align: center;
      border-radius: var(--radius-panel);
      background: #fff;
      border: 1px solid var(--outline);
      box-shadow: var(--shadow-modal);
    }
    h1 {
      font-size: 32px;
      line-height: 40px;
    }
    p {
      color: var(--ink-muted);
    }
    .back {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      font-weight: 700;
    }
    .back__icon {
      transform: rotate(180deg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadPage {
  protected readonly release = inject(ReleaseService);
  protected readonly started = signal(false);

  private readonly document = inject(DOCUMENT);

  constructor() {
    afterNextRender(() => {
      void this.start();
    });
  }

  private async start(): Promise<void> {
    // Give the live data a moment; the snapshot is used if the API is slow.
    const view = this.document.defaultView;
    const deadline = new Promise<void>((resolve) => view?.setTimeout(resolve, 2500));
    await Promise.race([this.waitForLiveData(), deadline]);

    const anchor = this.document.createElement('a');
    anchor.href = this.release.app().url;
    anchor.download = this.release.app().file;
    anchor.rel = 'noopener';
    this.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    this.started.set(true);
  }

  private waitForLiveData(): Promise<void> {
    return new Promise((resolve) => {
      const view = this.document.defaultView;
      const check = () => {
        if (!this.release.loading()) resolve();
        else view?.setTimeout(check, 100);
      };
      check();
    });
  }
}
