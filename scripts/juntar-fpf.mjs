// Atualização a partir da FPF, em dois passos (ver .claude/skills/atualizar-jogos/SKILL.md):
//
//   node scripts/juntar-fpf.mjs plano            -> configuração para extrairFPF(): jogos já realizados sem resultado
//   node scripts/juntar-fpf.mjs plano --com-proximos  -> idem, mais as próximas 8 semanas (adiamentos, horas)
//   node scripts/juntar-fpf.mjs juntar fpf.json  -> junta o que veio da FPF em data/jogos.json, data/classificacao.json
//                                                  e data/resultados.json (todos os jogos da série, para a forma recente)
//
// O plano inclui sempre a última jornada jogada de cada equipa enquanto a classificação dessa jornada
// não estiver guardada e completa (os outros jogos da jornada às vezes saem mais tarde), e as jornadas
// já jogadas que faltam em data/resultados.json ou têm jogos dos últimos 7 dias ainda sem resultado
// (um jogo adiado só volta a contar quando chegar a nova data).
//
// A FPF tem prioridade (adiamentos, horas, resultados). Do que já temos mantém-se a localidade,
// a grafia dos nomes e a hora de jogos já realizados (a FPF deixa de a mostrar).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const FICHEIRO = join(RAIZ, 'data/jogos.json');
const FICHEIRO_CLASS = join(RAIZ, 'data/classificacao.json');
const FICHEIRO_RES = join(RAIZ, 'data/resultados.json');
const DIAS_CLASS = 7; // classificação incompleta (jogo adiado na jornada): deixar de insistir ao fim de uma semana
const DIAS_A_FRENTE = 56; // alterações de data/hora costumam surgir nas semanas seguintes
const ESPERA_RESULTADO_MIN = 360; // a AF Aveiro não publica resultados antes de ~6h depois do início do jogo
const MAX_JORNADAS = 22; // a FPF aceita ~30 pedidos seguidos; deixa margem para as páginas das competições

