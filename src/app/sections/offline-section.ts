import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealDirective } from '../core/reveal.directive';
import { CountUp } from '../shared/count-up';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-offline-section',
  imports: [CountUp, Icon, RevealDirective],
  template: `
    <section class="section offline" id="offline">
      <div class="container">
        <div class="layout">
          <header class="section-heading" appReveal>
            <span class="eyebrow"><app-icon name="offline" [size]="18" /> Sem internet</span>
            <h2>O Brasil inteiro cabe no seu celular</h2>
            <p>
              Os mapas e os avisos de cada estado são montados todo dia a partir de fontes públicas.
              O app baixa sozinho o seu estado e os de cada rota que você traça. Na estrada sem
              sinal, a rota, o limite da via e os avisos continuam funcionando.
            </p>
            <ul class="sources" aria-label="Fontes dos dados">
              <li>OpenStreetMap</li>
              <li>ANTT</li>
              <li>PRF</li>
              <li>DNIT</li>
              <li>IBGE</li>
              <li>INMET</li>
              <li>Open-Meteo</li>
            </ul>
          </header>

          <ul class="stats">
            <li class="stat" appReveal="0">
              <span class="stat__value"><app-count-up [value]="27" /></span>
              <span class="stat__label">estados, cada um com os próprios mapas e avisos</span>
            </li>
            <li class="stat" appReveal="100">
              <span class="stat__value"><app-count-up [value]="18" /></span>
              <span class="stat__label">tipos de aviso na via, do radar ao animal na pista</span>
            </li>
            <li class="stat" appReveal="200">
              <span class="stat__value"><app-count-up [value]="7" suffix=" MB" /></span>
              <span class="stat__label">de avisos para o país inteiro, atualizados todo dia</span>
            </li>
            <li class="stat" appReveal="300">
              <span class="stat__value"><app-count-up [value]="400" suffix=" MB" /></span>
              <span class="stat__label"
                >de mapas com o limite de cada via, atualizados todo mês</span
              >
            </li>
            <li class="stat stat--wide" appReveal="400">
              <span class="stat__value mono">0</span>
              <span class="stat__label"
                >toques para atualizar: o app baixa os dados novos sozinho, sem você fazer
                nada</span
              >
            </li>
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: `
    .offline {
      background: var(--ink);
      color: #fff;
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 64px;
      align-items: center;
    }
    .section-heading {
      margin-bottom: 0;
    }
    .section-heading h2 {
      color: #fff;
    }
    .section-heading p {
      color: #cbd5e1;
    }
    .section-heading .eyebrow {
      background: rgba(96, 165, 250, 0.18);
      color: var(--sky-bright);
    }
    .sources {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 24px 0 0;
      padding: 0;
      list-style: none;
    }
    .sources li {
      padding: 6px 14px;
      border-radius: var(--radius-pill);
      border: 1px solid rgba(255, 255, 255, 0.16);
      color: #e2e8f0;
      font-size: 15px;
      font-weight: 700;
    }
    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .stat {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 28px;
      border-radius: var(--radius-card);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition:
        background var(--dur) ease,
        transform var(--dur) var(--ease-spring);
    }
    .stat:hover {
      background: rgba(59, 130, 246, 0.16);
      transform: translateY(-4px);
    }
    .stat--wide {
      grid-column: 1 / -1;
      flex-direction: row;
      align-items: center;
      gap: 24px;
    }
    .stat__value {
      font-family: var(--font-display);
      font-size: 56px;
      line-height: 56px;
      font-weight: 800;
      color: var(--sun);
      font-variant-numeric: tabular-nums;
    }
    .stat__label {
      color: #cbd5e1;
      font-size: 16px;
      line-height: 24px;
    }
    @media (max-width: 960px) {
      .layout {
        grid-template-columns: 1fr;
        gap: 40px;
      }
    }
    @media (max-width: 520px) {
      .stats {
        grid-template-columns: 1fr;
      }
      .stat--wide {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      .stat__value {
        font-size: 44px;
        line-height: 48px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineSection {}
