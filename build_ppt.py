"""
build_ppt.py — Genera presentacion_clasificacion.pptx
Wisconsin Breast Cancer — Clasificación Supervisada
"""

import os
import copy
from pptx import Presentation
from pptx.util import Cm, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.oxml.ns import qn
from pptx.oxml import parse_xml
from lxml import etree

# ---------------------------------------------------------------------------
# Dimensiones
# ---------------------------------------------------------------------------
SLIDE_W = Cm(33.87)
SLIDE_H = Cm(19.05)

# ---------------------------------------------------------------------------
# Paleta
# ---------------------------------------------------------------------------
BG_DARK       = RGBColor(0x0F, 0x17, 0x2A)
BG_LIGHT      = RGBColor(0xF8, 0xFA, 0xFC)
PRIMARY       = RGBColor(0x1E, 0x40, 0xAF)
ACCENT_RED    = RGBColor(0xDC, 0x26, 0x26)
ACCENT_GREEN  = RGBColor(0x16, 0xA3, 0x4A)
ACCENT_TEAL   = RGBColor(0x08, 0x91, 0xB2)
ACCENT_VIOLET = RGBColor(0x7C, 0x3A, 0xED)
TEXT_DARK     = RGBColor(0x1E, 0x29, 0x3B)
TEXT_MUTED    = RGBColor(0x64, 0x74, 0x8B)
BOX_BG        = RGBColor(0xEF, 0xF6, 0xFF)
BOX_WARN      = RGBColor(0xFE, 0xF3, 0xC7)
BOX_WARN_BDR  = RGBColor(0xF5, 0x9E, 0x0B)
BOX_RED_BG    = RGBColor(0xFE, 0xE2, 0xE2)
BOX_NAVY      = RGBColor(0x1E, 0x3A, 0x8A)
BLUE_LIGHT    = RGBColor(0x60, 0xA5, 0xFA)
ORANGE        = RGBColor(0xEA, 0x58, 0x0C)
GREEN_LIGHT   = RGBColor(0xBB, 0xF7, 0xD0)
WHITE         = RGBColor(0xFF, 0xFF, 0xFF)
BLUE_LIGHT2   = RGBColor(0x93, 0xC5, 0xFD)
DIVIDER       = RGBColor(0xCB, 0xD5, 0xE1)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE = "/home/jaiba/tp2/outputs"
imgs = {
    "cv_baseline":   os.path.join(BASE, "cv_baseline_comparison.png"),
    "before_after":  os.path.join(BASE, "before_after_tuning.png"),
    "overfit_train": os.path.join(BASE, "overfitting_train_vs_cv.png"),
    "overfit_gaps":  os.path.join(BASE, "overfitting_gaps.png"),
    "svm_val":       os.path.join(BASE, "svm", "val_curve_C (regularización).png"),
    "knn_val":       os.path.join(BASE, "knn", "val_curve_k (número de vecinos).png"),
    "rf_val":        os.path.join(BASE, "rf",  "val_curve_Profundidad máxima del árbol.png"),
    "svm_grid":      os.path.join(BASE, "svm", "hyperparam_grid.png"),
    "knn_grid":      os.path.join(BASE, "knn", "hyperparam_grid.png"),
    "rf_grid":       os.path.join(BASE, "rf",  "hyperparam_grid.png"),
    "svm_cm_test":   os.path.join(BASE, "svm", "confusion_matrix_test.png"),
    "svm_roc_test":  os.path.join(BASE, "svm", "roc_curve_test.png"),
}

OUT_PATH = os.path.join(BASE, "presentacion_clasificacion.pptx")

# ---------------------------------------------------------------------------
# Helpers internos
# ---------------------------------------------------------------------------

def _rgb_hex(color: RGBColor) -> str:
    return f"{color[0]:02X}{color[1]:02X}{color[2]:02X}"


def _set_cell_fill(cell, color: RGBColor):
    """Rellena celda de tabla con color sólido."""
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    solidFill = etree.SubElement(tcPr, qn("a:solidFill"))
    srgb = etree.SubElement(solidFill, qn("a:srgbClr"))
    srgb.set("val", _rgb_hex(color))


def _solid_fill_xml(color: RGBColor) -> str:
    return (
        f'<a:solidFill xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
        f'<a:srgbClr val="{_rgb_hex(color)}"/>'
        f'</a:solidFill>'
    )


# ---------------------------------------------------------------------------
# Helpers públicos
# ---------------------------------------------------------------------------

def add_slide(prs: Presentation) -> object:
    """Agrega slide en blanco (layout index 6 = Blank)."""
    blank_layout = prs.slide_layouts[6]
    return prs.slides.add_slide(blank_layout)


def set_bg(slide, rgb: RGBColor):
    """Fondo sólido del slide."""
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = rgb


