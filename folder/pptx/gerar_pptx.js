// Folder Prof. Corujão — versão editável (.pptx)
//
// Trifold A4 paisagem (297 x 210 mm), 3 colunas de 99 mm cada, dois slides
// (parte externa e parte interna). Cada texto, forma e imagem entra como
// objeto separado, para abrir editável no Canva (Importar arquivo) ou direto
// no PowerPoint / Google Slides / LibreOffice Impress.
//
// Uso: node gerar_pptx.js
// Saída: folder-prof-corujao-editavel.pptx (nesta mesma pasta)

const pptxgen = require("pptxgenjs");
const path = require("path");

const A = (p) => path.join(__dirname, "assets", p);

// ── Paleta da marca ─────────────────────────────────────────────────
const VIOLET = "503BF6";
const INDIGO = "4659FF";
const NAVY = "180E4E";
const YELLOW = "F5C842";
const GREEN = "10B981";
const GREEN_INK = "063A28";
const LILAC = "EEF0FF";
const PAPER = "F8F9FE";
const MUTED = "5B6070";
const WHITE = "FFFFFF";

// ── Geometria: A4 paisagem, 3 colunas de 99 mm ───────────────────────
const MM = 1 / 25.4;
const PAGE_W = 297 * MM;
const PAGE_H = 210 * MM;
const COL_W = 99 * MM;
const COL_X = [0, COL_W, COL_W * 2];
const PAD = 0.28; // respiro interno de cada coluna, em polegadas

const FONT_HEAD = "Cambria";
const FONT_BODY = "Calibri";

const pres = new pptxgen();
pres.defineLayout({ name: "FOLDER_A4", width: PAGE_W, height: PAGE_H });
pres.layout = "FOLDER_A4";

// ── Helpers ───────────────────────────────────────────────────────────

function shadowDura(cor = "000000", opacidade = 0.45) {
  // sombra "dura", deslocada, sem blur — a mesma linguagem do site.
  return { type: "outer", color: cor, opacity: opacidade, blur: 0, offset: 5, angle: 45 };
}

function sticker(slide, texto, x, y, w, h, opts = {}) {
  const {
    fontSize = 18,
    tilt = -3,
    bg = YELLOW,
    fg = NAVY,
    borderColor = NAVY,
    shadowColor = NAVY,
  } = opts;
  slide.addText(texto, {
    x, y, w, h,
    shape: pres.ShapeType.roundRect,
    rectRadius: 0.08,
    fill: { color: bg },
    line: { color: borderColor, width: 2.5 },
    shadow: shadowDura(shadowColor, 0.85),
    rotate: tilt,
    align: "center",
    valign: "middle",
    fontFace: FONT_HEAD,
    fontSize,
    bold: true,
    color: fg,
    margin: 0.04,
  });
}

function selo(slide, texto, x, y, w, h) {
  slide.addText(texto.toUpperCase(), {
    x, y, w, h,
    shape: pres.ShapeType.roundRect,
    rectRadius: 0.4,
    fill: { color: GREEN },
    line: { color: GREEN_INK, width: 2 },
    shadow: shadowDura(GREEN_INK, 0.9),
    rotate: -2,
    align: "center",
    valign: "middle",
    fontFace: FONT_BODY,
    fontSize: 9.5,
    bold: true,
    color: GREEN_INK,
    charSpacing: 1,
    margin: 0.03,
  });
}

function eyebrow(slide, texto, x, y, w, claro = false) {
  slide.addText(texto.toUpperCase(), {
    x, y, w, h: 0.22,
    fontFace: FONT_BODY,
    fontSize: 9,
    bold: true,
    color: claro ? "D9DCFF" : INDIGO,
    charSpacing: 1.5,
    margin: 0,
  });
}

