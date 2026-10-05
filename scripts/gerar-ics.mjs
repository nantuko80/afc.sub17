// Gera os calendários subscrevíveis em calendario/*.ics a partir de data/jogos.json.
// Uso: node scripts/gerar-ics.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CALENDARIOS, gerarIcs } from '../assets/ics.js';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const dados = JSON.parse(readFileSync(join(raiz, 'data/jogos.json'), 'utf8'));

const pasta = join(raiz, 'calendario');
mkdirSync(pasta, { recursive: true });
for (const c of CALENDARIOS) {
  const ics = gerarIcs(dados, { equipas: c.equipas, nome: c.nome });
  writeFileSync(join(pasta, c.ficheiro), ics);
  const n = (ics.match(/BEGIN:VEVENT/g) || []).length;
  console.log(`calendario/${c.ficheiro}: ${n} jogos`);
}
