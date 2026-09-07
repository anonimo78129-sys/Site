# Folder de prospecção — Prof. Corujão

Peça impressa para prospectar professores presencialmente: visita a escola,
sala dos professores, feira pedagógica, evento de formação.

**Formato:** uma folha A4, frente e verso. Duas páginas, nada de dobra.
**PDF pronto:** `folder-prof-corujao.pdf`

## O que está em cada lado

**Frente** (violeta cheio, o lado que o professor vê primeiro na mesa):
o gancho "Ei Professor(a)", a pergunta que abre a conversa, três dores da
rotina em uma linha cada, a fita "O corpo sai da sala. A cabeça não.", o
exemplo de um tema virando plano, prova, slides e jogo em cerca de 4 segundos,
e o rodapé com os três números e o selo de 7 dias grátis.

**Verso** (fundo claro, para gastar menos tinta e ler melhor):
as quatro frentes do app em blocos curtos, a faixa das 1.580 habilidades da
BNCC conferidas, os três jogos com imagem, o que sai impresso, e o bloco de
oferta com os dois planos, o QR code de teste grátis e o QR do WhatsApp.

Ficou de fora de propósito o que não cabe em folder e o site já explica bem:
o passo a passo da conferência da BNCC, o Kit do Professor item por item, o
FAQ e a história longa do TCC. Folder abre a conversa; o resto é no app.

## Como regerar

```bash
python3 folder/gerar_folder.py
```

O script reduz as imagens do repositório para resolução de impressão, monta uma
cópia temporária do site e renderiza com o Chromium headless. Depende de
`pillow` e de um Chromium instalado (o caminho é procurado em `CHROMES`).

Para editar o texto ou o layout, mexa em `folder.html` e rode o script de novo.
O arquivo abre direto no navegador para conferir antes de gerar o PDF.

## Arquivos

- `folder.html` — a peça inteira, em HTML/CSS, dois blocos `.page` de 210×297mm
- `gerar_folder.py` — otimização de imagens e renderização em PDF
- `fonts/` — Inter, Rozha One e Instrument Serif embutidas, para o PDF não
  depender da internet nem das fontes da máquina
- `assets/qr-app.svg` — QR de `app.profcorujao.com.br`
- `assets/qr-whats.svg` — QR do WhatsApp (98) 98179-6309

Para trocar um QR code:

```bash
python3 -c "import segno; segno.make('SUA-URL', error='h').save('folder/assets/qr-app.svg', scale=10, border=2, dark='#180e4e', light=None)"
```

## Na hora de imprimir

Peça frente e verso na mesma folha, sem redimensionar (escala 100%, "tamanho
real"), em papel de pelo menos 120g para o violeta não marcar o outro lado.
O fundo colorido vai até a borda, então a gráfica precisa imprimir com sangria
ou aceitar a margem branca fina da impressora comum.