function titulo(slide, runs, x, y, w, h, opts = {}) {
  // runs: array de {text, hl:true} onde hl vira o pedaço em destaque (cor).
  const { fontSize = 20, corBase = NAVY, corClaro = false } = opts;
  slide.addText(
    runs.map((r) => ({
      text: r.text,
      options: {
        bold: true,
        color: r.hl ? YELLOW : corBase,
        breakLine: !!r.br,
      },
    })),
    {
      x, y, w, h,
      fontFace: FONT_HEAD,
      fontSize,
      color: corBase,
      lineSpacing: fontSize * 1.08,
      margin: 0,
    }
  );
}

function paragrafo(slide, texto, x, y, w, h, opts = {}) {
  const { fontSize = 10.5, cor = MUTED, bold = false } = opts;
  slide.addText(texto, {
    x, y, w, h,
    fontFace: FONT_BODY,
    fontSize,
    color: cor,
    bold,
    lineSpacing: fontSize * 1.35,
    margin: 0,
    valign: "top",
  });
}

function card(slide, x, y, w, h, { tag, titulo: tit, corpo }) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.06,
    fill: { color: WHITE },
    line: { color: "E2E5F5", width: 1 },
  });
  let cy = y + 0.09;
  slide.addText(tag.toUpperCase(), {
    x: x + 0.14, y: cy, w: w - 0.28, h: 0.18,
    fontFace: FONT_BODY, fontSize: 7.5, bold: true, color: INDIGO, charSpacing: 1, margin: 0,
  });
  cy += 0.2;
  slide.addText(tit, {
    x: x + 0.14, y: cy, w: w - 0.28, h: 0.26,
    fontFace: FONT_HEAD, fontSize: 12.5, bold: true, color: NAVY, margin: 0,
  });
  cy += 0.27;
  slide.addText(corpo, {
    x: x + 0.14, y: cy, w: w - 0.28, h: h - (cy - y) - 0.08,
    fontFace: FONT_BODY, fontSize: 9, color: MUTED, lineSpacing: 12, margin: 0, valign: "top",
  });
}

function fita(slide, texto, x, y, w, h) {
  slide.addText(texto, {
    x, y, w, h,
    shape: pres.ShapeType.roundRect,
    rectRadius: 0.05,
    fill: { color: YELLOW },
    line: { color: NAVY, width: 2.5 },
    shadow: shadowDura(NAVY, 0.25),
    rotate: -1.2,
    align: "center",
    valign: "middle",
    fontFace: FONT_BODY,
    fontSize: 10.5,
    bold: true,
    color: NAVY,
    margin: 0.03,
  });
}

function pills(slide, itens, x, y, w, opts = {}) {
  const { fontSize = 8, lineH = 0.24, claro = false } = opts;
  let cx = x, cy = y;
  const approxCharW = fontSize * 0.0072;
  itens.forEach((texto) => {
    const pw = texto.length * approxCharW + 0.22;
    if (cx + pw > x + w) { cx = x; cy += lineH; }
    slide.addText(texto, {
      x: cx, y: cy, w: pw, h: lineH - 0.04,
      shape: pres.ShapeType.roundRect,
      rectRadius: 0.5,
      fill: { color: claro ? "FFFFFF22" : WHITE },
      line: { color: claro ? "FFFFFF55" : "DCDFF2", width: 1 },
      align: "center", valign: "middle",
      fontFace: FONT_BODY, fontSize, bold: true,
      color: claro ? WHITE : NAVY,
      margin: 0.02,
    });
    cx += pw + 0.06;
  });
  return cy + lineH;
}

function statBox(slide, x, y, w, h, numero, legenda) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.05,
    fill: { color: WHITE }, line: { color: "E2E5F5", width: 1 },
  });
  slide.addText(numero, {
    x, y: y + 0.05, w, h: h * 0.55,
    align: "center", fontFace: FONT_HEAD, fontSize: 17, bold: true, color: INDIGO, margin: 0,
  });
  slide.addText(legenda, {
    x: x + 0.04, y: y + h * 0.58, w: w - 0.08, h: h * 0.4,
    align: "center", fontFace: FONT_BODY, fontSize: 7, bold: true, color: MUTED,
    lineSpacing: 9, margin: 0,
  });
}

