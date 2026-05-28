from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    Table, TableStyle, PageBreak
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
import os

W, H = A4
BRAND  = colors.HexColor('#4659ff')
BRANDD = colors.HexColor('#2a35cc')
BSOFT  = colors.HexColor('#eef0ff')
INK    = colors.HexColor('#0c1015')
MUTED  = colors.HexColor('#6b7280')
NIGHT  = colors.HexColor('#0d1043')
NIGHT2 = colors.HexColor('#1a1f6e')
WHITE  = colors.white
EMLD   = colors.HexColor('#10b981')
AMBER  = colors.HexColor('#f59e0b')

def sty(name='body', **kw):
    base = {
        'fontName': 'Helvetica',
        'fontSize': 10,
        'leading': 15,
        'textColor': MUTED,
        'spaceAfter': 4,
    }
    base.update(kw)
    return ParagraphStyle(name, **base)

S_TITLE   = sty('title',   fontName='Helvetica-Bold', fontSize=22, textColor=INK,   leading=26, spaceAfter=6, alignment=TA_CENTER)
S_TITLE2  = sty('title2',  fontName='Helvetica-Bold', fontSize=16, textColor=INK,   leading=20, spaceAfter=4)
S_EYEBROW = sty('eyebrow', fontName='Helvetica-Bold', fontSize=8,  textColor=BRAND, leading=10, spaceAfter=2, alignment=TA_CENTER, spaceBefore=4)
S_BODY    = sty('body',    fontSize=10, leading=15, textColor=MUTED, spaceAfter=6)
S_BODY_C  = sty('body_c',  fontSize=10, leading=15, textColor=MUTED, spaceAfter=6, alignment=TA_CENTER)
S_QUOTE   = sty('quote',   fontName='Helvetica-Oblique', fontSize=12, textColor=INK, leading=18, spaceAfter=8)
S_SIG     = sty('sig',     fontName='Helvetica-Bold', fontSize=9, textColor=MUTED, leading=12, spaceAfter=4)
S_BULLET  = sty('bullet',  fontSize=10, leading=14, textColor=INK, spaceAfter=3, leftIndent=12, firstLineIndent=-12)
S_SMALL   = sty('small',   fontSize=8, leading=12, textColor=MUTED, spaceAfter=3)
S_SMALL_C = sty('small_c', fontSize=8, leading=12, textColor=MUTED, spaceAfter=3, alignment=TA_CENTER)
S_TAG     = sty('tag',     fontName='Helvetica-Bold', fontSize=8, textColor=BRAND, leading=10, spaceAfter=2, spaceBefore=2)
S_WHITE   = sty('white',   fontSize=10, leading=14, textColor=WHITE, spaceAfter=4, alignment=TA_CENTER)
S_WHITE_B = sty('white_b', fontName='Helvetica-Bold', fontSize=18, textColor=WHITE, leading=22, spaceAfter=6, alignment=TA_CENTER)
S_LIGHT   = sty('light',   fontSize=9,  leading=13, textColor=colors.HexColor('#b3c0ff'), spaceAfter=4, alignment=TA_CENTER)

def hr():
    return HRFlowable(width='100%', thickness=0.5, color=BSOFT, spaceAfter=8, spaceBefore=8)

def sp(h=6):
    return Spacer(1, h)

def eyebrow(text):
    return Paragraph(text, S_EYEBROW)

def heading(text, level=1):
    if level == 1:
        return Paragraph(text, sty(f'h{level}', fontName='Helvetica-Bold', fontSize=20, textColor=INK, leading=24, spaceAfter=8, alignment=TA_CENTER))
    return Paragraph(text, sty(f'h{level}', fontName='Helvetica-Bold', fontSize=14, textColor=INK, leading=18, spaceAfter=6))

def bullet(check, text):
    return Paragraph(f'<font color="#4659ff"><b>{check}</b></font>&nbsp;&nbsp;{text}', S_BULLET)

def brand_box(lines, bg=BRAND, tc=WHITE, padding=8):
    inner = [[Paragraph('<br/>'.join(f'<font color="#{tc.hexval()[2:]}"><b>{l}</b></font>' for l in lines), sty('bb', fontName='Helvetica-Bold', fontSize=10, textColor=tc, leading=14, alignment=TA_CENTER))]]
    t = Table(inner, colWidths=[14*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg),
        ('ROUNDEDCORNERS', [8]),
        ('TOPPADDING',    (0,0), (-1,-1), padding),
        ('BOTTOMPADDING', (0,0), (-1,-1), padding),
        ('LEFTPADDING',   (0,0), (-1,-1), padding),
        ('RIGHTPADDING',  (0,0), (-1,-1), padding),
    ]))
    return t

