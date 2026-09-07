# Folder de prospecção — Prof. Corujão

Peça impressa de 6 páginas A4 para prospectar professores presencialmente:
visita a escola, sala dos professores, feira pedagógica, evento de formação.

**PDF pronto:** `folder-prof-corujao.pdf`

## Estrutura das páginas

| Pág. | Papel na conversa |
|---|---|
| 1 | Capa: "Ei Professor(a)" e a pergunta que abre a porta |
| 2 | A dor, nomeada em cinco frases que o professor reconhece |
| 3 | A virada e o mecanismo: a BNCC conferida contra o dataset do MEC |
| 4 | O que vem junto: planejador, gamificação, agenda, chat, acervo |
| 5 | Os jogos e o material impresso, mais o Kit do Professor |
| 6 | Planos, QR code para testar grátis, QR do WhatsApp e a história do criador |

Páginas 1 e 6 têm fundo violeta cheio; as internas são claras, para gastar
menos tinta e ficar legível em impressão simples. O miolo é frente e verso:
imprima em 3 folhas, ou grampeie como caderno A5 se preferir a peça menor.

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

- `folder.html` — a peça inteira, em HTML/CSS, 6 blocos `.page` de 210×297mm
- `gerar_folder.py` — otimização de imagens e renderização em PDF
- `fonts/` — Inter, Rozha One e Instrument Serif embutidas, para o PDF não
  depender da internet nem das fontes da máquina
- `assets/qr-app.svg` — QR de `app.profcorujao.com.br`
- `assets/qr-whats.svg` — QR do WhatsApp (98) 98179-6309

Para trocar um QR code:

```bash
python3 -c "import segno; segno.make('SUA-URL', error='h').save('folder/assets/qr-app.svg', scale=10, border=2, dark='#180e4e', light=None)"
```
