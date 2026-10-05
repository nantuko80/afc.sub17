---
name: Jogos Sub-17 · Anadia FC
description: Calendário não oficial dos jogos das equipas Sub-17 A e B do Anadia FC, feito pelos diretores para se organizarem.
colors:
  azul-anadia: "#1650a8"
  azul-noite: "#0b2a5b"
  celeste: "#3d8fd6"
  papel: "#fcfdfe"
  folha: "#fcfdfe"
  giz: "#eef2f8"
  branco-gelo: "#f8fafd"
  tinta: "#0f1b2d"
  grafite: "#4a5872"
  linha-de-cal: "#dbe2ee"
  ceu-palido: "#b8d0f0"
  vitoria: "#18794e"
  empate: "#8a6d1d"
  derrota: "#b42318"
  alerta-fundo: "#fff4e0"
  alerta-tinta: "#7a4b00"
  alerta-contorno: "#f2c46d"
  info-fundo: "#c7daf4"
  info-tinta: "#164a8a"
  papel-noite: "#0a1220"
  folha-noite: "#121c2e"
  giz-noite: "#18243a"
  topo-noite: "#08203f"
  tinta-noite: "#e8edf6"
  grafite-noite: "#9fb0c9"
  linha-noite: "#24334d"
  ceu-noite: "#23395a"
  ceu-noite-tinta: "#cfe3fa"
  sobre-claro-noite: "#06152b"
  vitoria-noite: "#4cc38a"
  empate-noite: "#e0b84f"
  derrota-noite: "#f07167"
  alerta-fundo-noite: "#2e2412"
  alerta-tinta-noite: "#f5cf86"
  alerta-contorno-noite: "#6b5222"
  info-fundo-noite: "#13294a"
  info-tinta-noite: "#a9cbf2"
typography:
  display:
    fontFamily: "Saira, Arial Narrow, system-ui, sans-serif"
    fontStyle: italic
    fontStretch: "75%"
    fontSize: "clamp(52px, 13vw, 80px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  numeral:
    fontFamily: "Saira, Arial Narrow, system-ui, sans-serif"
    fontStyle: italic
    fontStretch: "75%"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1
  numeral-small:
    fontFamily: "Saira, Arial Narrow, system-ui, sans-serif"
    fontStyle: italic
    fontStretch: "75%"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1
  headline:
    fontFamily: "Saira, Arial Narrow, system-ui, sans-serif"
    fontStyle: italic
    fontStretch: "75%"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "0.01em"
  team-tag:
    fontFamily: "Saira, Arial Narrow, system-ui, sans-serif"
    fontStyle: italic
    fontStretch: "75%"
    fontSize: "13px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.04em"
  title:
    fontFamily: "Barlow, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.45
  body:
    fontFamily: "Barlow, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  control:
    fontFamily: "Barlow, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.2
  label:
    fontFamily: "Barlow, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.05em"
