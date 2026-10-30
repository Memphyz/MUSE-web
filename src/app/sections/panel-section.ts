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
      'O mapa com as cores do app e as avenidas em amarelo, a seta azul no centro, e embaixo a velocidade, a próxima curva no quadrado azul e a distância em números grandes. O trecho lento ganha a borda do trânsito.',
  },
  {
    id: 'radar',
    label: 'Radar à frente',
    caption:
      'O radar aparece sobre a rota no ponto exato. Acima do limite, a velocidade fica vermelha e o radar pulsa até você reduzir.',
  },
  {
    id: 'bump',
    label: 'Lombada',
    caption:
      'Lombadas, faixas elevadas e obstáculos aparecem com o mesmo ícone do app, vão se aproximando conforme a moto anda e passam por baixo do cartão quando você chega neles.',
  },
  {
    id: 'rain',
    label: 'Chuva',
    caption:
      'O painel avisa a quantos quilômetros está a chuva, e o aviso de pista escorregadia entra na rota como qualquer outro.',
  },
  {
    id: 'tunnel',
    label: 'Túnel',
    caption:
      'O que está embaixo da roda aparece no alto da tela: túnel, estrada de terra, pista lisa.',
  },
  {
    id: 'night',
    label: 'Estrada sem luz',
    caption:
      'Depois do pôr do sol, num trecho sem poste, o painel avisa "SEM LUZ" para você reduzir antes da curva.',
  },
  {
    id: 'monument',
    label: 'Rota Biker',
    caption:
      'Os monumentos da Rota Biker que você ainda não carimbou aparecem em cima da rota. Depois de carimbar no passaporte do app, eles somem.',
  },
  {
    id: 'rejoin',
    label: 'Volte à rota',
    caption:
      'Fora da rota e sem sinal para refazer o caminho, o painel mostra a volta à rota e a distância até ela, em vez da manobra antiga.',
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
  protected readonly perspective = signal(true);
  protected readonly release = inject(ReleaseService);

  protected select(scenario: Scenario): void {
    this.active.set(scenario);
  }

  protected setPerspective(value: boolean): void {
    this.perspective.set(value);
  }
}
