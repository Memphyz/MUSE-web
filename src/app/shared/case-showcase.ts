import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { PanelDial, PanelScenario } from './panel-dial';

/**
 * Where the screen window sits in each render of the case. The renders are
 * orthographic, so the window is an affine image of a circle: center and
 * diameter as a percentage of the image, and the 2D matrix that maps the
 * dial's own axes onto the projected face. Computed by the render script
 * from the same view the image was drawn with.
 */
interface WindowPlacement {
  src: string;
  centerPct: [number, number];
  diameterPct: number;
  matrix: [number, number, number, number];
}

const VIEWS: Record<'front' | 'three-quarter', WindowPlacement> = {
  front: {
    src: 'assets/prototype/case-front.webp',
    centerPct: [50, 49.9],
    diameterPct: 51.39,
    matrix: [1, 0, 0, 0.9998],
  },
  'three-quarter': {
    src: 'assets/prototype/case-34.webp',
    centerPct: [56.73, 43.66],
    diameterPct: 54.96,
    matrix: [0.7759, 0.4824, 0, 0.6444],
  },
};

/** The printed case with the live panel running inside its window. */
@Component({
  selector: 'app-case-showcase',
  imports: [NgOptimizedImage, PanelDial],
  template: `
    <div class="case">
      <img
        [ngSrc]="placement().src"
        width="1100"
        height="1100"
        [alt]="alt()"
        class="case__render"
      />
      <div
        class="case__window"
        [style.left.%]="placement().centerPct[0] - placement().diameterPct / 2"
        [style.top.%]="placement().centerPct[1] - placement().diameterPct / 2"
        [style.width.%]="placement().diameterPct"
        [style.transform]="transform()"
      >
        <app-panel-dial [scenario]="scenario()" label="" />
        <span class="case__glass" aria-hidden="true"></span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .case {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
    }
    .case__render {
      width: 100%;
      height: auto;
      display: block;
    }
    .case__window {
      position: absolute;
      aspect-ratio: 1;
      border-radius: 50%;
      overflow: hidden;
      transform-origin: center;
      background: #0b1220;
      box-shadow: inset 0 0 18px rgba(0, 0, 0, 0.9);
    }
    .case__window app-panel-dial {
      width: 100%;
      height: 100%;
    }
    .case__glass {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background:
        radial-gradient(120% 90% at 30% 10%, rgba(255, 255, 255, 0.16), transparent 45%),
        radial-gradient(100% 100% at 50% 50%, transparent 70%, rgba(0, 0, 0, 0.35));
      pointer-events: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseShowcase {
  readonly view = input<'front' | 'three-quarter'>('front');
  readonly scenario = input<PanelScenario>('route');
  readonly alt = input('Carcaça preta do MUSE com o painel ligado, mostrando a navegação');

  protected readonly placement = computed(() => VIEWS[this.view()]);
  protected readonly transform = computed(() => {
    const [a, b, c, d] = this.placement().matrix;
    return `matrix(${a}, ${b}, ${c}, ${d}, 0, 0)`;
  });
}
