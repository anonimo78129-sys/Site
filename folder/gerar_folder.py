#!/usr/bin/env python3
"""Gera o folder de prospeccao do Prof. Corujao em PDF (A4, 6 paginas).

Le folder/folder.html, reduz as imagens do repositorio para uma resolucao
adequada a impressao, monta uma copia temporaria do site e renderiza com o
Chromium headless.

Uso:  python3 folder/gerar_folder.py
Saida: folder/folder-prof-corujao.pdf
"""
import os
import re
import shutil
import subprocess
import sys
import tempfile

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(HERE, 'folder.html')
OUT = os.path.join(HERE, 'folder-prof-corujao.pdf')

# Largura maxima em pixels de cada imagem no PDF. A pagina A4 tem ~1240px de
# largura util a 150dpi, entao 1100px cobre a maior imagem (a coruja da capa)
# com folga e ainda mantem o arquivo leve para envio por WhatsApp.
LARGURA_MAX = 1100

# Imagens que ficam dentro de caixas brancas: a transparencia das bordas some
# no recorte, entao vale achatar sobre branco e salvar como JPEG (arquivo bem
# menor). As demais precisam do canal alfa para flutuar sobre o fundo violeta.
ACHATAR = {'illu-02.png', 'illu-04.png'}

# Larguras especificas, para o que aparece pequeno na pagina.
LARGURAS = {'logo.png': 200}

CHROMES = [
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    '/opt/pw-browsers/chromium/chrome-linux/chrome',
    shutil.which('chromium'),
    shutil.which('chromium-browser'),
    shutil.which('google-chrome'),
]


def achar_chrome():
    for c in CHROMES:
        if c and os.path.exists(c):
            return c
    sys.exit('Chromium nao encontrado. Instale o chromium ou ajuste CHROMES.')


def otimizar(origem, destino, achatar):
    im = Image.open(origem)
    largura = LARGURAS.get(os.path.basename(origem), LARGURA_MAX)
    if im.width > largura:
        altura = round(im.height * largura / im.width)
        im = im.resize((largura, altura), Image.LANCZOS)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        if achatar:
            fundo = Image.new('RGB', im.size, 'white')
            fundo.paste(im, mask=im.getchannel('A'))
            im = fundo
        else:
            im.save(destino, 'PNG', optimize=True)
            return
    im.convert('RGB').save(destino, 'JPEG', quality=86, optimize=True,
                           progressive=True)


def main():
    html = open(SRC, encoding='utf-8').read()
    build = tempfile.mkdtemp(prefix='folder-corujao-')
    imgdir = os.path.join(build, 'img')
    os.makedirs(imgdir)

    for pasta in ('fonts', 'assets'):
        shutil.copytree(os.path.join(HERE, pasta), os.path.join(build, pasta))

    for ref in sorted(set(re.findall(r'src="\.\./([^"]+)"', html))):
        origem = os.path.join(ROOT, ref)
        nome = os.path.basename(ref)
        base, ext = os.path.splitext(nome)
        achatar = nome in ACHATAR
        # So continua PNG o que precisa mesmo de transparencia.
        ext = '.png' if ext.lower() == '.png' and not achatar else '.jpg'
        destino = os.path.join(imgdir, base + ext)
        otimizar(origem, destino, achatar)
        html = html.replace('src="../%s"' % ref, 'src="img/%s"' % (base + ext))
        print('  %-26s -> %6.0f KB' % (ref, os.path.getsize(destino) / 1024))

    pagina = os.path.join(build, 'index.html')
    open(pagina, 'w', encoding='utf-8').write(html)

    subprocess.run([
        achar_chrome(),
        '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
        '--font-render-hinting=none',
        '--run-all-compositor-stages-before-draw',
        '--virtual-time-budget=20000',
        '--no-pdf-header-footer',
        '--print-to-pdf=' + OUT,
        'file://' + pagina,
    ], check=True)

    print('\nPDF gerado: %s (%.0f KB)' % (OUT, os.path.getsize(OUT) / 1024))
    shutil.rmtree(build, ignore_errors=True)


if __name__ == '__main__':
    main()
