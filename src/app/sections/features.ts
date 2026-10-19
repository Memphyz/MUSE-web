import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealDirective } from '../core/reveal.directive';
import { Icon } from '../shared/icon';

interface Feature {
  icon: string;
  tone: 'sky' | 'sun' | 'leaf' | 'berry' | 'coral';
  title: string;
  text: string;
}

const FEATURES: readonly Feature[] = [
  {
    icon: 'route',
    tone: 'sky',
    title: 'Navegação curva a curva',
    text: 'A seta da próxima curva aparece em cima da rota, com a distância até ela, no celular e no painel.',
  },
  {
    icon: 'gauge',
    tone: 'coral',
    title: 'Velocímetro com o limite da via',
    text: 'A sua velocidade em números grandes. Quando você passa do limite, o número fica vermelho e a placa do limite aparece. O limite vem do mapa e, onde o mapa não diz, do padrão daquele tipo de via.',
  },
  {
    icon: 'bell',
    tone: 'sun',
    title: '18 tipos de alerta',
    text: 'Radar, lombada, pedágio, semáforo, passagem de trem, trecho com acidentes de moto e mais, avisados antes de você chegar, no app e no guidão.',
  },
  {
    icon: 'rain',
    tone: 'sky',
    title: 'Clima no trajeto',
    text: 'Como vai estar o tempo em cada trecho na hora em que você passa por ele: chuva, vento de lado, frio na estrada e os alertas oficiais de tempo severo.',
  },
  {
    icon: 'offline',
    tone: 'leaf',
    title: 'Rota sem internet',
    text: 'Os mapas e os avisos de cada estado ficam guardados no celular. Sem sinal, a busca de endereço, a rota e o recálculo continuam funcionando.',
  },
  {
    icon: 'traffic',
    tone: 'coral',
    title: 'Trânsito ao vivo',
    text: 'O trecho parado aparece em amarelo ou vermelho ao longo da rota, como no Waze, e a hora de chegada leva em conta que a moto passa pelo corredor.',
  },
  {
    icon: 'stops',
    tone: 'berry',
    title: 'Paradas e rota na sua mão',
    text: 'Adicione paradas no caminho, mude a ordem arrastando e puxe a linha da rota para passar por onde você quiser.',
  },
  {
    icon: 'toll',
    tone: 'sun',
    title: 'Pedágio sem cancela',
    text: 'Nas rodovias com pedágio automático, o app percebe quando você passa e lembra do prazo para pagar, com a placa de cada moto cadastrada.',
  },
  {
    icon: 'history',
    tone: 'sky',
    title: 'Histórico e números',
    text: 'As viagens que você fez, com o caminho real, os quilômetros, os recordes e o seu ritmo na cidade, na estrada e na rodovia.',
  },
  {
    icon: 'cloud',
    tone: 'leaf',
    title: 'Sincroniza com a sua conta Google',
    text: 'Lugares, rotas salvas, viagens e motos ficam guardados no seu Google Drive. Trocou de celular, está tudo lá. Ninguém mais tem acesso.',
  },
  {
    icon: 'update',
    tone: 'berry',
    title: 'App e painel se atualizam sozinhos',
    text: 'O app avisa quando tem versão nova e instala com um toque. O painel também se atualiza pelo app, por Bluetooth, mostrando o que mudou antes de instalar.',
  },
  {
    icon: 'bookmark',
    tone: 'sun',
    title: 'Rotas salvas com resumo',
    text: 'Cada rota salva mostra quantos radares, lombadas, semáforos e quilômetros de rodovia tem, para você comparar e escolher com calma.',
  },
];

@Component({
  selector: 'app-features',
  imports: [Icon, RevealDirective],
  template: `
    <section class="section features" id="recursos">
      <div class="container">
        <header class="section-heading" appReveal>
          <span class="eyebrow"><app-icon name="star" [size]="18" /> Recursos</span>
          <h2>Feito para quem pilota, não para quem olha o celular</h2>
          <p>
            Cada função existe porque fez falta numa viagem de verdade. Nada de menu escondido: o
            que importa aparece no guidão, do tamanho que dá para ler a 80 km/h.
          </p>
        </header>

        <ul class="grid">
          @for (feature of features; track feature.title; let i = $index) {
            <li class="card" [class]="'card card--' + feature.tone" [appReveal]="(i % 3) * 90">
              <span class="card__icon"><app-icon [name]="feature.icon" [size]="28" /></span>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.text }}</p>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    .features {
      background: var(--surface);
      border-block: 1px solid var(--outline);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 32px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .card {
      --tone: var(--sky);
      --tone-soft: var(--sky-soft);
      --tone-deep: var(--sky-deep);
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 28px;
      background: #fff;
      border: 1px solid var(--outline);
      border-radius: var(--radius-card);
      overflow: hidden;
      transition:
        transform var(--dur) var(--ease-spring),
        box-shadow var(--dur) ease,
        border-color var(--dur) ease;
    }
    .card::before {
      content: '';
      position: absolute;
      inset: 0 0 auto 0;
      height: 6px;
      background: var(--tone);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform var(--dur-slow) var(--ease-out);
    }
    .card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-card);
      border-color: var(--tone-soft);
    }
    .card:hover::before {
      transform: scaleX(1);
    }
    .card--sun {
      --tone: var(--sun);
      --tone-soft: var(--sun-soft);
      --tone-deep: var(--sun-ink);
    }
    .card--leaf {
      --tone: var(--leaf);
      --tone-soft: var(--leaf-soft);
      --tone-deep: var(--leaf-ink);
    }
    .card--berry {
      --tone: var(--berry);
      --tone-soft: var(--berry-soft);
      --tone-deep: var(--berry-deep);
    }
    .card--coral {
      --tone: var(--coral);
      --tone-soft: var(--coral-soft);
      --tone-deep: var(--coral-deep);
    }
    .card__icon {
      display: grid;
      place-items: center;
      width: 64px;
      height: 64px;
      border-radius: 20px;
      background: var(--tone-soft);
      color: var(--tone-deep);
      transition: transform var(--dur) var(--ease-spring);
    }
    .card:hover .card__icon {
      transform: rotate(-6deg) scale(1.08);
    }
    .card h3 {
      font-size: 22px;
      line-height: 30px;
    }
    .card p {
      color: var(--ink-muted);
      font-size: 17px;
      line-height: 27px;
    }
    @media (max-width: 1024px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 24px;
      }
    }
    @media (max-width: 640px) {
      .grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Features {
  protected readonly features = FEATURES;
}
