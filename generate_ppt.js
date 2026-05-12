const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ─── CONFIG ───
const OUT_FILE = "outputs/presentacion_clasificacion.pptx";
const IMG_BASE = "outputs";

// ─── PALETA ───
const C = {
  bg_dark: "0F172A",
  bg_light: "F8FAFC",
  primary: "1E40AF",
  accent_red: "DC2626",
  accent_green: "16A34A",
  accent_teal: "0891B2",
  accent_violet: "7C3AED",
  text_dark: "1E293B",
  text_muted: "64748B",
  box_bg: "EFF6FF",
  box_yellow: "FEF3C7",
  box_red: "FEE2E2",
  white: "FFFFFF",
  divider: "CBD5E1",
};

// ─── HELPERS ───
const makeShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.1 });
const px = (pt) => pt; // sizes in points for fontSize

function addSolidBg(slide, color) {
  slide.background = { color };
}

function addBand(slide, color) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.15, h: 5.625,
    fill: { color }, line: { style: "none" }
  });
}

function addHeaderStrip(slide, title, stripColor) {
  // Strip superior ~14% altura = 0.8"
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.75,
    fill: { color: stripColor }, line: { style: "none" }
  });
  slide.addText(title, {
    x: 0.4, y: 0.15, w: 9.2, h: 0.5,
    fontSize: 22, bold: true, color: C.white,
    fontFace: "Calibri", valign: "middle"
  });
}

function addSlideNum(slide, n) {
  slide.addText(String(n), {
    x: 9.0, y: 5.25, w: 0.5, h: 0.2,
    fontSize: 10, color: C.text_muted, align: "right", fontFace: "Calibri"
  });
}

function addCalloutBox(slide, text, opts) {
  const { x, y, w, h, bg, border, fontSize = 13, color = C.text_dark, bold = false } = opts;
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: bg },
    line: border ? { color: border, width: 1.5 } : { style: "none" },
    shadow: makeShadow()
  });
  slide.addText(text, {
    x: x + 0.08, y: y + 0.08, w: w - 0.16, h: h - 0.16,
    fontSize, color, bold, fontFace: "Calibri", valign: "top"
  });
}

function addImageSafe(slide, relPath, x, y, w, h) {
  const p = path.join(IMG_BASE, relPath);
  if (fs.existsSync(p)) {
    slide.addImage({ path: p, x, y, w, h, sizing: { type: "contain", w, h } });
  } else {
    slide.addText("[Imagen no encontrada]", { x, y, w, h, fontSize: 12, color: C.accent_red });
  }
}

// ─── INIT ───
let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "ML ITBA";
pres.title = "Clasificacion Supervisada - Wisconsin Breast Cancer";
pres.subject = "72.75 Aprendizaje Automático";

// ─── SLIDE 1: PORTADA ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_dark);
  // rectángulo decorativo inferior derecha
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.5, y: 3.8, w: 3.5, h: 1.8,
    fill: { color: C.primary },
    line: { style: "none" },
    shadow: { type: "outer", color: "000000", blur: 20, offset: 5, angle: 135, opacity: 0.25 }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.2, y: 4.3, w: 2.8, h: 1.3,
    fill: { color: C.accent_teal },
    line: { style: "none" }
  });
  // supertítulo
  s.addText("72.75 Aprendizaje Automático — ITBA", {
    x: 0.6, y: 1.6, w: 8, h: 0.3,
    fontSize: 14, color: "93C5FD", fontFace: "Calibri"
  });
  // título
  s.addText("Clasificación Supervisada", {
    x: 0.6, y: 2.0, w: 8.5, h: 0.8,
    fontSize: 40, bold: true, color: C.white, fontFace: "Calibri"
  });
  // línea decorativa
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.85, w: 3.5, h: 0.04,
    fill: { color: C.accent_teal }, line: { style: "none" }
  });
  // subtítulo
  s.addText("Detección de Cáncer de Mama — Wisconsin Dataset", {
    x: 0.6, y: 3.05, w: 8.5, h: 0.5,
    fontSize: 22, color: "93C5FD", fontFace: "Calibri"
  });
  // footer
  s.addText("Mayo 2026", {
    x: 0.6, y: 5.05, w: 3, h: 0.2,
    fontSize: 11, color: "94A3B8", fontFace: "Calibri"
  });
}

