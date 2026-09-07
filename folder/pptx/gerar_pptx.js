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

// ── Helpers do miolo revisado ─────────────────────────────────────

function passo(slide, x, y, w, numero, tit, corpo) {
  slide.addShape(pres.ShapeType.ellipse, {
    x, y, w: 0.24, h: 0.24, fill: { color: INDIGO },
  });
  slide.addText(numero, {
    x, y, w: 0.24, h: 0.24, align: "center", valign: "middle",
    fontFace: FONT_BODY, fontSize: 10, bold: true, color: WHITE, margin: 0,
  });
  const tx = x + 0.34, tw = w - 0.34;
  slide.addText(tit, { x: tx, y: y - 0.01, w: tw, h: 0.2, fontFace: FONT_HEAD, fontSize: 11.5, bold: true, color: NAVY, margin: 0 });
  slide.addText(corpo, { x: tx, y: y + 0.2, w: tw, h: 0.46, fontFace: FONT_BODY, fontSize: 9, color: MUTED, lineSpacing: 11, margin: 0, valign: "top" });
}

function caixaCheck(slide, x, y, w, cab, itens) {
  const h = 0.34 + itens.length * 0.24;
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.05,
    fill: { color: WHITE }, line: { color: "E2E5F5", width: 1 },
  });
  slide.addText(cab.toUpperCase(), {
    x: x + 0.13, y: y + 0.08, w: w - 0.26, h: 0.18,
    fontFace: FONT_BODY, fontSize: 8, bold: true, color: INDIGO, charSpacing: 1.2, margin: 0,
  });
  itens.forEach((t, i) => {
    slide.addText(
      [
        { text: "✓  ", options: { color: GREEN, bold: true } },
        { text: t, options: { color: NAVY } },
      ],
      { x: x + 0.13, y: y + 0.3 + i * 0.24, w: w - 0.26, h: 0.24, fontFace: FONT_BODY, fontSize: 8.8, lineSpacing: 10.5, margin: 0, valign: "top" }
    );
  });
  return y + h;
}

