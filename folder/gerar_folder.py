#!/usr/bin/env python3
"""Gera o folder de prospeccao do Prof. Corujao em PDF.

Triptico com duas dobras: folha de 303 x 216 mm (A4 deitado com 3 mm de
sangria), dois lados. Le folder/folder.html, reduz as imagens do repositorio
para uma resolucao adequada a impressao, monta uma copia temporaria do site e
renderiza com o Chromium headless.

Uso:
  python3 folder/gerar_folder.py           arte final, sem marcas
  python3 folder/gerar_folder.py --guias   prova com corte, dobra e margem

Saida: folder/folder-prof-corujao.pdf
       folder/folder-prof-corujao-guias.pdf
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
OUT_GUIAS = os.path.join(HERE, 'folder-prof-corujao-guias.pdf')

# Largura maxima em pixels de cada imagem no PDF. A pagina A4 tem ~1240px de
# largura util a 150dpi, entao 1100px cobre a maior imagem (a coruja da capa)
# com folga e ainda mantem o arquivo leve para envio por WhatsApp.
# Folha final, com sangria: A4 deitado (297x210) + 3 mm em volta.
LARGURA_MM, ALTURA_MM = 303.0, 216.0

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


# Injetado na copia de verificacao: mede quanto cada painel passou da area
# util (a margem de seguranca) e imprime a lista. As rotacoes dos adesivos
# entram na area de rolagem sem ocupar espaco de layout, entao sao zeradas
# antes da medicao para nao virarem falso alarme.
CHECAGEM = """
<style id="semGiro">* { transform: none !important; }</style>
<script>
window.addEventListener('load', function () {
  var fora = [];
  document.querySelectorAll('.painel > .conteudo').forEach(function (c, i) {
    var sobra = c.scrollHeight - c.clientHeight;
    if (sobra > 1) fora.push('painel ' + (i + 1) + ': ' + sobra.toFixed(0) + 'px');
  });
  var pre = document.createElement('pre');
  pre.id = 'checagem';
  pre.textContent = fora.length ? fora.join(' | ') : 'ok';
  document.body.appendChild(pre);
});
</script>
"""


def checar_transbordo(chrome, build, html):
    """Avisa se algum painel passou da margem de seguranca."""
    caminho = os.path.join(build, 'checagem.html')
    open(caminho, 'w', encoding='utf-8').write(html.replace('</body>', CHECAGEM + '</body>'))
    saida = subprocess.run([
        chrome, '--headless', '--disable-gpu', '--no-sandbox',
        '--virtual-time-budget=8000', '--dump-dom', 'file://' + caminho,
    ], capture_output=True, text=True).stdout
    achado = re.search(r'<pre id="checagem">(.*?)</pre>', saida, re.S)
    resultado = achado.group(1).strip() if achado else 'nao foi possivel medir'
    if resultado == 'ok':
        print('  margens de seguranca: ok')
    else:
        print('  ATENCAO, conteudo passou da margem -> ' + resultado)


def ajustar_tamanho(caminho):
    """Deixa a pagina exatamente em 303 x 216 mm.

    O Chromium arredonda o tamanho da pagina para pixels inteiros e entrega
    215,9 mm de altura. A diferenca de 0,1 mm nao aparece na impressao, mas a
    grafica confere o tamanho do arquivo, entao vale corrigir. Se o pymupdf nao
    estiver instalado, o PDF sai do jeito que o Chromium gerou.
    """
    try:
        import pymupdf
    except ImportError:
        print('  (pymupdf ausente: pagina fica em ~215,9 mm de altura)')
        return

    larg, alt = LARGURA_MM * 72 / 25.4, ALTURA_MM * 72 / 25.4
    origem = pymupdf.open(caminho)
    if all(abs(p.rect.width - larg) < .01 and abs(p.rect.height - alt) < .01
           for p in origem):
        origem.close()
        return

    destino = pymupdf.open()
    for pagina in origem:
        nova = destino.new_page(width=larg, height=alt)
        nova.show_pdf_page(nova.rect, origem, pagina.number)
    origem.close()
    destino.save(caminho, garbage=4, deflate=True)
    destino.close()


def main():
    guias = '--guias' in sys.argv
    saida = OUT_GUIAS if guias else OUT
    html = open(SRC, encoding='utf-8').read()
    if guias:
        html = html.replace('<body>', '<body class="guias">', 1)
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

    chrome = achar_chrome()
    checar_transbordo(chrome, build, html)

    subprocess.run([
        chrome,
        '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
        '--font-render-hinting=none',
        '--run-all-compositor-stages-before-draw',
        '--virtual-time-budget=20000',
        '--no-pdf-header-footer',
        '--print-to-pdf=' + saida,
        'file://' + pagina,
    ], check=True)

    ajustar_tamanho(saida)
    print('\nPDF gerado: %s (%.0f KB)' % (saida, os.path.getsize(saida) / 1024))
    shutil.rmtree(build, ignore_errors=True)


if __name__ == '__main__':
    main()