// ─── SLIDE 2: DATASET ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_light);
  addBand(s, C.accent_teal);
  addHeaderStrip(s, "El Dataset: Wisconsin Diagnostic Breast Cancer", C.primary);
  addSlideNum(s, 2);

  // Bullets izquierda
  s.addText([
    { text: "569 muestras · 30 features originales → 17 seleccionadas tras limpieza", options: { bullet: true, breakLine: true } },
    { text: "Etiqueta binaria: Benigno (B=0) / Maligno (M=1)", options: { bullet: true, breakLine: true } },
    { text: "Features: mediciones del núcleo celular (radio, textura, perímetro, etc.)", options: { bullet: true, breakLine: true } },
    { text: "3 grupos de features: _mean, _se, _worst", options: { bullet: true } }
  ], {
    x: 0.4, y: 1.05, w: 5.4, h: 2.2,
    fontSize: 15, color: C.text_dark, fontFace: "Calibri", valign: "top"
  });

  // Callout derecha
  addCalloutBox(s, "", { x: 6.1, y: 1.05, w: 3.5, h: 2.0, bg: C.box_bg });
  s.addText([
    { text: "B: 357 (62.7%)", options: { color: C.accent_green, bold: true, breakLine: true } },
    { text: "M: 212 (37.3%)", options: { color: C.accent_red, bold: true, breakLine: true } },
    { text: "Dataset desbalanceado → split estratificado obligatorio", options: { color: C.text_muted, fontSize: 12 } }
  ], { x: 6.25, y: 1.18, w: 3.2, h: 1.8, fontSize: 18, fontFace: "Calibri", valign: "top" });

  // Nota inferior
  s.addText("Train: 455 muestras | Test: 114 muestras (80/20 estratificado)", {
    x: 0.4, y: 3.4, w: 9.2, h: 0.3,
    fontSize: 12, color: C.text_muted, fontFace: "Calibri", italic: true
  });
}

// ─── SLIDE 3: PREPROCESAMIENTO ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_light);
  addBand(s, C.accent_violet);
  addHeaderStrip(s, "Pipeline de Preprocesamiento", C.primary);
  addSlideNum(s, 3);

  // Diagrama de flujo horizontal (4 cajas)
  const boxW = 1.75, boxH = 0.75, startX = 0.35, gap = 0.12, yFlow = 1.05;
  const boxes = [
    "Raw Data\n(569×30)",
    "Limpieza &\nFeature Selection\n(569×17)",
    "Train/Test\nSplit 80/20\nestratificado",
    "StandardScaler\ndentro de\nCV/Pipeline"
  ];
  boxes.forEach((txt, i) => {
    const x = startX + i * (boxW + gap + 0.25);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: yFlow, w: boxW, h: boxH,
      fill: { color: C.box_bg }, line: { color: C.primary, width: 1.5 },
      shadow: makeShadow()
    });
    s.addText(txt, { x, y: yFlow + 0.05, w: boxW, h: boxH - 0.1, fontSize: 11, color: C.text_dark, align: "center", valign: "middle", fontFace: "Calibri" });
    if (i < boxes.length - 1) {
      s.addShape(pres.shapes.LINE, {
        x: x + boxW, y: yFlow + boxH / 2, w: gap + 0.25, h: 0,
        line: { color: C.primary, width: 2, arrowTailType: "arrow", arrowHeadType: "arrow" }
      });
      // arrow text
      s.addText("→", { x: x + boxW + gap * 0.3, y: yFlow + boxH / 2 - 0.12, w: 0.3, h: 0.2, fontSize: 16, color: C.primary, align: "center" });
    }
  });

  // Bullets abajo
  s.addText([
    { text: "Eliminación de features correlacionadas (|r| > 0.95): 13 features removidas", options: { bullet: true, breakLine: true } },
    { text: "Eliminación de outliers extremos (IQR × 3)", options: { bullet: true, breakLine: true } },
    { text: "Split 80/20 estratificado → preserva proporción B/M en ambos sets", options: { bullet: true, breakLine: true } },
    { text: "StandardScaler aplicado DENTRO del pipeline → sin data leakage", options: { bullet: true } }
  ], {
    x: 0.5, y: 2.1, w: 9.0, h: 1.4,
    fontSize: 14, color: C.text_dark, fontFace: "Calibri", valign: "top"
  });

  // Callout amarillo
  addCalloutBox(s, "Escalar antes del split contaminaría el test set con información del train. El scaler se ajusta solo sobre el fold de entrenamiento en cada iteración de CV.", {
    x: 0.5, y: 3.65, w: 9.0, h: 0.9, bg: C.box_yellow, border: "F59E0B", fontSize: 13
  });
}