function qrCard(slide, x, y, w, h, imgFile, titulo, legenda, url) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: WHITE }, line: { color: NAVY, width: 2 },
    shadow: shadowDura("000000", 0.35),
  });
  const qs = h - 0.16;
  slide.addImage({ path: A(imgFile), x: x + 0.08, y: y + (h - qs) / 2, w: qs, h: qs });
  const tx = x + qs + 0.18;
  const tw = w - qs - 0.28;
  slide.addText(titulo, { x: tx, y: y + 0.06, w: tw, h: 0.34, fontFace: FONT_HEAD, fontSize: 10, bold: true, color: NAVY, lineSpacing: 11, margin: 0, valign: "top" });
  slide.addText(legenda, { x: tx, y: y + 0.42, w: tw, h: 0.17, fontFace: FONT_BODY, fontSize: 7, color: MUTED, lineSpacing: 8, margin: 0, valign: "top" });
  slide.addText(url, { x: tx, y: y + h - 0.18, w: tw, h: 0.16, fontFace: FONT_BODY, fontSize: 8, bold: true, color: INDIGO, margin: 0, valign: "top" });
}

function planoBox(slide, x, y, w, h, opts) {
  const { pro = false, nome, preco, sub } = opts;
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: pro ? { color: WHITE } : { color: WHITE, transparency: 88 },
    line: { color: pro ? NAVY : WHITE, width: pro ? 2.5 : 1.5, transparency: pro ? 0 : 55 },
    shadow: pro ? shadowDura("000000", 0.35) : undefined,
  });
  slide.addText(nome.toUpperCase(), {
    x: x + 0.12, y: y + 0.07, w: w - 0.24, h: 0.18,
    fontFace: FONT_BODY, fontSize: 7.5, bold: true, charSpacing: 1,
    color: pro ? INDIGO : "D9DCFF", margin: 0,
  });
  slide.addText(preco, {
    x: x + 0.12, y: y + 0.24, w: w - 0.24, h: 0.32,
    fontFace: FONT_HEAD, fontSize: 18, bold: true,
    color: pro ? INDIGO : YELLOW, margin: 0,
  });
  slide.addText(sub, {
    x: x + 0.12, y: y + 0.56, w: w - 0.24, h: h - 0.62,
    fontFace: FONT_BODY, fontSize: 7.8,
    color: pro ? MUTED : "E3E5FF", lineSpacing: 10, margin: 0, valign: "top",
  });
}

function jogoCard(slide, x, y, w, imgFile, titulo, corpo) {
  const imgH = 1.05;
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h: imgH + 0.62, rectRadius: 0.05,
    fill: { color: WHITE }, line: { color: NAVY, width: 2 },
    shadow: shadowDura(NAVY, 0.25),
  });
  slide.addImage({ path: A(imgFile), x, y, w, h: imgH, sizing: { type: "cover", w, h: imgH } });
  slide.addText(titulo, { x: x + 0.1, y: y + imgH + 0.05, w: w - 0.2, h: 0.2, fontFace: FONT_HEAD, fontSize: 10.5, bold: true, color: NAVY, margin: 0 });
  slide.addText(corpo, { x: x + 0.1, y: y + imgH + 0.24, w: w - 0.2, h: 0.34, fontFace: FONT_BODY, fontSize: 7.5, color: MUTED, lineSpacing: 9, margin: 0, valign: "top" });
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 1 — PARTE EXTERNA: Interna | Contra Capa | Capa
// ═══════════════════════════════════════════════════════════════════
const s1 = pres.addSlide();
s1.background = { color: PAPER };

