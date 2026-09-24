# Materiais impressos — Prof. Corujão

Esta pasta tem duas peças de prospecção, cada uma com seu próprio dobramento
físico. Este README documenta primeiro o **tríptico** (`folder.html`); o
**cartão de dobra simples** (`folder-conheca.html`) tem sua seção própria no
fim do arquivo.

---

# Peça 1 — Tríptico de prospecção (`folder.html`)

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

## Por que o PDF é todo em cor chapada

O PDF é montado **sem nenhum gradiente, blur ou `filter` CSS**. Isso não é
escolha estética: gradiente vira *shading pattern* dentro do PDF, e o Canva
não sabe separar isso — ele rasteriza a página inteira junto, e o fundo chega
como um bloco só, impossível de editar.

Com cor chapada, o PDF sai com zero shadings e zero patterns; cada retângulo,
adesivo, fita e caixa vira um objeto vetorial próprio (85 no total, entre as
duas páginas) e o texto continua sendo texto de verdade. É o máximo que o
formato PDF permite: **camadas de PDF (OCG) existem, mas o Canva as ignora** —
o que decide se dá para editar é ser vetor separado em vez de imagem achatada.

Para conferir depois de mexer na arte:

```bash
python3 - <<'EOF'
import pymupdf
d = pymupdf.open('folder/folder-prof-corujao.pdf')
for p in d:
    print(p.number+1, 'Shading=', d.xref_get_key(p.xref, "Resources/Shading")[0],
          '| vetores:', len(p.get_drawings()),
          '| imagens:', len(p.get_images()))
EOF
```

`Shading=null` nas duas páginas é o resultado esperado.

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
- **Mesmo texto do PDF.** Os dois arquivos são mantidos em sincronia; ao mudar
  a copy em `folder.html`, mude também em `pptx/gerar_pptx.js`
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

## Para quem a peça foi escrita

Uma professora que **nunca ouviu falar do app e não se considera boa de
tecnologia**. Ela pega o folder na sala dos professores e decide em um minuto
se aquilo serve para ela. Isso comanda as decisões de texto:

- A peça diz **o que a coisa é**, em português de gente, já na capa: "um site
  que monta o plano de aula, a prova e os slides". Nada de "assistente de IA"
  sem explicação
- O medo número um ("eu não sei mexer com isso") é respondido três vezes: no
  selo verde da Interna, no passo 1 do miolo e no primeiro item do FAQ
- Um FAQ de seis perguntas ocupa um painel inteiro, porque objeção não
  respondida no papel vira folder no lixo
- Jargão fora: sem "gamificação" solta, sem "algoritmo", sem "dataset"

## O que está em cada painel

**Capa** — o gancho ("Ei Professor(a)", a pergunta sobre fazer tudo sozinho),
o mascote e, antes do rodapé, a caixa branca que explica o que o app é.

**Interna** (o painel que dobra para dentro, primeiro a aparecer quando o
professor abre) — a dor em três linhas, a fita "O corpo sai da sala. A cabeça
não.", a explicação de que é um site onde se escreve o tema, o exemplo em
formato de conversa e o selo "não precisa saber mexer com tecnologia".

**Contra Capa** (o verso quando está fechado) — a oferta: os dois planos, o QR
code de teste grátis, o QR do WhatsApp e a assinatura do TCC.

**Miolo aberto** (os três painéis internos, lidos como uma página só) — como
funciona em três passos e o que chega pronto, com a faixa das 1.580
habilidades da BNCC; depois o que ele resolve além da aula; e por fim os jogos
e as perguntas que todo professor faz.

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

---

# Peça 2 — "Conheça o Prof. Corujão" (`folder-conheca.html`)

Cartão de **dobra simples** (uma única dobra ao meio, como um cartão de
aniversário), pensado para uma narrativa curta: dor → virada → como funciona
→ oferta. Complementa o tríptico da Peça 1, que é mais denso em conteúdo; este
é o formato pra puxar pelo gancho emocional (o domingo à noite) antes de
mostrar o produto.

## Formato

- **Folha:** 303 × 216 mm — A4 deitado (297 × 210) com 3 mm de sangria em volta,
  a mesma geometria de folha da Peça 1
- **Painéis depois do corte:** dois A5 de **148,5 mm** cada (a folha dividida
  ao meio), diferente do tríptico: aqui não há painel assimétrico, porque a
  dobra é uma só, no centro exato da folha (151,5 mm)
