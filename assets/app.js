import { CALENDARIOS, gerarIcs, tituloJogo } from './ics.js';

const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const DIAS_LONGOS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const CHOQUE_MIN = 180; // jogos a menos de 3h em locais diferentes não dão para acompanhar ambos

// Ícones Phosphor (peso bold, licença MIT) - https://phosphoricons.com
const ICONES = {
  local: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,60a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,60Zm0,64a20,20,0,1,1,20-20A20,20,0,0,1,128,124Zm0-112a92.1,92.1,0,0,0-92,92c0,77.36,81.64,135.4,85.12,137.83a12,12,0,0,0,13.76,0,259,259,0,0,0,42.18-39C205.15,170.57,220,136.37,220,104A92.1,92.1,0,0,0,128,12Zm31.3,174.71A249.35,249.35,0,0,1,128,216.89a249.35,249.35,0,0,1-31.3-30.18C80,167.37,60,137.31,60,104a68,68,0,0,1,136,0C196,137.31,176,167.37,159.3,186.71Z"/></svg>',
  calendario: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm112-52a12,12,0,0,1-12,12H140v12a12,12,0,0,1-24,0V164H104a12,12,0,0,1,0-24h12V128a12,12,0,0,1,24,0v12h12A12,12,0,0,1,164,152Z"/></svg>',
  partilhar: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M220,112v96a20,20,0,0,1-20,20H56a20,20,0,0,1-20-20V112A20,20,0,0,1,56,92H76a12,12,0,0,1,0,24H60v88H196V116H180a12,12,0,0,1,0-24h20A20,20,0,0,1,220,112ZM96.49,72.49,116,53v83a12,12,0,0,0,24,0V53l19.51,19.52a12,12,0,1,0,17-17l-40-40a12,12,0,0,0-17,0l-40,40a12,12,0,1,0,17,17Z"/></svg>',
  info: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z"/></svg>',
  alerta: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z"/></svg>',
  rota: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M238.7,102.46,62.81,37.21l-.25-.09A20,20,0,0,0,37.12,62.56l.09.25L102.46,238.7A20,20,0,0,0,121.3,252h.35a20,20,0,0,0,18.77-14.12l.09-.29,21.23-75.85,75.85-21.23.29-.09a20,20,0,0,0,.82-38Zm-89.93,38a12,12,0,0,0-8.32,8.32l-19.68,70.29L62.8,62.8l156.26,58Z"/></svg>',
  google: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M228,128a100,100,0,1,1-22.86-63.64,12,12,0,0,1-18.51,15.28A76,76,0,1,0,203.05,140H128a12,12,0,0,1,0-24h88A12,12,0,0,1,228,128Z"/></svg>',
  apple: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M227,168a12,12,0,0,0-4.21-5.09C207.25,152.22,204,133.68,204,120c0-16.17,12.68-30.6,20.25-37.76a12,12,0,0,0,0-17.43C210.89,52.17,188.81,44,168,44a76.29,76.29,0,0,0-40,11.37,75.59,75.59,0,0,0-93.58,11A78.64,78.64,0,0,0,12,123.51,131,131,0,0,0,53.43,216,43.81,43.81,0,0,0,83.6,228h87.69a43.87,43.87,0,0,0,32.05-13.85,127.63,127.63,0,0,0,18.4-25.39c1.57-2.88,3-5.71,4.14-8.41C227.47,176.67,229.12,172.87,227,168Zm-41.23,29.82A19.78,19.78,0,0,1,171.29,204H83.6a19.85,19.85,0,0,1-13.7-5.42A107.18,107.18,0,0,1,36,122.88,54.49,54.49,0,0,1,51.5,83.28,50.86,50.86,0,0,1,88,68h.72A51.5,51.5,0,0,1,120.48,79.4a12,12,0,0,0,15,0A51.41,51.41,0,0,1,168,68a67.24,67.24,0,0,1,29.88,7.4C186.26,89.66,180,105.13,180,120c0,23.33,7.47,42.89,21.25,56.19A103.3,103.3,0,0,1,185.76,197.81ZM128.75,13A43.83,43.83,0,0,1,142.17,1.51a12,12,0,0,1,11.64,21,19.84,19.84,0,0,0-6.11,5.24A12,12,0,0,1,128.75,13Z"/></svg>',
  abrir: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"/></svg>',
  ligacao: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M117.18,188.74a12,12,0,0,1,0,17l-5.12,5.12A58.26,58.26,0,0,1,70.6,228h0A58.62,58.62,0,0,1,29.14,127.92L63.89,93.17a58.64,58.64,0,0,1,98.56,28.11,12,12,0,1,1-23.37,5.44,34.65,34.65,0,0,0-58.22-16.58L46.11,144.89A34.62,34.62,0,0,0,70.57,204h0a34.41,34.41,0,0,0,24.49-10.14l5.11-5.12A12,12,0,0,1,117.18,188.74ZM226.83,45.17a58.65,58.65,0,0,0-82.93,0l-5.11,5.11a12,12,0,0,0,17,17l5.12-5.12a34.63,34.63,0,1,1,49,49L175.1,145.86A34.39,34.39,0,0,1,150.61,156h0a34.63,34.63,0,0,1-33.69-26.72,12,12,0,0,0-23.38,5.44A58.64,58.64,0,0,0,150.56,180h.05a58.28,58.28,0,0,0,41.47-17.17l34.75-34.75a58.62,58.62,0,0,0,0-82.91Z"/></svg>',
};

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- Datas (sempre na hora de Lisboa) ----------
const hojeLisboa = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon' }).format(new Date());
const paraData = (iso) => { const [a, m, d] = iso.split('-').map(Number); return new Date(a, m - 1, d); };
const isoDe = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
const somarDias = (iso, n) => { const d = paraData(iso); d.setDate(d.getDate() + n); return isoDe(d); };
const diasEntre = (a, b) => Math.round((paraData(b) - paraData(a)) / 86400000);
const minutos = (h) => { const [hh, mm] = h.split(':').map(Number); return hh * 60 + mm; };
const segundaDaSemana = (iso) => somarDias(iso, -((paraData(iso).getDay() + 6) % 7));
const dataCurta = (iso) => { const d = paraData(iso); return `${d.getDate()} ${MESES[d.getMonth()]}`; };
const dataComDia = (iso) => { const d = paraData(iso); return `${DIAS_LONGOS[d.getDay()]}, ${d.getDate()} ${MESES[d.getMonth()]}`; };

