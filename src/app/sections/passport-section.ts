import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealDirective } from '../core/reveal.directive';
import { Icon } from '../shared/icon';
import { PhoneFrame, PhoneShot } from '../shared/phone-frame';

const COVER: readonly PhoneShot[] = [
  {
    src: 'assets/shots/passport-cover.webp',
    alt: 'Capa do Passaporte Rota Biker no app, com 2 de 37 monumentos carimbados',
  },
];

const STAMP: readonly PhoneShot[] = [
  {
    src: 'assets/shots/passport-stamp.webp',
    alt: 'Página do passaporte com o carimbo do monumento 27, Restaurante Pedra do Baú, e a data da visita',
  },
];

@Component({
  selector: 'app-passport-section',
  imports: [Icon, PhoneFrame, RevealDirective],
  template: `
    <section class="section passport" id="passaporte">
      <div class="container layout">
        <header class="section-heading" appReveal>
          <span class="eyebrow"><app-icon name="passport" [size]="18" /> Rota Biker</span>
          <h2>Um passaporte para carimbar na estrada</h2>
          <p>
            O MUSE conhece os monumentos da Rota Biker. Eles aparecem no mapa do app e no painel, e
            o passaporte fica no app para folhear: capa, a sua identificação com foto e uma página
            por monumento, com o carimbo e a data.
          </p>
          <ul class="points">
            <li>
              <app-icon name="route" [size]="22" />
              <span
                ><strong>Desvio sugerido</strong>: ao planejar uma rota que passa perto de um
                monumento sem carimbo, um toque e ele vira parada</span
              >
            </li>
            <li>
              <app-icon name="check" [size]="22" />
              <span
                ><strong>Carimbo no fim da viagem</strong>: passou por um monumento, o app pergunta
                se você carimbou</span
              >
            </li>
            <li>
              <app-icon name="cloud" [size]="22" />
              <span
                ><strong>Guardado na sua conta Google</strong>, com a foto, em todos os seus
                celulares</span
              >
            </li>
          </ul>
        </header>

        <div class="phones" appReveal="120">
          <app-phone-frame class="phones__back" [shots]="cover" [width]="250" />
          <app-phone-frame class="phones__front" [shots]="stamp" [width]="250" />
        </div>
      </div>
    </section>
  `,
  styles: `
    .passport {
      background: linear-gradient(180deg, transparent, #f2f7f7 30%, #f2f7f7 70%, transparent);
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 48px;
      align-items: center;
    }
    .section-heading {
      margin-bottom: 0;
    }
    .points {
      display: grid;
      gap: 16px;
      margin: 32px 0 0;
      padding: 0;
      list-style: none;
    }
    .points li {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      color: var(--ink-muted);
      font-size: 17px;
      line-height: 26px;
    }
    .points app-icon {
      flex: none;
      margin-top: 2px;
      color: #1f6b6b;
    }
    .points strong {
      color: var(--ink);
    }
    .phones {
      position: relative;
      display: flex;
      justify-content: center;
      padding-block: 24px;
    }
    .phones__back {
      transform: rotate(-6deg) translateX(40px);
    }
    .phones__front {
      transform: rotate(5deg) translate(-40px, 36px);
    }
    @media (max-width: 900px) {
      .layout {
        grid-template-columns: minmax(0, 1fr);
      }
    }
    @media (max-width: 560px) {
      .phones__back {
        display: none;
      }
      .phones__front {
        transform: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassportSection {
  protected readonly cover = COVER;
  protected readonly stamp = STAMP;
}