const dados = JSON.parse(readFileSync(FICHEIRO, 'utf8'));
const lerClass = () => { try { return JSON.parse(readFileSync(FICHEIRO_CLASS, 'utf8')); } catch { return { equipas: {} }; } };
const lerRes = () => { try { return JSON.parse(readFileSync(FICHEIRO_RES, 'utf8')); } catch { return { equipas: {} }; } };
// "AAAA-MM-DDTHH:MM" na hora de Lisboa: compara-se como texto.
const agora = (() => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Lisbon', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
})();
const hoje = agora.slice(0, 10);
const somarDias = (iso, n) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
// Já deve haver resultado: jogos de dias anteriores, ou de hoje que começaram há mais de 6h.
function podeTerResultado(j) {
  if (!j.data || j.data > hoje) return false;
  if (j.data < hoje) return true;
  if (!j.hora) return false;
  const [h, m] = j.hora.split(':').map(Number);
  const t = h * 60 + m + ESPERA_RESULTADO_MIN;
  return t < 1440 && agora >= `${hoje}T${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}
const chave = (s) => (s || '').normalize('NFKD').replace(/[^\w]/g, '').toLowerCase();

function plano(comProximos) {
  const limite = somarDias(hoje, DIAS_A_FRENTE);
  const equipas = {};
  const motivos = {};
  for (const [letra, eq] of Object.entries(dados.equipas)) {
    const url = new URL(eq.url);
    const jogos = dados.jogos.filter((j) => j.equipa === letra);
    // Jogos já realizados sem resultado, incluindo os de hoje com mais de 6h (e os adiados, que assim ficam com a data nova);
    // opcionalmente, os próximos, para apanhar mudanças de data ou hora.
    const semResultado = jogos.filter((j) => podeTerResultado(j) && !j.resultado).map((j) => j.jornada);
    const proximos = comProximos ? jogos.filter((j) => j.data && j.data >= hoje && j.data <= limite).map((j) => j.jornada) : [];
    // Classificação: a última jornada jogada, se ainda não a temos ou se faltavam resultados de outros jogos.
    const ultima = jogos.filter(podeTerResultado).at(-1);
    const guardada = lerClass().equipas[letra];
    const classificacao = ultima && (!guardada || guardada.jornada < ultima.jornada ||
      (guardada.jornada === ultima.jornada && !guardada.completa && ultima.data >= somarDias(hoje, -DIAS_CLASS)))
      ? [ultima.jornada] : [];
    // Resultados da série: todas as jornadas até à última jogada (inclui as de folga do Anadia).
    const guardados = lerRes().equipas[letra]?.jornadas || {};
    const serie = [];
    for (let n = 1; n <= (ultima?.jornada || 0); n++) {
      const g = guardados[n];
      if (!g || g.some((x) => !x.resultado && x.data && x.data <= hoje && x.data >= somarDias(hoje, -DIAS_CLASS))) serie.push(n);
    }
    equipas[letra] = {
      competitionId: Number(url.searchParams.get('competitionId')),
      jornadas: [...new Set([...semResultado, ...proximos, ...classificacao, ...serie])].sort((a, b) => a - b),
    };
    motivos[letra] = { semResultado, proximos, classificacao, serie };
  }
  // Respeitar o limite de pedidos: cortar primeiro as jornadas mais distantes.
  let total = Object.values(equipas).reduce((n, e) => n + e.jornadas.length, 0);
  while (total > MAX_JORNADAS) {
    const maior = Object.values(equipas).sort((a, b) => b.jornadas.length - a.jornadas.length)[0];
    maior.jornadas.pop();
    total--;
  }
  const seasonId = Number(new URL(Object.values(dados.equipas)[0].url).searchParams.get('seasonId'));
  const anoInicio = Number(dados.epoca.slice(0, 4));
  console.log(JSON.stringify({ seasonId, anoInicio, equipas }));
  console.error(`Agora: ${agora.replace('T', ' ')}. Jornadas a ler: ${total}.`, JSON.stringify(motivos));
}

function juntar(caminho) {
  const fpf = JSON.parse(readFileSync(caminho, 'utf8'));
  const porId = new Map(dados.jogos.map((j) => [j.id, j]));
  const alteracoes = [];
  for (const [letra, meta] of Object.entries(fpf.equipas)) {
    dados.equipas[letra] = { ...dados.equipas[letra], ...meta, zona: meta.zona || dados.equipas[letra]?.zona || null };
  }
  for (const novo of fpf.jogos) {
    const antigo = porId.get(novo.id);
    if (antigo) {
      if (antigo.localidade) novo.localidade = antigo.localidade;
      for (const k of ['local', 'casa', 'fora', 'adversario']) {
        if (antigo[k] && chave(antigo[k]) === chave(novo[k])) novo[k] = antigo[k];
      }
      if (!novo.hora && antigo.hora && antigo.data === novo.data) novo.hora = antigo.hora;
      const mudou = ['data', 'hora', 'casa', 'fora', 'resultado'].filter((k) => chave(antigo[k]) !== chave(novo[k]));
      if (mudou.length) {
        alteracoes.push(`${novo.id}: ` + mudou.map((k) => `${k} ${antigo[k] ?? '-'} → ${novo[k] ?? '-'}`).join(', '));
      }
    } else {
      alteracoes.push(`${novo.id}: novo (${novo.data} ${novo.hora ?? ''} ${novo.casa} x ${novo.fora})`);
    }
    porId.set(novo.id, novo);
  }
  dados.atualizado = fpf.lidoEm || new Date().toISOString();
  dados.jogos = [...porId.values()].sort((a, b) => (a.data || '9').localeCompare(b.data || '9') || (a.hora || '').localeCompare(b.hora || ''));
  writeFileSync(FICHEIRO, JSON.stringify(dados, null, 2) + '\n');

  // Classificação: fica a da jornada mais recente, com os nomes escritos como em data/jogos.json.
  const nomes = new Map(dados.jogos.flatMap((j) => [j.casa, j.fora]).map((n) => [chave(n), n]));
  const cls = lerClass();
  for (const [letra, nova] of Object.entries(fpf.classificacao || {})) {
    const antiga = cls.equipas[letra];
    if (antiga && antiga.jornada > nova.jornada) continue;
    nova.linhas = nova.linhas.map((l) => ({ ...l, equipa: nomes.get(chave(l.equipa)) || l.equipa }));
    if (JSON.stringify(antiga) === JSON.stringify(nova)) continue;
    cls.equipas[letra] = nova;
    const nos = nova.linhas.find((l) => /anadia/i.test(l.equipa));
    alteracoes.push(`classificação ${letra}: jornada ${nova.jornada}${nova.completa ? '' : ' (faltam resultados)'}` +
      (nos ? `, Anadia ${nos.pos}.º com ${nos.pts} pts` : ''));
  }
  if (Object.keys(fpf.classificacao || {}).length) {
    cls.atualizado = dados.atualizado;
    writeFileSync(FICHEIRO_CLASS, JSON.stringify({ atualizado: cls.atualizado, equipas: cls.equipas }, null, 2) + '\n');
  }

  // Resultados de toda a série, por jornada (substitui a jornada lida), com os nomes como nos outros ficheiros.
  for (const l of Object.values(cls.equipas).flatMap((c) => c.linhas)) if (!nomes.has(chave(l.equipa))) nomes.set(chave(l.equipa), l.equipa);
  const res = lerRes();
  let novosRes = 0;
  for (const [letra, jornadas] of Object.entries(fpf.serie || {})) {
    const eq = (res.equipas[letra] ||= { jornadas: {} });
    for (const [n, jogos] of Object.entries(jornadas)) {
      const antes = eq.jornadas[n] || [];
      eq.jornadas[n] = jogos.map((g) => ({ ...g, casa: nomes.get(chave(g.casa)) || g.casa, fora: nomes.get(chave(g.fora)) || g.fora }));
      novosRes += eq.jornadas[n].filter((g) => g.resultado).length - antes.filter((g) => g.resultado).length;
    }
  }
  if (Object.keys(fpf.serie || {}).length) {
    // Uma linha por jogo: o ficheiro fica legível e os diffs pequenos.
    const corpo = Object.entries(res.equipas).map(([letra, eq]) => `    "${letra}": {\n      "jornadas": {\n` +
      Object.entries(eq.jornadas).sort((a, b) => a[0] - b[0]).map(([n, jogos]) => `        "${n}": [\n` +
        jogos.map((g) => `          ${JSON.stringify(g)}`).join(',\n') + '\n        ]').join(',\n') + '\n      }\n    }').join(',\n');
    writeFileSync(FICHEIRO_RES, `{\n  "atualizado": ${JSON.stringify(dados.atualizado)},\n  "equipas": {\n${corpo}\n  }\n}\n`);
    if (novosRes) alteracoes.push(`resultados da série: ${novosRes} novo(s)`);
  }
  console.log(`Jornadas lidas: ${JSON.stringify(fpf.jornadasLidas)}`);
  console.log(alteracoes.length ? `Alterações (${alteracoes.length}):\n- ${alteracoes.join('\n- ')}` : 'Sem alterações.');
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'plano') plano(arg === '--com-proximos');
else if (cmd === 'juntar' && arg) juntar(arg);
else {
  console.error('Uso: node scripts/juntar-fpf.mjs plano | juntar <ficheiro-da-fpf.json>');
  process.exit(1);
}