function contagem(iso, hoje) {
  const n = diasEntre(hoje, iso);
  if (n === 0) return 'Hoje';
  if (n === 1) return 'Amanhã';
  return `Daqui a ${n} dias`;
}

// ---------- Estado ----------
const estado = { equipa: 'todas', vista: 'proximos', dados: null, emblemas: {}, campos: {} };

function guardar() {
  try { localStorage.setItem('afc-sub17', JSON.stringify({ equipa: estado.equipa, vista: estado.vista })); } catch { /* sem armazenamento */ }
}
function restaurar() {
  const hash = location.hash.replace('#', '').toUpperCase();
  try {
    const s = JSON.parse(localStorage.getItem('afc-sub17') || '{}');
    if (['todas', 'A', 'B'].includes(s.equipa)) estado.equipa = s.equipa;
    if (['proximos', 'resultados'].includes(s.vista)) estado.vista = s.vista;
  } catch { /* sem armazenamento */ }
  if (hash === 'A' || hash === 'B') estado.equipa = hash;
}

// ---------- Lógica dos jogos ----------
function resultadoAnadia(j) {
  if (!j.resultado) return null;
  const [c, f] = j.resultado.split('-').map(Number);
  const nos = j.emCasa ? c : f;
  const eles = j.emCasa ? f : c;
  return nos > eles ? 'v' : nos < eles ? 'd' : 'e';
}

const realizado = (j, hoje) => !!j.resultado || (j.data && j.data < hoje);

