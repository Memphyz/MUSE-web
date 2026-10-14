import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealDirective } from '../core/reveal.directive';

interface Alert {
  icon: string;
  label: string;
}

/** The 18 alert types the app knows, with the very icons the panel draws. */
const ALERTS: readonly Alert[] = [
  { icon: 'alert_speed_radar', label: 'Radar de velocidade' },
  { icon: 'alert_red_light_radar', label: 'Radar semafórico' },
  { icon: 'alert_surveillance_camera', label: 'Câmera de monitoramento' },
  { icon: 'alert_speed_bump', label: 'Lombada' },
  { icon: 'alert_raised_crossing', label: 'Travessia elevada' },
  { icon: 'alert_toll', label: 'Pedágio' },
  { icon: 'alert_free_flow', label: 'Pedágio sem cancela' },
  { icon: 'alert_traffic_signals', label: 'Semáforo' },
  { icon: 'alert_stop', label: 'PARE' },
  { icon: 'alert_give_way', label: 'Dê a preferência' },
  { icon: 'alert_level_crossing', label: 'Cruzamento de trem' },
  { icon: 'alert_accidents', label: 'Trecho com acidentes' },
  { icon: 'alert_sharp_curve', label: 'Curva fechada' },
  { icon: 'alert_obstacle', label: 'Obstáculo na via' },
  { icon: 'alert_ford', label: "Travessia d'água" },
  { icon: 'alert_slippery_road', label: 'Pista escorregadia' },
  { icon: 'alert_unpaved', label: 'Sem asfalto' },
  { icon: 'alert_animal_hazard', label: 'Animais na pista' },
];

@Component({
  selector: 'app-alerts-strip',
  imports: [NgOptimizedImage, RevealDirective],
  template: `
    <section class="strip" aria-labelledby="alerts-title">
      <div class="container strip__head" appReveal>
        <h2 id="alerts-title">Os 18 avisos que o painel conhece</h2>
        <p>
          Os mesmos ícones que o app desenha no mapa vão para o guidão, no ponto exato da rota.
          Nunca só a cor: sempre o desenho e a distância.
        </p>
      </div>

      <div class="marquee" aria-hidden="true">
        <ul class="marquee__track">
          @for (alert of alerts; track alert.icon) {
            <li class="chip">
              <img [ngSrc]="'assets/icons/' + alert.icon + '.svg'" width="40" height="40" alt="" />
              <span>{{ alert.label }}</span>
            </li>
          }
          @for (alert of alerts; track alert.icon + '-dup') {
            <li class="chip">
              <img [ngSrc]="'assets/icons/' + alert.icon + '.svg'" width="40" height="40" alt="" />
              <span>{{ alert.label }}</span>
            </li>
          }
        </ul>
      </div>

      <ul class="visually-hidden">
        @for (alert of alerts; track alert.icon) {
          <li>{{ alert.label }}</li>
        }
      </ul>
    </section>
  `,
  styles: `
    .strip {
      padding-block: 80px;
      overflow: hidden;
    }
    .strip__head {
      text-align: center;
      max-width: 760px;
      margin-bottom: 40px;
    }
    .strip__head p {
      margin-top: 16px;
      color: var(--ink-muted);
      font-size: 19px;
      line-height: 30px;
    }
    .marquee {
      position: relative;
      mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
    }
    .marquee__track {
      display: flex;
      gap: 16px;
      width: max-content;
      margin: 0;
      padding: 8px 0;
      list-style: none;
      animation: scroll 48s linear infinite;
    }
    .marquee:hover .marquee__track {
      animation-play-state: paused;
    }
    @keyframes scroll {
      to {
        transform: translateX(-50%);
      }
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 10px 20px 10px 12px;
      border: 1px solid var(--outline);
      border-radius: var(--radius-pill);
      background: #fff;
      font-weight: 700;
      font-size: 17px;
      white-space: nowrap;
      box-shadow: var(--shadow-card);
    }
    .chip img {
      width: 40px;
      height: 40px;
    }
    @media (prefers-reduced-motion: reduce) {
      .marquee__track {
        animation: none;
        flex-wrap: wrap;
        width: auto;
        justify-content: center;
        padding-inline: var(--gutter);
      }
      .marquee__track .chip:nth-child(n + 19) {
        display: none;
      }
      .marquee {
        mask-image: none;
        -webkit-mask-image: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsStrip {
  protected readonly alerts = ALERTS;
}