// ─── SLIDE 4: CONTEXTO CLÍNICO ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_light);
  addBand(s, C.accent_red);
  addHeaderStrip(s, "Contexto Clínico: No todas las métricas son iguales", C.primary);
  addSlideNum(s, 4);

  // Izquierda: tabla conceptual 2x2
  const tx = 0.5, ty = 1.1, tw = 3.8, th = 2.6;
  // Fondo tabla
  s.addShape(pres.shapes.RECTANGLE, { x: tx, y: ty, w: tw, h: th, fill: { color: C.white }, line: { color: C.divider, width: 1 } });
  // Celdas
  const cellH = th / 2;
  const cellW = tw / 2;
  // TP
  s.addShape(pres.shapes.RECTANGLE, { x: tx, y: ty, w: cellW, h: cellH, fill: { color: "DCFCE7" }, line: { color: C.divider, width: 1 } });
  s.addText("TP", { x: tx, y: ty, w: cellW, h: 0.35, fontSize: 14, bold: true, color: C.accent_green, align: "center", valign: "middle" });
  s.addText("Maligno → Maligno", { x: tx, y: ty + 0.3, w: cellW, h: 0.5, fontSize: 12, color: C.text_dark, align: "center", valign: "middle" });
  // FP
  s.addShape(pres.shapes.RECTANGLE, { x: tx + cellW, y: ty, w: cellW, h: cellH, fill: { color: "FFEDD5" }, line: { color: C.divider, width: 1 } });
  s.addText("FP", { x: tx + cellW, y: ty, w: cellW, h: 0.35, fontSize: 14, bold: true, color: "EA580C", align: "center", valign: "middle" });
  s.addText("Benigno → Maligno", { x: tx + cellW, y: ty + 0.3, w: cellW, h: 0.5, fontSize: 12, color: C.text_dark, align: "center", valign: "middle" });
  // FN (más grande visualmente - fondo más intenso)
  s.addShape(pres.shapes.RECTANGLE, { x: tx, y: ty + cellH, w: cellW, h: cellH, fill: { color: "FECACA" }, line: { color: C.divider, width: 1 } });
  s.addText("FN", { x: tx, y: ty + cellH, w: cellW, h: 0.35, fontSize: 16, bold: true, color: C.accent_red, align: "center", valign: "middle" });
  s.addText("Maligno → Benigno", { x: tx, y: ty + cellH + 0.3, w: cellW, h: 0.5, fontSize: 12, color: C.text_dark, align: "center", valign: "middle" });
  s.addText("EL PELIGROSO", { x: tx, y: ty + cellH + 0.7, w: cellW, h: 0.3, fontSize: 11, bold: true, color: C.accent_red, align: "center", valign: "middle" });
  // TN
  s.addShape(pres.shapes.RECTANGLE, { x: tx + cellW, y: ty + cellH, w: cellW, h: cellH, fill: { color: "DCFCE7" }, line: { color: C.divider, width: 1 } });
  s.addText("TN", { x: tx + cellW, y: ty + cellH, w: cellW, h: 0.35, fontSize: 14, bold: true, color: C.accent_green, align: "center", valign: "middle" });
  s.addText("Benigno → Benigno", { x: tx + cellW, y: ty + cellH + 0.3, w: cellW, h: 0.5, fontSize: 12, color: C.text_dark, align: "center", valign: "middle" });

  // Derecha: bullets
  s.addText([
    { text: "FN: tumor maligno clasificado como benigno → paciente no recibe tratamiento → consecuencia grave", options: { bullet: true, breakLine: true } },
    { text: "FP: benigno clasificado como maligno → biopsia innecesaria → costoso pero no fatal", options: { bullet: true, breakLine: true } },
    { text: "Conclusión: minimizar FN = maximizar Sensibilidad (Recall)", options: { bullet: true, breakLine: true } }
  ], {
    x: 4.6, y: 1.1, w: 5.0, h: 2.0,
    fontSize: 15, color: C.text_dark, fontFace: "Calibri", valign: "top"
  });

  // Callout rojo
  addCalloutBox(s, "En diagnóstico oncológico, un FN puede costar una vida. Optimizamos Recall.", {
    x: 4.6, y: 3.3, w: 5.0, h: 0.7, bg: C.box_red, border: C.accent_red, fontSize: 14, bold: true, color: C.accent_red
  });
}