// Dias em que A e B jogam: "mesmo-dia" ou "choque" (horas próximas em locais diferentes).
function calcularChoques(jogos) {
  const porDia = new Map();
  for (const j of jogos) {
    if (!j.data) continue;
    if (!porDia.has(j.data)) porDia.set(j.data, []);
    porDia.get(j.data).push(j);
  }
  const choques = new Map();
  for (const [dia, lista] of porDia) {
    const a = lista.filter((j) => j.equipa === 'A');
    const b = lista.filter((j) => j.equipa === 'B');
    if (!a.length || !b.length) continue;
    let tipo = 'mesmo-dia';
    for (const ja of a) for (const jb of b) {
      const mesmoLocal = ja.local && ja.local === jb.local;
      const perto = ja.hora && jb.hora && Math.abs(minutos(ja.hora) - minutos(jb.hora)) < CHOQUE_MIN;
      if (perto && !mesmoLocal) tipo = 'choque';
    }
    choques.set(dia, tipo);
  }
  return choques;
}

// Horas da A e da B num dia de choque (o choque é marcado com menos de 3h entre jogos em sítios diferentes).
function horasChoque(jogos, dia) {
  const a = jogos.find((j) => j.data === dia && j.equipa === 'A');
  const b = jogos.find((j) => j.data === dia && j.equipa === 'B');
  return { a: a.hora, b: b.hora, iguais: a.hora === b.hora };
}
// Aviso por extenso, no cartão do próximo jogo.
function textoChoque(jogos, dia) {
  const h = horasChoque(jogos, dia);
  return h.iguais
    ? `A e B jogam à mesma hora em sítios diferentes (${h.a})`
    : `Jogos seguidos em sítios diferentes (A às ${h.a}, B às ${h.b})`;
}
// Chip junto ao título do fim de semana: "Jogam à mesma hora: dom 09:00" ou "Jogos seguidos: dom 09:00 e 11:30".
function chipChoque(jogos, dias) {
  return dias.map((d) => {
    const h = horasChoque(jogos, d);
    const dia = DIAS[paraData(d).getDay()];
    return h.iguais ? `Jogam à mesma hora: ${dia} ${h.a}` : `Jogos seguidos: ${dia} ${[h.a, h.b].sort().join(' e ')}`;
  }).join(' · ');
}

// Destino no mapa: coordenadas de data/campos.json quando o campo lá está (nome da FPF -> lat/lon); senão, o nome e a localidade.
const destino = (j) => {
  const c = estado.campos[j.local];
  return c ? `${c.lat},${c.lon}` : encodeURIComponent(`${j.local}, ${j.localidade || j.casa}`);
};
const mapa = (j) => `https://www.google.com/maps/search/?api=1&query=${destino(j)}`;
// Como chegar usa sempre o Google Maps, que encontra melhor os campos pelo nome da FPF; o link
// abre a app quando está instalada. No telemóvel não abre separador novo, para não ficar
// uma página vazia no browser quando passa para a app.
const MOVEL = /Android|iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
// Abre o local no mapa (e não um percurso): o diretor vê o campo e pede as indicações na própria app.
const comoChegar = mapa;
const abrirMapa = MOVEL ? '' : ' target="_blank" rel="noopener"';
const localCompleto = (j) => (j.localidade && !j.local.toLowerCase().includes(j.localidade.toLowerCase()) ? `${j.local} · ${j.localidade}` : j.local);