- **Lado externo**, esquerda → direita: Contracapa (148,5) · Capa (148,5). Ao
  dobrar, a Capa fica por cima (o que a pessoa vê primeiro); a Contracapa fica
  nas costas
- **Lado interno**, esquerda → direita: Página 2 (148,5) · Página 3 (148,5).
  Formam um spread só quando o cartão é aberto
- **Margem de segurança:** 6 mm do corte, **9 mm da dobra central** (a dobra
  concentra o desgaste de manuseio, por isso pede mais folga que o corte de
  borda), mais 3 mm de respiro no pé

## Arquivos gerados

| Arquivo | Para que serve |
|---|---|
| `folder-conheca.pdf` | Arte final, com sangria e sem marcas. É este que vai para a gráfica |
| `folder-conheca-guias.pdf` | Prova de conferência: corte, dobra e margem de segurança. Não mandar para impressão |

Mesmo princípio de edição da Peça 1: fundo em cor chapada, sem gradiente nem
`filter`, para o PDF sair com zero *shading*/*pattern* e continuar separável
em objetos caso alguém precise importar no Canva (ver a seção "Por que o PDF é
todo em cor chapada" acima, mesma lógica vale aqui). Não existe versão `.pptx`
desta peça — se precisar de uma editável, adapte o padrão usado em
`pptx/gerar_pptx.js` para a geometria de dobra simples.

## O que está em cada painel

**Capa** — a pergunta de abertura em adesivo amarelo ("Cansado de fazer tudo
sozinho..."), os "itens da carga mental" da semana como tags, o mascote e,
antes da assinatura final, uma frase que resume o app em uma linha.

**Contracapa** (o verso quando fechado) — a oferta: "7 dias grátis", três
garantias de baixo atrito (sem cartão, cancela quando quiser, o material
continua seu), o QR code do site e o QR do WhatsApp para quem quer apoiar o
projeto a crescer.

**Página 2** (a dor, em forma de cena) — o parágrafo do domingo à noite
montando tudo do zero, a ilustração da professora corrigindo provas sozinha, a
pergunta-gancho ("Já pensou ter alguém que faz isso tudo por você?"), uma
caixa com o que esse domingo rouba (sono, fim de semana, tempo com a família)
e a fita "24 horas por dia. Sem reclamar." fechando com o teaser para a
página seguinte.

**Página 3** (a virada) — "Conheça o Prof. Corujão" e os quatro passos de como
funciona, a lista do que mais o app resolve além do plano de aula, e a caixa
final espelhando a dor da Página 2: o que você ganha de volta (descansa, janta
com a família, volta a ter domingo). O espelhamento entre as duas páginas —
o que o domingo rouba vs. o que você recupera — é a espinha dorsal da peça;
ao editar uma lista, ajuste a outra para manter o paralelo.

## Como regerar

```bash
python3 folder/gerar_folder_conheca.py           # arte final
python3 folder/gerar_folder_conheca.py --guias   # prova com as marcas
```

Mesmo script da Peça 1, só que apontando para `folder-conheca.html` — mesma
otimização de imagem, mesma checagem de margem, mesmo ajuste fino de tamanho
de página. Para editar o texto ou o layout, mexa em `folder-conheca.html`
diretamente; a geometria dos painéis está nos `style` de cada `.painel`.

## Arquivos específicos desta peça

- `folder-conheca.html` — a peça inteira, duas folhas de 303 × 216 mm com dois
  painéis A5 cada
- `gerar_folder_conheca.py` — cópia do `gerar_folder.py` apontando para os
  nomes de arquivo desta peça; reutiliza `fonts/` e `assets/` da Peça 1
- `assets/qr-site.svg` — QR de `https://www.profcorujao.com.br/`
- `assets/qr-whats-apoiador.svg` — QR do WhatsApp com a mesma mensagem
  pré-preenchida usada no site (`index.html`): "Quero ser Apoiador do Prof.
  Corujão"

## Na hora de pedir a impressão

Peça **dobra simples ao meio (meio-a-meio, formato cartão)**, couché brilho
150g ou mais. Mande `folder-conheca.pdf` como está. Como a dobra é única e
central, é a peça mais fácil das duas de explicar para a gráfica — não tem
painel assimétrico para confundir.