// ─── SLIDE 5: MÉTRICAS ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_light);
  addBand(s, C.accent_teal);
  addHeaderStrip(s, "Métricas clave — Definiciones", C.primary);
  addSlideNum(s, 5);

  const cards = [
    { title: "Sensibilidad / Recall (TPR)", formula: "TP / (TP + FN)", desc: "¿De todos los enfermos, cuántos detectamos?", bg: "F0FDF4", border: C.accent_green, badge: "MÉTRICA PRINCIPAL", badgeColor: C.accent_green },
    { title: "Especificidad (TNR)", formula: "TN / (TN + FP)", desc: "¿De todos los sanos, cuántos identificamos correctamente?", bg: C.box_bg, border: C.primary, badge: null },
    { title: "VPP (Precisión)", formula: "TP / (TP + FP)", desc: "¿De los clasificados como enfermos, cuántos lo son realmente?", bg: C.box_bg, border: C.primary, badge: null },
    { title: "VPN", formula: "TN / (TN + FN)", desc: "¿De los clasificados como sanos, cuántos lo son realmente?", bg: C.box_bg, border: C.primary, badge: null },
  ];

  const cols = 2, cardW = 4.2, cardH = 1.55, startX = 0.6, startY = 1.0, gapX = 0.4, gapY = 0.25;
  cards.forEach((c, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: cardH,
      fill: { color: c.bg }, line: { color: c.border, width: 2 },
      shadow: makeShadow()
    });
    let txtY = y + 0.1;
    if (c.badge) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.1, y: txtY, w: 1.6, h: 0.22,
        fill: { color: c.badgeColor }, line: { style: "none" }
      });
      s.addText(c.badge, { x: x + 0.1, y: txtY, w: 1.6, h: 0.22, fontSize: 9, color: C.white, align: "center", valign: "middle", bold: true });
      txtY += 0.28;
    }
    s.addText(c.title, { x: x + 0.1, y: txtY, w: cardW - 0.2, h: 0.3, fontSize: 14, bold: true, color: C.text_dark, fontFace: "Calibri" });
    s.addText(c.formula, { x: x + 0.1, y: txtY + 0.32, w: cardW - 0.2, h: 0.25, fontSize: 13, color: C.accent_teal, fontFace: "Consolas", bold: true });
    s.addText(c.desc, { x: x + 0.1, y: txtY + 0.6, w: cardW - 0.2, h: 0.6, fontSize: 12, color: C.text_muted, fontFace: "Calibri" });
  });

  s.addText("Recall y Especificidad están en trade-off — aumentar uno tiende a bajar el otro", {
    x: 0.6, y: 4.35, w: 9, h: 0.25, fontSize: 12, color: C.text_muted, fontFace: "Calibri", italic: true
  });
}