def add_band(slide, rgb: RGBColor):
    """Banda vertical izquierda 0.5 cm, altura completa."""
    from pptx.util import Cm
    shape = slide.shapes.add_shape(
        1,  # MSO_SHAPE_TYPE.RECTANGLE
        Cm(0), Cm(0), Cm(0.5), SLIDE_H
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = rgb
    shape.line.fill.background()


def add_header_strip(slide, title_text: str, rgb: RGBColor):
    """Franja superior ~14% altura con texto blanco centrado."""
    strip_h = SLIDE_H * 0.14
    shape = slide.shapes.add_shape(
        1, Cm(0), Cm(0), SLIDE_W, strip_h
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = rgb
    shape.line.fill.background()

    tf = shape.text_frame
    tf.word_wrap = False
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run = p.add_run()
    run.text = title_text
    run.font.bold = True
    run.font.size = Pt(22)
    run.font.color.rgb = WHITE
    run.font.name = "Plus Jakarta Sans"

    # Centrar verticalmente
    from pptx.util import Pt as _Pt
    tf.margin_top = int(strip_h / 2) - int(Pt(22) / 2)
    tf.margin_bottom = 0
    tf.margin_left = Cm(0.8)
    tf.margin_right = Cm(0.8)


def add_textbox(slide, text: str,
                left_cm, top_cm, width_cm, height_cm,
                font_name="DM Sans", font_size_pt=16,
                bold=False, color_rgb=None,
                alignment=PP_ALIGN.LEFT,
                word_wrap=True):
    """Caja de texto básica."""
    if color_rgb is None:
        color_rgb = TEXT_DARK
    txBox = slide.shapes.add_textbox(
        Cm(left_cm), Cm(top_cm), Cm(width_cm), Cm(height_cm)
    )
    tf = txBox.text_frame
    tf.word_wrap = word_wrap
    p = tf.paragraphs[0]
    p.alignment = alignment
    run = p.add_run()
    run.text = text
    run.font.name = font_name
    run.font.size = Pt(font_size_pt)
    run.font.bold = bold
    run.font.color.rgb = color_rgb
    return txBox


def add_textbox_multiline(slide, lines: list,
                          left_cm, top_cm, width_cm, height_cm,
                          font_name="DM Sans", font_size_pt=16,
                          bold=False, color_rgb=None,
                          alignment=PP_ALIGN.LEFT,
                          line_spacing_pt=None):
    """Caja de texto con múltiples párrafos (lista de strings)."""
    if color_rgb is None:
        color_rgb = TEXT_DARK
    txBox = slide.shapes.add_textbox(
        Cm(left_cm), Cm(top_cm), Cm(width_cm), Cm(height_cm)
    )
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, line in enumerate(lines):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.alignment = alignment
        if line_spacing_pt:
            p.line_spacing = Pt(line_spacing_pt)
        run = p.add_run()
        run.text = line
        run.font.name = font_name
        run.font.size = Pt(font_size_pt)
        run.font.bold = bold
        run.font.color.rgb = color_rgb
    return txBox


def add_callout(slide, text: str,
                left_cm, top_cm, width_cm, height_cm,
                bg_rgb=None, border_rgb=None,
                font_size_pt=14, font_name="DM Sans",
                text_color=None, bold=False):
    """Caja redondeada con fondo y borde de color."""
    if bg_rgb is None:
        bg_rgb = BOX_BG
    if border_rgb is None:
        border_rgb = PRIMARY
    if text_color is None:
        text_color = TEXT_DARK

    from pptx.util import Pt as _Pt
    shape = slide.shapes.add_shape(
        5,  # ROUNDED_RECTANGLE
        Cm(left_cm), Cm(top_cm), Cm(width_cm), Cm(height_cm)
    )
    # Ajuste del radio de esquina
    shape.adjustments[0] = 0.05

    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_rgb
    shape.line.color.rgb = border_rgb
    shape.line.width = Pt(1.5)

    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Cm(0.4)
    tf.margin_right = Cm(0.4)
    tf.margin_top = Cm(0.25)
    tf.margin_bottom = Cm(0.25)

    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.LEFT
    run = p.add_run()
    run.text = text
    run.font.name = font_name
    run.font.size = Pt(font_size_pt)
    run.font.color.rgb = text_color
    run.font.bold = bold
    return shape


def add_callout_multiline(slide, lines: list,
                          left_cm, top_cm, width_cm, height_cm,
                          bg_rgb=None, border_rgb=None,
                          font_size_pt=14, font_name="DM Sans",
                          text_color=None):
    """Caja redondeada con múltiples párrafos."""
    if bg_rgb is None:
        bg_rgb = BOX_BG
    if border_rgb is None:
        border_rgb = PRIMARY
    if text_color is None:
        text_color = TEXT_DARK

    from pptx.util import Pt as _Pt
    shape = slide.shapes.add_shape(
        5,
        Cm(left_cm), Cm(top_cm), Cm(width_cm), Cm(height_cm)
    )
    shape.adjustments[0] = 0.05
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_rgb
    shape.line.color.rgb = border_rgb
    shape.line.width = Pt(1.5)

    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Cm(0.4)
    tf.margin_right = Cm(0.4)
    tf.margin_top = Cm(0.25)
    tf.margin_bottom = Cm(0.25)

    for i, line in enumerate(lines):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        run = p.add_run()
        run.text = line
        run.font.name = font_name
        run.font.size = Pt(font_size_pt)
        run.font.color.rgb = text_color
    return shape


def add_image(slide, img_path: str, left_cm, top_cm, width_cm):
    """Inserta imagen manteniendo relación de aspecto."""
    if not os.path.exists(img_path):
        print(f"  [WARN] Imagen no encontrada: {img_path}")
        return None
    pic = slide.shapes.add_picture(
        img_path,
        Cm(left_cm), Cm(top_cm),
        width=Cm(width_cm)
    )
    return pic


def add_slide_number(slide, n: int):
    """Número de slide bottom-right."""
    add_textbox(slide, str(n),
                left_cm=31.5, top_cm=18.0,
                width_cm=2.0, height_cm=0.8,
                font_name="DM Sans", font_size_pt=10,
                bold=False, color_rgb=TEXT_MUTED,
                alignment=PP_ALIGN.RIGHT)


def add_divider_line(slide, top_cm, color=None):
    """Línea horizontal divisoria."""
    if color is None:
        color = DIVIDER
    from pptx.shapes.autoshape import Shape
    connector = slide.shapes.add_shape(
        1,  # rectangle delgado
        Cm(0.8), Cm(top_cm), Cm(32.0), Cm(0.03)
    )
    connector.fill.solid()
    connector.fill.fore_color.rgb = color
    connector.line.fill.background()


# ---------------------------------------------------------------------------
# Construcción de slides
# ---------------------------------------------------------------------------

def build_slide_1(prs):
    """SLIDE 1 — Portada."""
    slide = add_slide(prs)
    set_bg(slide, BG_DARK)

    # Rectángulo decorativo esquina inferior derecha
    deco = slide.shapes.add_shape(
        5,  # rounded rect
        Cm(22), Cm(12), Cm(12), Cm(8)
    )
    deco.adjustments[0] = 0.08
    deco.fill.solid()
    deco.fill.fore_color.rgb = RGBColor(0x1E, 0x40, 0xAF)
    deco.line.fill.background()
    # Aplicar transparencia 60% via XML
    sp = deco._element
    spPr = sp.find(qn("p:spPr"))
    if spPr is not None:
        solidFill = spPr.find(qn("a:solidFill"))
        if solidFill is not None:
            srgb = solidFill.find(qn("a:srgbClr"))
            if srgb is not None:
                alpha = etree.SubElement(srgb, qn("a:alpha"))
                alpha.set("val", "40000")  # 40% opacidad

    # Rectángulo teal superpuesto (esquina)
    deco2 = slide.shapes.add_shape(
        5,
        Cm(27), Cm(15), Cm(7), Cm(5)
    )
    deco2.adjustments[0] = 0.08
    deco2.fill.solid()
    deco2.fill.fore_color.rgb = ACCENT_TEAL
    deco2.line.fill.background()
    sp2 = deco2._element
    spPr2 = sp2.find(qn("p:spPr"))
    if spPr2 is not None:
        solidFill2 = spPr2.find(qn("a:solidFill"))
        if solidFill2 is not None:
            srgb2 = solidFill2.find(qn("a:srgbClr"))
            if srgb2 is not None:
                alpha2 = etree.SubElement(srgb2, qn("a:alpha"))
                alpha2.set("val", "30000")

    # Supertítulo
    add_textbox(slide, "72.75 Aprendizaje Automático — ITBA",
                left_cm=2.5, top_cm=4.5, width_cm=20, height_cm=1.0,
                font_name="DM Sans", font_size_pt=13,
                color_rgb=RGBColor(0xB0, 0xBE, 0xC5))

    # Título principal
    add_textbox(slide, "Clasificación Supervisada",
                left_cm=2.5, top_cm=5.8, width_cm=26, height_cm=2.5,
                font_name="Plus Jakarta Sans", font_size_pt=42,
                bold=True, color_rgb=WHITE)

    # Subtítulo
    add_textbox(slide, "Detección de Cáncer de Mama — Wisconsin Dataset",
                left_cm=2.5, top_cm=9.0, width_cm=26, height_cm=1.5,
                font_name="Plus Jakarta Sans", font_size_pt=22,
                color_rgb=BLUE_LIGHT2)

    # Línea decorativa horizontal
    line_shape = slide.shapes.add_shape(
        1,
        Cm(2.5), Cm(10.8), Cm(13), Cm(0.08)
    )
    line_shape.fill.solid()
    line_shape.fill.fore_color.rgb = ACCENT_TEAL
    line_shape.line.fill.background()

    # Footer
    add_textbox(slide, "Felipe Hiba  ·  2026  ·  ITBA",
                left_cm=2.5, top_cm=17.2, width_cm=20, height_cm=0.8,
                font_name="DM Sans", font_size_pt=11,
                color_rgb=RGBColor(0x94, 0xA3, 0xB8))

    add_slide_number(slide, 1)
    return slide


def build_slide_2(prs):
    """SLIDE 2 — Exploración del dataset."""
    slide = add_slide(prs)
    set_bg(slide, BG_LIGHT)
    add_band(slide, ACCENT_TEAL)
    add_header_strip(slide, "El Dataset: Wisconsin Diagnostic Breast Cancer", PRIMARY)

    TOP = 3.2

    # Columna izquierda — bullets (60%)
    bullets = [
        "• 569 muestras  ·  30 features originales → 17 seleccionadas tras limpieza",
        "• Etiqueta binaria: Benigno (B=0) / Maligno (M=1)",
        "• Features: mediciones del núcleo celular (radio, textura, perímetro, etc.)",
        "• 3 grupos de features: _mean, _se, _worst",
    ]
    add_textbox_multiline(slide, bullets,
                          left_cm=1.0, top_cm=TOP,
                          width_cm=19.0, height_cm=7.0,
                          font_name="DM Sans", font_size_pt=15,
                          color_rgb=TEXT_DARK, line_spacing_pt=22)

    # Columna derecha — callout estadísticas (40%)
    stats_lines = [
        "Distribución de clases",
        "",
        "B (Benigno): 357  (62.7%)",
        "M (Maligno): 212  (37.3%)",
        "",
        "Dataset desbalanceado →",
        "split estratificado obligatorio",
    ]
    callout = slide.shapes.add_shape(
        5,
        Cm(21.5), Cm(TOP), Cm(11.0), Cm(9.0)
    )
    callout.adjustments[0] = 0.05
    callout.fill.solid()
    callout.fill.fore_color.rgb = BOX_BG
    callout.line.color.rgb = PRIMARY
    callout.line.width = Pt(1.5)

    tf = callout.text_frame
    tf.word_wrap = True
    tf.margin_left = Cm(0.5)
    tf.margin_right = Cm(0.4)
    tf.margin_top = Cm(0.35)

    colors_lines = [TEXT_DARK, TEXT_DARK, ACCENT_GREEN, ACCENT_RED, TEXT_DARK, TEXT_MUTED, TEXT_MUTED]
    sizes_lines  = [14, 12, 17, 17, 12, 13, 13]
    bolds_lines  = [True, False, True, True, False, False, False]

    for i, (line, col, sz, bd) in enumerate(zip(stats_lines, colors_lines, sizes_lines, bolds_lines)):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        run = p.add_run()
        run.text = line
        run.font.name = "DM Sans"
        run.font.size = Pt(sz)
        run.font.color.rgb = col
        run.font.bold = bd

    # Nota metodológica inferior
    add_textbox(slide, "Train: 455 muestras  |  Test: 114 muestras  (80/20 estratificado)",
                left_cm=1.0, top_cm=15.5, width_cm=31.0, height_cm=1.0,
                font_name="DM Sans", font_size_pt=13,
                color_rgb=TEXT_MUTED, alignment=PP_ALIGN.CENTER)

    add_slide_number(slide, 2)
    return slide


def build_slide_3(prs):
    """SLIDE 3 — Limpieza y preprocesamiento."""
    slide = add_slide(prs)
    set_bg(slide, BG_LIGHT)
    add_band(slide, ACCENT_VIOLET)
    add_header_strip(slide, "Pipeline de Preprocesamiento", ACCENT_VIOLET)

    # Diagrama de flujo: 4 cajas + flechas
    boxes = [
        "Raw Data\n(569×30)",
        "Limpieza &\nFeature Selection\n(569×17)",
        "Train/Test Split\n80/20 estratificado",
        "StandardScaler\ndentro de CV/Pipeline",
    ]
    box_colors = [
        RGBColor(0xDB, 0xEA, 0xFE),  # azul muy claro
        RGBColor(0xED, 0xE9, 0xFE),  # violeta claro
        RGBColor(0xD1, 0xFA, 0xE5),  # verde claro
        RGBColor(0xD1, 0xFA, 0xE5),  # verde claro
    ]
    box_border_colors = [PRIMARY, ACCENT_VIOLET, ACCENT_GREEN, ACCENT_GREEN]

    # Coordenadas: 4 cajas distribuidas horizontalmente
    box_w = 6.8
    box_h = 2.2
    box_top = 3.0
    gap = 0.6
    total_w = 4 * box_w + 3 * gap
    start_x = (33.87 - total_w) / 2

    box_shapes = []
    for i, (txt, bg, bdr) in enumerate(zip(boxes, box_colors, box_border_colors)):
        x = start_x + i * (box_w + gap)
        shape = slide.shapes.add_shape(
            5,
            Cm(x), Cm(box_top), Cm(box_w), Cm(box_h)
        )
        shape.adjustments[0] = 0.06
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg
        shape.line.color.rgb = bdr
        shape.line.width = Pt(1.5)
        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Cm(0.3)
        tf.margin_right = Cm(0.3)
        tf.margin_top = Cm(0.2)
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = txt
        run.font.name = "DM Sans"
        run.font.size = Pt(13)
        run.font.color.rgb = TEXT_DARK
        run.font.bold = True
        box_shapes.append(shape)

    # Flechas entre cajas (líneas con conector)
    arrow_top = box_top + box_h / 2
    for i in range(3):
        x1 = start_x + (i + 1) * (box_w + gap) - gap
        x2 = x1 + gap
        mid = (x1 + x2) / 2
        # Flecha: rectángulo pequeño + triángulo (simplificado: texto "→")
        add_textbox(slide, "→",
                    left_cm=x1, top_cm=arrow_top - 0.4,
                    width_cm=gap, height_cm=0.8,
                    font_name="DM Sans", font_size_pt=20,
                    color_rgb=ACCENT_VIOLET, alignment=PP_ALIGN.CENTER)

    # Bullets
    bullets = [
        "• Eliminación de features correlacionadas (|r| > 0.95): 13 features removidas",
        "• Eliminación de outliers extremos (IQR × 3)",
        "• Split 80/20 estratificado → preserva proporción B/M en ambos sets",
        "• StandardScaler aplicado DENTRO del pipeline → sin data leakage",
    ]
    add_textbox_multiline(slide, bullets,
                          left_cm=1.0, top_cm=6.0,
                          width_cm=21.5, height_cm=5.5,
                          font_name="DM Sans", font_size_pt=14,
                          color_rgb=TEXT_DARK, line_spacing_pt=22)

    # Callout advertencia
    warn_text = (
        "Escalar antes del split contaminaría el test set con información del train. "
        "El scaler se ajusta solo sobre el fold de entrenamiento en cada iteración de CV."
    )
    add_callout(slide, warn_text,
                left_cm=23.5, top_cm=6.0,
                width_cm=9.8, height_cm=4.5,
                bg_rgb=BOX_WARN, border_rgb=BOX_WARN_BDR,
                font_size_pt=13)

    add_slide_number(slide, 3)
    return slide


def build_slide_4(prs):
    """SLIDE 4 — Contexto clínico / métricas."""
    slide = add_slide(prs)
    set_bg(slide, BG_LIGHT)
    add_band(slide, ACCENT_RED)
    add_header_strip(slide, "Contexto Clínico: No todas las métricas son iguales", ACCENT_RED)

    TOP = 3.0

    # Tabla de confusión conceptual 2×2 (izquierda)
    tbl_left = 1.2
    tbl_top  = TOP
    tbl_w    = 13.0
    tbl_h    = 9.5

    # Etiquetas de ejes
    add_textbox(slide, "PREDICCIÓN →",
                left_cm=tbl_left + 3, top_cm=tbl_top - 0.8,
                width_cm=8, height_cm=0.7,
                font_name="DM Sans", font_size_pt=12,
                bold=True, color_rgb=TEXT_MUTED, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, "REAL ↓",
                left_cm=tbl_left - 0.7, top_cm=tbl_top + 2,
                width_cm=1.5, height_cm=5,
                font_name="DM Sans", font_size_pt=12,
                bold=True, color_rgb=TEXT_MUTED)

    # Cabeceras predicción
    add_textbox(slide, "Maligno",
                left_cm=tbl_left + 3.2, top_cm=tbl_top,
                width_cm=4.5, height_cm=0.8,
                font_name="DM Sans", font_size_pt=13,
                bold=True, color_rgb=TEXT_DARK, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, "Benigno",
                left_cm=tbl_left + 8.2, top_cm=tbl_top,
                width_cm=4.5, height_cm=0.8,
                font_name="DM Sans", font_size_pt=13,
                bold=True, color_rgb=TEXT_DARK, alignment=PP_ALIGN.CENTER)

    # Cabeceras real
    add_textbox(slide, "Maligno",
                left_cm=tbl_left, top_cm=tbl_top + 1.5,
                width_cm=3.0, height_cm=3.0,
                font_name="DM Sans", font_size_pt=13,
                bold=True, color_rgb=TEXT_DARK, alignment=PP_ALIGN.RIGHT)
    add_textbox(slide, "Benigno",
                left_cm=tbl_left, top_cm=tbl_top + 5.0,
                width_cm=3.0, height_cm=3.0,
                font_name="DM Sans", font_size_pt=13,
                bold=True, color_rgb=TEXT_DARK, alignment=PP_ALIGN.RIGHT)

    # Celdas 2×2
    cell_w = 4.5
    cell_h = 3.5
    cell_x0 = tbl_left + 3.2
    cell_x1 = tbl_left + 8.2
    cell_y0 = tbl_top + 1.0
    cell_y1 = tbl_top + 5.0

    cells = [
        # (x, y, bg, texto, subtexto, font_size)
        (cell_x0, cell_y0, ACCENT_GREEN,
         "TP", "Maligno → Maligno", 13),
        (cell_x1, cell_y0, RGBColor(0xFE, 0xD7, 0xAA),
         "FN ⚠", "Maligno → Benigno\n¡EL PELIGROSO!", 13),
        (cell_x0, cell_y1, RGBColor(0xFD, 0xBA, 0x74),
         "FP", "Benigno → Maligno", 13),
        (cell_x1, cell_y1, GREEN_LIGHT,
         "TN", "Benigno → Benigno", 13),
    ]
    cell_colors_bdr = [ACCENT_GREEN, ACCENT_RED, ORANGE, ACCENT_GREEN]
    cell_txt_colors = [WHITE, ACCENT_RED, TEXT_DARK, TEXT_DARK]

    for (x, y, bg, label, sub, fsz), bdr, tcol in zip(cells, cell_colors_bdr, cell_txt_colors):
        shape = slide.shapes.add_shape(
            5,
            Cm(x), Cm(y), Cm(cell_w), Cm(cell_h)
        )
        shape.adjustments[0] = 0.04
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg
        shape.line.color.rgb = bdr
        shape.line.width = Pt(2)
        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Cm(0.3)
        tf.margin_top = Cm(0.2)
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = label
        run.font.name = "Plus Jakarta Sans"
        run.font.size = Pt(20)
        run.font.bold = True
        run.font.color.rgb = tcol

        p2 = tf.add_paragraph()
        p2.alignment = PP_ALIGN.CENTER
        run2 = p2.add_run()
        run2.text = sub
        run2.font.name = "DM Sans"
        run2.font.size = Pt(11)
        run2.font.color.rgb = TEXT_DARK

    # Columna derecha — bullets
    right_lines = [
        "FN: tumor maligno clasificado como benigno",
        "→ paciente no recibe tratamiento",
        "→ consecuencia potencialmente fatal",
        "",
        "FP: benigno clasificado como maligno",
        "→ biopsia innecesaria",
        "→ costoso pero no fatal",
        "",
        "Conclusión: minimizar FN",
        "= maximizar Sensibilidad (Recall)",
    ]
    add_textbox_multiline(slide, right_lines,
                          left_cm=15.5, top_cm=TOP,
                          width_cm=17.5, height_cm=9.5,
                          font_name="DM Sans", font_size_pt=14,
                          color_rgb=TEXT_DARK, line_spacing_pt=20)

    # Callout rojo
    add_callout(slide,
                "En diagnóstico oncológico, un FN puede costar una vida. Optimizamos Recall.",
                left_cm=1.0, top_cm=13.2,
                width_cm=32.0, height_cm=2.2,
                bg_rgb=BOX_RED_BG, border_rgb=ACCENT_RED,
                font_size_pt=14, bold=True,
                text_color=ACCENT_RED)

    add_slide_number(slide, 4)
    return slide


def build_slide_5(prs):
    """SLIDE 5 — Métricas: definiciones."""
    slide = add_slide(prs)
    set_bg(slide, BG_LIGHT)
    add_band(slide, ACCENT_TEAL)
    add_header_strip(slide, "Métricas clave — Definiciones", PRIMARY)

    TOP = 3.0
    BOX_W = 14.8
    BOX_H = 5.2
    GAP_H = 0.4
    GAP_V = 0.4

    # Grilla 2×2
    grid = [
        # (col, row, titulo, formula, descripcion, bg, bdr, badge)
        (0, 0,
         "Sensibilidad / Recall (TPR)",
         "TP / (TP + FN)",
         "¿De todos los enfermos, cuántos detectamos?",
         RGBColor(0xD1, 0xFA, 0xE5), ACCENT_GREEN, "MÉTRICA PRINCIPAL"),
        (1, 0,
         "Especificidad (TNR)",
         "TN / (TN + FP)",
         "¿De todos los sanos, cuántos identificamos correctamente?",
         BOX_BG, PRIMARY, None),
        (0, 1,
         "VPP (Precisión)",
         "TP / (TP + FP)",
         "¿De los clasificados como enfermos, cuántos lo son realmente?",
         BOX_BG, PRIMARY, None),
        (1, 1,
         "VPN",
         "TN / (TN + FN)",
         "¿De los clasificados como sanos, cuántos lo son realmente?",
         BOX_BG, PRIMARY, None),
    ]

    for (col, row, titulo, formula, desc, bg, bdr, badge) in grid:
        x = 1.0 + col * (BOX_W + GAP_H)
        y = TOP + row * (BOX_H + GAP_V)

        shape = slide.shapes.add_shape(
            5,
            Cm(x), Cm(y), Cm(BOX_W), Cm(BOX_H)
        )
        shape.adjustments[0] = 0.05
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg
        shape.line.color.rgb = bdr
        shape.line.width = Pt(1.5 if badge else 1.0)

        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Cm(0.5)
        tf.margin_right = Cm(0.4)
        tf.margin_top = Cm(0.3)

        # Título
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.LEFT
        run = p.add_run()
        run.text = titulo
        run.font.name = "Plus Jakarta Sans"
        run.font.size = Pt(15)
        run.font.bold = True
        run.font.color.rgb = TEXT_DARK

        # Fórmula
        p2 = tf.add_paragraph()
        run2 = p2.add_run()
        run2.text = formula
        run2.font.name = "JetBrains Mono"
        run2.font.size = Pt(17)
        run2.font.bold = True
        run2.font.color.rgb = bdr

        # Descripción
        p3 = tf.add_paragraph()
        run3 = p3.add_run()
        run3.text = desc
        run3.font.name = "DM Sans"
        run3.font.size = Pt(13)
        run3.font.color.rgb = TEXT_MUTED

        # Badge
        if badge:
            p4 = tf.add_paragraph()
            run4 = p4.add_run()
            run4.text = f"★ {badge}"
            run4.font.name = "DM Sans"
            run4.font.size = Pt(12)
            run4.font.bold = True
            run4.font.color.rgb = ACCENT_GREEN

    # Nota inferior
    add_textbox(slide, "Recall y Especificidad están en trade-off — aumentar uno tiende a bajar el otro",
                left_cm=1.0, top_cm=16.8, width_cm=32.0, height_cm=0.9,
                font_name="DM Sans", font_size_pt=13,
                color_rgb=TEXT_MUTED, alignment=PP_ALIGN.CENTER)

    add_slide_number(slide, 5)
    return slide


def build_slide_6(prs):
    """SLIDE 6 — ROC-AUC y métricas descartadas."""
    slide = add_slide(prs)
    set_bg(slide, BG_LIGHT)
    add_band(slide, ACCENT_TEAL)
    add_header_strip(slide, "ROC-AUC y métricas complementarias", PRIMARY)

    TOP = 3.0

    # Izquierda (40%)
    left_lines = [
        "ROC = curva TPR vs FPR para todos",
        "los umbrales posibles",
        "",
        "AUC = área bajo la curva =",
        "capacidad discriminativa general",
        "",
        "\"Threshold-free\" → útil para comparar",
        "modelos sin fijar umbral",
        "",
        "Segunda métrica de ranking:",
        "desempata entre modelos con",
        "recall similar",
    ]
    add_textbox_multiline(slide, left_lines,
                          left_cm=1.0, top_cm=TOP,
                          width_cm=12.0, height_cm=10.0,
                          font_name="DM Sans", font_size_pt=14,
                          color_rgb=TEXT_DARK, line_spacing_pt=19)

    # Derecha — tabla (60%)
    tbl_data = [
        ["Accuracy",     "Engañosa con clases desbalanceadas\n(modelo trivial = 62.7%)"],
        ["F1-Score",     "Combina Recall + Precisión por igual —\nen oncología Recall > Precisión"],
        ["Precisión (VPP)", "Penaliza FP, no FN —\nprioridad incorrecta para este dominio"],
        ["MCC",          "Robusto pero difícil de interpretar\npara audiencia clínica"],
    ]

    tbl_left  = 14.0
    tbl_top   = TOP
    tbl_w     = 19.0
    col_w1    = 6.0
    col_w2    = 13.0
    row_h     = 2.0
    hdr_h     = 1.0

    # Cabecera
    for ci, (hdr, cw) in enumerate(zip(["Métrica", "Por qué no es la principal"], [col_w1, col_w2])):
        shape = slide.shapes.add_shape(
            1, Cm(tbl_left + (col_w1 if ci else 0)), Cm(tbl_top), Cm(cw), Cm(hdr_h)
        )
        shape.fill.solid()
        shape.fill.fore_color.rgb = PRIMARY
        shape.line.fill.background()
        tf = shape.text_frame
        tf.margin_left = Cm(0.3)
        tf.margin_top = Cm(0.1)
        p = tf.paragraphs[0]
        run = p.add_run()
        run.text = hdr
        run.font.name = "DM Sans"
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = WHITE

    # Filas
    row_colors = [BG_LIGHT, BOX_BG, BG_LIGHT, BOX_BG]
    for ri, (row, bg) in enumerate(zip(tbl_data, row_colors)):
        y = tbl_top + hdr_h + ri * row_h
        for ci, (cell_txt, cw) in enumerate(zip(row, [col_w1, col_w2])):
            cx = tbl_left + (col_w1 if ci else 0)
            shape = slide.shapes.add_shape(
                1, Cm(cx), Cm(y), Cm(cw), Cm(row_h)
            )
            shape.fill.solid()
            shape.fill.fore_color.rgb = bg
            shape.line.color.rgb = DIVIDER
            shape.line.width = Pt(0.75)
            tf = shape.text_frame
            tf.margin_left = Cm(0.3)
            tf.margin_top = Cm(0.1)
            tf.word_wrap = True
            p = tf.paragraphs[0]
            run = p.add_run()
            run.text = cell_txt
            run.font.name = "DM Sans"
            run.font.size = Pt(12)
            run.font.color.rgb = TEXT_DARK
            if ci == 0:
                run.font.bold = True

    # Callout inferior
    add_callout(slide,
                "Reportamos F1 y Accuracy como métricas secundarias para completitud.",
                left_cm=1.0, top_cm=14.2,
                width_cm=32.0, height_cm=1.8,
                bg_rgb=BOX_BG, border_rgb=PRIMARY,
                font_size_pt=14)

    add_slide_number(slide, 6)
    return slide


def build_slide_7(prs):
    """SLIDE 7 — 5 Clasificadores."""
    slide = add_slide(prs)
    set_bg(slide, BG_LIGHT)
    add_band(slide, PRIMARY)
    add_header_strip(slide, "5 Clasificadores — Características", PRIMARY)

    TOP = 3.0

    rows = [
        ("Naive Bayes",    "Generativo, paramétrico",    "Underfitting (asume independencia entre features)"),
        ("LDA",            "Discriminativo lineal",       "Underfitting (frontera lineal, asume Gaussiana)"),
        ("SVM (RBF)",      "Discriminativo, kernel",      "Overfitting si C alto"),
        ("KNN",            "Basado en instancias",        "Depende de k: bajo k → overfit"),
        ("Random Forest",  "Ensemble (bagging)",          "Overfit si max_depth sin límite"),
    ]
    headers = ["Modelo", "Tipo", "Tendencia natural"]

    col_widths = [7.5, 9.0, 15.0]
    col_starts = [1.0, 9.0, 18.5]
    row_h = 1.9
    hdr_h = 1.1

    # Cabecera
    for ci, (hdr, cw, cx) in enumerate(zip(headers, col_widths, col_starts)):
        shape = slide.shapes.add_shape(1, Cm(cx), Cm(TOP), Cm(cw), Cm(hdr_h))
        shape.fill.solid()
        shape.fill.fore_color.rgb = PRIMARY
        shape.line.fill.background()
        tf = shape.text_frame
        tf.margin_left = Cm(0.3)
        tf.margin_top = Cm(0.15)
        p = tf.paragraphs[0]
        run = p.add_run()
        run.text = hdr
        run.font.name = "Plus Jakarta Sans"
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = WHITE

    row_bgs = [BOX_BG, BG_LIGHT, BOX_BG, BG_LIGHT, BOX_BG]
    # Highlight SVM
    svm_idx = 2
    for ri, (row, bg) in enumerate(zip(rows, row_bgs)):
        y = TOP + hdr_h + ri * row_h
        actual_bg = RGBColor(0xDB, 0xEA, 0xFE) if ri == svm_idx else bg
        for ci, (cell_txt, cw, cx) in enumerate(zip(row, col_widths, col_starts)):
            shape = slide.shapes.add_shape(1, Cm(cx), Cm(y), Cm(cw), Cm(row_h))
            shape.fill.solid()
            shape.fill.fore_color.rgb = actual_bg
            shape.line.color.rgb = DIVIDER
            shape.line.width = Pt(0.75)
            tf = shape.text_frame
            tf.margin_left = Cm(0.3)
            tf.margin_top = Cm(0.2)
            tf.word_wrap = True
            p = tf.paragraphs[0]
            run = p.add_run()
            run.text = cell_txt
            run.font.name = "DM Sans"
            run.font.size = Pt(13)
            run.font.bold = (ci == 0)
            run.font.color.rgb = PRIMARY if (ri == svm_idx and ci == 0) else TEXT_DARK

    # Nota inferior
    add_textbox(slide,
                "CV estratificado 5-fold en todos los modelos. Los resultados son de validación — el test set NO fue tocado.",
                left_cm=1.0, top_cm=16.8, width_cm=32.0, height_cm=0.9,
                font_name="DM Sans", font_size_pt=12,
                color_rgb=TEXT_MUTED, alignment=PP_ALIGN.CENTER)

    add_slide_number(slide, 7)
    return slide


def build_slide_8(prs):
    """SLIDE 8 — CV Baseline."""
    slide = add_slide(prs)
    set_bg(slide, BG_LIGHT)
    add_band(slide, PRIMARY)
    add_header_strip(slide, "Paso 1: Baseline con hiperparámetros por defecto", PRIMARY)

    # Imagen centrada 80% ancho
    img_w = 33.87 * 0.78
    img_x = (33.87 - img_w) / 2
    add_image(slide, imgs["cv_baseline"], img_x, 3.0, img_w)

    # Bullets
    bullets = [
        "• SVM lidera: Recall=0.959, ROC-AUC=0.995",
        "• NB y KNN empatan: Recall=0.906",
        "• LDA más bajo: Recall=0.876 — frontera lineal insuficiente",
    ]
    add_textbox_multiline(slide, bullets,
                          left_cm=1.0, top_cm=14.0,
                          width_cm=28.0, height_cm=3.0,
                          font_name="DM Sans", font_size_pt=14,
                          color_rgb=TEXT_DARK, line_spacing_pt=20)

    # Callout
    add_callout(slide,
                "Todos los resultados son de validación cruzada 5-fold — test set intacto",
                left_cm=1.0, top_cm=16.8,
                width_cm=32.0, height_cm=1.5,
                bg_rgb=BOX_BG, border_rgb=PRIMARY,
                font_size_pt=13)

    add_slide_number(slide, 8)
    return slide


def build_slide_9(prs):
    """SLIDE 9 — Análisis bias-varianza."""
    slide = add_slide(prs)
    set_bg(slide, BG_LIGHT)
    add_band(slide, ACCENT_VIOLET)
    add_header_strip(slide, "Análisis Bias-Varianza: Train vs CV", ACCENT_VIOLET)

    img_w = 33.87 * 0.73
    img_x = (33.87 - img_w) / 2
    add_image(slide, imgs["overfit_train"], img_x, 2.9, img_w)

    bullets = [
        "• SVM: gap mínimo → bien regularizado con C=1, kernel RBF",
        "• RF: gap Recall ≈ 0.07 → overfitting leve, árboles memorizan train",
        "• NB/LDA: gap chico pero valores moderados → underfitting por simplificaciones del modelo",
        "• KNN: gap moderado → sensible al valor de k",
    ]
    add_textbox_multiline(slide, bullets,
                          left_cm=1.0, top_cm=14.0,
                          width_cm=32.0, height_cm=4.5,
                          font_name="DM Sans", font_size_pt=13,
                          color_rgb=TEXT_DARK, line_spacing_pt=19)

    add_slide_number(slide, 9)
    return slide


def build_slide_10(prs):
    """SLIDE 10 — Gaps de overfitting."""
    slide = add_slide(prs)
    set_bg(slide, BG_LIGHT)
    add_band(slide, ACCENT_VIOLET)
    add_header_strip(slide, "Gap Train − CV por modelo", ACCENT_VIOLET)

    img_w = 33.87 * 0.78
    img_x = (33.87 - img_w) / 2
    add_image(slide, imgs["overfit_gaps"], img_x, 3.0, img_w)

    bullets = [
        "• Umbral overfitting = 0.05 (línea roja en el gráfico)",
        "• RF cruza umbral en Recall → max_depth debe controlarse",
        "• SVM y NB por debajo del umbral → comportamiento estable",
    ]
    add_textbox_multiline(slide, bullets,
                          left_cm=1.0, top_cm=14.0,
                          width_cm=28.0, height_cm=3.0,
                          font_name="DM Sans", font_size_pt=14,
                          color_rgb=TEXT_DARK, line_spacing_pt=20)

    add_textbox(slide,
                "Gap bajo + CV alto = buen trade-off sesgo-varianza",
                left_cm=1.0, top_cm=17.2, width_cm=32.0, height_cm=0.8,
                font_name="DM Sans", font_size_pt=12,
                color_rgb=TEXT_MUTED, alignment=PP_ALIGN.CENTER)

    add_slide_number(slide, 10)
    return slide


def build_slide_11(prs):
    """SLIDE 11 — Curvas de validación 1D."""
    slide = add_slide(prs)
    set_bg(slide, BG_LIGHT)
    add_band(slide, ACCENT_GREEN)
    add_header_strip(slide, "Tuning 1D: Curvas de Validación", ACCENT_GREEN)

    captions = [
        ("SVM: C óptimo ~1–10;\nC muy alto → overfit", imgs["svm_val"]),
        ("KNN: k óptimo 5–9;\nk=1 overfittea, k grande underfittea", imgs["knn_val"]),
        ("RF: max_depth ~6–10 equilibra;\nsin límite → overfit", imgs["rf_val"]),
    ]

    TOTAL_W  = 33.87
    MARGIN_L = 0.8
    MARGIN_R = 0.8
    GAP      = 0.3
    available = TOTAL_W - MARGIN_L - MARGIN_R - 2 * GAP
    img_w = available / 3
    img_top = 3.0
    cap_top = img_top + 8.5  # debajo de imágenes

    for i, (caption, img_path) in enumerate(captions):
        x = MARGIN_L + i * (img_w + GAP)
        add_image(slide, img_path, x, img_top, img_w)
        add_textbox(slide, caption,
                    left_cm=x, top_cm=cap_top,
                    width_cm=img_w, height_cm=2.0,
                    font_name="DM Sans", font_size_pt=12,
                    color_rgb=TEXT_MUTED, alignment=PP_ALIGN.CENTER)

    add_slide_number(slide, 11)
    return slide


def build_slide_12(prs):
    """SLIDE 12 — Grid 2D: Heatmaps."""
    slide = add_slide(prs)
    set_bg(slide, BG_LIGHT)
    add_band(slide, ACCENT_GREEN)
    add_header_strip(slide, "Tuning 2D: GridSearchCV — Heatmaps", ACCENT_GREEN)

    captions = [
        ("SVM: mejor C=1, kernel=rbf\n→ Recall=0.959", imgs["svm_grid"]),
        ("KNN: mejor k=7, weights=uniform\n→ Recall=0.906", imgs["knn_grid"]),
        ("RF: mejor max_depth=None, n_estimators=200\n→ Recall=0.929", imgs["rf_grid"]),
    ]

    TOTAL_W  = 33.87
    MARGIN_L = 0.8
    MARGIN_R = 0.8
    GAP      = 0.3
    available = TOTAL_W - MARGIN_L - MARGIN_R - 2 * GAP
    img_w = available / 3
    img_top = 3.0
    cap_top = img_top + 8.5

    for i, (caption, img_path) in enumerate(captions):
        x = MARGIN_L + i * (img_w + GAP)
        add_image(slide, img_path, x, img_top, img_w)
        add_textbox(slide, caption,
                    left_cm=x, top_cm=cap_top,
                    width_cm=img_w, height_cm=2.0,
                    font_name="DM Sans", font_size_pt=12,
                    color_rgb=TEXT_MUTED, alignment=PP_ALIGN.CENTER)

    add_slide_number(slide, 12)
    return slide


def build_slide_13(prs):
    """SLIDE 13 — Impacto del tuning."""
    slide = add_slide(prs)
    set_bg(slide, BG_LIGHT)
    add_band(slide, ACCENT_GREEN)
    add_header_strip(slide, "Impacto del Tuning de Hiperparámetros", ACCENT_GREEN)

    img_w = 33.87 * 0.68
    img_x = (33.87 - img_w) / 2
    add_image(slide, imgs["before_after"], img_x, 3.0, img_w)

    bullets = [
        "• SVM: sin cambio — C=1 ya era el default óptimo, confirma estabilidad",
        "• RF: leve mejora en Recall (+0.005) con n_estimators=200",
        "• LDA: mejora ROC-AUC con shrinkage=0.1 (solver lsqr)",
        "• KNN: sin mejora significativa",
    ]
    add_textbox_multiline(slide, bullets,
                          left_cm=1.0, top_cm=14.0,
                          width_cm=32.0, height_cm=4.5,
                          font_name="DM Sans", font_size_pt=14,
                          color_rgb=TEXT_DARK, line_spacing_pt=20)

    add_slide_number(slide, 13)
    return slide


def build_slide_14(prs):
    """SLIDE 14 — Selección del modelo final (fondo oscuro)."""
    slide = add_slide(prs)
    set_bg(slide, BG_DARK)

    # Título
    add_textbox(slide, "Selección del Modelo Final",
                left_cm=1.5, top_cm=0.8,
                width_cm=30.0, height_cm=1.8,
                font_name="Plus Jakarta Sans", font_size_pt=36,
                bold=True, color_rgb=WHITE, alignment=PP_ALIGN.CENTER)

    # Callout principal — centrado
    callout_txt = (
        "El modelo se selecciona en base a los resultados de validación cruzada — NO de test.\n\n"
        "El test set se evalúa UNA SOLA VEZ, sobre el modelo ya elegido. "
        "Usarlo para selección introduce optimistic bias."
    )
    add_callout(slide, callout_txt,
                left_cm=3.0, top_cm=3.0,
                width_cm=28.0, height_cm=4.5,
                bg_rgb=BOX_NAVY, border_rgb=BLUE_LIGHT,
                font_size_pt=15, text_color=WHITE)

    # Ranking
    ranking_lines = [
        "Ranking por Recall CV tuned:",
        "",
        "1.  SVM — 0.959   ✓ SELECCIONADO",
        "2.  RF  — 0.929",
        "3.  KNN / NB — 0.906",
        "4.  LDA — 0.882",
    ]
    txb = slide.shapes.add_textbox(Cm(4.0), Cm(8.2), Cm(26.0), Cm(7.5))
    tf = txb.text_frame
    tf.word_wrap = True
    col_map = [WHITE, WHITE, ACCENT_GREEN, WHITE, WHITE, WHITE]
    bold_map = [True, False, True, False, False, False]
    sz_map   = [16, 14, 20, 16, 16, 16]
    for i, line in enumerate(ranking_lines):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = line
        run.font.name = "DM Sans"
        run.font.size = Pt(sz_map[i])
        run.font.bold = bold_map[i]
        run.font.color.rgb = col_map[i]

    # Nota
    add_textbox(slide,
                "SVM con kernel RBF, C=1 → mejor Recall CV  Y  mejor ROC-AUC CV",
                left_cm=1.5, top_cm=16.5, width_cm=30.0, height_cm=1.0,
                font_name="DM Sans", font_size_pt=13,
                color_rgb=BLUE_LIGHT, alignment=PP_ALIGN.CENTER)

    add_slide_number(slide, 14)
    return slide


def build_slide_15(prs):
    """SLIDE 15 — Evaluación final en test."""
    slide = add_slide(prs)
    set_bg(slide, BG_LIGHT)
    add_band(slide, ACCENT_RED)
    add_header_strip(slide, "Evaluación en Test — SVM (RBF, C=1)", ACCENT_RED)

    TOP = 3.0
    IMG_W = 15.5

    # Izquierda: confusion matrix
    add_image(slide, imgs["svm_cm_test"], 1.0, TOP, IMG_W)

    # Derecha: ROC curve
    add_image(slide, imgs["svm_roc_test"], 17.5, TOP, IMG_W)

    # Tabla de métricas (debajo)
    metrics_top = 12.5
    headers_m = ["Recall", "ROC-AUC", "F1", "Accuracy"]
    values_m  = ["0.929", "0.995", "0.940", "0.956"]
    col_w_m   = 7.5
    row_h_m   = 1.2
    tbl_x     = (33.87 - 4 * col_w_m) / 2

    # Cabecera
    for ci, hdr in enumerate(headers_m):
        shape = slide.shapes.add_shape(1, Cm(tbl_x + ci * col_w_m), Cm(metrics_top), Cm(col_w_m), Cm(row_h_m))
        shape.fill.solid()
        shape.fill.fore_color.rgb = ACCENT_RED
        shape.line.fill.background()
        tf = shape.text_frame
        tf.margin_left = Cm(0.2)
        tf.margin_top = Cm(0.15)
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = hdr
        run.font.name = "DM Sans"
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = WHITE

    # Valores
    for ci, val in enumerate(values_m):
        shape = slide.shapes.add_shape(1, Cm(tbl_x + ci * col_w_m), Cm(metrics_top + row_h_m), Cm(col_w_m), Cm(row_h_m))
        shape.fill.solid()
        shape.fill.fore_color.rgb = BOX_RED_BG if ci == 0 else BOX_BG
        shape.line.color.rgb = DIVIDER
        shape.line.width = Pt(0.75)
        tf = shape.text_frame
        tf.margin_left = Cm(0.2)
        tf.margin_top = Cm(0.1)
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = val
        run.font.name = "JetBrains Mono"
        run.font.size = Pt(18)
        run.font.bold = True
        run.font.color.rgb = ACCENT_RED if ci == 0 else PRIMARY

    # Bullets
    bullets = [
        "• Recall test (0.929) ≈ Recall CV (0.959) → generaliza bien, sin overfit significativo",
        "• Solo 3 FN (tumores malignos no detectados) de 42 muestras malignas",
        "• ROC-AUC = 0.995 → discriminación casi perfecta",
    ]
    add_textbox_multiline(slide, bullets,
                          left_cm=1.0, top_cm=15.2,
                          width_cm=32.0, height_cm=3.5,
                          font_name="DM Sans", font_size_pt=13,
                          color_rgb=TEXT_DARK, line_spacing_pt=19)

    add_slide_number(slide, 15)
    return slide


def build_slide_16(prs):
    """SLIDE 16 — Conclusiones (fondo oscuro)."""
    slide = add_slide(prs)
    set_bg(slide, BG_DARK)

    # Título
    add_textbox(slide, "Conclusiones",
                left_cm=1.5, top_cm=0.7,
                width_cm=30.0, height_cm=1.8,
                font_name="Plus Jakarta Sans", font_size_pt=36,
                bold=True, color_rgb=WHITE, alignment=PP_ALIGN.CENTER)

    # Columna izquierda — Resultados
    left_lines = [
        "Resultados",
        "",
        "• SVM con kernel RBF es el mejor clasificador",
        "  (Recall CV=0.959)",
        "• Todos los modelos superan 0.87 de Recall —",
        "  dataset relativamente bien separable",
        "• El tuning mejoró marginalmente —",
        "  defaults de sklearn eran razonables",
        "• Pipeline con StandardScaler interno garantiza",
        "  evaluación libre de data leakage",
    ]
    txb_l = slide.shapes.add_textbox(Cm(1.5), Cm(3.0), Cm(14.5), Cm(13.0))
    tf_l = txb_l.text_frame
    tf_l.word_wrap = True
    for i, line in enumerate(left_lines):
        if i == 0:
            p = tf_l.paragraphs[0]
        else:
            p = tf_l.add_paragraph()
        run = p.add_run()
        run.text = line
        run.font.name = "DM Sans"
        run.font.size = Pt(15 if i == 0 else 13)
        run.font.bold = (i == 0)
        run.font.color.rgb = ACCENT_GREEN if i == 0 else WHITE

    # Columna derecha — Aprendizajes metodológicos
    right_lines = [
        "Aprendizajes metodológicos",
        "",
        "• La elección de métrica define el problema:",
        "  Accuracy hubiera confundido, Recall lo aclaró",
        "• CV estratificado es indispensable",
        "  con clases desbalanceadas",
        "• El análisis train/CV es más informativo",
        "  que el resultado de test para decisiones de diseño",
        "• Separar selección de modelo (CV) de",
        "  evaluación final (test) es no-negociable",
    ]
    txb_r = slide.shapes.add_textbox(Cm(17.0), Cm(3.0), Cm(15.5), Cm(13.0))
    tf_r = txb_r.text_frame
    tf_r.word_wrap = True
    for i, line in enumerate(right_lines):
        if i == 0:
            p = tf_r.paragraphs[0]
        else:
            p = tf_r.add_paragraph()
        run = p.add_run()
        run.text = line
        run.font.name = "DM Sans"
        run.font.size = Pt(15 if i == 0 else 13)
        run.font.bold = (i == 0)
        run.font.color.rgb = BLUE_LIGHT if i == 0 else WHITE

    # Línea divisora vertical
    div = slide.shapes.add_shape(1, Cm(16.3), Cm(3.0), Cm(0.05), Cm(12.0))
    div.fill.solid()
    div.fill.fore_color.rgb = RGBColor(0x33, 0x45, 0x5E)
    div.line.fill.background()

    # Callout final
    add_callout(slide,
                "Un modelo clínico debe optimizar lo que importa: detectar enfermos. La métrica es la hipótesis.",
                left_cm=2.0, top_cm=15.8,
                width_cm=30.0, height_cm=2.0,
                bg_rgb=PRIMARY, border_rgb=BLUE_LIGHT,
                font_size_pt=15, text_color=WHITE, bold=True)

    add_slide_number(slide, 16)
    return slide


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    prs = Presentation()
    prs.slide_width  = SLIDE_W
    prs.slide_height = SLIDE_H

    print("Construyendo slides...")
    builders = [
        build_slide_1,
        build_slide_2,
        build_slide_3,
        build_slide_4,
        build_slide_5,
        build_slide_6,
        build_slide_7,
        build_slide_8,
        build_slide_9,
        build_slide_10,
        build_slide_11,
        build_slide_12,
        build_slide_13,
        build_slide_14,
        build_slide_15,
        build_slide_16,
    ]

    for i, builder in enumerate(builders, start=1):
        print(f"  Slide {i:02d} — {builder.__doc__.strip().split('—')[1].strip() if '—' in (builder.__doc__ or '') else ''}")
        builder(prs)

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    prs.save(OUT_PATH)
    size_kb = os.path.getsize(OUT_PATH) / 1024
    print(f"\nGuardado: {OUT_PATH}")
    print(f"Tamaño: {size_kb:.1f} KB")
    if size_kb > 500:
        print("OK — tamaño razonable (> 500 KB)")
    else:
        print("WARN — tamaño menor a 500 KB (revisar imágenes)")


if __name__ == "__main__":
    main()