def info_box(title, body_text, bg=BSOFT, tc=INK):
    rows = [[
        Paragraph(f'<b>{title}</b>', sty('ibt', fontName='Helvetica-Bold', fontSize=10, textColor=tc, leading=13)),
        Paragraph(body_text, sty('ibb', fontSize=9, textColor=MUTED, leading=13)),
    ]]
    t = Table(rows, colWidths=[4*cm, 10*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg),
        ('TOPPADDING',    (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING',   (0,0), (-1,-1), 8),
        ('RIGHTPADDING',  (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return t

def stat_table(items):
    cells = [Paragraph(f'<b><font color="#4659ff" size="16">{n}</font></b><br/><font color="#6b7280" size="7">{l}</font>', sty('st', alignment=TA_CENTER, leading=16)) for n, l in items]
    t = Table([cells], colWidths=[14*cm/len(items)]*len(items))
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BSOFT),
        ('TOPPADDING',    (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    return t

def plan_table(label, price, period, features, is_pro=False):
    bg = BRAND if is_pro else colors.HexColor('#f8f9fe')
    hdr_tc = WHITE if is_pro else BRAND
    feat_lines = ''.join(f'<font color="#4659ff">+</font>  {f}<br/>' for f in features)
    inner = [
        [Paragraph(f'<b><font color="#{hdr_tc.hexval()[2:]}">{label}</font></b>', sty('ph', fontName='Helvetica-Bold', fontSize=11, leading=14))],
        [Paragraph(f'<font color="#4659ff" size="22"><b>{price}</b></font><br/><font color="#6b7280" size="8">{period}</font>', sty('pp', leading=18))],
        [Paragraph(feat_lines, sty('pf', fontSize=9, leading=13, textColor=INK))],
    ]
    t = Table(inner, colWidths=[14*cm])
    bdr = BRAND
    t.setStyle(TableStyle([
        ('BACKGROUND',   (0,0), (0,0), bg),
        ('BACKGROUND',   (0,1), (0,2), colors.HexColor('#f0f2ff') if is_pro else colors.HexColor('#f8f9fe')),
        ('BOX',          (0,0), (-1,-1), 1, bdr),
        ('TOPPADDING',   (0,0), (-1,-1), 8),
        ('BOTTOMPADDING',(0,0), (-1,-1), 8),
        ('LEFTPADDING',  (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    return t

def terminal_box(lines):
    content = '<br/>'.join(f'<font color="#c8d2ff">{l}</font>' for l in lines)
    inner = [[Paragraph(content, sty('tb', fontName='Helvetica', fontSize=9, textColor=WHITE, leading=14))]]
    t = Table(inner, colWidths=[14*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), NIGHT),
        ('BOX',        (0,0), (-1,-1), 1, BRAND),
        ('TOPPADDING',    (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING',   (0,0), (-1,-1), 14),
        ('RIGHTPADDING',  (0,0), (-1,-1), 14),
    ]))
    return t

def card_row(icon, title, desc):
    inner = [[
        Paragraph(f'<font size="14">{icon}</font>', sty('ci', alignment=TA_CENTER)),
        Paragraph(f'<b>{title}</b><br/><font color="#6b7280" size="8">{desc}</font>', sty('ct', fontSize=9, leading=12)),
    ]]
    t = Table(inner, colWidths=[1*cm, 13*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8f9fe')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#e7e9f7')),
        ('TOPPADDING',    (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING',   (0,0), (-1,-1), 8),
        ('RIGHTPADDING',  (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    return t

def faq_item(q, a):
    items = [
        [Paragraph(f'<b>P: {q}</b>', sty('fq', fontName='Helvetica-Bold', fontSize=10, textColor=INK, leading=13))],
        [Paragraph(f'R: {a}', sty('fa', fontSize=9, textColor=MUTED, leading=13))],
    ]
    t = Table(items, colWidths=[14*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), BSOFT),
        ('TOPPADDING',    (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
        ('LINEBELOW', (0,-1), (-1,-1), 0.5, colors.HexColor('#e7e9f7')),
    ]))
    return t

# ─────────────────────────────────────────────────────────────
# Build document
# ─────────────────────────────────────────────────────────────
out_path = '/home/user/Site/profcorujao.pdf'
doc = SimpleDocTemplate(
    out_path, pagesize=A4,
    leftMargin=2*cm, rightMargin=2*cm,
    topMargin=2*cm, bottomMargin=2*cm,
)

story = []

# ══ PAGE 1 — CAPA ════════════════════════════════════════════
story += [
    sp(30),
    Paragraph('🦉', sty('owl', fontSize=48, leading=52, alignment=TA_CENTER, spaceAfter=10)),
    Paragraph('Prof. Corujão', sty('c1', fontName='Helvetica-Bold', fontSize=32, textColor=BRAND, leading=36, spaceAfter=4, alignment=TA_CENTER)),
    Paragraph('IA Educacional · TCC 2026', sty('c2', fontName='Helvetica-Bold', fontSize=9, textColor=MUTED, leading=12, spaceAfter=12, alignment=TA_CENTER)),
    Paragraph('O assistente de IA feito por professor, para professor.', sty('c3', fontName='Helvetica-Oblique', fontSize=14, textColor=INK, leading=18, spaceAfter=8, alignment=TA_CENTER)),
    hr(),
    Paragraph('Cria planos de aula, atividades, provas, slides e até escape rooms em segundos.', S_BODY_C),
    sp(12),
    stat_table([('8+', 'Ferramentas'), ('7', 'Tipos de jogos'), ('4', 'Temas Escape Room')]),
    sp(16),
    hr(),
    Paragraph('<b>profcorujao.vercel.app</b>', sty('url', fontName='Helvetica-Bold', fontSize=11, textColor=BRAND, alignment=TA_CENTER)),
    Paragraph('Lyelson Martins — Criador &amp; Estudante de TCC · 2026', S_SMALL_C),
    PageBreak(),
]

# ══ PAGE 2 — Dor ═════════════════════════════════════════════
story += [
    eyebrow('— 01 / 07 — A REALIDADE DO PROFESSOR'),
    sp(4),
    heading('Isso soa familiar?'),
    hr(),
    Paragraph(
        '"Você entra na sala com 35 alunos, um conteúdo pra cumprir, e o celular '
        'deles competindo com você. Você passa horas montando uma atividade que eles '
        'fazem em 10 minutos — ou não fazem."',
        S_QUOTE),
    Paragraph(
        '<b>Você quer que a aula seja incrível. Mas o tempo não colabora.</b>',
        sty('bold_body', fontName='Helvetica-Bold', fontSize=12, textColor=INK, leading=16, spaceAfter=4)),
    Paragraph('— Todo professor brasileiro, em algum momento', S_SIG),
    hr(),
]

for icon, title, desc in [
    ('⏰', 'i. Falta de tempo', 'Planejamento consome horas que não existem na sua semana.'),
    ('😴', 'ii. Turma desengajada', 'Conteúdo seco não prende atenção. Criar algo diferente exige energia.'),
    ('📋', 'iii. Burocracia infinita', 'Provas, atividades, relatórios — pilha interminável que rouba o fim de semana.'),
    ('🤯', 'iv. Sobrecarga criativa', 'Criar do zero todo dia é exaustivo. Inspiração não surge com 6 turmas.'),
    ('💡', 'v. Boa ideia, mas…', '"Queria gamificar, mas não sei por onde começar." Falta a ferramenta certa.'),
]:
    story.append(card_row(icon, title, desc))
    story.append(sp(4))

story.append(PageBreak())

# ══ PAGE 3 — Virada ══════════════════════════════════════════
story += [
    eyebrow('— 02 / 07 — A VIRADA'),
    sp(4),
    heading('E se a IA fizesse a parte chata?'),
    hr(),
    Paragraph(
        'O Prof. Corujão é um assistente educacional com IA que trabalha com você '
        'em segundo plano. Você digita o tema, ele pensa, estrutura, cria — '
        'e você escolhe o que usar.',
        S_BODY),
    sp(8),
    terminal_box([
        'PROFESSOR: Fotossíntese, 8º ano — algo que engaje a turma',
        '',
        '🦉 CORUJÃO:',
        '   ✅  Plano de aula com 3 objetivos pedagógicos',
        '   ✅  Atividade impressa pronta para distribuir',
        '   ✅  Quiz: Verdadeiro ou Falso com justificativas',
        '   ✅  Slides com ilustrações automáticas',
        '   ⏱  Gerado em 4 segundos',
    ]),
    sp(12),
    hr(),
    Paragraph('<b>O que muda na sua rotina:</b>', sty('wm', fontName='Helvetica-Bold', fontSize=11, textColor=INK, leading=14, spaceAfter=6)),
]
for b in [
    'Planejamento de horas → minutos',
    'Atividades genéricas → personalizadas por turma',
    'Fim de semana perdido → fim de semana livre',
    'Alunos dispersos → turma engajada com jogos',
]:
    story.append(bullet('✓', b))
    story.append(sp(2))

story.append(PageBreak())

# ══ PAGE 4 — Funcionalidades ══════════════════════════════════
story += [
    eyebrow('— 03 / 07 — FUNCIONALIDADES'),
    sp(4),
    heading('Tudo isso num só lugar?'),
    Paragraph('Cada ferramenta resolve uma dor real do professor. Juntas, transformam sua rotina.', S_BODY_C),
    hr(),

    Paragraph('<b>i. Planejador Inteligente ★ Carro-Chefe</b>', sty('ft', fontName='Helvetica-Bold', fontSize=13, textColor=INK, leading=16, spaceAfter=2)),
    Paragraph('<i>O núcleo do app — resolve a dor diária.</i>', sty('fs', fontName='Helvetica-Oblique', fontSize=10, textColor=MUTED, leading=13, spaceAfter=4)),
    Paragraph('Planejar, organizar e produzir materiais — tudo em um só lugar.', S_BODY),
]
for b in [
    'Alinhado à BNCC — banco real de habilidades, não inventadas pela IA',
    'Planos de aula completos com objetivos, metodologia e avaliação',
    'Atividades impressas prontas para distribuir',
    'Provas personalizadas — múltipla escolha, dissertativa, mista',
    'Slides profissionais com layouts e ilustrações automáticas',
    'Calendário escolar por turma — organiza todo o cronograma',
    'Funciona em segundo plano — gera enquanto você faz outra coisa',
]:
    story.append(bullet('✓', b))
    story.append(sp(2))

story += [
    sp(6),
    stat_table([('8+', 'Tipos de saída'), ('BNCC', 'Alinhado'), ('4s', 'Tempo médio')]),
    hr(),

    Paragraph('<b>ii. Chat com IA 💬</b>', sty('ft2', fontName='Helvetica-Bold', fontSize=13, textColor=INK, leading=16, spaceAfter=2)),
    Paragraph('<i>Um colega, não um robô.</i>', sty('fs2', fontName='Helvetica-Oblique', fontSize=10, textColor=MUTED, leading=13, spaceAfter=4)),
]
for b in [
    'Tira dúvidas e sugere abordagens pedagógicas',
    'Dá feedback sobre suas atividades e provas',
    'Aceita arquivos e imagens para análise',
    'Responde como colega de profissão',
]:
    story.append(bullet('✓', b))
    story.append(sp(2))

story.append(PageBreak())

# ══ PAGE 5 — Gamificação ══════════════════════════════════════
story += [
    eyebrow('— 03 / 07 — FUNCIONALIDADES (cont.)'),
    sp(4),
    heading('Gamificação & Escape Room'),
    hr(),

    Paragraph('<b>iii. Gamificação 🎮 · Diferencial</b>', sty('ft3', fontName='Helvetica-Bold', fontSize=13, textColor=INK, leading=16, spaceAfter=2)),
    Paragraph('<i>Nenhum outro app faz isso.</i>', sty('fs3', fontName='Helvetica-Oblique', fontSize=10, textColor=MUTED, leading=13, spaceAfter=4)),
    Paragraph(
        'Qualquer conteúdo vira jogo. Atividades gamificadas geradas automaticamente '
        'a partir do tema — é o que faz o aluno pedir pra repetir na semana seguinte.',
        S_BODY),
]
for b in [
    'Geração automática a partir do tema da aula',
    'Imprima ou use na tela — pronto pra projetar ou distribuir',
    'Personalização total — nível, faixa etária e disciplina',
]:
    story.append(bullet('✓', b))
    story.append(sp(2))

story += [
    sp(6),
    Paragraph('<b>Atividades disponíveis:</b>', sty('av', fontName='Helvetica-Bold', fontSize=10, textColor=INK, leading=13, spaceAfter=4)),
]

games = [
    ('🔐 Escape Room', '4 temas completos — destaque do app'),
    ('📖 Storytelling', 'Narrativas educativas interativas'),
    ('❓ Quiz', 'Verdadeiro/Falso, múltipla escolha'),
    ('🔤 Caça-palavras', 'Vocabulário e revisão de conteúdo'),
    ('✏️ Cruzadas', 'Fixação de termos e conceitos'),
    ('🎯 Bingo', 'Revisão lúdica em grupo'),
    ('🃏 Jogo da Memória', 'Pares conceito-definição'),
]
game_cells = [[
    Paragraph(f'<b>{g}</b><br/><font color="#6b7280" size="8">{d}</font>', sty('gc', fontSize=9, leading=12))
    for g, d in games[i:i+2]
] for i in range(0, len(games), 2)]
# pad last row if odd
if len(game_cells[-1]) == 1:
    game_cells[-1].append(Paragraph('', S_BODY))

gt = Table(game_cells, colWidths=[7*cm, 7*cm])
gt.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), BSOFT),
    ('BOX', (0,0), (-1,-1), 0.5, BRAND),
    ('INNERGRID', (0,0), (-1,-1), 0.3, colors.HexColor('#e7e9f7')),
    ('TOPPADDING',    (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING',   (0,0), (-1,-1), 8),
    ('RIGHTPADDING',  (0,0), (-1,-1), 8),
]))
story.append(gt)
story += [
    sp(10),
    brand_box([
        '✓ BNCC — Planos alinhados ao banco oficial',
        'Habilidades reais — não inventadas pela IA',
    ]),
    sp(6),
    Paragraph(
        'O Prof. Corujão possui um banco real de habilidades da BNCC integrado. '
        'Isso significa que os planos de aula gerados usam códigos e descritores reais '
        '— não frases genéricas inventadas pela IA.',
        S_BODY),
    PageBreak(),
]

# ══ PAGE 6 — A História ═══════════════════════════════════════
story += [
    eyebrow('— 04 / 07 — A HISTÓRIA POR TRÁS'),
    sp(4),
    heading('Eu não sou uma empresa.\nSou um estudante.'),
    hr(),
    Paragraph(
        '"Estou construindo o app que eu queria que existisse, para os professores '
        'que eu vi trabalhando até tarde, improvisando com o que tinham, sem apoio '
        'de tecnologia de verdade."',
        S_QUOTE),
    Paragraph(
        'Esse é o meu TCC. Cada linha de código foi escrita com uma pergunta em mente: '
        'isso vai facilitar a vida de alguém amanhã?',
        S_BODY),
    Paragraph(
        'Se você se tornar Apoiador, não está só pagando por um app. '
        'Está dizendo que acredita que professores merecem ferramentas melhores. '
        'E me ajudando a provar isso.',
        S_BODY),
    hr(),
]

sign_t = Table([[
    Paragraph('<b><font color="#4659ff" size="18">Lyelson Martins</font></b><br/><font color="#6b7280" size="8">Criador do Prof. Corujão · Estudante de TCC · 2026</font>',
              sty('st2', leading=18)),
]], colWidths=[14*cm])
sign_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), BSOFT),
    ('TOPPADDING',    (0,0), (-1,-1), 12),
    ('BOTTOMPADDING', (0,0), (-1,-1), 12),
    ('LEFTPADDING',   (0,0), (-1,-1), 14),
]))
story += [sign_t, PageBreak()]

# ══ PAGE 7 — Planos ═══════════════════════════════════════════
story += [
    eyebrow('— 05 / 07 — PLANOS'),
    sp(4),
    heading('Escolha como fazer parte.'),
    Paragraph(
        'Estamos convidando professores a se tornarem Apoiadores — '
        'pessoas que acreditam que a educação merece tecnologia de verdade.',
        S_BODY_C),
    hr(),
    brand_box(['⚡  As primeiras vagas têm condição especial. Depois do lançamento, o preço muda.']),
    sp(10),
    plan_table(
        'Plano Gratuito',
        'R$ 0',
        'para sempre gratuito',
        [
            'Planejador (limite de gerações)',
            'Chat com IA',
            'Estúdio básico de gamificação',
            'Escape Room limitado',
        ]
    ),
    sp(10),
    plan_table(
        '⭐ Apoiador Pro — Recomendado',
        'R$ 59,90/mês',
        'acesso completo e ilimitado',
        [
            'Gerações ilimitadas em tudo',
            'Escape Room completo · todos os 4 temas',
            'Execução em segundo plano',
            'Acesso antecipado a novidades',
            'Nome na lista de Apoiadores do app',
            'Suporte direto com o criador',
        ],
        is_pro=True
    ),
    sp(8),
    Paragraph(
        '<i>O app funciona em qualquer navegador e é instalável como PWA no Android e iPhone. '
        'Login com Google ou e-mail · dados protegidos pelo Firebase.</i>',
        S_SMALL_C),
    PageBreak(),
]

# ══ PAGE 8 — FAQ ══════════════════════════════════════════════
story += [
    eyebrow('— 06 / 07 — PERGUNTAS FREQUENTES'),
    sp(4),
    heading('Respostas rápidas.'),
    hr(),
]

faqs = [
    ('Precisa de internet para funcionar?',
     'Sim, para gerar conteúdo com IA é necessária conexão. Mas o app é instalável como PWA '
     'e funciona como app nativo no celular, com experiência fluida e responsiva.'),
    ('Funciona no iPhone?',
     'Funciona em qualquer navegador — Safari, Chrome, Firefox. '
     'É instalável no Android como app nativo. No iPhone, funciona perfeitamente pelo Safari.'),
    ('Os materiais gerados são meus?',
     'Sim, 100%. Tudo que você gera no Prof. Corujão pertence a você. '
     'Pode editar, imprimir, compartilhar e usar como quiser — sem restrições.'),
    ('É seguro? Meus dados ficam protegidos?',
     'Sim. Login com Google ou e-mail, dados armazenados e protegidos pelo Firebase (Google). '
     'Nenhuma informação sensível é compartilhada com terceiros.'),
    ('Por que "Apoiador" e não cliente?',
     'Porque você está ajudando um projeto real a crescer: não comprando um produto de prateleira. '
     'Cada Apoiador ajuda a garantir que o app continue crescendo e melhorando.'),
    ('Por que o Prof. Corujão é pago?',
     'Cada geração consome créditos reais de IA — isso tem custo. O valor cobre:\n'
     '🤖 Google Gemini — a IA que gera todo conteúdo;\n'
     '☁️ Firebase e hospedagem — banco de dados e infraestrutura 24h;\n'
     '🛠️ Desenvolvimento contínuo — novas funcionalidades e suporte.\n'
     'R$ 59,90/mês não é lucro — é o que mantém o app funcionando e evoluindo.'),
]
for q, a in faqs:
    story.append(faq_item(q, a))
    story.append(sp(4))

story.append(PageBreak())

# ══ PAGE 9 — CTA Final ════════════════════════════════════════
story += [
    sp(20),
    Paragraph('🦉', sty('cta_owl', fontSize=40, leading=44, alignment=TA_CENTER, spaceAfter=8)),
    eyebrow('— 07 / 07 — SUA PRÓXIMA AULA'),
    sp(8),
    Paragraph(
        'A aula que você sempre quis dar<br/>começa com a ferramenta certa.',
        sty('cta_title', fontName='Helvetica-Bold', fontSize=24, textColor=INK, leading=28, spaceAfter=10, alignment=TA_CENTER)),
    Paragraph(
        'Seja um Apoiador do Prof. Corujão. Acesse tudo. Ilimitado.<br/>'
        'E transforme o tempo que você perde planejando em tempo dentro da sala de aula.',
        sty('cta_sub', fontSize=11, textColor=MUTED, leading=16, spaceAfter=16, alignment=TA_CENTER)),
    brand_box(['🦉  Quero ser Apoiador agora'], bg=BRAND, tc=WHITE),
    sp(12),
    hr(),
    Paragraph('<b>profcorujao.vercel.app</b>', sty('f_url', fontName='Helvetica-Bold', fontSize=11, textColor=BRAND, alignment=TA_CENTER, spaceAfter=4)),
    Paragraph('📱 WhatsApp: +55 98 98179-6309', S_SMALL_C),
    Paragraph('👤 Lyelson Martins — Criador do Prof. Corujão', S_SMALL_C),
    sp(20),
    Paragraph('© 2026 Prof. Corujão · IA Educacional · Projeto TCC', sty('copy', fontSize=8, textColor=MUTED, alignment=TA_CENTER)),
]

doc.build(story)
size = os.path.getsize(out_path) // 1024
print(f'PDF gerado: {out_path} ({size} KB)')