// ─── SLIDE 6: ROC-AUC ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_light);
  addBand(s, C.accent_teal);
  addHeaderStrip(s, "ROC-AUC y métricas complementarias", C.primary);
  addSlideNum(s, 6);

  // Izquierda
  s.addText([
    { text: "ROC = curva TPR vs FPR para todos los umbrales posibles", options: { bullet: true, breakLine: true } },
    { text: "AUC = área bajo la curva = capacidad discriminativa general", options: { bullet: true, breakLine: true } },
    { text: '"Threshold-free" → útil para comparar modelos sin fijar umbral', options: { bullet: true, breakLine: true } },
    { text: "Segunda métrica de ranking: desempata entre modelos con recall similar", options: { bullet: true } }
  ], {
    x: 0.4, y: 1.05, w: 3.6, h: 2.2,
    fontSize: 14, color: C.text_dark, fontFace: "Calibri", valign: "top"
  });

  // Tabla derecha
  const rows = [
    ["Métrica", "Por qué no es la principal"],
    ["Accuracy", "Engañosa con clases desbalanceadas (modelo trivial = 62.7%)"],
    ["F1-Score", "Combina Recall + Precisión por igual — en oncología Recall > Precisión"],
    ["Precisión (VPP)", "Penaliza FP, no FN — prioridad incorrecta para este dominio"],
    ["MCC", "Robusto pero difícil de interpretar para audiencia clínica"]
  ];
  const tblX = 4.3, tblY = 1.05, tblW = 5.2, tblH = 2.4;
  const headerFill = { color: C.primary };
  const rowFill = { color: C.white };
  const altFill = { color: C.box_bg };

  s.addTable(rows.map((r, i) => r.map((cell, j) => ({
    text: cell,
    options: {
      fill: i === 0 ? headerFill : (i % 2 === 0 ? altFill : rowFill),
      color: i === 0 ? C.white : C.text_dark,
      bold: i === 0 || j === 0,
      fontSize: 12,
      fontFace: "Calibri"
    }
  }))), {
    x: tblX, y: tblY, w: tblW, h: tblH,
    border: { pt: 0.5, color: C.divider },
    colW: [1.8, 3.4], fontFace: "Calibri"
  });

  addCalloutBox(s, "Reportamos F1 y Accuracy como métricas secundarias para completitud.", {
    x: 0.4, y: 3.6, w: 9.1, h: 0.6, bg: C.box_bg, border: C.primary, fontSize: 13
  });
}

// ─── SLIDE 7: MODELOS ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_light);
  addBand(s, C.primary);
  addHeaderStrip(s, "5 Clasificadores — Características", C.primary);
  addSlideNum(s, 7);

  const rows = [
    ["Modelo", "Tipo", "Tendencia natural"],
    ["Naive Bayes", "Generativo, paramétrico", "Underfitting (asume independencia entre features)"],
    ["LDA", "Discriminativo lineal", "Underfitting (frontera lineal, asume Gaussiana)"],
    ["SVM (RBF)", "Discriminativo, kernel", "Overfitting si C alto"],
    ["KNN", "Basado en instancias", "Depende de k: bajo k → overfit"],
    ["Random Forest", "Ensemble (bagging)", "Overfit si max_depth sin límite"]
  ];

  s.addTable(rows.map((r, i) => r.map((cell) => ({
    text: cell,
    options: {
      fill: i === 0 ? { color: C.primary } : (i % 2 === 0 ? { color: C.box_bg } : { color: C.white }),
      color: i === 0 ? C.white : C.text_dark,
      bold: i === 0,
      fontSize: 13,
      fontFace: "Calibri"
    }
  }))), {
    x: 0.5, y: 1.05, w: 9.0, h: 2.6,
    border: { pt: 0.5, color: C.divider },
    colW: [2.2, 2.6, 4.2], fontFace: "Calibri"
  });

  s.addText("CV estratificado 5-fold en todos los modelos. Los resultados son de validación — el test set NO fue tocado.", {
    x: 0.5, y: 3.85, w: 9.0, h: 0.3,
    fontSize: 12, color: C.text_muted, fontFace: "Calibri", italic: true
  });
}

// ─── SLIDE 8: CV BASELINE ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_light);
  addBand(s, C.primary);
  addHeaderStrip(s, "Paso 1: Baseline con hiperparámetros por defecto", C.primary);
  addSlideNum(s, 8);

  addImageSafe(s, "cv_baseline_comparison.png", 1.0, 1.0, 8.0, 2.8);

  s.addText([
    { text: "SVM lidera: Recall=0.959, ROC-AUC=0.995", options: { bullet: true, breakLine: true } },
    { text: "NB y KNN empatan: Recall=0.906", options: { bullet: true, breakLine: true } },
    { text: "LDA más bajo: Recall=0.876 — frontera lineal insuficiente", options: { bullet: true } }
  ], {
    x: 0.5, y: 3.95, w: 9.0, h: 1.0,
    fontSize: 14, color: C.text_dark, fontFace: "Calibri", valign: "top"
  });

  addCalloutBox(s, "Todos los resultados son de validación cruzada 5-fold — test set intacto", {
    x: 0.5, y: 4.9, w: 9.0, h: 0.45, bg: C.box_bg, border: C.primary, fontSize: 12
  });
}

