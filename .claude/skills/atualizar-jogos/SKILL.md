---
name: atualizar-jogos
description: Atualiza data/jogos.json com resultados (e, se pedido, adiamentos/horas) do Centro de Resultados da FPF, usando o browser integrado. Usar quando o utilizador pedir "atualiza os jogos", "vai buscar os resultados", "há alterações na FPF?" ou semelhante.
---

# Atualizar jogos a partir da FPF

O site resultados.fpf.pt está atrás da Cloudflare: pedidos de servidor/curl levam 403 e há um limite de ~30 pedidos seguidos (429). Por isso a leitura faz-se **no browser integrado** (mcp__Claude_Browser__*), numa página de resultados.fpf.pt, e só das jornadas necessárias. Nunca tentar contornar a verificação "não sou um robô": se aparecer, pedir ao utilizador que a passe no painel do browser.

Os diretores não são técnicos: esta atualização é sempre feita aqui, a pedido do utilizador.

## Passos

1. **Plano** (que jornadas ler):
   ```
   node scripts/juntar-fpf.mjs plano
   ```
   Por defeito: só jogos já realizados sem resultado (inclui adiados). Se o utilizador pedir para verificar também alterações de data/hora, usar `plano --com-proximos` (próximas 8 semanas).
   Se todas as listas `jornadas` vierem vazias, **não ir à FPF**: dizer que não há nada para atualizar.

2. **Abrir a FPF** no browser integrado: `navigate` para `https://resultados.fpf.pt/Competition/GetCompetitionsByAssociation?associationId=217&seasonId=<seasonId>`. Confirmar com `get_page_text` que não é a página "Um momento…"/verificação; se for, pedir ao utilizador para a passar e esperar.

3. **Correr o extrator**: ler `tools/extrair-fpf.js`, executar o conteúdo com `javascript_tool` nessa página, e depois lançar sem esperar (o tool tem limite de 45 s):
   ```js
   window.__fpf = null; extrairFPF(<JSON do plano>).catch(() => {}); 'lançado'
   ```
   Consultar até `window.__fpfEstado.estado` ser `feito` (ou `erro: …`) com esperas curtas (`await new Promise(r => setTimeout(r, 20000))`). Se houver 429, o extrator espera sozinho; se falhar, esperar ~15 min e repetir.

4. **Trazer o resultado**: `JSON.stringify(window.__fpf)` e gravar com Write num ficheiro no scratchpad (ex.: `fpf.json`).

5. **Juntar**:
   ```
   node scripts/juntar-fpf.mjs juntar <scratchpad>/fpf.json
   ```
   Mostra as alterações (resultados novos, adiamentos, horas). Confirmar que fazem sentido.

6. **Verificar** no site local (servidor `python3 -m http.server 8417` na raiz do projeto, browser integrado em http://127.0.0.1:8417): sem erros na consola, jogos alterados certos.

7. **Publicar**: `git add data/jogos.json`, commit ("Atualiza jogos (FPF, AAAA-MM-DD)") e push para `main`, se o repositório já estiver ligado ao GitHub (o GitHub Actions publica o site e regenera os .ics). Se ainda não houver remoto, dizer ao utilizador.

8. **Resumo ao utilizador**: o que mudou (resultados, adiamentos), nº de pedidos à FPF, e se ficou publicado.

## Notas
- Época 2026/27: seasonId 106; Honra Sub/17 competitionId 29907, 1.ª Divisão Sub/17 competitionId 30260 (ambas Zona Sul). Lidos de `data/jogos.json`.
- Jornadas de folga (B: 9 e 22) não têm jogo do Anadia; é normal não aparecerem.
- A junção mantém localidade, grafia dos nomes e a hora de jogos já realizados.
