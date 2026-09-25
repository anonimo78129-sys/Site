#!/usr/bin/env python3
"""Gera o convite de pesquisa do TCC em PDF (A4 retrato, leitura normal).

Ao contrario das duas pecas de folder (que sao impressas com dobra fisica e
por isso pedem sangria e paineis medidos em mm), este documento e para abrir
na tela: A4 retrato comum, margem normal, sem sangria, com hiperlinks de
verdade em vez de QR code. Le folder/pesquisa-tcc.html, reduz as imagens do
repositorio, monta uma copia temporaria e renderiza com o Chromium headless.

Uso:
  python3 folder/gerar_pesquisa_tcc.py

Saida: folder/pesquisa-tcc.pdf
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
SRC = os.path.join(HERE, 'pesquisa-tcc.html')
OUT = os.path.join(HERE, 'pesquisa-tcc.pdf')

LARGURA_MAX = 1000
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


def otimizar(origem, destino):
    im = Image.open(origem)
    largura = LARGURAS.get(os.path.basename(origem), LARGURA_MAX)
    if im.width > largura:
        altura = round(im.height * largura / im.width)
        im = im.resize((largura, altura), Image.LANCZOS)
    if im.mode in ('RGBA', 'LA', 'P'):
        im.convert('RGBA').save(destino, 'PNG', optimize=True)
        return
    im.convert('RGB').save(destino, 'JPEG', quality=86, optimize=True,
                           progressive=True)


# Injetado numa copia de verificacao: mede quanto cada pagina passou da
# altura da folha. As rotacoes dos adesivos entram na area de rolagem sem
# ocupar espaco de layout, entao sao zeradas antes de medir.
CHECAGEM = """
<style>* { transform: none !important; }</style>
<script>
window.addEventListener('load', function () {
  var fora = [];
  document.querySelectorAll('.pagina').forEach(function (c, i) {
    var sobra = c.scrollHeight - c.clientHeight;
    if (sobra > 1) fora.push('pagina ' + (i + 1) + ': ' + sobra.toFixed(0) + 'px');
  });
  var pre = document.createElement('pre');
  pre.id = 'checagem';
  pre.textContent = fora.length ? fora.join(' | ') : 'ok';
  document.body.appendChild(pre);
});
</script>
"""


def checar_altura(chrome, build, html):
    """Avisa se o conteudo de alguma pagina nao coube na folha."""
    caminho = os.path.join(build, 'checagem.html')
    open(caminho, 'w', encoding='utf-8').write(html.replace('</body>', CHECAGEM + '</body>'))
    saida = subprocess.run([
        chrome, '--headless', '--disable-gpu', '--no-sandbox',
        '--virtual-time-budget=8000', '--dump-dom', 'file://' + caminho,
    ], capture_output=True, text=True).stdout
    achado = re.search(r'<pre id="checagem">(.*?)</pre>', saida, re.S)
    resultado = achado.group(1).strip() if achado else 'nao foi possivel medir'
    if resultado == 'ok':
        print('  todas as paginas cabem na folha: ok')
    else:
        print('  ATENCAO, conteudo passou da folha -> ' + resultado)


def checar_links(caminho):
    """Confere que os hiperlinks sobreviveram ao print-to-pdf do Chromium."""
    try:
        import pymupdf
    except ImportError:
        print('  (pymupdf ausente: não foi possível conferir os hiperlinks)')
        return
    d = pymupdf.open(caminho)
    total = sum(len(p.get_links()) for p in d)
    if total == 0:
        print('  ATENCAO: nenhum hiperlink encontrado no PDF gerado')
    else:
        print('  hiperlinks no PDF: %d' % total)
        for p in d:
            for link in p.get_links():
                if link.get('uri'):
                    print('    pág %d -> %s' % (p.number + 1, link['uri']))


def main():
    html = open(SRC, encoding='utf-8').read()
    build = tempfile.mkdtemp(prefix='pesquisa-tcc-')
    imgdir = os.path.join(build, 'img')
    os.makedirs(imgdir)
    shutil.copytree(os.path.join(HERE, 'fonts'), os.path.join(build, 'fonts'))

    for ref in sorted(set(re.findall(r'src="\.\./([^"]+)"', html))):
        origem = os.path.join(ROOT, ref)
        nome = os.path.basename(ref)
        base, ext = os.path.splitext(nome)
        im = Image.open(origem)
        ext = '.png' if im.mode in ('RGBA', 'LA', 'P') else '.jpg'
        destino = os.path.join(imgdir, base + ext)
        otimizar(origem, destino)
        html = html.replace('src="../%s"' % ref, 'src="img/%s"' % (base + ext))
        print('  %-26s -> %6.0f KB' % (ref, os.path.getsize(destino) / 1024))

    pagina = os.path.join(build, 'index.html')
    open(pagina, 'w', encoding='utf-8').write(html)

    chrome = achar_chrome()
    checar_altura(chrome, build, html)

    subprocess.run([
        chrome,
        '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
        '--font-render-hinting=none',
        '--run-all-compositor-stages-before-draw',
        '--virtual-time-budget=20000',
        '--no-pdf-header-footer',
        '--print-to-pdf=' + OUT,
        'file://' + pagina,
    ], check=True)

    checar_links(OUT)
    print('\nPDF gerado: %s (%.0f KB)' % (OUT, os.path.getsize(OUT) / 1024))
    shutil.rmtree(build, ignore_errors=True)


if __name__ == '__main__':
    main()