// ─── SLIDE 9: BIAS-VARIANZA ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_light);
  addBand(s, C.accent_violet);
  addHeaderStrip(s, "Análisis Bias-Varianza: Train vs CV", C.primary);
  addSlideNum(s, 9);

  addImageSafe(s, "overfitting_train_vs_cv.png", 1.0, 0.95, 8.0, 2.6);

  s.addText([
    { text: "SVM: gap mínimo → bien regularizado con C=1, kernel RBF", options: { bullet: true, breakLine: true } },
    { text: "RF: gap Recall ≈ 0.07 → overfitting leve, árboles memorizan train", options: { bullet: true, breakLine: true } },
    { text: "NB/LDA: gap chico pero valores moderados → underfitting por simplificaciones del modelo", options: { bullet: true, breakLine: true } },
    { text: "KNN: gap moderado → sensible al valor de k", options: { bullet: true } }
  ], {
    x: 0.5, y: 3.7, w: 9.0, h: 1.3,
    fontSize: 14, color: C.text_dark, fontFace: "Calibri", valign: "top"
  });
}

// ─── SLIDE 10: GAPS ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_light);
  addBand(s, C.accent_violet);
  addHeaderStrip(s, "Gap Train − CV por modelo", C.primary);
  addSlideNum(s, 10);

  addImageSafe(s, "overfitting_gaps.png", 1.0, 1.0, 8.0, 2.8);

  s.addText([
    { text: "Umbral overfitting = 0.05 (línea roja en el gráfico)", options: { bullet: true, breakLine: true } },
    { text: "RF cruza umbral en Recall → max_depth debe controlarse", options: { bullet: true, breakLine: true } },
    { text: "SVM y NB por debajo del umbral → comportamiento estable", options: { bullet: true } }
  ], {
    x: 0.5, y: 3.95, w: 9.0, h: 1.0,
    fontSize: 14, color: C.text_dark, fontFace: "Calibri", valign: "top"
  });

  s.addText("Gap bajo + CV alto = buen trade-off sesgo-varianza", {
    x: 0.5, y: 4.95, w: 9.0, h: 0.25,
    fontSize: 12, color: C.text_muted, fontFace: "Calibri", italic: true
  });
}

// ─── SLIDE 11: CURVAS 1D ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_light);
  addBand(s, C.accent_green);
  addHeaderStrip(s, "Tuning 1D: Curvas de Validación", C.primary);
  addSlideNum(s, 11);

  const imgs = [
    { path: "svm/val_curve_C (regularización).png", cap: "SVM: C óptimo ~1–10; C muy alto → overfit" },
    { path: "knn/val_curve_k (número de vecinos).png", cap: "KNN: k óptimo 5–9; k=1 overfittea, k grande underfittea" },
    { path: "rf/val_curve_Profundidad máxima del árbol.png", cap: "RF: max_depth ~6–10 equilibra; sin límite → overfit" }
  ];
  const imgW = 2.8, imgH = 2.3, gap = 0.2, startX = 0.6, yImg = 1.0;
  imgs.forEach((img, i) => {
    const x = startX + i * (imgW + gap);
    addImageSafe(s, img.path, x, yImg, imgW, imgH);
    s.addText(img.cap, {
      x, y: yImg + imgH + 0.1, w: imgW, h: 0.5,
      fontSize: 11, color: C.text_muted, align: "center", fontFace: "Calibri"
    });
  });
}

// ─── SLIDE 12: HEATMAPS 2D ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_light);
  addBand(s, C.accent_green);
  addHeaderStrip(s, "Tuning 2D: GridSearchCV — Heatmaps", C.primary);
  addSlideNum(s, 12);

  const imgs = [
    { path: "svm/hyperparam_grid.png", cap: "SVM: mejor C=3.16, kernel=rbf → Recall=0.953" },
    { path: "knn/hyperparam_grid.png", cap: "KNN: mejor k=7, weights=uniform → Recall=0.924" },
    { path: "rf/hyperparam_grid.png", cap: "RF: mejor max_depth=6, n_estimators=100 → Recall=0.929" }
  ];
  const imgW = 2.8, imgH = 2.3, gap = 0.2, startX = 0.6, yImg = 1.0;
  imgs.forEach((img, i) => {
    const x = startX + i * (imgW + gap);
    addImageSafe(s, img.path, x, yImg, imgW, imgH);
    s.addText(img.cap, {
      x, y: yImg + imgH + 0.1, w: imgW, h: 0.5,
      fontSize: 11, color: C.text_muted, align: "center", fontFace: "Calibri"
    });
  });
}