// Emblema do clube (data/emblemas.json: nome do clube sem "B" -> ficheiro); sem emblema, as iniciais.
const clube = (n) => n.replace(/\s*"B"$/, '');
function emblema(n) {
  const f = estado.emblemas[clube(n)];
  if (f) return `<img class="emblema" src="${esc(f)}" alt="" width="20" height="20" loading="lazy" decoding="async">`;
  const ini = clube(n).replace(/[^\p{L}\s]/gu, '').split(/\s+/).filter((p) => p.length > 2 || /^[A-Z]{2,}$/.test(p)).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  return `<span class="emblema emblema-ini" aria-hidden="true">${esc(ini || clube(n)[0])}</span>`;
}
function local(j, semLigacao) {
  if (!j.local) return '';
  const texto = `${ICONES.local}${esc(localCompleto(j))}`;
  return semLigacao
    ? `<span class="jogo-local">${texto}</span>`
    : `<a class="jogo-local" href="${comoChegar(j)}"${abrirMapa} aria-label="Como chegar a ${esc(localCompleto(j))}">${texto}</a>`;
}
function equipasHtml(j) {
  const nome = (n) => `<span class="clube">${emblema(n)}${/Anadia/i.test(n) ? `<b>${esc(n)}</b>` : esc(n)}</span>`;
  return `${nome(j.casa)}<span class="sr-only"> x </span>${nome(j.fora)}`;
}

function textoPartilha(j, equipa) {
  const quando = `${dataComDia(j.data)}${j.hora ? ', ' + j.hora : ''}`;
  return [
    `⚽ ${equipa.nome} · Jornada ${j.jornada}`,
    `${j.casa} x ${j.fora}`,
    `📅 ${quando}`,
    j.local ? `📍 ${localCompleto(j)}\n${mapa(j)}` : null,
  ].filter(Boolean).join('\n');
}

// ---------- Renderização ----------
const acoesHtml = (j, comRota) => `
  ${comRota && j.local ? `<a class="btn btn-principal" href="${comoChegar(j)}"${abrirMapa}>${ICONES.rota}Como chegar</a>` : ''}
  <button type="button" class="btn" data-adicionar="${j.id}">${ICONES.calendario}Adicionar</button>
  <button type="button" class="btn" data-partilhar="${j.id}">${ICONES.partilhar}Partilhar</button>`;
const jornadaLado = (j) => `Jornada ${j.jornada} · ${j.emCasa ? 'Em casa' : 'Fora'}`;
const proximoDe = (dados, letra, hoje) => dados.jogos.find((x) => x.equipa === letra && x.data && x.data >= hoje && !x.resultado);

function renderProximos(dados, hoje) {
  const choques = calcularChoques(dados.jogos);
  const html = Object.entries(dados.equipas).map(([letra, eq]) => {
    const j = proximoDe(dados, letra, hoje);
    if (!j) {
      return `<article class="cartao"><div class="cartao-cab"><span class="equipa equipa-${letra}">${esc(eq.nome)}</span></div>
        <p class="aviso">Sem jogos marcados de momento.</p></article>`;
    }
    const d = paraData(j.data);
    return `<article class="cartao">
      <div class="cartao-cab">
        <span class="cartao-id"><span class="equipa equipa-${letra}">${esc(eq.nome)}</span><span class="jornada">${jornadaLado(j)}</span></span>
        <span class="contagem">${contagem(j.data, hoje)}</span>
      </div>
      <div class="cartao-quando">${DIAS_LONGOS[d.getDay()]} ${dataCompacta(j.data)}<small>${j.hora ? esc(j.hora) : 'Hora a definir'}</small></div>
      <div>
        <div class="cartao-jogo">${equipasHtml(j)}</div>
        ${local(j, !j.emCasa)}
        ${choques.get(j.data) === 'choque' ? `<div class="jogo-aviso">${ICONES.alerta}<span>${esc(textoChoque(dados.jogos, j.data))}</span></div>` : ''}
      </div>
      <div class="cartao-acoes">${acoesHtml(j, !j.emCasa)}</div>
    </article>`;
  }).join('');
  $('#proximos').innerHTML = html;
  $('#proximos').removeAttribute('aria-busy');
}

