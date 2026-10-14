import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AlertsStrip } from '../../sections/alerts-strip';
import { ChangelogSection } from '../../sections/changelog-section';
import { DownloadSection } from '../../sections/download-section';
import { Features } from '../../sections/features';
import { Hero } from '../../sections/hero';
import { HowItWorks } from '../../sections/how-it-works';
import { OfflineSection } from '../../sections/offline-section';
import { PanelSection } from '../../sections/panel-section';
import { SiteFooter } from '../../sections/site-footer';
import { SiteHeader } from '../../sections/site-header';

@Component({
  selector: 'app-landing-page',
  imports: [
    AlertsStrip,
    ChangelogSection,
    DownloadSection,
    Features,
    Hero,
    HowItWorks,
    OfflineSection,
    PanelSection,
    SiteFooter,
    SiteHeader,
  ],
  template: `
    <a class="skip" href="#inicio">Pular para o conteúdo</a>
    <app-site-header />
    <main>
      <app-hero />
      <app-how-it-works />
      <app-features />
      <app-alerts-strip />
      <app-panel-section />
      <app-offline-section />
      <app-changelog-section />
      <app-download-section />
    </main>
    <app-site-footer />
  `,
  styles: `
    .skip {
      position: absolute;
      top: -100px;
      left: 16px;
      z-index: 100;
      padding: 12px 20px;
      border-radius: var(--radius-button);
      background: var(--sky-deep);
      color: #fff;
      font-weight: 700;
      text-decoration: none;
    }
    .skip:focus {
      top: 16px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {}