// ── Coluna 1: Interna (a dor + a virada) ──────────────────────────
{
  const cx = COL_X[0] + PAD, cw = COL_W - PAD * 2;
  let y = 0.32;

  eyebrow(s1, "A realidade da sala", cx, y, cw); y += 0.28;
  titulo(s1, [{ text: "Isso soa" }], cx, y, cw, 0.3, { fontSize: 19 });
  y += 0.34;
  sticker(s1, "familiar?", cx, y, 1.7, 0.4, { fontSize: 15, tilt: -3 });
  y += 0.5;

  paragrafo(s1, "•  Janta pensando na aula de amanhã e deita planejando a próxima semana.\n•  Seis turmas, seis planejamentos. Inspiração não aparece por decreto às 22h.\n•  Notas, chamada, provas, relatórios. Some um domingo e a pilha continua ali.",
    cx, y, cw, 1.0, { fontSize: 10, cor: NAVY, bold: false });
  y += 1.05;

  fita(s1, "O corpo sai da sala. A cabeça não.", cx - 0.05, y, cw + 0.1, 0.34);
  y += 0.52;

  eyebrow(s1, "A virada", cx, y, cw); y += 0.26;
  titulo(s1, [{ text: "Você escreve o tema." }], cx, y, cw, 0.28, { fontSize: 16 });
  y += 0.3;
  titulo(s1, [{ text: "Ele monta" }], cx, y, cw, 0.28, { fontSize: 16 });
  y += 0.32;
  sticker(s1, "o resto.", cx, y, 1.4, 0.36, { fontSize: 13, tilt: 3 });
  y += 0.48;

  const chatH = 1.55;
  s1.addShape(pres.ShapeType.roundRect, { x: cx, y, w: cw, h: chatH, rectRadius: 0.06, fill: { color: NAVY } });
  s1.addText("PROFESSOR", { x: cx + 0.13, y: y + 0.1, w: cw - 0.26, h: 0.16, fontFace: FONT_BODY, fontSize: 6.5, bold: true, color: "8A8FC4", charSpacing: 1, margin: 0 });
  s1.addText("Fotossíntese, 8º ano. Algo que engaje a turma.", {
    x: cx + 0.13, y: y + 0.27, w: cw - 0.26, h: 0.28,
    shape: pres.ShapeType.roundRect, rectRadius: 0.08, fill: { color: INDIGO },
    fontFace: FONT_BODY, fontSize: 8.5, bold: true, color: WHITE, valign: "middle", margin: 0.06,
  });
  s1.addText("CORUJÃO, EM CERCA DE 4 SEGUNDOS", { x: cx + 0.13, y: y + 0.6, w: cw - 0.26, h: 0.16, fontFace: FONT_BODY, fontSize: 6.5, bold: true, color: "8A8FC4", charSpacing: 1, margin: 0 });
  s1.addText(
    "✓ Plano completo, com as habilidades da BNCC conferidas uma a uma\n✓ Prova com gabarito e atividade pronta para imprimir\n✓ Slides com imagens, exportáveis em PowerPoint\n✓ Um jogo do conteúdo, para fechar a semana",
    { x: cx + 0.13, y: y + 0.78, w: cw - 0.26, h: chatH - 0.85, fontFace: FONT_BODY, fontSize: 8.3, color: WHITE, lineSpacing: 12.5, margin: 0, valign: "top" }
  );
  y += chatH + 0.14;

  const sw = (cw - 0.16) / 3;
  statBox(s1, cx, y, sw, 0.62, "1.580", "habilidades\nda BNCC");
  statBox(s1, cx + sw + 0.08, y, sw, 0.62, "9", "jogos\ncom IA");
  statBox(s1, cx + (sw + 0.08) * 2, y, sw, 0.62, "~4s", "por\nmaterial");
}

