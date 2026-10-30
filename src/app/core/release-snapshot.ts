import { AppRelease, FirmwareRelease } from './release.models';

export const RELEASES_REPO = 'Memphyz/MUSE-releases';
export const RELEASES_API = `https://api.github.com/repos/${RELEASES_REPO}/releases/tags`;
export const RELEASES_DOWNLOAD = `https://github.com/${RELEASES_REPO}/releases/download`;
export const RELEASES_PAGE = `https://github.com/${RELEASES_REPO}/releases/tag/app`;

/**
 * What was published when this site was built. The page shows this on first
 * paint and swaps in the live data from the GitHub API as soon as it arrives,
 * so the download button never depends on the API being reachable.
 */
export const APP_SNAPSHOT: AppRelease = {
  version: '1.25.0',
  file: 'muse-app-1.25.0.apk',
  url: `${RELEASES_DOWNLOAD}/app/muse-app-1.25.0.apk`,
  sizeBytes: 23474556,
  publishedAt: '2026-10-30T01:55:10Z',
  totalDownloads: 0,
  source: 'snapshot',
  changelog: [
    {
      version: '1.25.0',
      date: '2026-10-29',
      groups: [
        {
          name: 'Novidades',
          items: [
            {
              title: 'Planejar a viagem para mais tarde',
              text: 'na folha da rota, o botão Sair agora abre um calendário e um relógio para escolher quando você vai sair, até uma semana à frente. O tempo de viagem passa a ser o do trânsito de costume naquele dia e hora, o clima no trajeto é o da hora em que você passa por cada trecho, e o rodízio é conferido nesse horário. O X ao lado volta para sair agora. Antes a rota era sempre a de agora.',
            },
            {
              title: 'Horários de saída',
              text: 'a rota escolhida saindo em cinco horários, de meia em meia hora, com o tempo de viagem e o céu de cada um, e um aviso quando sair em outro horário economiza tempo. Tocar num horário o escolhe. Com a saída marcada para depois, a comparação aparece sozinha; saindo agora, toque em Comparar horários.',
            },
            {
              title: 'Planejamento salvo',
              text: 'com a saída marcada para depois, o Iniciar dá lugar a Salvar planejamento, que guarda a rota em Salvos, na seção Planejadas. Quando chegar a hora, é só abrir e iniciar: a rota é a mesma que você viu. O planejamento some sozinho quando a viagem termina ou é encerrada.',
            },
            {
              title: 'Faixa Azul no mapa',
              text: 'os trechos de Faixa Azul de São Paulo aparecem no mapa como a pintura da faixa, um tracejado azul, ao chegar perto. A rota de moto que anda por ela ganha um selo verde em Nesta rota dizendo quanto do caminho é na faixa.',
            },
          ],
        },
        {
          name: 'Melhorias',
          items: [
            {
              title: 'Rota de moto pelas avenidas',
              text: 'na hora do pico, a rota de moto não foge mais das avenidas onde a moto segue pelo corredor e pela Faixa Azul para as ruas de bairro em volta, que para ela são mais lentas. O caminho é escolhido pelas vias rápidas e o tempo continua sendo o do trânsito de agora. O aviso de rota mais rápida durante a navegação também passou a pensar assim.',
            },
            {
              title: 'Editar a rota arrastando',
              text: 'para criar um ponto, segure a linha por um segundo antes de arrastar, o que evita mexer na rota sem querer. O caminho arrastado não volta mais para o de antes a cada tentativa.',
            },
          ],
        },
      ],
    },
    {
      version: '1.24.1',
      date: '2026-10-28',
      groups: [
        {
          name: 'Correções',
          items: [
            {
              title: 'Aba de Ajustes marcada ao voltar',
              text: 'ao voltar para Ajustes pela barra de abas depois de sair por uma das telas de dentro, como Som ou Painel, a barra continuava marcando a aba anterior, do mapa ou dos salvos, mesmo com Ajustes aberto. Agora a aba certa fica marcada.',
            },
          ],
        },
      ],
    },
    {
      version: '1.24.0',
      date: '2026-10-28',
      groups: [
        {
          name: 'Novidades',
          items: [
            {
              title: 'Som da navegação em três opções',
              text: 'o botão de som no canto do mapa agora abre uma pílula com sem som, só alertas e tudo, e fecha sozinho depois da escolha, em alguns segundos ou ao tocar em qualquer outro lugar da tela. Antes ele só ligava e calava a voz das manobras. Sem som cala tudo, até o bipe de excesso de velocidade; só alertas toca os avisos da via com bipe e voz, sem falar as manobras; tudo soma a voz das manobras. A mesma escolha aparece no topo de Ajustes > Som, com a explicação de cada opção. Quem tinha desligado a voz das manobras começa em só alertas.',
            },
            {
              title: 'Alertas falados',
              text: 'com som, cada alerta da via é dito logo depois do bipe, como "Radar reportado à frente", "Radar semafórico reportado à frente", "Lombada à frente", "Pista escorregadia à frente" ou "Trecho com histórico de acidentes à frente, redobre a atenção". Cada tipo de alerta tem a sua frase, em português e em inglês. Acima do limite continua só o bipe, para não cansar. Fala só o que está ligado em Ajustes > Som: alerta desligado, grupo desligado ou tipo desmarcado não bipa nem fala. O "Ouvir o som" de cada grupo agora toca o bipe e a frase, como na moto.',
            },
            {
              title: 'Outros avisos com som',
              text: 'pedágio, pedágio sem cancela, câmera de monitoramento, semáforo e monumento da Rota Biker ganharam um grupo próprio em Ajustes > Som, com bipe e frase, e dá para escolher cada um. O grupo começa desligado; antes esses avisos não tinham som nenhum.',
            },
            {
              title: 'Halloween no app',
              text: 'só no dia 31 de outubro, e nunca durante a rota, o app ganha teias nos cantos de cima, uma aranha que desce e sobe e uma névoa roxa bem leve no pé das telas. Nenhum enfeite atrapalha o toque, e cada animação é curta e acaba sozinha, para poupar a bateria. Com as animações do celular desligadas, nada se mexe.',
            },
            {
              title: 'Bruxinha no mapa',
              text: 'no Halloween, uma bruxinha na vassoura marca onde você está no mapa, no lugar da bolinha azul. Ao começar a rota, volta a seta de sempre.',
            },
            {
              title: 'Abas e Ajustes de Halloween',
              text: 'a aba escolhida fica laranja e ganha um chapéu de bruxa, que balança ao trocar de aba, e o botão de Ajustes da busca também fica laranja. Em Ajustes, abóboras tortas balançam em algumas linhas quando a tela abre, a conta ganha um chapéu, o Histórico vira uma ampulheta, a Aparência vira uma lua com morcego, e um selo diz "Feliz Halloween".',
            },
            {
              title: 'Sustos de Halloween',
              text: 'folhas secas caem por alguns segundos quando o app abre, morcegos cruzam o alto da tela de vez em quando, e um fantasminha espia do canto de baixo para dizer "Bu!" em momentos sorteados.',
            },
          ],
        },
        {
          name: 'Melhorias',
          items: [
            {
              title: 'Inclinar o mapa com dois dedos',
              text: 'o gesto agora funciona com os dedos em alturas diferentes, como o indicador e o anelar. Antes só pegava com os dois dedos quase na mesma altura.',
            },
          ],
        },
      ],
    },
  ],
};

