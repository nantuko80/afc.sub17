// Geração de calendários iCalendar (.ics) a partir de data/jogos.json.
// Usado no browser (adicionar um jogo) e em scripts/gerar-ics.mjs (subscrições).

const DURACAO_MIN = 105; // 2 x 40 min + intervalo e margem

const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Lisbon',
  'BEGIN:STANDARD',
  'DTSTART:19701025T020000',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0000',
  'TZNAME:WET',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'BEGIN:DAYLIGHT',
  'DTSTART:19700329T010000',
  'TZOFFSETFROM:+0000',
  'TZOFFSETTO:+0100',
  'TZNAME:WEST',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'END:VTIMEZONE',
];

const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

// RFC 5545: linhas com mais de 75 octetos são dobradas.
function dobrar(linha) {
  const bytes = new TextEncoder().encode(linha);
  if (bytes.length <= 75) return linha;
  const partes = [];
  let atual = '';
  let tam = 0;
  for (const ch of linha) {
    const n = new TextEncoder().encode(ch).length;
    if (tam + n > (partes.length ? 74 : 75)) {
      partes.push(atual);
      atual = '';
      tam = 0;
    }
    atual += ch;
    tam += n;
  }
  partes.push(atual);
  return partes.join('\r\n ');
}

const soDigitos = (s) => s.replace(/[-:]/g, '');

function diaSeguinte(data) {
  const [a, m, d] = data.split('-').map(Number);
  const t = new Date(Date.UTC(a, m - 1, d + 1));
  return t.toISOString().slice(0, 10);
}

function somarMinutos(hora, min) {
  const [h, m] = hora.split(':').map(Number);
  const total = h * 60 + m + min;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function tituloJogo(jogo, equipa) {
  const marcador = jogo.resultado ? ` ${jogo.resultado} ` : ' x ';
  return `${equipa.nome} · ${jogo.casa}${marcador}${jogo.fora}`;
}

function evento(jogo, equipa, stamp) {
  const linhas = [
    'BEGIN:VEVENT',
    `UID:anadia-sub17-${jogo.id.toLowerCase()}@afc-sub17`,
    `DTSTAMP:${stamp}`,
  ];
  if (jogo.hora) {
    linhas.push(`DTSTART;TZID=Europe/Lisbon:${soDigitos(jogo.data)}T${soDigitos(jogo.hora)}00`);
    linhas.push(`DTEND;TZID=Europe/Lisbon:${soDigitos(jogo.data)}T${soDigitos(somarMinutos(jogo.hora, DURACAO_MIN))}00`);
  } else {
    linhas.push(`DTSTART;VALUE=DATE:${soDigitos(jogo.data)}`);
    linhas.push(`DTEND;VALUE=DATE:${soDigitos(diaSeguinte(jogo.data))}`);
  }
  const descricao = [
    `${equipa.competicao}${equipa.zona ? ' · ' + equipa.zona : ''} · Jornada ${jogo.jornada}`,
    jogo.emCasa ? 'Jogo em casa' : 'Jogo fora',
    jogo.hora || jogo.resultado ? null : 'Hora por confirmar',
    `Fonte: ${equipa.url}`,
  ].filter(Boolean).join('\n');
  linhas.push(`SUMMARY:${esc(tituloJogo(jogo, equipa))}`);
  if (jogo.local) linhas.push(`LOCATION:${esc([jogo.local, jogo.localidade].filter(Boolean).join(', '))}`);
  linhas.push(`DESCRIPTION:${esc(descricao)}`);
  linhas.push(`URL:${equipa.url}`);
  linhas.push('END:VEVENT');
  return linhas;
}

/**
 * @param {object} dados conteúdo de data/jogos.json
 * @param {object} [opcoes]
 * @param {string[]} [opcoes.equipas] letras das equipas a incluir (por omissão, todas)
 * @param {string} [opcoes.idJogo] só este jogo
 * @param {string} [opcoes.nome] nome do calendário
 */
export function gerarIcs(dados, { equipas, idJogo, nome } = {}) {
  const letras = equipas ?? Object.keys(dados.equipas);
  const stamp = new Date(dados.atualizado).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const jogos = dados.jogos.filter((j) => j.data && letras.includes(j.equipa) && (!idJogo || j.id === idJogo));
  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Diretores Sub-17 Anadia FC (não oficial)//Jogos//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];
  if (!idJogo) {
    linhas.push(`X-WR-CALNAME:${esc(nome ?? 'Anadia FC · Sub-17')}`);
    linhas.push('X-WR-TIMEZONE:Europe/Lisbon');
    linhas.push('REFRESH-INTERVAL;VALUE=DURATION:PT6H');
    linhas.push('X-PUBLISHED-TTL:PT6H');
  }
  linhas.push(...VTIMEZONE);
  for (const j of jogos) linhas.push(...evento(j, dados.equipas[j.equipa], stamp));
  linhas.push('END:VCALENDAR');
  return linhas.map(dobrar).join('\r\n') + '\r\n';
}

// Calendários publicados no site (ficheiro → equipas incluídas).
export const CALENDARIOS = [
  { ficheiro: 'anadia-sub17.ics', equipas: ['A', 'B'], nome: 'Anadia FC · Sub-17 A e B' },
  { ficheiro: 'anadia-sub17-a.ics', equipas: ['A'], nome: 'Anadia FC · Sub-17 A' },
  { ficheiro: 'anadia-sub17-b.ics', equipas: ['B'], nome: 'Anadia FC · Sub-17 B' },
];