function renderAvisos(dados, hoje) {
  const notas = [];
  const letras = estado.equipa === 'todas' ? Object.keys(dados.equipas) : [estado.equipa];
  for (const l of letras) {
    const eq = dados.equipas[l];
    const ultima = Math.max(0, ...dados.jogos.filter((j) => j.equipa === l).map((j) => j.jornada));
    if (eq.jornadas && ultima < eq.jornadas) {
      notas.push(`<div class="nota">${ICONES.info}<span><b>${esc(eq.nome)}:</b> a AF Aveiro só publicou os jogos até à jornada ${ultima} (de ${eq.jornadas}). Os restantes aparecem aqui quando forem publicados.</span></div>`);
    }
  }
  const idade = diasEntre(dados.atualizado.slice(0, 10), hoje);
  if (idade > 10) {
    notas.push(`<div class="nota nota-alerta">${ICONES.alerta}<span>Os dados foram atualizados há ${idade} dias. Confirme datas e horas no site da FPF.</span></div>`);
  }
  $('#avisos').innerHTML = notas.join('');
}

function tituloSemana(segunda, jogos) {
  const sabado = somarDias(segunda, 5);
  const domingo = somarDias(segunda, 6);
  const soFimDeSemana = jogos.every((j) => j.data === sabado || j.data === domingo);
  if (soFimDeSemana) {
    const [s, d] = [paraData(sabado), paraData(domingo)];
    const intervalo = s.getMonth() === d.getMonth()
      ? `${s.getDate()}-${d.getDate()} ${MESES[d.getMonth()]}`
      : `${dataCurta(sabado)} - ${dataCurta(domingo)}`;
    return `<strong>Fim de semana</strong> · ${intervalo}`;
  }
  return `<strong>Semana</strong> · ${dataCurta(segunda)} - ${dataCurta(domingo)}`;
}

function renderLista(dados, hoje) {
  const choques = calcularChoques(dados.jogos);
  const resultados = estado.vista === 'resultados';
  // Próximos: sem os jogos que já estão nos cartões. Resultados: só os realizados, do mais recente para o mais antigo.
  const nosCartoes = new Set(Object.keys(dados.equipas).map((l) => proximoDe(dados, l, hoje)?.id));
  let jogos = dados.jogos.filter((j) =>
    j.data &&
    (estado.equipa === 'todas' || j.equipa === estado.equipa) &&
    (resultados ? realizado(j, hoje) : !realizado(j, hoje) && !nosCartoes.has(j.id)));
  if (resultados) jogos = jogos.reverse();

  if (!jogos.length) {
    $('#lista').innerHTML = `<div class="vazio">${resultados ? 'Ainda não há jogos realizados.' : 'Não há mais jogos marcados. Veja os resultados em “Resultados”.'}</div>`;
    return;
  }

  const semanas = new Map();
  for (const j of jogos) {
    const k = segundaDaSemana(j.data);
    if (!semanas.has(k)) semanas.set(k, []);
    semanas.get(k).push(j);
  }

  const verAmbas = estado.equipa === 'todas';
  let html = '';
  for (const [segunda, lista] of semanas) {
    const diasChoque = [...new Set(lista.map((j) => j.data))].filter((d) => choques.has(d) && !realizado({ data: d }, hoje));
    const temChoque = verAmbas && diasChoque.some((d) => choques.get(d) === 'choque');
    const ambas = verAmbas && diasChoque.length && !temChoque;
    html += `<section class="semana">
      <div class="semana-cab">
        <h3 class="semana-titulo">${tituloSemana(segunda, lista)}</h3>
        ${temChoque ? `<span class="semana-alerta">${chipChoque(dados.jogos, diasChoque.filter((d) => choques.get(d) === 'choque'))}</span>` : ambas ? '<span class="semana-alerta">A e B no mesmo dia</span>' : ''}
      </div>
      <ul class="semana-jogos${temChoque ? ' com-choque' : ''}">${lista.map((j) => linhaJogo(j, dados, hoje, verAmbas ? choques : null)).join('')}</ul>
    </section>`;
  }
  $('#lista').innerHTML = html;
}

