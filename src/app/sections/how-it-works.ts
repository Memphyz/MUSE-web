import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealDirective } from '../core/reveal.directive';
import { Icon } from '../shared/icon';

interface Step {
  icon: string;
  title: string;
  text: string;
  detail: string;
}

const STEPS: readonly Step[] = [
  {
    icon: 'phone',
    title: 'O celular calcula',
    text: 'Posição, rota, limite da via, avisos e clima: tudo é decidido no app. Ele melhora a cada versão e se atualiza sozinho, sem mexer no painel.',
    detail: 'App Android',
  },
  {
    icon: 'bluetooth',
    title: 'O Bluetooth leva o recado',
    text: 'O celular manda só o que o painel precisa mostrar: velocidade, próxima manobra, ruas em volta, avisos, chegada e hora. Nada de senha nem de app de terceiros.',
    detail: 'Bluetooth · pareia uma vez',
  },
  {
    icon: 'display',
    title: 'O painel desenha',
    text: 'Uma tela redonda no guidão que desenha o que chega, sem travar e sem distrair. O painel não guarda sua posição e não precisa de internet.',
    detail: 'Tela redonda · liga com a chave',
  },
  {
    icon: 'print',
    title: 'A carcaça segura tudo',
    text: 'Impressa em 3D, no mesmo suporte e no mesmo conector do acessório original da moto. Liga na chave e dorme quando a ignição desliga.',
    detail: 'Impressão 3D · encaixe original',
  },
];

@Component({
  selector: 'app-how-it-works',
  imports: [Icon, RevealDirective],
  template: `
    <section class="section" id="como-funciona">
      <div class="container">
        <header class="section-heading" appReveal>
          <span class="eyebrow"><app-icon name="route" [size]="18" /> Como funciona</span>
          <h2>Quatro peças, um só caminho</h2>
          <p>
            O MUSE separa quem pensa de quem mostra. Por isso o painel gasta pouca bateria, a lógica
            melhora a cada versão do app, e a moto nunca precisa voltar para a bancada.
          </p>
        </header>

        <ol class="steps">
          @for (step of steps; track step.title; let i = $index) {
            <li class="step" [appReveal]="i * 100">
              <span class="step__number mono">0{{ i + 1 }}</span>
              <span class="step__icon"><app-icon [name]="step.icon" [size]="28" /></span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
              <span class="step__detail mono">{{ step.detail }}</span>
              @if (i < steps.length - 1) {
                <span class="step__connector" aria-hidden="true"></span>
              }
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .steps {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 32px;
      margin: 0;
      padding: 0;
      list-style: none;
      counter-reset: step;
    }
    .step {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 28px;
      border: 1px solid var(--outline);
      border-radius: var(--radius-card);
      background: var(--surface);
      transition:
        transform var(--dur) var(--ease-spring),
        box-shadow var(--dur) ease,
        border-color var(--dur) ease;
    }
    .step:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-active);
      border-color: var(--sky-bright);
    }
    .step__number {
      font-size: 14px;
      font-weight: 700;
      color: var(--ink-subtle);
      letter-spacing: 0.1em;
    }
    .step__icon {
      display: grid;
      place-items: center;
      width: 64px;
      height: 64px;
      border-radius: 20px;
      background: var(--sky-soft);
      color: var(--sky-deep);
      margin-bottom: 4px;
    }
    .step p {
      color: var(--ink-muted);
      font-size: 17px;
      line-height: 27px;
      flex: 1;
    }
    .step__detail {
      white-space: nowrap;
      letter-spacing: 0;
      font-size: 13px;
      font-weight: 700;
      color: var(--sky-deep);
      background: #fff;
      border: 1px solid var(--outline);
      border-radius: var(--radius-pill);
      padding: 6px 10px;
      align-self: flex-start;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .step__connector {
      position: absolute;
      top: 60px;
      right: -32px;
      width: 32px;
      height: 2px;
      background: repeating-linear-gradient(90deg, var(--sky-bright) 0 6px, transparent 6px 12px);
      background-size: 200% 100%;
      animation: dash 1.2s linear infinite;
    }
    @keyframes dash {
      to {
        background-position: -24px 0;
      }
    }
    @media (max-width: 1024px) {
      .steps {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 24px;
      }
      .step__connector {
        display: none;
      }
    }
    @media (max-width: 600px) {
      .steps {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorks {
  protected readonly steps = STEPS;
}
