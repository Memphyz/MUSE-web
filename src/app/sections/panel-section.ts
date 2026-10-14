import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ReleaseService } from '../core/release.service';
import { RevealDirective } from '../core/reveal.directive';
import { CaseShowcase } from '../shared/case-showcase';
import { Icon } from '../shared/icon';
import { PanelDial, PanelScenario } from '../shared/panel-dial';

interface Scenario {
  id: PanelScenario;
  label: string;
  caption: string;
}

const SCENARIOS: readonly Scenario[] = [
  {
    id: 'route',
    label: 'Navegando',
    caption:
      'A rota em branco, as ruas em volta em cinza, a seta fixa no centro e a próxima manobra com a distância em números grandes.',
  },
  {
    id: 'radar',
    label: 'Radar à frente',
    caption:
      'O radar aparece sobre a rota no ponto exato. Acima do limite, o número fica vermelho e a placa do limite sobe no anel.',
  },
  {
    id: 'bump',
    label: 'Lombada',
    caption:
      'Lombadas, travessias e obstáculos chegam com o mesmo ícone do app, se aproximando conforme a moto anda.',
  },
  {
    id: 'rain',
    label: 'Chuva',
    caption:
      'O clima do trajeto avisa a distância até a chuva, e a pista escorregadia entra na fila de eventos da rota.',
  },
  {
    id: 'tunnel',
    label: 'Túnel',
    caption:
      'O que é estado da via embaixo da roda vira um chip no topo: túnel, piso solto, rampa, ponte.',
  },
  {
    id: 'night',
    label: 'Estrada sem luz',
    caption:
      'Depois do pôr do sol, num trecho sem poste, o painel avisa "SEM LUZ" para você reduzir antes da curva.',
  },
];

@Component({
  selector: 'app-panel-section',
  imports: [CaseShowcase, Icon, PanelDial, RevealDirective],
  templateUrl: './panel-section.html',
  styleUrl: './panel-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelSection {
  protected readonly scenarios = SCENARIOS;
  protected readonly active = signal<Scenario>(SCENARIOS[0]);
  protected readonly release = inject(ReleaseService);

  protected select(scenario: Scenario): void {
    this.active.set(scenario);
  }
}
