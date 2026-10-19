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
  version: '1.18.0',
  file: 'muse-app-1.18.0.apk',
  url: `${RELEASES_DOWNLOAD}/app/muse-app-1.18.0.apk`,
  sizeBytes: 9640976,
  publishedAt: '2026-10-16T19:33:15Z',
  totalDownloads: 0,
  source: 'snapshot',
  changelog: [
    {
      version: '1.18.0',
      date: '2026-10-16',
      groups: [
        {
          name: 'Novidades',
          items: [
            {
              title: 'Tela acesa na rota',
              text: 'navegando, a tela do celular não apaga mais sozinha, e o app aparece por cima da tela de bloqueio sem pedir senha.',
            },
            {
              title: 'Bipe acima do limite',
              text: 'o app toca um bipe quando você passa do limite da via, uma vez só. Dá para desligar em Ajustes > Alertas.',
            },
            {
              title: 'Mapa escuro à noite',
              text: 'navegando à noite, o mapa escurece sozinho, mesmo com o celular no tema claro.',
            },
          ],
        },
        {
          name: 'Melhorias',
          items: [
            {
              title: 'Menos bateria e menos calor',
              text: 'o mapa da navegação desenha menos vezes por segundo e para de redesenhar com a moto parada.',
            },
            {
              title: 'A rota não fecha por engano',
              text: 'o gesto de voltar minimiza o app em vez de fechá-lo. Para encerrar, use o botão da tela ou o da notificação.',
            },
          ],
        },
      ],
    },
    {
      version: '1.17.0',
      date: '2026-10-16',
      groups: [
        {
          name: 'Novidades',
          items: [
            {
              title: 'Avisos sonoros',
              text: 'navegando, o app toca um som ao chegar perto de um radar, de um perigo na via ou de uma lombada da sua rota. O som sai no fone ou no intercomunicador.',
            },
          ],
        },
        {
          name: 'Melhorias',
          items: [
            {
              title: 'Limite da via mais certo',
              text: 'com o trânsito ligado, o velocímetro usa o limite que o serviço de trânsito conhece para cada trecho da rota.',
            },
          ],
        },
      ],
    },
    {
      version: '1.16.0',
      date: '2026-10-15',
      groups: [
        {
          name: 'Novidades',
          items: [
            {
              title: 'Bateria do celular no painel',
              text: 'o painel mostra o nível da bateria do celular ao lado da hora de chegada. Fica âmbar com a bateria baixa e vermelha abaixo de 15%.',
            },
          ],
        },
        {
          name: 'Melhorias',
          items: [
            {
              title: 'Seta que acompanha a moto',
              text: 'a seta e o mapa andavam um pouco atrás da moto. Agora a seta chega na curva junto com você.',
            },
            {
              title: 'Painel volta mais rápido depois de uma queda',
              text: 'se a conexão com o painel cair no meio da rota, o app reconecta na hora.',
            },
          ],
        },
      ],
    },
  ],
};

export const FIRMWARE_SNAPSHOT: FirmwareRelease = {
  version: '2.3.0',
  file: 'muse-fw-2.3.0.bin',
  sizeBytes: 1452800,
  publishedAt: '2026-10-17T15:08:13Z',
  source: 'snapshot',
  changelog: [
    {
      version: '2.3.0',
      date: '2026-10-17',
      groups: [
        {
          name: 'Melhorias',
          items: [
            {
              title: 'Brilho da tela',
              text: 'ao ligar, o painel pede à tela o brilho máximo que ela aceita, para ficar mais forte de dia.',
            },
          ],
        },
      ],
    },
  ],
};
