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
  version: '1.14.2',
  file: 'muse-app-1.14.2.apk',
  url: `${RELEASES_DOWNLOAD}/app/muse-app-1.14.2.apk`,
  sizeBytes: 9519424,
  publishedAt: '2026-10-14T12:25:48Z',
  totalDownloads: 0,
  source: 'snapshot',
  changelog: [
    {
      version: '1.14.2',
      date: '2026-10-14',
      groups: [
        {
          name: 'Correções',
          items: [
            {
              title: 'Tema claro que não escurece sozinho',
              text: 'com o celular no modo escuro e o app no Claro, as telas às vezes passavam a abrir escuras depois de o app voltar do segundo plano. Agora o tema escolhido vale desde a abertura e não se perde.',
            },
          ],
        },
      ],
    },
    {
      version: '1.14.0',
      date: '2026-10-13',
      groups: [
        {
          name: 'Melhorias',
          items: [
            {
              title: 'Chegada que conhece o tipo de via',
              text: 'o app agora aprende o seu ritmo separado na cidade, na estrada e na rodovia.',
            },
            {
              title: 'O trânsito de todo dia agora conta',
              text: 'o app vê o trânsito inteiro da rota, e é nele que o corredor e a faixa azul fazem diferença.',
            },
          ],
        },
      ],
    },
    {
      version: '1.13.0',
      date: '2026-10-13',
      groups: [
        {
          name: 'Novidades',
          items: [
            {
              title: 'Pedágio sem cancela',
              text: 'o pórtico que cobra pela placa agora tem ícone próprio no mapa, na rota e no painel, com lembrete do prazo de pagamento.',
            },
            {
              title: 'Avisos oficiais do INMET',
              text: 'o "Clima no trajeto" mostra os avisos meteorológicos oficiais que cobrem a rota, e o painel mostra "ALERTA" ao entrar na área.',
            },
            {
              title: 'Girar o mapa com dois dedos',
              text: 'torça os dedos sobre o mapa, como no Google Maps; com o mapa girado aparece a bússola.',
            },
          ],
        },
      ],
    },
  ],
};

export const FIRMWARE_SNAPSHOT: FirmwareRelease = {
  version: '2.1.0',
  file: 'muse-fw-2.1.0.bin',
  sizeBytes: 1446912,
  publishedAt: '2026-10-13T21:38:04Z',
  source: 'snapshot',
  changelog: [
    {
      version: '2.1.0',
      date: '2026-10-13',
      groups: [
        {
          name: 'Novidades',
          items: [
            {
              title: 'Estrada sem iluminação',
              text: 'à noite, num trecho de estrada sem poste, aparece "SEM LUZ" no alto da tela.',
            },
            {
              title: 'Alerta oficial do INMET',
              text: 'quando a moto entra na área de um aviso meteorológico oficial, o painel mostra "ALERTA" com um triângulo de perigo.',
            },
          ],
        },
      ],
    },
  ],
};