const dataCompacta = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d} ${MESES[m - 1]} ${String(a).slice(2)}`; };

function linhaJogo(j, dados, hoje, choques) {
  const d = paraData(j.data);
  const passado = realizado(j, hoje);
  const r = resultadoAnadia(j);
  const choque = choques && !passado && choques.get(j.data) === 'choque';
  const depois = r
    ? `<span class="resultado ${r}" title="${{ v: 'Vitória', e: 'Empate', d: 'Derrota' }[r]}">${esc(j.resultado)}</span>`
    : j.hora
      ? `<span class="hora">${esc(j.hora)}</span>`
      : passado ? '' : '<span class="hora hora-pc">Hora a definir</span>';
  const esbater = passado && estado.vista !== 'resultados';
  // Jogos por realizar abrem no próprio cartão com as ações (como chegar, adicionar, partilhar).
  const abre = !passado;
  const painel = `acoes-${j.id}`;
  return `<li class="jogo${esbater ? ' passado' : ''}${choque ? ' choque' : ''}${abre ? ' expansivel' : ''}">
    <div class="jogo-info">
      <div class="jogo-meta">
        <span class="equipa equipa-${j.equipa}">${esc(dados.equipas[j.equipa].nome)}</span>
        <span class="jornada">${jornadaLado(j)}</span>
      </div>
      <div class="jogo-equipas">${equipasHtml(j)}</div>
      ${local(j, abre && !j.emCasa)}
    </div>
    <div class="jogo-quando">
      <span class="dsem">${DIAS[d.getDay()]}</span>
      <span class="data" aria-label="${dataComDia(j.data)}">${dataCompacta(j.data)}</span>
      ${depois}
      ${abre ? `<button type="button" class="icone-btn jogo-abrir" data-abrir aria-expanded="false" aria-controls="${painel}" aria-label="Opções do jogo" title="Opções">${ICONES.abrir}</button>` : ''}
    </div>
    ${abre ? `<div class="jogo-acoes" id="${painel}" hidden>${acoesHtml(j, !j.emCasa)}</div>` : ''}
  </li>`;
}

// Um cartão aberto de cada vez.
function alternar(li) {
  const abrir = !li.classList.contains('aberto');
  document.querySelectorAll('.jogo.aberto').forEach((x) => fechar(x));
  if (!abrir) return;
  li.classList.add('aberto');
  li.querySelector('[data-abrir]').setAttribute('aria-expanded', 'true');
  li.querySelector('.jogo-acoes').hidden = false;
}
function fechar(li) {
  li.classList.remove('aberto');
  li.querySelector('[data-abrir]').setAttribute('aria-expanded', 'false');
  li.querySelector('.jogo-acoes').hidden = true;
}

function renderSubscricoes() {
  const c = CALENDARIOS.find((x) => (estado.equipa === 'todas' ? x.equipas.length > 1 : x.equipas.join() === estado.equipa));
  const https = new URL(`calendario/${c.ficheiro}`, location.href).href;
  const webcal = https.replace(/^https?:/, 'webcal:');
  const google = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`;
  $('#subscricao-alvo').textContent = c.equipas.length > 1
    ? 'Inclui a A e a B. Para só uma equipa, escolha-a no filtro.'
    : `Inclui só a Sub-17 ${c.equipas[0]}. Para as duas, escolha “Ambas” no filtro.`;
  $('#subscricao-btns').innerHTML = `
    <a class="btn btn-principal" href="${google}" target="_blank" rel="noopener">${ICONES.google}Google Calendar</a>
    <a class="btn" href="${webcal}">${ICONES.apple}iPhone / Outlook</a>
    <button type="button" class="btn" data-copiar="${https}">${ICONES.ligacao}Copiar ligação</button>`;
}

function renderCabecalho(dados) {
  $('#subtitulo').textContent = `Calendário de jogos ${dados.epoca}`;
  const atual = new Date(dados.atualizado);
  const quando = new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Lisbon' }).format(atual);
  const comps = Object.values(dados.equipas)
    .map((e) => `<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.nome)}: ${esc(e.competicao)}${e.zona ? ' (' + esc(e.zona) + ')' : ''}</a>`)
    .join(' · ');
  $('#fonte').innerHTML = `Dados da FPF e da AF Aveiro, atualizados a ${esc(quando)}. Podem ser alterados; na dúvida, confirme na FPF: ${comps}.`;
}

