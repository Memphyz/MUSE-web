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
    alt: 'Rota de moto traçada no mapa do MUSE, com o trânsito pintado nas vias e a chuva no caminho',
  },
  {
    src: 'assets/shots/route.webp',
    alt: 'Prévia da rota: moto, carro ou a pé, fotos da rua do destino e 8,7 km de Faixa Azul nesta rota',
  },
  {
    src: 'assets/shots/planned.webp',
    alt: 'Viagem planejada para terça às 7h30, com o clima de cada horário de saída',
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