// ── Coluna 2: Contra Capa (oferta) ────────────────────────────────
{
  const cx0 = COL_X[1], cx = cx0 + PAD, cw = COL_W - PAD * 2;
  s1.addShape(pres.ShapeType.rect, { x: cx0, y: 0, w: COL_W, h: PAGE_H, fill: { color: VIOLET } });
  let y = 0.3;

  s1.addImage({ path: A("logo.png"), x: cx, y, w: 0.32, h: 0.32 });
  s1.addText("Prof. Corujão", { x: cx + 0.42, y: y + 0.02, w: cw - 0.42, h: 0.3, fontFace: FONT_HEAD, fontSize: 13, bold: true, color: WHITE, margin: 0, valign: "middle" });
  y += 0.5;

  eyebrow(s1, "Como começar", cx, y, cw, true); y += 0.26;
  titulo(s1, [{ text: "Teste sete dias. Depois você " }, { text: "decide.", hl: true }], cx, y, cw, 0.55, { fontSize: 15, corBase: WHITE });
  y += 0.62;

  paragrafo(s1, "Criação ilimitada por sete dias, sem cartão. Passado o prazo, o material que você já criou continua seu.", cx, y, cw, 0.55, { fontSize: 9, cor: "E3E5FF" });
  y += 0.58;

  planoBox(s1, cx, y, cw, 0.62, { nome: "Acesso gratuito", preco: "7 dias", sub: "Tudo liberado, sem cartão e sem compromisso." });
  y += 0.7;
  planoBox(s1, cx, y, cw, 0.72, { pro: true, nome: "★ Apoiador Pro", preco: "R$ 59,90 /mês", sub: "Sem prazo e sem fidelidade. Menos de R$ 2 por dia, o preço de um café." });
  y += 0.82;

  qrCard(s1, cx, y, cw, 0.78, "qr-app.png", "Aponte a câmera e teste grátis", "Celular, tablet ou computador.", "app.profcorujao.com.br");
  y += 0.86;
  qrCard(s1, cx, y, cw, 0.78, "qr-whats.png", "Ficou com dúvida? Fale comigo", "WhatsApp direto com quem desenvolveu.", "(98) 98179-6309");
  y += 0.92;

  selo(s1, "7 dias grátis · sem cartão", cx, y, 2.0, 0.24); y += 0.32;
  paragrafo(s1, "Não é uma empresa. É um TCC. Construí o Prof. Corujão sozinho, para os professores que eu vi trabalhando até tarde com o que tinham.\nLyelson Martins", cx, y, cw, 0.5, { fontSize: 7.8, cor: "D9DCFF" });
  y += 0.56;
  paragrafo(s1, "© 2026 Prof. Corujão · @prof.corujão", cx, y, cw, 0.18, { fontSize: 7, cor: "9AA0D8" });
}