// ─── SLIDE 13: IMPACTO TUNING ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_light);
  addBand(s, C.accent_green);
  addHeaderStrip(s, "Impacto del Tuning de Hiperparámetros", C.primary);
  addSlideNum(s, 13);

  addImageSafe(s, "before_after_tuning.png", 1.5, 1.0, 7.0, 2.6);

  s.addText([
    { text: "SVM: sin cambio — C=1 ya era el default óptimo, confirma estabilidad", options: { bullet: true, breakLine: true } },
    { text: "RF: leve mejora en Recall (+0.005) con n_estimators=200", options: { bullet: true, breakLine: true } },
    { text: "LDA: mejora ROC-AUC con shrinkage=0.1 (solver lsqr)", options: { bullet: true, breakLine: true } },
    { text: "KNN: sin mejora significativa", options: { bullet: true } }
  ], {
    x: 0.5, y: 3.75, w: 9.0, h: 1.3,
    fontSize: 14, color: C.text_dark, fontFace: "Calibri", valign: "top"
  });
}

// ─── SLIDE 14: SELECCIÓN MODELO FINAL ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_dark);
  addSlideNum(s, 14);

  s.addText("Selección del Modelo Final", {
    x: 0.6, y: 0.5, w: 8.5, h: 0.6,
    fontSize: 32, bold: true, color: C.white, fontFace: "Calibri"
  });

  // Callout principal
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.2, w: 8.8, h: 1.3,
    fill: { color: "1E3A8A" }, line: { color: "60A5FA", width: 2 },
    shadow: makeShadow()
  });
  s.addText([
    { text: "El modelo se selecciona en base a los resultados de validación cruzada — NO de test.", options: { bold: true, breakLine: true } },
    { text: "El test set se evalúa UNA SOLA VEZ, sobre el modelo ya elegido. Usarlo para selección introduce sesgo optimista.", options: { breakLine: true } }
  ], {
    x: 0.75, y: 1.3, w: 8.5, h: 1.15,
    fontSize: 14, color: C.white, fontFace: "Calibri", valign: "top"
  });

  // Ranking
  s.addText("Ranking por Recall CV tuned:", {
    x: 0.6, y: 2.75, w: 5, h: 0.3,
    fontSize: 16, bold: true, color: C.accent_teal, fontFace: "Calibri"
  });
  const ranking = [
    "1. SVM — 0.959    ✓ seleccionado",
    "2. RF — 0.929",
    "3. KNN / NB — 0.906",
    "4. LDA — 0.882"
  ];
  ranking.forEach((line, i) => {
    s.addText(line, {
      x: 0.8, y: 3.15 + i * 0.35, w: 5, h: 0.3,
      fontSize: 15, color: C.white, fontFace: "Calibri"
    });
  });

  s.addText("SVM con kernel RBF, C=1 → mejor Recall CV Y mejor ROC-AUC CV", {
    x: 0.6, y: 4.8, w: 8.8, h: 0.3,
    fontSize: 13, color: "93C5FD", fontFace: "Calibri", italic: true
  });
}

