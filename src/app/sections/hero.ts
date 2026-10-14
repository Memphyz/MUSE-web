import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

import { MotionService } from '../core/motion.service';
import { ReleaseService } from '../core/release.service';
import { RevealDirective } from '../core/reveal.directive';
import { DownloadButton } from '../shared/download-button';
import { Icon } from '../shared/icon';
import { PanelDial } from '../shared/panel-dial';
import { PhoneFrame, PhoneShot } from '../shared/phone-frame';

const SHOTS: readonly PhoneShot[] = [
  {
    src: 'assets/shots/route-map.webp',
    alt: 'Rota traçada no mapa do MUSE, com o trânsito das vias ao redor',
  },
  {
    src: 'assets/shots/route.webp',
    alt: 'Prévia da rota: tempo, distância, riscos nesta rota e o clima no trajeto',
  },
  { src: 'assets/shots/home.webp', alt: 'Mapa do MUSE com os alertas da via por perto' },
  {
    src: 'assets/shots/saved.webp',
    alt: 'Rotas salvas com o retrato de radares, lombadas e semáforos de cada uma',
  },
];

@Component({
  selector: 'app-hero',
  imports: [DownloadButton, Icon, PanelDial, PhoneFrame, RevealDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly release = inject(ReleaseService);
  protected readonly shots = SHOTS;
  protected readonly activeShot = signal(0);

  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (this.motion.reduced()) return;
      const timer = setInterval(() => {
        this.activeShot.update((index) => (index + 1) % SHOTS.length);
      }, 3800);
      this.destroyRef.onDestroy(() => clearInterval(timer));
    });
  }

  protected selectShot(index: number): void {
    this.activeShot.set(index);
  }
}