export const FIRMWARE_SNAPSHOT: FirmwareRelease = {
  version: '2.6.1',
  file: 'muse-fw-2.6.1.bin',
  sizeBytes: 1413696,
  publishedAt: '2026-10-30T01:52:56Z',
  source: 'snapshot',
  changelog: [
    {
      version: '2.6.1',
      date: '2026-10-29',
      groups: [
        {
          name: 'Melhorias',
          items: [
            {
              title: 'Rota mais fina',
              text: 'a linha da rota no mapa do painel ficou cerca de um terço mais fina, junto com a borda do trânsito. Antes ela saía mais grossa que a seta da sua posição e cobria as ruas em volta.',
            },
          ],
        },
      ],
    },
    {
      version: '2.6.0',
      date: '2026-10-28',
      groups: [
        {
          name: 'Novidades',
          items: [
            {
              title: 'Mapa em perspectiva',
              text: 'o mapa do painel pode ficar inclinado à frente, como o 3D do app, com a rua que vem pela frente subindo para o horizonte em vez de vista de cima. É o novo padrão e se troca no app, em Ajustes > Painel > Perspectiva, sem instalar nada de novo; o painel guarda a escolha mesmo desligado. Com um app anterior ao 1.23.0, o mapa fica em perspectiva.',
            },
          ],
        },
      ],
    },
  ],
};