function render() {
  const hoje = hojeLisboa();
  const dados = estado.dados;
  document.querySelectorAll('[data-equipa]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.equipa === estado.equipa)));
  document.querySelectorAll('[data-vista]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.vista === estado.vista)));
  renderAvisos(dados, hoje);
  renderLista(dados, hoje);
  renderSubscricoes();
}

// ---------- Ações ----------
let tempoToast;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('ver');
  clearTimeout(tempoToast);
  tempoToast = setTimeout(() => t.classList.remove('ver'), 2600);
}

function adicionar(id) {
  const j = estado.dados.jogos.find((x) => x.id === id);
  const ics = gerarIcs(estado.dados, { idJogo: id });
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `anadia-sub17-${j.equipa.toLowerCase()}-jornada-${j.jornada}.ics` });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Jogo descarregado. Abra o ficheiro para o juntar ao calendário.');
}

async function copiar(texto, msg) {
  try {
    await navigator.clipboard.writeText(texto);
    toast(msg);
  } catch {
    window.prompt('Copie o texto:', texto);
  }
}

async function partilhar(id) {
  const j = estado.dados.jogos.find((x) => x.id === id);
  const eq = estado.dados.equipas[j.equipa];
  const texto = textoPartilha(j, eq);
  if (navigator.share) {
    try { await navigator.share({ title: tituloJogo(j, eq), text: texto }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  copiar(texto, 'Jogo copiado. Já pode colar no WhatsApp.');
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) {
    // Tocar em qualquer parte do cartão abre-o, exceto em ligações ou ao selecionar texto.
    const li = e.target.closest('.jogo.expansivel');
    if (li && !e.target.closest('a, .jogo-acoes') && !String(getSelection())) alternar(li);
    return;
  }
  if (b.dataset.abrir !== undefined) alternar(b.closest('.jogo'));
  else if (b.dataset.equipa) {
    estado.equipa = b.dataset.equipa;
    history.replaceState(null, '', estado.equipa === 'todas' ? location.pathname + location.search : '#' + estado.equipa.toLowerCase());
    guardar();
    render();
  } else if (b.dataset.vista) {
    estado.vista = b.dataset.vista;
    guardar();
    render();
  } else if (b.dataset.adicionar) adicionar(b.dataset.adicionar);
  else if (b.dataset.partilhar) partilhar(b.dataset.partilhar);
  else if (b.dataset.copiar) copiar(b.dataset.copiar, 'Ligação copiada.');
});

document.querySelectorAll('.segmentos').forEach((g) => g.addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  const btns = [...e.currentTarget.querySelectorAll('button')];
  const i = btns.findIndex((b) => b.getAttribute('aria-checked') === 'true');
  const n = btns[(i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length];
  n.click();
  n.focus();
}));

// ---------- Arranque ----------
async function iniciar() {
  restaurar();
  try {
    const [r, e, c] = await Promise.all([
      fetch('data/jogos.json', { cache: 'no-cache' }),
      fetch('data/emblemas.json').catch(() => null),
      fetch('data/campos.json').catch(() => null),
    ]);
    if (!r.ok) throw new Error(r.status);
    estado.dados = await r.json();
    if (e?.ok) estado.emblemas = await e.json().catch(() => ({}));
    if (c?.ok) estado.campos = await c.json().catch(() => ({}));
  } catch {
    $('#proximos').removeAttribute('aria-busy');
    $('#proximos').innerHTML = `<div class="vazio erro"><p>Não foi possível carregar os jogos. Verifique a ligação à internet.</p>
      <button type="button" class="btn btn-principal" onclick="location.reload()">Tentar de novo</button></div>`;
    return;
  }
  renderCabecalho(estado.dados);
  renderProximos(estado.dados, hojeLisboa());
  render();
}

iniciar();
