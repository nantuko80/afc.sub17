# Jogos Sub-17 · Anadia FC

Página **não oficial**, feita pelos diretores para se organizarem, com o calendário de jogos das equipas **Sub-17 A** (Campeonato Distrital Honra, Zona Sul) e **Sub-17 B** (Campeonato Distrital 1.ª Divisão) do Anadia Futebol Clube. Não está associada ao clube nem aparece nos motores de busca (`noindex`): acede-se pela ligação partilhada no grupo.

- Próximo jogo de cada equipa, com contagem decrescente
- Lista por fim de semana, com filtro A / B / ambas e resultados dos jogos realizados
- Aviso quando a A e a B jogam no mesmo dia ou **com menos de 3 horas entre jogos em sítios diferentes**
- O nome do campo abre o caminho no Google Maps; o próximo jogo fora tem o botão **Como chegar**
- Partilhar qualquer jogo (WhatsApp, etc.) com a localização; adicionar os próximos jogos ao calendário
- Calendários subscrevíveis (Google, iPhone, Outlook) que se atualizam sozinhos

Os dados vêm de duas fontes da AF Aveiro / FPF:

1. **Comunicados oficiais de calendário (PDF)** — calendário completo da época, publicado no início (Comunicados 051 e 060 de 2026/27).
2. **[Centro de Resultados da FPF](https://resultados.fpf.pt/Competition/GetCompetitionsByAssociation?associationId=217&seasonId=106)** — alterações de data/hora, adiamentos e resultados. Tem prioridade sobre o PDF.

## Como funciona

```
PDF oficial ──(tools/importar-pdf.py, 1× por época)───────────────┐
                                                                  ├──► data/jogos.json ──(GitHub Actions)──► site + calendario/*.ics
resultados.fpf.pt ──(extrair-fpf.js + juntar-fpf.mjs, a pedido)──┘
```

O site da FPF está protegido pela Cloudflare: **bloqueia pedidos automáticos** (servidores, GitHub Actions, etc.) e **limita pedidos seguidos** (cerca de 30). Por isso a atualização é feita por uma pessoa, no seu browser, e só consulta as jornadas próximas (da anterior à atual até 8 jornadas à frente, ~20 pedidos). Os outros jogos mantêm-se como estavam. Tudo o resto é automático.

Cada jogo tem `"origem": "pdf"` ou `"fpf"` (só para controlo interno; não aparece no site). O site avisa quando os dados têm mais de 10 dias ou quando faltam jornadas por publicar.

| Ficheiro | Para quê |
|---|---|
| `index.html`, `assets/` | O site (HTML/CSS/JS, sem dependências). Fontes Barlow (OFL) em `assets/fonts/` e ícones [Phosphor](https://phosphoricons.com) (MIT) incluídos no próprio site, sem pedidos a terceiros |
| `data/jogos.json` | Os jogos — **é o único ficheiro que muda durante a época** |
| `tools/extrair-fpf.js` | Lê jornadas da FPF (no browser) |
| `scripts/juntar-fpf.mjs` | Escolhe as jornadas a ler e junta o resultado em `data/jogos.json` |
| `tools/importar-pdf.py` | Importa o calendário completo dos PDFs da AF Aveiro |
| `assets/emblemas/`, `data/emblemas.json` | Emblemas dos clubes (recolhidos da FPF uma vez por época) e o mapa nome do clube → ficheiro |
| `data/campos.json` | Coordenadas de campos cujo nome da FPF o Google Maps não encontra bem (nome do campo, tal como vem da FPF → `lat`/`lon`). Usadas no «Como chegar» e na partilha; campos que não estão aqui usam o nome |
| `scripts/gerar-ics.mjs` | Gera os calendários `.ics` (corre no GitHub Actions) |
| `.github/workflows/publicar.yml` | Publica o site no GitHub Pages a cada alteração |

## Atualizar os jogos

Os diretores não precisam de fazer nada: só abrem o site.

As atualizações (resultados de jogos passados e, se pedido, adiamentos ou mudanças de hora) fazem-se a pedido no Claude Code, neste projeto ("atualiza os jogos"). O procedimento está em `.claude/skills/atualizar-jogos/SKILL.md`:

1. `node scripts/juntar-fpf.mjs plano` escolhe as jornadas a ler: por defeito, só os jogos já realizados sem resultado (`--com-proximos` junta as próximas 8 semanas).
2. `tools/extrair-fpf.js` lê essas jornadas numa página aberta de resultados.fpf.pt (a FPF bloqueia servidores, por isso corre num browser; ~1 pedido por jornada).
3. `node scripts/juntar-fpf.mjs juntar fpf.json` junta em `data/jogos.json`, mostrando o que mudou.
4. Commit e push: o GitHub Actions publica o site e os calendários.

Se aparecer a verificação "não sou um robô" da FPF, tem de ser uma pessoa a passá-la no browser.

### Correção manual

Para corrigir um jogo à mão (ex.: mudança de hora comunicada pelo clube), editar `data/jogos.json` diretamente no GitHub (ícone do lápis). Cada jogo tem este formato:

```json
{
  "id": "A-03",
  "equipa": "A",
  "jornada": 3,
  "data": "2026-10-10",
  "hora": "15:00",
  "casa": "AD Taboeira \"B\"",
  "fora": "Anadia FC",
  "emCasa": false,
  "adversario": "AD Taboeira \"B\"",
  "resultado": null,
  "local": "Complexo Desportivo Da Taboeira"
}
```

Atenção: se a FPF tiver esse jogo, a próxima atualização substitui a correção manual.

## Nova época

1. Em `data/jogos.json`, atualizar `epoca` e os dados de `equipas`, e esvaziar `jogos` (`[]`).
2. Importar os PDFs de calendário da AF Aveiro (secção **Competições → Calendários**):

   ```bash
   pip install pypdf
   ```

   ```bash
   python3 tools/importar-pdf.py A "Calendario CD Honra Sub_17.pdf" B "Calendario CD 1_Divisao Sub_17.pdf"
   ```

3. Em `data/jogos.json`, o `url` de cada equipa tem de apontar para a competição da nova época (abrir a competição no site da FPF e copiar o endereço, com `competitionId` e `seasonId`). O `juntar-fpf.mjs` lê daí a configuração.

## Publicar no GitHub Pages (uma vez)

1. Criar um repositório público no GitHub e enviar estes ficheiros para o ramo `main`.
2. Em **Settings → Pages → Build and deployment → Source**, escolher **GitHub Actions**.
3. O site fica disponível em `https://<utilizador>.github.io/<repositório>/`.

## Testar localmente

```bash
node scripts/gerar-ics.mjs
```

```bash
python3 -m http.server 8417
```

E abrir http://127.0.0.1:8417.
