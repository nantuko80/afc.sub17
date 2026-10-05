#!/usr/bin/env python3
"""
Importa os jogos do Anadia FC dos comunicados oficiais da AF Aveiro (PDF de calendário)
para data/jogos.json.

O PDF é o calendário inicial completo; o site da FPF tem as alterações posteriores
(adiamentos, horas, resultados). Por isso, jogos que já vieram da FPF não são
substituídos: o PDF só acrescenta jornadas em falta e completa a localidade do campo.

Uso:
    pip install pypdf
    python3 tools/importar-pdf.py A "N051_Calendario CD Honra Sub_17.pdf" B "N060_Calendario CD 1_Divisao Sub_17.pdf"
"""
import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader

RAIZ = Path(__file__).resolve().parent.parent
FICHEIRO = RAIZ / 'data' / 'jogos.json'

CODIGO = re.compile(r'^\d{4}\.\d+\.\d{3}\.\d$')
DATA_HORA = re.compile(r'^(\d\d)/(\d\d)/(\d{4}) - (\d\d:\d\d)$')
PEQUENAS = {'da', 'de', 'do', 'das', 'dos', 'e'}
SIGLAS = re.compile(r'^(fc|cd|ad|adc|sc|gd|gdr|ud|aa|rd|cf|sl|ac|ca|ss|ar|ads|acd|grd|cr|ccd)$')


def titulo(s):
    """'CAMPO TREINOS R.D.AGUEDA' -> 'Campo Treinos R.D.Agueda'."""
    palavras = []
    for i, p in enumerate(s.lower().split()):
        if p in PEQUENAS and i:
            palavras.append(p)
        elif SIGLAS.match(p):
            palavras.append(p.upper())
        else:
            palavras.append(re.sub(r'(^|[.\-/(])(\w)', lambda m: m.group(1) + m.group(2).upper(), p))
    return ' '.join(palavras)


def sem_acentos(s):
    import unicodedata
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]', '', s.lower())


def ler_campo(texto):
    """'(3614) CAMPO DR. PEQUITO REBELO(100.0x64.0) - Relvado Sintético - ANADIA'"""
    m = re.match(r'\(\d+\)\s*(.*?)\s*\([\d.x]+\)\s*-\s*(.*?)\s*-\s*(.*)$', texto or '')
    if not m:
        return None, None
    nome, _piso, local = m.groups()
    return titulo(re.sub(r'\s+', ' ', nome)), titulo(local.strip()) or None


def jogos_do_pdf(caminho, letra):
    texto = '\n'.join(p.extract_text() or '' for p in PdfReader(caminho).pages)
    linhas = [l.strip() for l in texto.splitlines()]
    zona, j1, j2, jogos, i = None, None, None, [], 0
    while i < len(linhas):
        l = linhas[i]
        if re.match(r'^(Zona|Série) ', l):
            zona = l
        m = re.match(r'^Jornada:\s*(\d+)\s*-', l)
        if m:
            m2 = re.match(r'^Jornada:\s*(\d+)\s*-', linhas[i + 1])
            j1, j2 = int(m.group(1)), int(m2.group(1)) if m2 else None
            i += 2 if m2 else 1
            continue
        if CODIGO.match(l) and i + 1 < len(linhas) and DATA_HORA.match(linhas[i + 1]):
            d1, k, meio = linhas[i + 1], i + 2, []
            while not DATA_HORA.match(linhas[k]):
                meio.append(linhas[k])
                k += 1
            d2, k = linhas[k], k + 2
            equipas, atual = [], None
            for x in meio:  # "5984 - " / nome (pode ocupar várias linhas)
                if re.match(r'^\d+ -$', x):
                    atual = []
                    equipas.append(atual)
                elif atual is not None:
                    atual.append(x)
            casa, fora = (' '.join(e).replace('- ', '-') for e in equipas[:2])
            campos = []
            while k < len(linhas) and not re.match(CODIGO.pattern + r'|^Jornada:|^Campeonato|^1\.ª Fase|^Zona ', linhas[k]):
                if linhas[k]:
                    campos.append(linhas[k])
                k += 1
            campos = ' '.join(campos)
            campos = re.sub(r'\s*Pag\.:\s*\d+\s*/\s*\d+.*?(?=\s\(\d+\) |$)', '', campos)  # rodapé da página
            campos = re.split(r'\s(?=\(\d+\) )', campos)
            if 'Anadia' in casa + fora:
                for jor, dh, c, f, campo in ((j1, d1, casa, fora, campos[0]), (j2, d2, fora, casa, campos[-1])):
                    if jor is None:
                        continue
                    dd, mm, aaaa, hora = DATA_HORA.match(dh).groups()
                    local, localidade = ler_campo(campo)
                    em_casa = 'Anadia' in c
                    jogos.append({
                        'id': f'{letra}-{jor:02d}', 'equipa': letra, 'jornada': jor,
                        'data': f'{aaaa}-{mm}-{dd}', 'hora': hora,
                        'casa': c, 'fora': f, 'emCasa': em_casa, 'adversario': f if em_casa else c,
                        'resultado': None, 'local': local, 'localidade': localidade, 'origem': 'pdf',
                    })
            i = k
            continue
        i += 1
    return zona, jogos


def main(args):
    if len(args) < 2 or len(args) % 2:
        sys.exit(__doc__)
    dados = json.loads(FICHEIRO.read_text())
    por_id = {j['id']: j for j in dados['jogos']}
    for letra, pdf in zip(args[::2], args[1::2]):
        zona, jogos = jogos_do_pdf(pdf, letra)
        if zona and not dados['equipas'][letra].get('zona'):
            dados['equipas'][letra]['zona'] = zona
        novos = completados = 0
        for j in jogos:
            atual = por_id.get(j['id'])
            if atual is None or atual.get('origem') == 'pdf':
                por_id[j['id']] = j
                novos += atual is None
                continue
            # Jogo já veio da FPF: manter, só completar o que falta.
            atual.setdefault('origem', 'fpf')
            mesmo_campo = sem_acentos(atual.get('local')) == sem_acentos(j['local'])
            if mesmo_campo:
                atual['local'] = j['local']  # grafia uniforme entre fontes
            if mesmo_campo and j['localidade'] and atual.get('localidade') != j['localidade']:
                atual['localidade'] = j['localidade']
                completados += 1
            if not atual.get('hora') and atual['data'] == j['data']:
                atual['hora'] = j['hora']
        print(f'Sub-17 {letra}: {len(jogos)} jogos no PDF, {novos} novos, {completados} completados', file=sys.stderr)
    dados['jogos'] = sorted(por_id.values(), key=lambda j: (j['data'] or '9', j['hora'] or ''))
    FICHEIRO.write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main(sys.argv[1:])