// ── Coluna 3: Capa ─────────────────────────────────────────────────
{
  const cx0 = COL_X[2], cx = cx0 + PAD, cw = COL_W - PAD * 2;
  s1.addShape(pres.ShapeType.rect, { x: cx0, y: 0, w: COL_W, h: PAGE_H, fill: { color: NAVY } });
  let y = 0.3;

  s1.addImage({ path: A("logo.png"), x: cx, y, w: 0.32, h: 0.32 });
  s1.addText("Prof. Corujão", { x: cx + 0.42, y: y + 0.02, w: cw - 0.7, h: 0.3, fontFace: FONT_HEAD, fontSize: 13, bold: true, color: WHITE, margin: 0, valign: "middle" });
  s1.addText("@PROF.CORUJÃO", { x: cx, y: y + 0.36, w: cw, h: 0.18, fontFace: FONT_BODY, fontSize: 7, bold: true, color: "9AA0D8", charSpacing: 1, margin: 0 });
  y += 0.68;

  sticker(s1, "EI", cx, y, 1.05, 0.42, { fontSize: 20, tilt: -3 });
  y += 0.5;
  sticker(s1, "PROFESSOR(A)", cx, y, cw, 0.46, { fontSize: 17, tilt: 2.4 });
  y += 0.62;

  titulo(s1, [{ text: "Cansado de fazer tudo sozinho e sem tempo de sobra?" }], cx, y, cw, 0.75, { fontSize: 14, corBase: WHITE });
  y += 0.8;
  paragrafo(s1, "Pouco tempo, muita cobrança, sobrecarga que ninguém vê de fora.", cx, y, cw, 0.4, { fontSize: 9, cor: "D9DCFF" });

  s1.addImage({ path: A("illu-01.png"), x: cx0 + COL_W * 0.06, y: PAGE_H - 3.55, w: COL_W * 0.88, h: 3.15, sizing: { type: "contain", w: COL_W * 0.88, h: 3.15 } });

  y = PAGE_H - 0.9;
  selo(s1, "7 dias grátis · sem cartão", cx, y, 2.0, 0.24); y += 0.3;
  paragrafo(s1, "O assistente de IA feito por professor, para professor.", cx, y, cw, 0.3, { fontSize: 8, cor: "D9DCFF" });
  y += 0.3;
  s1.addText("app.profcorujao.com.br", { x: cx, y, w: cw, h: 0.2, fontFace: FONT_BODY, fontSize: 9, bold: true, color: YELLOW, margin: 0 });
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 2 — PARTE INTERNA (miolo aberto): o que faz, BNCC, jogos
// ═══════════════════════════════════════════════════════════════════
const s2 = pres.addSlide();
s2.background = { color: PAPER };

// ── Coluna 1: o que vem junto ──────────────────────────────────────
{
  const cx = COL_X[0] + PAD, cw = COL_W - PAD * 2;
  let y = 0.32;

  eyebrow(s2, "O que vem junto", cx, y, cw); y += 0.26;
  titulo(s2, [{ text: "Meia dúzia de apps num" }], cx, y, cw, 0.28, { fontSize: 15.5 });
  y += 0.32;
  sticker(s2, "só lugar.", cx, y, 1.5, 0.36, { fontSize: 13, tilt: -3 });
  y += 0.5;

  paragrafo(s2, "Cada ferramenta resolve uma dor que você tem hoje. Juntas, devolvem as horas que o planejamento come da sua semana.", cx, y, cw, 0.5, { fontSize: 9 });
  y += 0.55;

  card(s2, cx, y, cw, 0.92, { tag: "★ Carro-chefe", titulo: "Planejador", corpo: "Digite o tema e a turma. Volta o plano inteiro, com os tempos ajustados à duração real da sua aula, mais prova, slides e sequência didática." });
  y += 1.0;
  card(s2, cx, y, cw, 0.92, { tag: "Turma gamificada", titulo: "O comportamento vira ponto", corpo: "XP, moedas, níveis, equipes e missões da semana. A loja não dá prêmio material: dá ser ajudante do dia ou escolher a música da aula." });
  y += 1.0;
  card(s2, cx, y, cw, 0.92, { tag: "Chat pedagógico", titulo: "Um colega, não um robô", corpo: "Assistente especializado em educação: tira dúvida, sugere abordagem e dá feedback sobre a sua prova. Histórico sincronizado entre dispositivos." });
  y += 1.02;

  const bnccH = PAGE_H - y - 0.28;
  s2.addShape(pres.ShapeType.roundRect, { x: cx, y, w: cw, h: bnccH, rectRadius: 0.06, fill: { color: NAVY } });
  s2.addText("1.580", { x: cx + 0.14, y: y + 0.1, w: 1.0, h: bnccH - 0.2, fontFace: FONT_HEAD, fontSize: 24, bold: true, color: YELLOW, valign: "middle", margin: 0 });
  s2.addText(
    [
      { text: "habilidades da BNCC conferidas contra o documento oficial do MEC.\n", options: { bold: true, color: WHITE } },
      { text: "Toda IA diz que é “alinhada à BNCC”. Aqui o código é comparado antes de chegar em você, e o que não bate é reescrito.", options: { color: "C7CBEE" } },
    ],
    { x: cx + 1.05, y: y + 0.1, w: cw - 1.15, h: bnccH - 0.2, fontFace: FONT_BODY, fontSize: 8, lineSpacing: 10.5, valign: "middle", margin: 0 }
  );
}

// ── Coluna 2: agenda, kit do professor, escape room, acervo ────────
{
  const cx = COL_X[1] + PAD, cw = COL_W - PAD * 2;
  let y = 0.32;

  card(s2, cx, y, cw, 0.88, { tag: "Agenda & diário de bordo", titulo: "O ano letivo a partir de um PDF", corpo: "Manda o calendário da escola em PDF e a IA preenche feriados, recessos e eventos. A ementa vira aulas distribuídas no ano." });
  y += 0.96;
  card(s2, cx, y, cw, 0.88, { tag: "Kit do Professor", titulo: "A burocracia do domingo", corpo: "Lista de chamada, adaptação inclusiva para TDAH, TEA e dislexia, rubrica de avaliação, bilhete para a família e aula a partir de um vídeo." });
  y += 0.98;

  const fotoH = 1.35;
  s2.addShape(pres.ShapeType.roundRect, { x: cx, y, w: cw, h: fotoH + 0.5, rectRadius: 0.06, fill: { color: WHITE }, line: { color: NAVY, width: 2 }, shadow: shadowDura(NAVY, 0.2) });
  s2.addImage({ path: A("illu-06a.jpg"), x: cx, y, w: cw, h: fotoH, sizing: { type: "cover", w: cw, h: fotoH } });
  s2.addText("O caderno da sala de escape sai pronto para imprimir, com pistas, gabarito e cartelas.", { x: cx + 0.1, y: y + fotoH + 0.06, w: cw - 0.2, h: 0.42, fontFace: FONT_BODY, fontSize: 8, color: MUTED, lineSpacing: 10, margin: 0 });
  y += fotoH + 0.62;

  card(s2, cx, y, cw, 0.6, { tag: "Acervo", titulo: "Nada se perde entre bimestres", corpo: "Biblioteca pessoal com busca e filtro, mais um acervo compartilhado com materiais curados." });
  y += 0.7;

  eyebrow(s2, "Na hora da aula, no projetor", cx, y, cw); y += 0.24;
  const yEnd = pills(s2, ["Sorteador", "Cronômetro", "Grupos", "Medidor de ruído", "Semáforo", "Dado", "Placar de equipes"], cx, y, cw);
  y = yEnd + 0.1;

  fita(s2, "Exporta em Word e PowerPoint. O material é seu.", cx - 0.03, y, cw + 0.06, 0.4);
}

// ── Coluna 3: jogos ─────────────────────────────────────────────────
{
  const cx = COL_X[2] + PAD, cw = COL_W - PAD * 2;
  let y = 0.32;

  eyebrow(s2, "A parte que a turma pede de novo", cx, y, cw); y += 0.26;
  titulo(s2, [{ text: "Qualquer conteúdo " }], cx, y, cw, 0.28, { fontSize: 15 });
  y += 0.3;
  sticker(s2, "vira jogo.", cx, y, 1.55, 0.38, { fontSize: 14, tilt: -3 });
  y += 0.5;

  paragrafo(s2, "A IA escreve as perguntas pela disciplina e pelo nível da turma. Quem monta a grade é o app: o jogo sempre sai jogável.", cx, y, cw, 0.5, { fontSize: 9 });
  y += 0.56;

  jogoCard(s2, cx, y, cw, "illu-mundo-perdido.jpg", "Mundo Perdido", "Aventura narrativa em tela cheia. O aluno joga sozinho, no próprio ritmo.");
  y += 1.75;
  jogoCard(s2, cx, y, cw, "illu-quiz-relampago.jpg", "Quiz Relâmpago", "Dez rodadas no projetor. Fecha a aula em cinco minutos.");
  y += 1.75;
  jogoCard(s2, cx, y, cw, "illu-batalha.jpg", "QuaqueMagia", "Combate por acertos entre as equipes da turma.");
  y += 1.8;

  pills(s2, ["Escape Room · 4 ambientações", "Caça-palavras", "Cruzadas", "Bingo", "Memória", "Flashcards"], cx, y, cw);

  sticker(s2, "app.profcorujao.com.br", cx + (cw - 2.6) / 2, PAGE_H - 0.5, 2.6, 0.3, { fontSize: 9.5, tilt: -1 });
}

const SAIDA = path.join(__dirname, "..", "folder-prof-corujao-editavel.pptx");
pres.writeFile({ fileName: SAIDA }).then((fileName) => {
  console.log("Gerado:", fileName);
});
