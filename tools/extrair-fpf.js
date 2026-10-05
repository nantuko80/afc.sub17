/*
 * Lê jornadas do Centro de Resultados da FPF (resultados.fpf.pt), a partir do próprio browser.
 *
 * O site da FPF bloqueia pedidos de servidores (Cloudflare) e limita pedidos seguidos (~30),
 * por isso isto corre numa página de resultados.fpf.pt já aberta, só lê as jornadas pedidas
 * e espaça os pedidos. Não junta nada: devolve os jogos do Anadia, e a junção com
 * data/jogos.json é feita por scripts/juntar-fpf.mjs.
 *
 * Uso (na consola de uma página de resultados.fpf.pt):
 *   1. colar este ficheiro;
 *   2. extrairFPF({ seasonId: 106, anoInicio: 2026, equipas: { A: { competitionId: 29907, jornadas: [3, 4] } } })
 *        .then((r) => console.log(JSON.stringify(r)));
 *   O resultado fica também em window.__fpf (e o estado em window.__fpfEstado).
 */
window.extrairFPF = async function extrairFPF({ seasonId, anoInicio, equipas, clube = 'Anadia' }) {
  const E = (window.__fpfEstado = { estado: 'a correr', pedidos: 0, log: [] });
  const CLUBE = new RegExp(clube, 'i');
  const MESES = { jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6, jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12 };
  const SIGLAS = /^(fc|cd|ad|adc|sc|gd|gdr|ud|aa|rd|cf|sl|ac|ca|ss|ar|ads|acd|grd|cr|ccd|neg)$/i;
  const limpar = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const bonito = (s) => limpar(s).split(' ').map((p) => (SIGLAS.test(p) ? p.toUpperCase() : p)).join(' ');
  const pad = (n) => String(n).padStart(2, '0');
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  // Pedidos espaçados e com nova tentativa: a FPF responde 429 se forem demasiados seguidos.
  async function html(url) {
    for (let t = 0; t < 5; t++) {
      await esperar(1200);
      E.pedidos++;
      const r = await fetch(url, { credentials: 'include' });
      if (r.ok) return new DOMParser().parseFromString(await r.text(), 'text/html');
      if (r.status !== 429 && r.status < 500) throw new Error(`HTTP ${r.status} em ${url}`);
      E.log.push(`HTTP ${r.status}; nova tentativa em ${30 * (t + 1)}s`);
      await esperar(30000 * (t + 1));
    }
    throw new Error('A FPF continua a recusar pedidos. Esperar 15 minutos e repetir.');
  }

  function lerData(texto) {
    const m = texto.match(/(\d{1,2})\s+([a-zç]{3})\w*(?:\s+(\d{1,2}:\d{2}))?/i);
    if (!m) return { data: null, hora: null };
    const mes = MESES[m[2].toLowerCase()];
    const ano = mes >= 7 ? anoInicio : anoInicio + 1;
    return { data: `${ano}-${pad(mes)}-${pad(m[1])}`, hora: m[3] ? m[3].padStart(5, '0') : null };
  }

  const saida = { lidoEm: new Date().toISOString(), equipas: {}, jogos: [], jornadasLidas: {} };
  try {
    for (const [letra, cfg] of Object.entries(equipas)) {
      if (!cfg.jornadas?.length) continue; // nada a ler: nenhum pedido
      const urlComp = `/Competition/Details?competitionId=${cfg.competitionId}&seasonId=${seasonId}`;
      const doc = await html(urlComp);
      const serie = [...doc.querySelectorAll('[id^="htmlSerieId_"]')].find((s) => CLUBE.test(s.textContent));
      if (!serie) throw new Error(`${clube} não encontrado em ${urlComp}`);
      const links = new Map([...serie.querySelectorAll('a[data-ajax][href*="fixtureId"]')]
        .map((a) => [parseInt(a.textContent, 10), a.getAttribute('href')]));
      saida.equipas[letra] = {
        competicao: limpar(doc.querySelector('h2')?.textContent),
        zona: [...serie.querySelectorAll('.text-center > span')].map((e) => limpar(e.textContent))
          .find((t) => /^(zona|s[ée]rie)\s/i.test(t)) || null,
        url: `https://resultados.fpf.pt${urlComp}`,
        jornadas: links.size,
      };
      saida.jornadasLidas[letra] = [];
      for (const n of cfg.jornadas) {
        if (!links.has(n)) continue;
        const d = await html(links.get(n));
        saida.jornadasLidas[letra].push(n);
        for (const g of d.querySelectorAll('#matches .game')) {
          if (!CLUBE.test(g.textContent)) continue; // jornada de folga: não há jogo do clube
          const casa = bonito(g.querySelector('.home-team')?.textContent);
          const fora = bonito(g.querySelector('.away-team')?.textContent);
          const { data, hora } = lerData(limpar(g.querySelector('.game-schedule')?.textContent));
          const res = limpar(g.querySelector('.score > span:not(.game-schedule)')?.textContent);
          const est = g.nextElementSibling?.classList.contains('game-list-stadium')
            ? bonito(g.nextElementSibling.textContent) : null;
          const emCasa = CLUBE.test(casa);
          saida.jogos.push({
            id: `${letra}-${pad(n)}`, equipa: letra, jornada: n, data, hora, casa, fora, emCasa,
            adversario: emCasa ? fora : casa,
            resultado: /^\d+\s*-\s*\d+$/.test(res) ? res.replace(/\s+/g, '') : null,
            local: est, origem: 'fpf',
          });
        }
        E.log.push(`${letra}: jornada ${n} lida`);
      }
    }
    E.estado = 'feito';
  } catch (e) {
    E.estado = 'erro: ' + e.message;
    throw e;
  }
  window.__fpf = saida;
  return saida;
};