// ─── SLIDE 15: EVALUACIÓN TEST SVM ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_light);
  addBand(s, C.accent_red);
  addHeaderStrip(s, "Evaluación en Test — SVM (RBF, C=1)", C.primary);
  addSlideNum(s, 15);

  addImageSafe(s, "svm/confusion_matrix_test.png", 0.5, 1.0, 4.5, 2.6);
  addImageSafe(s, "svm/roc_curve_test.png", 5.2, 1.0, 4.3, 2.6);

  // Tabla métricas
  const metricRows = [
    ["Recall", "ROC-AUC", "F1", "Accuracy"],
    ["0.929", "0.995", "0.940", "0.956"]
  ];
  s.addTable(metricRows.map((r, i) => r.map((cell) => ({
    text: cell,
    options: {
      fill: i === 0 ? { color: C.accent_red } : { color: C.white },
      color: i === 0 ? C.white : C.text_dark,
      bold: i === 0 || i === 1,
      fontSize: 16,
      align: "center",
      fontFace: "Calibri"
    }
  }))), {
    x: 2.5, y: 3.75, w: 5.0, h: 0.7,
    border: { pt: 0.5, color: C.divider },
    colW: [1.25, 1.25, 1.25, 1.25], fontFace: "Calibri"
  });

  s.addText([
    { text: "Recall test (0.929) ≈ Recall CV (0.959) → generaliza bien, sin overfit significativo", options: { bullet: true, breakLine: true } },
    { text: "Solo 3 FN (tumores malignos no detectados) de 42 muestras malignas", options: { bullet: true, breakLine: true } },
    { text: "ROC-AUC = 0.995 → discriminación casi perfecta", options: { bullet: true } }
  ], {
    x: 0.5, y: 4.55, w: 9.0, h: 0.8,
    fontSize: 13, color: C.text_dark, fontFace: "Calibri", valign: "top"
  });
}

// ─── SLIDE 16: CONCLUSIONES ───
{
  let s = pres.addSlide();
  addSolidBg(s, C.bg_dark);
  addSlideNum(s, 16);

  s.addText("Conclusiones", {
    x: 0.6, y: 0.45, w: 8, h: 0.55,
    fontSize: 32, bold: true, color: C.white, fontFace: "Calibri"
  });

  // Columna izquierda
  s.addText("Resultados", {
    x: 0.6, y: 1.1, w: 4.3, h: 0.3,
    fontSize: 16, bold: true, color: C.accent_teal, fontFace: "Calibri"
  });
  s.addText([
    { text: "SVM con kernel RBF es el mejor clasificador (Recall CV=0.959)", options: { bullet: true, breakLine: true } },
    { text: "Todos los modelos superan 0.87 de Recall — dataset relativamente bien separable", options: { bullet: true, breakLine: true } },
    { text: "El tuning mejoró marginalmente — defaults de sklearn eran razonables", options: { bullet: true, breakLine: true } },
    { text: "Pipeline con StandardScaler interno garantiza evaluación libre de data leakage", options: { bullet: true } }
  ], {
    x: 0.6, y: 1.45, w: 4.3, h: 2.2,
    fontSize: 13, color: C.white, fontFace: "Calibri", valign: "top"
  });

  // Columna derecha
  s.addText("Aprendizajes metodológicos", {
    x: 5.3, y: 1.1, w: 4.3, h: 0.3,
    fontSize: 16, bold: true, color: C.accent_teal, fontFace: "Calibri"
  });
  s.addText([
    { text: "La elección de métrica define el problema: Accuracy hubiera confundido, Recall lo aclaró", options: { bullet: true, breakLine: true } },
    { text: "CV estratificado es indispensable con clases desbalanceadas", options: { bullet: true, breakLine: true } },
    { text: "El análisis train/CV es más informativo que el resultado de test para decisiones de diseño", options: { bullet: true, breakLine: true } },
    { text: "Separar selección de modelo (CV) de evaluación final (test) es no-negociable", options: { bullet: true } }
  ], {
    x: 5.3, y: 1.45, w: 4.3, h: 2.2,
    fontSize: 13, color: C.white, fontFace: "Calibri", valign: "top"
  });

  // Callout final
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.9, w: 8.4, h: 0.9,
    fill: { color: C.primary }, line: { style: "none" },
    shadow: makeShadow()
  });
  s.addText("Un modelo clínico debe optimizar lo que importa: detectar enfermos. La métrica es la hipótesis.", {
    x: 0.95, y: 4.05, w: 8.1, h: 0.7,
    fontSize: 15, bold: true, color: C.white, fontFace: "Calibri", align: "center", valign: "middle"
  });
}

// ─── WRITE ───
pres.writeFile({ fileName: OUT_FILE })
  .then(() => console.log("OK:", OUT_FILE))
  .catch((e) => { console.error("ERROR:", e); process.exit(1); });
