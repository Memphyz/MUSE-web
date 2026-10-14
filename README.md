# MUSE-web

Landing page do [MUSE](https://github.com/Memphyz/MUSE), o painel de guidão
para motocicleta. Uma página só, em Angular, que apresenta o projeto e baixa
o app Android direto da release pública.

## O que a página faz

- **Baixa a versão mais nova sozinha.** O botão aponta para o APK publicado
  na release de etiqueta fixa `app` do
  [`Memphyz/MUSE-releases`](https://github.com/Memphyz/MUSE-releases/releases/tag/app),
  a mesma de onde o app se atualiza. A versão, o tamanho, a data e o
  changelog vêm ao vivo da API do GitHub (`src/app/core/release.service.ts`);
  se a API não responder, a página usa o registro gravado no build
  (`src/app/core/release-snapshot.ts`), e o botão continua funcionando.
- **`/download`** é um link para compartilhar: inicia o download sozinho e
  deixa um botão na tela para o caso de o navegador bloquear o início
  automático.
- **O painel simulado** (`src/app/shared/panel-dial.ts`) é uma réplica em
  SVG da tela redonda do guidão, com velocímetro, manobra, distância e os
  cenários da via (radar, lombada, chuva, túnel, estrada sem luz), animada
  com signals e `requestAnimationFrame`.
- Os ícones de alerta, manobra e clima são os mesmos SVGs do firmware
  (`public/assets/icons`, copiados de `MUSE/firmware/assets/icons`). Os
  prints do app em `public/assets/shots` vieram do aparelho; os renders da
  carcaça são gerados dos STL atuais da pasta de peças (a versão da carcaça
  não aparece na página de propósito).

## Design

A página segue o Skylearn, o design system do app (`MUSE/app/DESIGN.md`):
Hubot Sans nos títulos, Atkinson Hyperlegible Next no texto, JetBrains Mono
nos números, cantos generosos, movimento com mola suave e confete só na
conclusão (o clique de baixar). Os tokens moram em `src/styles.scss`.

Acessibilidade: contraste AA em todo texto, alvos de toque de 56 px nos
controles principais, estados nunca só pela cor, e `prefers-reduced-motion`
desliga o confete, a esteira de avisos e as animações do painel.

## Rodar

```bash
npm install --legacy-peer-deps   # o npm 10.9 trava num peer opcional do vitest
npm start                        # http://localhost:4200
npm run build                    # dist/MUSE-web/browser
```

Para publicar, qualquer hospedagem de arquivos estáticos serve. O
`/download` precisa que todas as rotas caiam no `index.html` (fallback de
SPA).

## Atualizar o registro de build

O `release-snapshot.ts` é o que aparece antes de a API responder. Quando
uma versão nova do app sair, atualize a versão, o nome do arquivo, o tamanho,
a data e as primeiras seções do changelog ali, com o que estiver na release.