function faq(slide, x, y, w, pergunta, resposta, alturaResposta = 0.34) {
  slide.addText(pergunta, { x, y, w, h: 0.18, fontFace: FONT_HEAD, fontSize: 10, bold: true, color: NAVY, margin: 0 });
  slide.addText(resposta, { x, y: y + 0.19, w, h: alturaResposta, fontFace: FONT_BODY, fontSize: 8.5, color: MUTED, lineSpacing: 10.5, margin: 0, valign: "top" });
  return y + 0.19 + alturaResposta + 0.08;
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 1 — PARTE EXTERNA: Interna | Contra Capa | Capa
// ═══════════════════════════════════════════════════════════════════
const s1 = pres.addSlide();
s1.background = { color: PAPER };

// ── Coluna 1: Interna (a dor + o que é o app) ─────────────────────
{
  const cx = COL_X[0] + PAD, cw = COL_W - PAD * 2;
  let y = 0.32;

  eyebrow(s1, "A realidade da sala", cx, y, cw); y += 0.28;
  titulo(s1, [{ text: "Isso soa" }], cx, y, cw, 0.3, { fontSize: 19 });
  y += 0.34;
  sticker(s1, "familiar?", cx, y, 1.7, 0.4, { fontSize: 15, tilt: -3 });
  y += 0.56;

  paragrafo(s1,
    "•  Janta pensando na aula de amanhã e deita planejando a próxima semana.\n" +
    "•  Seis turmas, seis planejamentos. Inspiração não aparece por decreto às 22h.\n" +
    "•  Notas, chamada, provas, relatórios. Some um domingo e a pilha continua ali.",
    cx, y, cw, 1.0, { fontSize: 10, cor: NAVY });
  y += 1.05;

  fita(s1, "O corpo sai da sala. A cabeça não.", cx - 0.05, y, cw + 0.1, 0.34);
  y += 0.55;

  eyebrow(s1, "O que é o Prof. Corujão", cx, y, cw); y += 0.26;
  titulo(s1, [{ text: "Você escreve o tema." }], cx, y, cw, 0.28, { fontSize: 16 });
  y += 0.3;
  titulo(s1, [{ text: "Ele monta" }], cx, y, cw, 0.28, { fontSize: 16 });
  y += 0.32;
  sticker(s1, "o resto.", cx, y, 1.4, 0.36, { fontSize: 13, tilt: 3 });
  y += 0.5;

  paragrafo(s1,
    "É um site. Você abre no celular ou no computador, escreve o tema da aula em uma linha e recebe o material pronto para revisar, imprimir ou projetar.",
    cx, y, cw, 0.6, { fontSize: 9.5 });
  y += 0.62;

  const chatH = 1.5;
  s1.addShape(pres.ShapeType.roundRect, { x: cx, y, w: cw, h: chatH, rectRadius: 0.06, fill: { color: NAVY } });
  s1.addText("PROFESSOR", { x: cx + 0.13, y: y + 0.09, w: cw - 0.26, h: 0.16, fontFace: FONT_BODY, fontSize: 6.5, bold: true, color: "8A8FC4", charSpacing: 1, margin: 0 });
  s1.addText("Fotossíntese, 8º ano. Algo que engaje a turma.", {
    x: cx + 0.13, y: y + 0.26, w: cw - 0.26, h: 0.26,
    shape: pres.ShapeType.roundRect, rectRadius: 0.08, fill: { color: INDIGO },
    fontFace: FONT_BODY, fontSize: 8.5, bold: true, color: WHITE, valign: "middle", margin: 0.06,
  });
  s1.addText("CORUJÃO, EM CERCA DE 4 SEGUNDOS", { x: cx + 0.13, y: y + 0.57, w: cw - 0.26, h: 0.16, fontFace: FONT_BODY, fontSize: 6.5, bold: true, color: "8A8FC4", charSpacing: 1, margin: 0 });
  s1.addText(
    "✓ Plano de aula completo, com as habilidades da BNCC\n✓ Prova com gabarito e atividade para imprimir\n✓ Slides prontos para projetar\n✓ Um jogo do conteúdo, para fechar a semana",
    { x: cx + 0.13, y: y + 0.75, w: cw - 0.26, h: chatH - 0.82, fontFace: FONT_BODY, fontSize: 8.3, color: WHITE, lineSpacing: 12.5, margin: 0, valign: "top" }
  );

  y = PAGE_H - 1.12;
  selo(s1, "Não precisa saber mexer com tecnologia", cx, y, cw, 0.26);
  y += 0.36;
  const sw = (cw - 0.16) / 3;
  statBox(s1, cx, y, sw, 0.6, "1.580", "habilidades\nda BNCC");
  statBox(s1, cx + sw + 0.08, y, sw, 0.6, "9", "tipos\nde jogo");
  statBox(s1, cx + (sw + 0.08) * 2, y, sw, 0.6, "~4s", "por\nmaterial");
}

// ── Coluna 2: Contra Capa (oferta) ────────────────────────────────
{
  const cx0 = COL_X[1], cx = cx0 + PAD, cw = COL_W - PAD * 2;
  s1.addShape(pres.ShapeType.rect, { x: cx0, y: 0, w: COL_W, h: PAGE_H, fill: { color: VIOLET } });
  let y = 0.3;

  s1.addImage({ path: A("logo.png"), x: cx, y, w: 0.32, h: 0.32 });
  s1.addText("Prof. Corujão", { x: cx + 0.42, y: y + 0.02, w: cw - 0.42, h: 0.3, fontFace: FONT_HEAD, fontSize: 13, bold: true, color: WHITE, margin: 0, valign: "middle" });
  y += 0.52;

  eyebrow(s1, "Como começar", cx, y, cw, true); y += 0.26;
  titulo(s1, [{ text: "Teste sete dias." }], cx, y, cw, 0.28, { fontSize: 15, corBase: WHITE });
  y += 0.3;
  titulo(s1, [{ text: "Depois você" }], cx, y, cw, 0.28, { fontSize: 15, corBase: WHITE });
  y += 0.32;
  sticker(s1, "decide.", cx, y, 1.3, 0.36, { fontSize: 13, tilt: 2, shadowColor: "000000" });
  y += 0.52;

  paragrafo(s1, "Sete dias criando quanto quiser, sem cartão de crédito. Passado o prazo, o material que você já criou continua seu.", cx, y, cw, 0.55, { fontSize: 9, cor: "E3E5FF" });
  y += 0.6;

  planoBox(s1, cx, y, cw, 0.6, { nome: "Acesso gratuito", preco: "7 dias", sub: "Tudo liberado, sem cartão e sem compromisso." });
  y += 0.68;
  planoBox(s1, cx, y, cw, 0.72, { pro: true, nome: "★ Apoiador Pro", preco: "R$ 59,90 /mês", sub: "Sem prazo e sem fidelidade. Menos de R$ 2 por dia, o preço de um café." });
  y += 0.82;

  qrCard(s1, cx, y, cw, 0.78, "qr-app.png", "Aponte a câmera e teste grátis", "Cadastro com e-mail e senha, leva um minuto.", "app.profcorujao.com.br");
  y += 0.86;
  qrCard(s1, cx, y, cw, 0.78, "qr-whats.png", "Ficou com dúvida? Fale comigo", "WhatsApp direto com quem desenvolveu.", "(98) 98179-6309");

  y = PAGE_H - 1.25;
  selo(s1, "7 dias grátis · sem cartão", cx, y, 2.0, 0.24); y += 0.32;
  paragrafo(s1, "Não é uma empresa. É um TCC. Construí o Prof. Corujão sozinho, para professores que eu vi trabalhando até tarde com o que tinham.\nLyelson Martins", cx, y, cw, 0.5, { fontSize: 7.8, cor: "D9DCFF" });
  y += 0.56;
  paragrafo(s1, "© 2026 Prof. Corujão · @prof.corujão", cx, y, cw, 0.18, { fontSize: 7, cor: "9AA0D8" });
}

// ── Coluna 3: Capa ─────────────────────────────────────────────────
{
  const cx0 = COL_X[2], cx = cx0 + PAD, cw = COL_W - PAD * 2;
  s1.addShape(pres.ShapeType.rect, { x: cx0, y: 0, w: COL_W, h: PAGE_H, fill: { color: VIOLET } });
  let y = 0.3;

  s1.addImage({ path: A("logo.png"), x: cx, y, w: 0.32, h: 0.32 });
  s1.addText("Prof. Corujão", { x: cx + 0.42, y: y + 0.02, w: cw - 0.7, h: 0.3, fontFace: FONT_HEAD, fontSize: 13, bold: true, color: WHITE, margin: 0, valign: "middle" });
  s1.addText("@PROF.CORUJÃO", { x: cx, y: y + 0.36, w: cw, h: 0.18, fontFace: FONT_BODY, fontSize: 7, bold: true, color: "B9C0FF", charSpacing: 1, margin: 0 });
  y += 0.66;

  sticker(s1, "EI", cx, y, 1.0, 0.4, { fontSize: 19, tilt: -3, shadowColor: "000000" });
  y += 0.48;
  sticker(s1, "PROFESSOR(A)", cx, y, cw, 0.44, { fontSize: 16, tilt: 2.4, shadowColor: "000000" });
  y += 0.58;

  titulo(s1, [{ text: "Cansado de fazer tudo sozinho e sem tempo de sobra?" }], cx, y, cw, 0.7, { fontSize: 13.5, corBase: WHITE });
  y += 0.74;
  paragrafo(s1, "Pouco tempo, muita cobrança, sobrecarga que ninguém vê de fora.", cx, y, cw, 0.36, { fontSize: 9, cor: "DCDFFF" });
  y += 0.42;

  s1.addImage({ path: A("illu-01.png"), x: cx + (cw - 2.5) / 2, y, w: 2.5, h: 2.5, sizing: { type: "contain", w: 2.5, h: 2.5 } });

  // "o que é", dito sem rodeio, ainda na capa
  y = PAGE_H - 1.72;
  s1.addShape(pres.ShapeType.roundRect, {
    x: cx, y, w: cw, h: 0.62, rectRadius: 0.06,
    fill: { color: WHITE }, line: { color: NAVY, width: 2.5 },
    shadow: shadowDura("000000", 0.5),
  });
  s1.addText(
    [
      { text: "O Prof. Corujão é um site que ", options: { color: NAVY } },
      { text: "monta o plano de aula, a prova e os slides da sua aula", options: { color: NAVY, bold: true } },
      { text: ". Você só escreve o tema.", options: { color: NAVY } },
    ],
    { x: cx + 0.12, y: y + 0.07, w: cw - 0.24, h: 0.48, fontFace: FONT_BODY, fontSize: 8.8, lineSpacing: 11, margin: 0, valign: "middle" }
  );
  y += 0.72;
  paragrafo(s1, "Abra o folder e veja como funciona.", cx, y, cw, 0.2, { fontSize: 8.5, cor: "DCDFFF", bold: true });
  y += 0.26;
  selo(s1, "7 dias grátis · sem cartão", cx, y, 2.0, 0.24);
  y += 0.32;
  s1.addText("app.profcorujao.com.br", { x: cx, y, w: cw, h: 0.2, fontFace: FONT_BODY, fontSize: 9, bold: true, color: YELLOW, margin: 0 });
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 2 — PARTE INTERNA: como funciona | além da aula | jogos e dúvidas
// ═══════════════════════════════════════════════════════════════════
const s2 = pres.addSlide();
s2.background = { color: PAPER };

// ── Coluna 1: como funciona ────────────────────────────────────────
{
  const cx = COL_X[0] + PAD, cw = COL_W - PAD * 2;
  let y = 0.32;

  eyebrow(s2, "Como funciona", cx, y, cw); y += 0.26;
  titulo(s2, [{ text: "Três passos." }], cx, y, cw, 0.3, { fontSize: 17 });
  y += 0.34;
  sticker(s2, "Só isso.", cx, y, 1.35, 0.36, { fontSize: 13, tilt: -3 });
  y += 0.56;

  passo(s2, cx, y, cw, "1", "Escreva o tema e a turma",
    "Do jeito que você falaria: “Fotossíntese, 8º ano”. Não tem configuração nem palavra técnica.");
  y += 0.82;
  passo(s2, cx, y, cw, "2", "Espere alguns segundos",
    "Ele monta enquanto você faz outra coisa e avisa quando termina. Dá tempo de sair da escola.");
  y += 0.82;
  passo(s2, cx, y, cw, "3", "Revise, imprima ou projete",
    "Baixa em Word e PowerPoint. Você lê, muda o que quiser e usa. Nada vai para a turma sem você aprovar.");
  y += 0.9;

  caixaCheck(s2, cx, y, cw, "O que chega pronto", [
    "Plano de aula com objetivos, metodologia e avaliação",
    "As habilidades da BNCC daquele ano, conferidas uma a uma",
    "Prova com gabarito: objetiva, discursiva ou mista",
    "Atividade impressa, pronta para distribuir na sala",
    "Slides com imagens, prontos para o projetor",
    "Jogo do conteúdo, para imprimir ou passar na TV",
  ]);

  const bnccY = PAGE_H - 1.5, bnccH = 1.2;
  s2.addShape(pres.ShapeType.roundRect, { x: cx, y: bnccY, w: cw, h: bnccH, rectRadius: 0.06, fill: { color: NAVY } });
  s2.addText("1.580", { x: cx + 0.14, y: bnccY + 0.08, w: 1.1, h: 0.42, fontFace: FONT_HEAD, fontSize: 22, bold: true, color: YELLOW, margin: 0 });
  s2.addText(
    [
      { text: "habilidades da BNCC conferidas contra o documento oficial do MEC.\n", options: { bold: true, color: WHITE } },
      { text: "Todo aplicativo diz que é “alinhado à BNCC”. Aqui cada código é comparado antes de chegar em você, e o que não bate é refeito. Seu plano não chega com habilidade inventada.", options: { color: "C7CBEE" } },
    ],
    { x: cx + 0.14, y: bnccY + 0.48, w: cw - 0.28, h: bnccH - 0.56, fontFace: FONT_BODY, fontSize: 8, lineSpacing: 10.5, margin: 0, valign: "top" }
  );
}

// ── Coluna 2: além da aula ─────────────────────────────────────────
{
  const cx = COL_X[1] + PAD, cw = COL_W - PAD * 2;
  let y = 0.32;

  eyebrow(s2, "Além da aula", cx, y, cw); y += 0.26;
  titulo(s2, [{ text: "O domingo que ele" }], cx, y, cw, 0.3, { fontSize: 15.5 });
  y += 0.34;
  sticker(s2, "devolve.", cx, y, 1.45, 0.36, { fontSize: 13, tilt: 2 });
  y += 0.56;

  card(s2, cx, y, cw, 1.0, { tag: "Agenda e diário de classe", titulo: "O ano letivo a partir de um PDF", corpo: "Você manda o calendário da escola em PDF e ele preenche feriados, recessos e reuniões sozinho. Chamada, anotações e notas por aluno ficam no mesmo lugar." });
  y += 1.08;
  card(s2, cx, y, cw, 1.0, { tag: "Kit do Professor", titulo: "A papelada que ninguém vê", corpo: "Lista de chamada pronta para imprimir, atividade adaptada para aluno com TDAH, TEA, dislexia ou baixa visão, rubrica de avaliação e bilhete para a família." });
  y += 1.08;
  card(s2, cx, y, cw, 0.94, { tag: "Turma gamificada", titulo: "Comportamento que vira ponto", corpo: "Pontos, níveis e equipes, com as regras que você escolher. O prêmio não é material: é ser ajudante do dia ou escolher a música da aula." });
  y += 1.02;
  card(s2, cx, y, cw, 0.78, { tag: "Seu acervo", titulo: "Nada se perde de um ano para o outro", corpo: "Tudo o que você cria fica guardado e organizado, com busca por tipo de material." });
  y += 0.88;

  eyebrow(s2, "Na hora da aula, no projetor", cx, y, cw); y += 0.24;
  pills(s2, ["Sorteador", "Cronômetro", "Grupos", "Medidor de ruído", "Semáforo", "Dado", "Placar de equipes"], cx, y, cw);

  fita(s2, "Exporta em Word e PowerPoint. O material é seu.", cx - 0.03, PAGE_H - 0.62, cw + 0.06, 0.4);
}

// ── Coluna 3: jogos e as dúvidas de sempre ─────────────────────────
{
  const cx = COL_X[2] + PAD, cw = COL_W - PAD * 2;
  let y = 0.32;

  eyebrow(s2, "A parte que a turma pede de novo", cx, y, cw); y += 0.26;
  titulo(s2, [{ text: "Qualquer conteúdo" }], cx, y, cw, 0.3, { fontSize: 15 });
  y += 0.34;
  sticker(s2, "vira jogo.", cx, y, 1.5, 0.36, { fontSize: 13, tilt: -3 });
  y += 0.56;

  paragrafo(s2,
    "Você dá o tema, ele escreve as perguntas pelo nível da sua turma e monta o jogo inteiro. Uns saem no papel, para imprimir e distribuir. Outros rodam na TV da sala, com a turma dividida em equipes.",
    cx, y, cw, 0.7, { fontSize: 9 });
  y += 0.76;

  y = pills(s2, ["Escape Room", "Caça-palavras", "Cruzadas", "Bingo", "Memória", "Flashcards", "Quiz na TV", "Batalha em equipes", "Aventura para jogar sozinho"], cx, y, cw) + 0.24;

  eyebrow(s2, "Perguntas que todo professor faz", cx, y, cw); y += 0.3;

  y = faq(s2, cx, y, cw, "Preciso saber mexer com tecnologia?",
    "Não. Você escreve o tema como escreve uma mensagem. Não tem configuração, não tem palavra difícil, não tem curso para fazer antes.", 0.44);
  y = faq(s2, cx, y, cw, "Funciona no meu celular?",
    "Funciona. Abre no navegador do celular, do tablet ou do computador, e não precisa instalar nada.", 0.34);
  y = faq(s2, cx, y, cw, "O material é meu mesmo?",
    "É. Você edita, imprime e usa como quiser, inclusive depois que o teste de sete dias acaba.", 0.34);
  y = faq(s2, cx, y, cw, "Serve para a minha disciplina?",
    "Da educação infantil ao ensino médio, em qualquer matéria.", 0.22);
  y = faq(s2, cx, y, cw, "Preciso de internet?",
    "Para montar o material, sim. Depois de baixar em Word ou PowerPoint, o arquivo abre sem internet.", 0.34);
  y = faq(s2, cx, y, cw, "E se eu não gostar?",
    "São sete dias grátis, sem cartão de crédito. Se não servir, é só não continuar. Nada é cobrado sozinho.", 0.34);

  sticker(s2, "app.profcorujao.com.br", cx + (cw - 2.5) / 2, PAGE_H - 0.5, 2.5, 0.3, { fontSize: 9.5, tilt: -1 });
}

const SAIDA = path.join(__dirname, "..", "folder-prof-corujao-editavel.pptx");
pres.writeFile({ fileName: SAIDA }).then((fileName) => {
  console.log("Gerado:", fileName);
});