rounded:
  etiqueta: "6px"
  interior: "7px"
  controlo: "10px"
  cartao: "14px"
  chip: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.azul-anadia}"
    textColor: "{colors.branco-gelo}"
    typography: "{typography.control}"
    rounded: "{rounded.controlo}"
    padding: "8px 14px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.azul-noite}"
  button-secondary:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.tinta}"
    typography: "{typography.control}"
    rounded: "{rounded.controlo}"
    padding: "8px 14px"
    height: "40px"
  button-directions:
    backgroundColor: "{colors.azul-anadia}"
    textColor: "{colors.branco-gelo}"
    rounded: "{rounded.controlo}"
    padding: "6px 12px"
    height: "36px"
  button-icon:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.grafite}"
    rounded: "{rounded.controlo}"
    size: "36px"
  segmented-option-selected:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.tinta}"
    typography: "{typography.control}"
    rounded: "{rounded.controlo}"
    height: "36px"
  segmented-option:
    backgroundColor: "{colors.giz}"
    textColor: "{colors.grafite}"
    typography: "{typography.control}"
    height: "36px"
  team-tag-a:
    backgroundColor: "{colors.azul-noite}"
    textColor: "{colors.branco-gelo}"
    typography: "{typography.team-tag}"
    rounded: "{rounded.etiqueta}"
    padding: "5px 8px"
  team-tag-b:
    backgroundColor: "{colors.ceu-palido}"
    textColor: "{colors.azul-noite}"
    typography: "{typography.team-tag}"
    rounded: "{rounded.etiqueta}"
    padding: "5px 8px"
  result-win:
    backgroundColor: "{colors.vitoria}"
    textColor: "{colors.branco-gelo}"
    rounded: "{rounded.etiqueta}"
    padding: "4px 8px"
  result-draw:
    backgroundColor: "{colors.empate}"
    textColor: "{colors.branco-gelo}"
    rounded: "{rounded.etiqueta}"
    padding: "4px 8px"
  result-loss:
    backgroundColor: "{colors.derrota}"
    textColor: "{colors.branco-gelo}"
    rounded: "{rounded.etiqueta}"
    padding: "4px 8px"
  chip-countdown:
    backgroundColor: "{colors.info-fundo}"
    textColor: "{colors.azul-anadia}"
    rounded: "{rounded.chip}"
    padding: "3px 9px"
  chip-clash:
    backgroundColor: "{colors.alerta-fundo}"
    textColor: "{colors.alerta-tinta}"
    rounded: "{rounded.chip}"
    padding: "2px 9px"
  card:
    backgroundColor: "{colors.folha}"
    rounded: "{rounded.cartao}"
    padding: "16px"
  header:
    backgroundColor: "{colors.azul-noite}"
    textColor: "{colors.branco-gelo}"
---

# Design System: Jogos Sub-17 · Anadia FC

## Overview

**Creative North Star: "A Folha de Jogo"**

O sistema inspira-se na ficha que o diretor de equipa leva para o jogo: uma folha onde está tudo o que interessa (dia, hora, adversário, campo) e nada do que não interessa. Cada jogo é uma linha dessa folha, lida de relance por um diretor com o telemóvel numa mão e as chaves do carro na outra. A hierarquia vem do tamanho dos números (dia e hora em letra condensada e grossa) e não de cor ou de decoração.

O registo é desportivo sem exagero. A Saira condensada em itálico e maiúsculas dá o sotaque de futebol e de movimento (placard, camisola, quadro do balneário), mas fica nos títulos, nas datas e nas horas. Tudo o resto é Barlow normal, calma e legível. A cor do clube manda nas ações e na identidade (topo, equipa A, botões), e a cor semântica só aparece quando tem algo a dizer: resultado, aviso de choque, informação sobre os dados.

Os componentes são táteis e robustos: alvos de toque com 44px em ecrãs táteis (36px com rato), uma ação principal por cartão em azul cheio, botões que cedem ligeiramente quando se carrega. A densidade é a de uma app do dia a dia, não a de um painel: uma coluna estreita (até 820px), cartões agrupados por fim de semana, espaço suficiente para o polegar.

**Key Characteristics:**
- Números grandes e condensados (dia, hora) como âncora de leitura.
- Azul Anadia como única cor de ação; cores semânticas só para resultado e avisos.
- Superfícies planas com contorno fino; sombra quase impercetível e só no modo claro.
- Uma coluna, agrupada por fim de semana, pensada primeiro para o telemóvel.
- Modo claro e escuro com a mesma hierarquia, seguindo a preferência do sistema.

## Colors

Uma paleta contida: neutros frios ligeiramente azulados, um azul de clube para agir, e um pequeno conjunto semântico para resultados e avisos.

### Primary
- **Azul Anadia** (`azul-anadia`): a cor de ação. Botão principal dos cartões ("Como chegar" no próximo jogo fora, "Google Calendar") e o texto da contagem decrescente. No hover escurece para Azul Noite.
- **Azul Noite** (`azul-noite`): a cor de identidade. Fundo do topo, etiqueta da equipa A e estado hover dos botões principais.
- **Celeste** (`celeste`): anel de foco do teclado e contorno de hover dos botões secundários. No modo escuro passa a ser o fundo da etiqueta da equipa A.

### Secondary
- **Céu Pálido** (`ceu-palido`): fundo da etiqueta da equipa B. A B é sempre a versão clara da A, nunca outra cor.

