// Atualização a partir da FPF, em dois passos (ver .claude/skills/atualizar-jogos/SKILL.md):
//
//   node scripts/juntar-fpf.mjs plano            -> configuração para extrairFPF(): jogos já realizados sem resultado
//   node scripts/juntar-fpf.mjs plano --com-proximos  -> idem, mais as próximas 8 semanas (adiamentos, horas)
//   node scripts/juntar-fpf.mjs juntar fpf.json  -> junta o que veio da FPF em data/jogos.json
//
// A FPF tem prioridade (adiamentos, horas, resultados). Do que já temos mantém-se a localidade,
// a grafia dos nomes e a hora de jogos já realizados (a FPF deixa de a mostrar).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const FICHEIRO = join(RAIZ, 'data/jogos.json');
const DIAS_A_FRENTE = 56; // alterações de data/hora costumam surgir nas semanas seguintes
const MAX_JORNADAS = 22; // a FPF aceita ~30 pedidos seguidos; deixa margem para as páginas das competições

const dados = JSON.parse(readFileSync(FICHEIRO, 'utf8'));
const hoje = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon' }).format(new Date());
const somarDias = (iso, n) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const chave = (s) => (s || '').normalize('NFKD').replace(/[^\w]/g, '').toLowerCase();

function plano(comProximos) {
  const limite = somarDias(hoje, DIAS_A_FRENTE);
  const equipas = {};
  const motivos = {};
  for (const [letra, eq] of Object.entries(dados.equipas)) {
    const url = new URL(eq.url);
    const jogos = dados.jogos.filter((j) => j.equipa === letra);
    // Jogos já realizados sem resultado (inclui jogos adiados, que assim ficam com a data nova);
    // opcionalmente, os próximos, para apanhar mudanças de data ou hora.
    const semResultado = jogos.filter((j) => j.data && j.data < hoje && !j.resultado).map((j) => j.jornada);
    const proximos = comProximos ? jogos.filter((j) => j.data && j.data >= hoje && j.data <= limite).map((j) => j.jornada) : [];
    equipas[letra] = {
      competitionId: Number(url.searchParams.get('competitionId')),
      jornadas: [...new Set([...semResultado, ...proximos])].sort((a, b) => a - b),
    };
    motivos[letra] = { semResultado, proximos };
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
  console.error(`Hoje: ${hoje}. Jornadas a ler: ${total}.`, JSON.stringify(motivos));
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
