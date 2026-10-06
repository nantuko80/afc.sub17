import { CALENDARIOS, gerarIcs, tituloJogo } from './ics.js';

const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const DIAS_LONGOS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const CHOQUE_MIN = 180; // jogos a menos de 3h em locais diferentes não dão para acompanhar ambos

// Ícones Tabler (contorno, licença MIT) - https://tabler.io/icons
// Todos com traço de 1.1px reais no ecrã, seja qual for o tamanho (vector-effect: non-scaling-stroke).
const icone = (...d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d.map((x) => `<path vector-effect="non-scaling-stroke" d="${x}"/>`).join('')}</svg>`;
const ICONES = {
  local: icone('M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0', 'M3 9h3v6h-3l0 -6', 'M18 9h3v6h-3l0 -6', 'M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10', 'M12 5l0 14'), // soccer-field
  calendario: icone('M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5', 'M16 3v4', 'M8 3v4', 'M4 11h16', 'M16 19h6', 'M19 16v6'), // calendar-plus
  partilhar: icone('M8 9h-1a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1', 'M12 14v-11', 'M9 6l3 -3l3 3'), // share-2
  info: icone('M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0', 'M12 9h.01', 'M11 12h1v4h1'), // info-circle
  alerta: icone('M12 9v4', 'M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0', 'M12 16h.01'), // alert-triangle
  rota: icone('M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5'), // location
  google: icone('M20.945 11a9 9 0 1 1 -3.284 -5.997l-2.655 2.392a5.5 5.5 0 1 0 2.119 6.605h-4.125v-3h7.945'), // brand-google
  apple: icone('M8.286 7.008c-3.216 0 -4.286 3.23 -4.286 5.92c0 3.229 2.143 8.072 4.286 8.072c1.165 -.05 1.799 -.538 3.214 -.538c1.406 0 1.607 .538 3.214 .538s4.286 -3.229 4.286 -5.381c-.03 -.011 -2.649 -.434 -2.679 -3.23c-.02 -2.335 2.589 -3.179 2.679 -3.228c-1.096 -1.606 -3.162 -2.113 -3.75 -2.153c-1.535 -.12 -3.032 1.077 -3.75 1.077c-.729 0 -2.036 -1.077 -3.214 -1.077', 'M12 4a2 2 0 0 0 2 -2a2 2 0 0 0 -2 2'), // brand-apple
  abrir: icone('M6 9l6 6l6 -6'), // chevron-down
  ligacao: icone('M9 15l6 -6', 'M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464', 'M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463'), // link
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
// Se o título já é o próprio dia ("Domingo · 25 out"), o dia sai do chip: "Jogam à mesma hora: 09:00".
function chipChoque(jogos, dias, semDia) {
  return dias.map((d) => {
    const h = horasChoque(jogos, d);
    const dia = semDia ? '' : `${DIAS[paraData(d).getDay()]} `;
    return h.iguais ? `Jogam à mesma hora: ${dia}${h.a}` : `Jogos seguidos: ${dia}${[h.a, h.b].sort().join(' e ')}`;
  }).join(' · ');
}

// Destino da pesquisa no mapa: coordenadas de data/campos.json quando o campo lá está (nome da FPF -> lat/lon); senão, o nome e a localidade.
const destino = (j) => {
  const c = estado.campos[j.local];
  return c?.lat != null && c?.lon != null ? `${c.lat},${c.lon}` : encodeURIComponent(`${j.local}, ${j.localidade || j.casa}`);
};
// Link do mapa: o "url" de data/campos.json quando existe (ficha exata do Google Maps); senão, uma pesquisa pelo destino.
const mapa = (j) => estado.campos[j.local]?.url || `https://www.google.com/maps/search/?api=1&query=${destino(j)}`;
// Como chegar usa sempre o Google Maps, que encontra melhor os campos pelo nome da FPF; o link
// abre a app quando está instalada. No telemóvel não abre separador novo, para não ficar
// uma página vazia no browser quando passa para a app.
const MOVEL = /Android|iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
// Abre o local no mapa (e não um percurso): o diretor vê o campo e pede as indicações na própria app.
const comoChegar = mapa;
const abrirMapa = MOVEL ? '' : ' target="_blank" rel="noopener"';
// Nome do campo a mostrar: o "nome" de data/campos.json quando existe (ex.: abreviado); senão, o da FPF, com a localidade.
const localCompleto = (j) => {
  const nome = estado.campos[j.local]?.nome || j.local;
  return j.localidade && !nome.toLowerCase().includes(j.localidade.toLowerCase()) ? `${nome} · ${j.localidade}` : nome;
};

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
// meio: o que fica entre os clubes (nos cartões, a data e a hora); o " x " continua lá para leitores de ecrã.
function equipasHtml(j, meio = '') {
  const nome = (n) => `<span class="clube">${emblema(n)}${/Anadia/i.test(n) ? `<b>${esc(n)}</b>` : esc(n)}</span>`;
  const x = '<span class="sr-only"> x </span>';
  return `${nome(j.casa)}${meio ? `<span class="cartao-meio">${x}${meio}</span>` : x}${nome(j.fora)}`;
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
      <div>
        <div class="cartao-jogo">${equipasHtml(j, `<span class="cartao-dia">${DIAS[d.getDay()]}, ${dataCurta(j.data)}</span>${j.hora ? `<span class="cartao-hora">${esc(j.hora)}</span>` : '<span class="cartao-hora-pc">Hora a definir</span>'}`)}</div>
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

// O dia comum quando há vários jogos e são todos na mesma data; senão, null.
const diaUnico = (jogos) => (jogos.length > 1 && jogos.every((j) => j.data === jogos[0].data) ? jogos[0].data : null);

function tituloSemana(segunda, jogos) {
  const sabado = somarDias(segunda, 5);
  const domingo = somarDias(segunda, 6);
  // Vários jogos todos no mesmo dia (ex.: A e B ao domingo): o título é só esse dia, "Domingo · 25 out".
  const dia = diaUnico(jogos);
  if (dia) {
    return `<strong>${DIAS_LONGOS[paraData(dia).getDay()]}</strong> · ${dataCurta(dia)}`;
  }
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
        ${temChoque ? `<span class="semana-alerta">${chipChoque(dados.jogos, diasChoque.filter((d) => choques.get(d) === 'choque'), diaUnico(lista))}</span>` : ambas ? '<span class="semana-alerta">A e B no mesmo dia</span>' : ''}
      </div>
      <ul class="semana-jogos">${lista.map((j) => linhaJogo(j, dados, hoje, verAmbas ? choques : null)).join('')}</ul>
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
  $('#epoca').textContent = dados.epoca.replace('/', ' / '); // "2026 / 27", ao lado do título
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
  atualizarNav();
}

// ---------- Barra de navegação (telemóvel) ----------
// Próximos e Calendário descem até à secção (e repõem a lista nos jogos por realizar);
// Resultados muda a lista para os resultados e desce até ela.
function irPara(alvo) {
  const vista = alvo === 'resultados' ? 'resultados' : 'proximos';
  if (estado.dados && estado.vista !== vista) {
    estado.vista = vista;
    guardar();
    render();
  }
  const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  // O item tocado fica ativo logo, e não muda a meio do scroll.
  navFixo = alvo;
  clearTimeout(tempoNav);
  tempoNav = setTimeout(() => { navFixo = null; atualizarNav(); }, 1000);
  atualizarNav();
  if (alvo === 'proximos') scrollTo({ top: 0, behavior }); // topo da página, com o cabeçalho
  else $('#sec-calendario').scrollIntoView({ behavior, block: 'start' });
}
let navFixo = null;
let tempoNav;
// Item ativo: o da secção que está no ecrã; no calendário, Resultados quando a lista mostra resultados.
function atualizarNav() {
  // No fim da página também conta como calendário (com poucos resultados, a lista não chega ao topo do ecrã).
  const noFim = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
  const noCalendario = noFim || $('#sec-calendario').getBoundingClientRect().top <= innerHeight * 0.4;
  const ativo = navFixo || (noCalendario ? (estado.vista === 'resultados' ? 'resultados' : 'calendario') : 'proximos');
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === ativo) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
  // Posição da pílula que desliza por baixo do item ativo (0, 1 ou 2).
  $('.navbar').dataset.ativo = ['proximos', 'calendario', 'resultados'].indexOf(ativo);
}
let navPendente = false;
addEventListener('scroll', () => {
  if (navPendente) return;
  navPendente = true;
  requestAnimationFrame(() => { navPendente = false; atualizarNav(); });
}, { passive: true });

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

// ---------- Painel de ligações úteis (grelha do topo) ----------
function painelLinks(abrir) {
  const btn = $('#topo-grelha');
  const painel = $('#painel-links');
  painel.hidden = !abrir;
  btn.setAttribute('aria-expanded', String(abrir));
  if (abrir) painel.querySelector('a').focus();
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#painel-links').hidden) {
    painelLinks(false);
    $('#topo-grelha').focus();
  }
});

document.addEventListener('click', (e) => {
  // Grelha abre/fecha o painel; tocar fora dele ou num link fecha-o.
  if (e.target.closest('#topo-grelha')) {
    painelLinks($('#painel-links').hidden);
    return;
  }
  if (!$('#painel-links').hidden && (!e.target.closest('#painel-links') || e.target.closest('a'))) painelLinks(false);
  const nav = e.target.closest('[data-nav]');
  if (nav) {
    e.preventDefault(); // sem mudar o endereço: o # do endereço guarda a equipa escolhida
    irPara(nav.dataset.nav);
    return;
  }
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