### Neutral
- **Papel** (`papel`): fundo da página, quase branco e igual à Folha no modo claro; os cartões separam-se do fundo pelo contorno, não pela cor nem por sombra.
- **Folha** (`folha`): superfície dos cartões, das listas e dos botões secundários.
- **Giz** (`giz`): fundo do controlo segmentado e dos blocos do esqueleto de carregamento.
- **Branco Gelo** (`branco-gelo`): texto sobre azul e sobre cores de resultado. Substitui o branco puro.
- **Tinta** (`tinta`): texto principal.
- **Grafite** (`grafite`): texto secundário, como local, jornada, dia da semana, rodapé e FORA.
- **Linha de Cal** (`linha-de-cal`): contornos dos cartões e divisórias entre jogos.

### Semantic
- **Vitória / Empate / Derrota** (`vitoria`, `empate`, `derrota`): só no marcador de jogos realizados, sempre com o resultado escrito.
- **Alerta** (`alerta-fundo`, `alerta-tinta`, `alerta-contorno`): choques de horário entre A e B e dados desatualizados.
- **Informação** (`info-fundo`, `info-tinta`): notas sobre a origem dos dados e o chip da contagem decrescente.

O modo escuro tem um token `-noite` para cada papel. Sobre superfícies claras no modo escuro (etiqueta da equipa A) o texto passa a `sobre-claro-noite`.

### Named Rules
**The One Action Color Rule.** O Azul Anadia é a única cor de ação. Nenhum botão, ligação ou estado ativo usa verde, âmbar ou outra cor do clube.

**The Semantic Silence Rule.** Verde, âmbar e vermelho só aparecem quando há algo a dizer: um resultado ou um aviso. Uma semana sem choques não tem nenhum âmbar.

**The No Pure White Rule.** Nunca usar `#fff` nem `#000`. O branco é Branco Gelo ou Folha, e o texto mais escuro é Tinta.

## Typography

**Display Font:** Saira, instância itálica 800 condensada (75%) (com Arial Narrow)
**Body Font:** Barlow (com system-ui)

**Character:** a Saira condensada, grossa, em itálico e maiúsculas lembra um equipamento desportivo ou um placard e dá dinamismo; a Barlow normal mantém o texto corrido calmo e muito legível em ecrãs pequenos. As fontes estão alojadas no próprio site (woff2, OFL), sem pedidos a terceiros.

### Hierarchy
- **Display** (Saira itálico 800, clamp 52-80px, 0.95, maiúsculas): só o título "AFC SUB17" no topo, com "Calendário de jogos 2026/27" numa linha por baixo. À esquerda, o escudo do Anadia FC (assets/icones/escudo.svg, recortado à largura do escudo; o favicon é a versão quadrada) com a altura do título e do subtítulo juntos (72-112px).
- **Numeral** (Saira itálico 800, 28px, 1): a hora do próximo jogo nos cartões, ao centro entre os dois clubes, com o dia por cima em Barlow 600 14px Grafite ("sáb, 10 out"). Sem hora marcada: "Hora a definir" em 14px Grafite.
- **Numeral small** (Saira itálico 800, 24px, 1): marcadores dos resultados.
- **Data e hora da lista** (Barlow, 16px, algarismos fixos): a data ("17 out 26", 600) e, por baixo, a hora com o mesmo tamanho mas em peso normal (400).
- **Headline** (Saira itálico 800, 24px, 1.1, maiúsculas): títulos de secção ("Próximos jogos", "Calendário"). "Próximos jogos" é a exceção: usa o estilo dos títulos de fim de semana (Barlow 600, 15px, sem maiúsculas), para os cartões serem o destaque.
- **Team tag** (Saira itálico 800, 13px, 0.04em, maiúsculas): etiquetas SUB-17 A / SUB-17 B.
- **Title** (500, 16-17px): o confronto em formato de placard, equipa da casa por cima e de fora por baixo, cada uma com o seu emblema; Anadia FC a negrito (700).
- **Body** (400, 16px, 1.45): texto corrido, com no máximo 60ch nos parágrafos explicativos.
- **Control** (600, 14px): botões e controlos segmentados.
- **Dia da semana da lista** (600, 14px, Grafite, minúsculas como a data): por cima da data ("sáb").
- **Meta** (400, 14px, Grafite): "Jornada 3 · Fora" / "Jornada 3 · Em casa", sempre nesta ordem, ao lado da etiqueta de equipa, na lista e nos cartões.

