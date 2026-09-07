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
