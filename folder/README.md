# Folder de prospecção — Prof. Corujão

Peça impressa para prospectar professores presencialmente: visita a escola,
sala dos professores, feira pedagógica, evento de formação.

## Formato

Tríptico com duas dobras (dobra em C), montado sobre o gabarito da gráfica.

- **Folha:** 303 × 216 mm — A4 deitado (297 × 210) com 3 mm de sangria em volta
- **Painéis depois do corte:** 100 + 100 + **97** mm. O de 97 mm é o que dobra
  para dentro, por isso é o mais estreito
- **Parte externa**, da esquerda para a direita: Interna (97) · Contra Capa (100) · Capa (100)
- **Parte interna**, da esquerda para a direita: Verso Capa (100) · Verso Contra Capa (100) · Verso Interna (97)
- **Margem de segurança:** 6 mm do corte e 6 mm de cada vinco, com mais 3 mm de
  respiro no pé. Nenhum texto cruza dobra

## Arquivos gerados

| Arquivo | Para que serve |
|---|---|
| `folder-prof-corujao.pdf` | Arte final, com sangria e sem marcas. É este que vai para a gráfica |
| `folder-prof-corujao-guias.pdf` | Prova de conferência: mostra corte, vincos e margem de segurança. Não mandar para impressão |
| `folder-prof-corujao-editavel.pptx` | Versão editável (PowerPoint), para abrir e customizar no Canva, PowerPoint, Google Slides ou LibreOffice Impress. Não tem sangria nem vinco — é para editar, não para imprimir direto |

## Versão editável (Canva / PowerPoint)

O PDF é uma imagem fixa: ninguém edita texto nele. Para isso existe o
`folder-prof-corujao-editavel.pptx` — mesmo conteúdo e identidade visual, mas
cada texto, forma e imagem é um objeto separado e editável.

**Para abrir no Canva:** entre em canva.com → "Criar um design" → "Importar
arquivo" → selecione o `.pptx`. O Canva traz cada elemento pronto para clicar
e editar, sem passar por nenhum link público — fica direto na sua conta.

Também abre nativo no PowerPoint, no Google Slides e no LibreOffice Impress.

Diferenças de propósito em relação ao PDF:

- **Formato:** A4 paisagem (297 × 210 mm) dividido em 3 colunas iguais de
  99 mm — o "trifold" clássico que o próprio Canva já reconhece, sem a
  assimetria de 97/100/100 mm que só faz sentido para a dobra física do PDF
- **Sem sangria nem marcas de corte** — depois de editar, se for imprimir,
  configure sangria e dobra nas opções de impressão do Canva (ou exporte de
  novo em PDF e use o `gerar_folder.py` como referência de medidas)
- **Fontes:** usa Cambria (títulos) e Calibri (corpo) em vez de Rozha One e
  Instrument Serif, porque essas vêm com qualquer instalação do Office e do
  Canva. Para bater 100% com a marca, troque a fonte no Canva depois de abrir
- Os adesivos amarelos, a fita, os selos verdes e as caixas navy foram
  recriados como formas do PowerPoint (retângulo arredondado + borda + sombra
  deslocada), não como imagem — por isso dá para mudar cor, texto e rotação
  de cada um livremente

### Como regerar

```bash
cd folder/pptx
npm install        # só na primeira vez
node gerar_pptx.js
```

Gera `folder-prof-corujao-editavel.pptx` na pasta `folder/`. Depende de
`pptxgenjs` (Node) — o `package.json` já fixa a versão. As imagens usadas
ficam pré-otimizadas em `folder/pptx/assets/`; para regerá-las a partir dos
arquivos originais do repositório, veja o topo de `gerar_pptx.js`.

Depois de mudar o script, valide antes de considerar pronto:

```bash
python3 <caminho-da-skill-pptx>/scripts/office/validate.py folder-prof-corujao-editavel.pptx
markitdown folder-prof-corujao-editavel.pptx | grep -iE "lorem|todo|\[insert"
```

Não há um jeito confiável de gerar miniaturas/PDF de conferência desta versão
neste ambiente (o LibreOffice aqui trava até em arquivos triviais, um bug do
ambiente, não do arquivo). Em vez de inspeção visual, o script foi conferido
programaticamente: nenhuma forma passa da borda da página e nenhum texto
sobrepõe outro texto de forma relevante (checagem por bounding box, exigida
depois de cada mudança de layout). Ainda assim, abra o `.pptx` de verdade
antes de usar em produção — texto tende a quebrar linha de um jeito que só a
renderização real mostra.

## O que está em cada painel

**Capa** — o gancho: "Ei Professor(a)", a pergunta que abre a conversa, o
mascote e o selo de 7 dias grátis.

**Interna** (o painel que dobra para dentro, primeiro a aparecer quando o
professor abre) — a dor em três linhas, a fita "O corpo sai da sala. A cabeça
não." e o exemplo de um tema virando plano, prova, slides e jogo.

**Contra Capa** (o verso quando está fechado) — a oferta: os dois planos, o QR
code de teste grátis, o QR do WhatsApp e a assinatura do TCC.

**Miolo aberto** (os três painéis internos, lidos como uma página só) — o que
o app faz, a faixa das 1.580 habilidades da BNCC, a foto do escape room
impresso, os instrumentos de aula e os três jogos em destaque.

## Como regerar

```bash
python3 folder/gerar_folder.py           # arte final
python3 folder/gerar_folder.py --guias   # prova com as marcas
```

O script reduz as imagens do repositório para resolução de impressão, monta uma
cópia temporária do site, **avisa se algum painel passou da margem de
segurança** e renderiza com o Chromium headless. No fim ajusta a página para
exatamente 303 × 216 mm, porque o Chromium arredonda a altura para 215,9.

Depende de `pillow` e de um Chromium instalado (o caminho é procurado em
`CHROMES`). O `pymupdf` é opcional: sem ele o PDF sai com 0,1 mm a menos de
altura, o que não muda nada na impressão mas pode ser barrado na conferência
da gráfica.

Para editar, mexa em `folder.html` e rode o script de novo. O arquivo abre
direto no navegador, e a geometria dos painéis está nos `style` de cada
`.painel` (posição e largura em mm dentro da folha de 303).

## Arquivos do projeto

- `folder.html` — a peça inteira, em HTML/CSS: duas folhas de 303 × 216 mm com
  três painéis absolutos cada
- `gerar_folder.py` — otimização de imagens, checagem de margem e renderização
- `fonts/` — Inter, Rozha One e Instrument Serif embutidas, para o PDF não
  depender da internet nem das fontes da máquina
- `assets/qr-app.svg` — QR de `app.profcorujao.com.br`
- `assets/qr-whats.svg` — QR do WhatsApp (98) 98179-6309

Para trocar um QR code:

```bash
python3 -c "import segno; segno.make('SUA-URL', error='h').save('folder/assets/qr-app.svg', scale=10, border=2, dark='#180e4e', light=None)"
```

## Na hora de pedir a impressão

Peça **A4 4×4 com duas dobras (dobra em C)**, papel couché brilho 150g ou mais.
Mande `folder-prof-corujao.pdf` como está: já tem os 3 mm de sangria que o
gabarito pede e não leva marcas de corte. Confira antes no
`folder-prof-corujao-guias.pdf` se algum elemento novo encostou no vinco.