### Named Rules
**The Numbers Shout Rule.** Só a data, a hora, o resultado e os títulos usam a Saira. Se um texto não é número nem título, é Barlow normal.

**The 14px Floor Rule.** Texto em minúsculas nunca fica abaixo de 14px. Só as etiquetas de equipa (Team tag, maiúsculas e negrito) descem a 13px. Datas, horas e marcadores usam algarismos de largura fixa (`tabular-nums`).

**The Middle Dot Rule.** O único separador em linha é o ponto médio com espaços (" · "), em todo o site: "Jornada 3 · Fora", "Fim de semana · 24-25 out", "Campo Monte · Eixo". Nunca bullets (•), barras nem travessões.

**The One Bold Name Rule.** Num confronto, só o nome do Anadia vai a negrito. O adversário fica em peso médio.

## Layout

Uma coluna centrada com no máximo 820px e 16px de margem lateral, que funciona igual do telemóvel ao desktop. No desktop, os dois cartões de próximos jogos ficam lado a lado (grelha `auto-fit`, mínimo 260px); no telemóvel empilham.

A lista agrupa os jogos por fim de semana: um título discreto ("Fim de semana · 24-25 out"; quando os jogos desse fim de semana são todos no mesmo dia, só esse dia: "Domingo · 25 out") e, por baixo, um bloco por jogo, sem contorno, com 8px entre blocos e cantos de 14px. O fundo do bloco é Giz (#eef2f8) no modo claro e Folha no escuro; o bloco aberto escurece um tom. Cada linha é uma grelha de três colunas: data (58px, 48px no telemóvel), informação do jogo, hora ou resultado. As ações ficam numa linha própria por baixo da informação.

O título "Calendário" e os filtros partilham uma linha (título à esquerda, filtros encostados à direita), que fica fixa no topo ao fazer scroll, mesmo no telemóvel. O espaçamento segue uma escala curta (4, 8, 12, 16, 28px): 28px entre secções, 16-18px entre fins de semana, 12-14px dentro dos cartões.

Ponto de quebra único: 520px, onde a coluna da data e hora estreita e os controlos ficam mais compactos.

## Elevation & Depth

O sistema é plano com contorno. A profundidade vem de camadas tonais (no modo claro, Papel e Folha são quase brancos e iguais; Giz nos controlos; no escuro, Papel mais escuro do que Folha) e de um contorno de 1px em Linha de Cal. Cartões e listas não têm sombra, em nenhum dos modos: o contorno chega para os separar do fundo. Os cartões (próximos jogos, subscrição) e os jogos da lista não têm contorno em nenhum dos modos: separam-se do fundo pelo tom (Giz #eef2f8 no claro, Folha no escuro); os jogos da lista são blocos separados por 8px.

### Shadow Vocabulary
- **Selecionado** (`box-shadow: 0 1px 3px rgb(15 27 45 / .12)`): opção ativa do controlo segmentado.

### Named Rules
**The Paper Not Glass Rule.** Nada flutua: sem desfoque, sem sombras fortes, sem camadas sobrepostas. Se algo precisa de destaque, muda o fundo ou o peso da letra, não a elevação.

## Shapes

Quatro raios com regra fixa: cartões e painéis 14px (`cartao`), botões e controlos 10px (`controlo`), etiquetas de equipa e marcadores 6px (`etiqueta`), chips de estado em pílula (`chip`). Um elemento dentro de um controlo usa o raio exterior menos o espaçamento interior (token `interior`, 7px, nas opções do segmentado). Os contornos são sempre de 1px, inteiros, nunca só de um lado.

## Components

### Buttons
Táteis e robustos: altos o suficiente para o polegar, texto numa linha só, uma ação principal por contexto.
- **Shape:** cantos suaves (10px), altura mínima de 40px com rato e 44px em ecrãs táteis (a seta de cada jogo da lista tem 36px com rato).
- **Primary:** Azul Anadia com texto Branco Gelo, ícone Tabler à esquerda, 8px 14px. Uma por cartão: "Como chegar" no cartão do próximo jogo, quando é fora; "Google Calendar" na subscrição.
- **Hover / Focus / Active:** o primário escurece para Azul Noite; os secundários ganham contorno Celeste. O foco tem um anel de 3px Celeste afastado 2px. Ao carregar, encolhem para 97% durante 80ms (desligado com `prefers-reduced-motion`).
- **Secondary:** contorno Linha de Cal e texto Tinta. "Adicionar" e "Partilhar" (cartões e jogos abertos da lista) sem fundo; "iPhone / Outlook" e "Copiar ligação" com fundo Folha.
- **Icon button:** quadrado de 36px (44px em ecrãs táteis), Folha, ícone Grafite de 18px. Em cada linha da lista por realizar é uma seta (⌄) na coluna da hora: tocar na seta ou em qualquer parte da linha abre-a (fundo Giz, seta rodada e em Azul) e mostra por baixo as ações dos cartões ("Adicionar" e "Partilhar" lado a lado e, nos jogos fora, "Como chegar" a toda a largura por cima). Só uma linha aberta de cada vez. A regra do "Como chegar" é a mesma nos cartões e na lista: botão só nos jogos fora, onde o campo passa a texto; nos jogos em casa o campo continua a ser ligação para o mapa. Jogos realizados não abrem nem têm ações.

### Chips
- **Equipa:** SUB-17 A em Azul Noite cheio, SUB-17 B em Céu Pálido; Saira itálica em maiúsculas, cantos de 6px.
- **Contagem:** pílula Informação com texto Azul Anadia em peso normal ("Daqui a 5 dias").
- **Choque:** pílula Alerta, sem contorno, junto ao título do fim de semana, com o dia e a hora: "Jogam à mesma hora: dom 09:00" ou, com horas diferentes mas menos de 3h entre jogos, "Jogos seguidos: dom 09:00 e 11:30". Quando o título já é o próprio dia ("Domingo · 25 out"), o chip leva só as horas ("Jogam à mesma hora: 09:00"). É o único sítio onde o choque é dito por extenso na lista. Cada jogo em choque ganha fundo âmbar, sem contorno, e a linha vertical antes da data em Alerta Borda suavizada (45% de opacidade).
- **Resultado:** marcador em Numeral small (24px), sem fundo, com os algarismos na cor Vitória, Empate ou Derrota; o resultado está sempre escrito.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Folha sobre Papel.
- **Shadow Strategy:** nenhuma; só contorno (ver Elevation & Depth).
- **Border:** 1px Linha de Cal.
- **Internal Padding:** 16px nos cartões; 14px nas linhas de jogo (12px 10px no telemóvel).

### Inputs / Fields
- **Controlo segmentado** (Ambas / Sub-17 A / Sub-17 B): trilho em Giz com contorno, opções de 36px (44px em ecrãs táteis), que escurecem o texto ao passar o rato; a opção ativa ganha fundo Folha, texto Tinta e sombra Selecionado. Setas esquerda/direita mudam de opção. Fica fixo no topo da lista, ao lado de "Próximos | Resultados"; a subscrição segue a escolha de equipa.
- **Próximos | Resultados:** segundo controlo segmentado, na mesma barra e com o mesmo estilo. "Próximos" (por defeito) mostra os jogos por realizar, sem os que já estão nos cartões; "Resultados" mostra só os realizados, do mais recente para o mais antigo, sem esbater. O filtro de equipa vale nos dois. As abas de equipa dizem "Ambas | S17·A | S17·B" (com `aria-label` completo, "Sub-17 A"), para os dois grupos caberem numa linha em qualquer ecrã.

### Emblemas
- **Forma:** azulejo de 22px na lista, cantos de 6px (no cartão do próximo jogo: 48px, cantos de 10px, com os dois clubes lado a lado, emblema por cima do nome centrado e um "x" Grafite ao meio), fundo Branco Gelo e contorno Linha de Cal, porque os emblemas da FPF são JPEG com fundo branco. Igual nos dois modos.
- **Origem:** recolhidos uma vez do site da FPF, guardados em `assets/emblemas/` (WebP 56px) e mapeados em `data/emblemas.json`.
- **Sem emblema:** iniciais do clube no mesmo azulejo, com as cores da etiqueta B.
- **Acessibilidade:** decorativos (`alt=""`), porque o nome do clube está sempre ao lado.

### Navigation
O topo em Azul Noite mostra o escudo, "AFC SUB17" e "Calendário de jogos 2026/27". O rodapé diz sempre "Página não oficial".
- **Barra de navegação (até 768px):** fixa em baixo, tipo app, com três itens de ícone (24px) e texto (12px, 600): Próximos (bola), Calendário (calendário) e Resultados (placard). Flutuante, com 8px de margem a toda a volta (acima da zona de gestos do iPhone), cantos de 12px, contorno suave (Linha de Cal a 50%) e fundo Folha translúcido (72%) com desfoque do conteúdo por trás (blur 16px). Próximos sobe ao topo da página; Calendário desce à lista com os jogos por realizar; Resultados muda a lista para os resultados e desce até ela. O item ativo acompanha a secção no ecrã (no fim da página conta como calendário) e fica na cor da contagem, com o ícone em estilo cheio (forma exterior preenchida, detalhes recortados na cor da barra); os inativos ficam em traço de 1.1px, Grafite. Nestes ecrãs o seletor Próximos | Resultados da lista desaparece.
- **Computador (acima de 768px):** sem barra; a lista tem o seletor Próximos | Resultados ao lado do filtro de equipa, fixo no topo ao fazer scroll.

### Linha de jogo (signature component)
A unidade da Folha de Jogo, em duas colunas separadas por uma linha vertical (1px Linha de Cal). À esquerda: etiqueta de equipa e a linha Meta ("Jornada 3 · Fora"); o confronto em Title (duas linhas, emblema de 22px à esquerda de cada clube); o campo com ícone de pin, que abre o caminho no Google Maps. À direita, centrado: dia da semana em minúsculas ("sáb"), a data ("17 out 26") e, por baixo, a hora ou o marcador do resultado; no fim, a seta que abre as ações do jogo. Nos jogos realizados (vista Próximos) a data e o confronto passam a Grafite. Num choque de horário, a linha inteira ganha um fundo âmbar suave (Alerta Fundo misturado 60% com Folha); o aviso por extenso fica no chip do fim de semana (e no cartão do próximo jogo, se o choque for aí).

## Do's and Don'ts

### Do:
- **Do** dizer cada coisa uma vez: os próximos jogos não se repetem na lista, cada destino tem um só controlo (o campo é o "Como chegar"), e um choque é dito num só chip.
- **Do** usar Azul Anadia (`#1650a8`) para todas as ações e só para ações.
- **Do** escrever datas e horas dos cartões em Saira itálico 800 e deixar que sejam o elemento mais visível de cada linha.
- **Do** acompanhar qualquer cor semântica com texto ou ícone (resultado escrito, "Jogam à mesma hora: dom 09:00", ícone de aviso).
- **Do** usar o token `--alvo` para tudo o que se toca: 36px com rato, 44px em ecrãs táteis. O texto dos botões fica sempre numa só linha.
- **Do** usar ícones Tabler (contorno) incluídos como SVG, com `aria-hidden` e traço de 1.1px reais (`vector-effect: non-scaling-stroke`) em todos os tamanhos.
- **Do** testar cada alteração nos modos claro e escuro e a 375px de largura.

### Don't:
- **Don't** esbater conteúdo com `opacity`; usar uma cor de texto mais suave que cumpra 4,5:1.
- **Don't** usar uma faixa colorida num só lado (`border-left` ou sombra interior) para destacar jogos ou avisos; usar o fundo tingido da linha inteira.
- **Don't** usar travessões (— ou –) em texto visível; nos intervalos de datas usar hífen ("24-25 out").
- **Don't** pôr riscas, gradientes ou texturas decorativas no topo ou nas superfícies.
- **Don't** usar branco puro (`#fff`) nem preto puro (`#000`).
- **Don't** criar grelhas de cartões iguais repetidos; uma escolha + um conjunto de ações é melhor do que três cartões com os mesmos botões.
- **Don't** carregar fontes ou ícones de serviços externos (Google Fonts, CDNs de ícones).
- **Don't** usar emblemas como marca (topo, ícone, cabeçalhos) nem elementos que façam a página parecer um canal oficial do Anadia FC. Os emblemas só aparecem como identificação dos clubes dentro de cada jogo.
