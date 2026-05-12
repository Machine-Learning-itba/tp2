const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const OUT_FILE = "outputs/presentacion_clasificacion_v2.pptx";
const IMG_BASE = "outputs";

const C = {
  slate900: "0F172A",
  slate800: "1E293B",
  slate700: "334155",
  slate100: "F1F5F9",
  blue: "2563EB",
  blueDark: "1D4ED8",
  cyan: "06B6D4",
  rose: "F43F5E",
  emerald: "10B981",
  amber: "F59E0B",
  white: "FFFFFF",
  muted: "64748B",
};

const makeShadow = (opacity = 0.12) => ({
  type: "outer", color: "000000", blur: 12, offset: 3, angle: 135, opacity
});

function addImageSafe(slide, relPath, x, y, w, h) {
  const p = path.join(IMG_BASE, relPath);
  if (fs.existsSync(p)) {
    slide.addImage({ path: p, x, y, w, h, sizing: { type: "contain", w, h } });
  } else {
    slide.addText("[img]", { x, y, w, h, fontSize: 10, color: C.rose });
  }
}

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "ML ITBA";
pres.title = "Clasificacion Supervisada";

// ─── SLIDE 1 ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate900 };
  // forma geométrica grande derecha
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 0, w: 4.2, h: 5.625,
    fill: { color: C.blue }, line: { style: "none" }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.5, y: 2.5, w: 2.5, h: 3.125,
    fill: { color: C.cyan }, line: { style: "none" }
  });
  s.addShape(pres.shapes.OVAL, {
    x: 6.2, y: 3.8, w: 1.6, h: 1.6,
    fill: { color: C.slate800 }, line: { style: "none" }
  });

  s.addText("72.75 Aprendizaje Automático — ITBA", {
    x: 0.5, y: 1.4, w: 5, h: 0.3, fontSize: 13, color: C.cyan, fontFace: "Calibri"
  });
  s.addText("Clasificación", {
    x: 0.5, y: 1.75, w: 5.5, h: 0.8, fontSize: 52, bold: true, color: C.white, fontFace: "Calibri"
  });
  s.addText("Supervisada", {
    x: 0.5, y: 2.5, w: 5.5, h: 0.8, fontSize: 52, bold: true, color: C.cyan, fontFace: "Calibri"
  });
  s.addText("Detección de Cáncer de Mama — Wisconsin Dataset", {
    x: 0.5, y: 3.45, w: 5.5, h: 0.4, fontSize: 18, color: "94A3B8", fontFace: "Calibri"
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.95, w: 1.8, h: 0.05,
    fill: { color: C.cyan }, line: { style: "none" }
  });
}

// ─── SLIDE 2: DATASET ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate100 };
  // big numbers callout style
  s.addText("Wisconsin Breast Cancer", {
    x: 0.5, y: 0.4, w: 6, h: 0.5, fontSize: 28, bold: true, color: C.slate900, fontFace: "Calibri"
  });
  s.addText("Dataset", {
    x: 0.5, y: 0.85, w: 6, h: 0.4, fontSize: 28, bold: true, color: C.blue, fontFace: "Calibri"
  });

  // stat boxes
  const stats = [
    { label: "Muestras", val: "569", color: C.blue },
    { label: "Features", val: "17", color: C.cyan },
    { label: "Benigno", val: "357", color: C.emerald },
    { label: "Maligno", val: "212", color: C.rose }
  ];
  stats.forEach((st, i) => {
    const x = 0.5 + i * 2.2;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.5, w: 1.9, h: 1.4,
      fill: { color: C.white }, line: { style: "none" },
      shadow: makeShadow(0.08)
    });
    s.addText(st.val, {
      x, y: 1.55, w: 1.9, h: 0.7,
      fontSize: 36, bold: true, color: st.color, align: "center", valign: "middle", fontFace: "Calibri"
    });
    s.addText(st.label, {
      x, y: 2.25, w: 1.9, h: 0.4,
      fontSize: 12, color: C.muted, align: "center", valign: "middle", fontFace: "Calibri"
    });
  });

  s.addText([
    { text: "30 features originales → 17 tras eliminar correlaciones (|r| > 0.95)", options: { bullet: true, breakLine: true } },
    { text: "Etiqueta binaria: Benigno (B=0) / Maligno (M=1)", options: { bullet: true, breakLine: true } },
    { text: "Mediciones del núcleo celular: radio, textura, perímetro, área, suavidad, etc.", options: { bullet: true, breakLine: true } },
    { text: "Train 455 | Test 114 — split 80/20 estratificado", options: { bullet: true } }
  ], {
    x: 0.5, y: 3.2, w: 9, h: 1.5,
    fontSize: 15, color: C.slate800, fontFace: "Calibri", valign: "top"
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.85, w: 9, h: 0.55,
    fill: { color: C.slate900 }, line: { style: "none" }
  });
  s.addText("Dataset desbalanceado → split estratificado obligatorio", {
    x: 0.6, y: 4.9, w: 8.8, h: 0.45,
    fontSize: 13, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", bold: true
  });
}

// ─── SLIDE 3: PREPROCESAMIENTO ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate100 };
  s.addText("Pipeline de", {
    x: 0.5, y: 0.35, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.slate900, fontFace: "Calibri"
  });
  s.addText("Preprocesamiento", {
    x: 0.5, y: 0.75, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.blue, fontFace: "Calibri"
  });

  // timeline vertical
  const steps = [
    { n: "01", title: "Raw Data", desc: "569 × 30" },
    { n: "02", title: "Limpieza", desc: "Eliminar |r|>0.95 → 17 features" },
    { n: "03", title: "Split", desc: "80/20 estratificado" },
    { n: "04", title: "Scaling", desc: "StandardScaler dentro del pipeline" }
  ];
  steps.forEach((step, i) => {
    const x = 0.5 + i * 2.2;
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.55, y: 1.5, w: 0.7, h: 0.7,
      fill: { color: C.blue }, line: { style: "none" }
    });
    s.addText(step.n, {
      x: x + 0.55, y: 1.5, w: 0.7, h: 0.7,
      fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri"
    });
    if (i < steps.length - 1) {
      s.addShape(pres.shapes.LINE, {
        x: x + 1.25, y: 1.85, w: 1.0, h: 0,
        line: { color: C.blue, width: 2 }
      });
    }
    s.addText(step.title, {
      x, y: 2.4, w: 1.9, h: 0.3,
      fontSize: 14, bold: true, color: C.slate900, align: "center", fontFace: "Calibri"
    });
    s.addText(step.desc, {
      x, y: 2.7, w: 1.9, h: 0.6,
      fontSize: 11, color: C.muted, align: "center", fontFace: "Calibri"
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.65, w: 9, h: 1.0,
    fill: { color: "FEF3C7" }, line: { color: C.amber, width: 1.5 },
    shadow: makeShadow(0.06)
  });
  s.addText("⚠  Escalar antes del split contaminaría el test set con información del train. El scaler se ajusta SOLO sobre el fold de entrenamiento en cada iteración de CV.", {
    x: 0.7, y: 3.8, w: 8.6, h: 0.8,
    fontSize: 14, color: "92400E", fontFace: "Calibri", valign: "middle"
  });
}

// ─── SLIDE 4: CONTEXTO CLÍNICO ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate900 };

  s.addText("Contexto", {
    x: 0.5, y: 0.5, w: 5, h: 0.5, fontSize: 28, bold: true, color: C.white, fontFace: "Calibri"
  });
  s.addText("Clínico", {
    x: 0.5, y: 0.95, w: 5, h: 0.5, fontSize: 28, bold: true, color: C.rose, fontFace: "Calibri"
  });

  // 4 big conceptual blocks
  const blocks = [
    { label: "TP", sub: "Maligno → Maligno", color: C.emerald },
    { label: "FP", sub: "Benigno → Maligno", color: C.amber },
    { label: "FN", sub: "Maligno → Benigno", color: C.rose, big: true },
    { label: "TN", sub: "Benigno → Benigno", color: C.emerald }
  ];
  blocks.forEach((b, i) => {
    const x = 0.5 + i * 2.2;
    const h = b.big ? 1.8 : 1.4;
    const y = b.big ? 1.8 : 2.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 1.9, h,
      fill: { color: C.slate800 }, line: { color: b.color, width: 2 },
      shadow: makeShadow(0.15)
    });
    s.addText(b.label, {
      x, y: y + 0.1, w: 1.9, h: 0.5,
      fontSize: b.big ? 28 : 22, bold: true, color: b.color, align: "center", valign: "middle", fontFace: "Calibri"
    });
    s.addText(b.sub, {
      x, y: y + 0.65, w: 1.9, h: 0.5,
      fontSize: 12, color: "CBD5E1", align: "center", valign: "middle", fontFace: "Calibri"
    });
    if (b.big) {
      s.addText("EL PELIGROSO", {
        x, y: y + 1.15, w: 1.9, h: 0.3,
        fontSize: 10, bold: true, color: C.rose, align: "center", valign: "middle", fontFace: "Calibri"
      });
    }
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.0, w: 9, h: 1.2,
    fill: { color: "450A0A" }, line: { color: C.rose, width: 1.5 }
  });
  s.addText([
    { text: "FN = tumor maligno no detectado → paciente sin tratamiento", options: { breakLine: true } },
    { text: "FP = biopsia innecesaria → costoso, no fatal", options: { breakLine: true } },
    { text: "Minimizar FN = maximizar Recall. En oncología, un FN puede costar una vida.", options: {} }
  ], {
    x: 0.7, y: 4.1, w: 8.6, h: 1.0,
    fontSize: 14, color: "FCA5A5", fontFace: "Calibri", valign: "top"
  });
}

// ─── SLIDE 5: MÉTRICAS ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate100 };
  s.addText("Métricas", {
    x: 0.5, y: 0.35, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.slate900, fontFace: "Calibri"
  });
  s.addText("Clave", {
    x: 0.5, y: 0.75, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.blue, fontFace: "Calibri"
  });

  const cards = [
    { title: "Recall / TPR", formula: "TP / (TP + FN)", q: "¿De todos los enfermos, cuántos detectamos?", bg: "ECFDF5", border: C.emerald, badge: "PRINCIPAL" },
    { title: "Especificidad / TNR", formula: "TN / (TN + FP)", q: "¿De todos los sanos, cuántos identificamos?", bg: "EFF6FF", border: C.blue, badge: null },
    { title: "Precisión / VPP", formula: "TP / (TP + FP)", q: "¿De los clasificados como enfermos, cuántos lo son?", bg: "EFF6FF", border: C.blue, badge: null },
    { title: "VPN", formula: "TN / (TN + FN)", q: "¿De los clasificados como sanos, cuántos lo son?", bg: "EFF6FF", border: C.blue, badge: null }
  ];
  cards.forEach((c, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 4.5, y = 1.4 + row * 1.7;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.3, h: 1.5,
      fill: { color: c.bg }, line: { color: c.border, width: 2 },
      shadow: makeShadow(0.06)
    });
    if (c.badge) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.1, y: y + 0.1, w: 1.3, h: 0.2,
        fill: { color: c.border }, line: { style: "none" }
      });
      s.addText(c.badge, {
        x: x + 0.1, y: y + 0.1, w: 1.3, h: 0.2,
        fontSize: 9, color: C.white, align: "center", valign: "middle", bold: true
      });
    }
    s.addText(c.title, {
      x: x + 0.1, y: y + (c.badge ? 0.4 : 0.15), w: 4.1, h: 0.3,
      fontSize: 15, bold: true, color: C.slate900, fontFace: "Calibri"
    });
    s.addText(c.formula, {
      x: x + 0.1, y: y + (c.badge ? 0.72 : 0.47), w: 4.1, h: 0.25,
      fontSize: 14, color: C.cyan, fontFace: "Consolas", bold: true
    });
    s.addText(c.q, {
      x: x + 0.1, y: y + (c.badge ? 1.0 : 0.75), w: 4.1, h: 0.4,
      fontSize: 12, color: C.muted, fontFace: "Calibri"
    });
  });

  s.addText("Recall y Especificidad están en trade-off", {
    x: 0.5, y: 4.75, w: 9, h: 0.25,
    fontSize: 12, color: C.muted, fontFace: "Calibri", italic: true
  });
}

// ─── SLIDE 6: ROC-AUC ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate100 };
  s.addText("ROC-AUC", {
    x: 0.5, y: 0.35, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.slate900, fontFace: "Calibri"
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 3.8, h: 3.6,
    fill: { color: C.white }, line: { style: "none" },
    shadow: makeShadow(0.06)
  });
  s.addText("ROC-AUC", {
    x: 0.7, y: 1.25, w: 3.4, h: 0.35,
    fontSize: 18, bold: true, color: C.blue, fontFace: "Calibri"
  });
  s.addText([
    { text: "Curva TPR vs FPR para todos los umbrales", options: { bullet: true, breakLine: true } },
    { text: "AUC = capacidad discriminativa general", options: { bullet: true, breakLine: true } },
    { text: "Threshold-free: compara modelos sin fijar umbral", options: { bullet: true, breakLine: true } },
    { text: "Segunda métrica de ranking para desempatar", options: { bullet: true } }
  ], {
    x: 0.7, y: 1.7, w: 3.4, h: 2.2,
    fontSize: 14, color: C.slate800, fontFace: "Calibri", valign: "top"
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.6, y: 1.1, w: 4.9, h: 3.6,
    fill: { color: C.white }, line: { style: "none" },
    shadow: makeShadow(0.06)
  });
  s.addText("Métricas descartadas", {
    x: 4.8, y: 1.25, w: 4.5, h: 0.35,
    fontSize: 18, bold: true, color: C.slate900, fontFace: "Calibri"
  });
  const rows = [
    ["Métrica", "Por qué no"],
    ["Accuracy", "Engañosa con clases desbalanceadas"],
    ["F1-Score", "Combina Recall + Precision por igual"],
    ["Precision (VPP)", "Penaliza FP, no FN → prioridad incorrecta"],
    ["MCC", "Robusto pero difícil de interpretar"]
  ];
  s.addTable(rows.map((r, i) => r.map((cell) => ({
    text: cell,
    options: {
      fill: i === 0 ? { color: C.slate900 } : (i % 2 === 1 ? { color: C.slate100 } : { color: C.white }),
      color: i === 0 ? C.white : C.slate800,
      bold: i === 0 || (i > 0 && cell === r[0]),
      fontSize: 12,
      fontFace: "Calibri"
    }
  }))), {
    x: 4.8, y: 1.7, w: 4.5, h: 2.8,
    border: { pt: 0.5, color: "E2E8F0" },
    colW: [1.8, 2.7], fontFace: "Calibri"
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.85, w: 9, h: 0.5,
    fill: { color: C.slate900 }, line: { style: "none" }
  });
  s.addText("Reportamos F1 y Accuracy como secundarias para completitud.", {
    x: 0.6, y: 4.9, w: 8.8, h: 0.4,
    fontSize: 12, color: C.white, align: "center", valign: "middle", fontFace: "Calibri"
  });
}

// ─── SLIDE 7: MODELOS ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate100 };
  s.addText("Clasificadores", {
    x: 0.5, y: 0.35, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.slate900, fontFace: "Calibri"
  });
  s.addText("Evaluados", {
    x: 0.5, y: 0.75, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.blue, fontFace: "Calibri"
  });

  const rows = [
    ["Modelo", "Tipo", "Tendencia"],
    ["Naive Bayes", "Generativo", "Underfitting (independencia de features)"],
    ["LDA", "Lineal discriminativo", "Underfitting (frontera lineal)"],
    ["SVM (RBF)", "Kernel discriminativo", "Overfitting si C alto"],
    ["KNN", "Basado en instancias", "Overfit con k bajo"],
    ["Random Forest", "Ensemble (bagging)", "Overfit sin límite de profundidad"]
  ];
  s.addTable(rows.map((r, i) => r.map((cell) => ({
    text: cell,
    options: {
      fill: i === 0 ? { color: C.slate900 } : (i % 2 === 1 ? { color: C.slate100 } : { color: C.white }),
      color: i === 0 ? C.white : C.slate800,
      bold: i === 0,
      fontSize: 13,
      fontFace: "Calibri"
    }
  }))), {
    x: 0.5, y: 1.35, w: 9, h: 2.8,
    border: { pt: 0.5, color: "E2E8F0" },
    colW: [2.2, 2.8, 4.0], fontFace: "Calibri"
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.35, w: 9, h: 0.8,
    fill: { color: C.white }, line: { style: "none" },
    shadow: makeShadow(0.06)
  });
  s.addText("CV estratificado 5-fold en todos los modelos. Test set intacto.", {
    x: 0.7, y: 4.45, w: 8.6, h: 0.6,
    fontSize: 13, color: C.muted, align: "center", valign: "middle", fontFace: "Calibri", italic: true
  });
}

// ─── SLIDE 8: CV BASELINE ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate100 };
  s.addText("Baseline CV", {
    x: 0.5, y: 0.35, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.slate900, fontFace: "Calibri"
  });
  s.addText("Hiperparámetros default", {
    x: 0.5, y: 0.75, w: 6, h: 0.45, fontSize: 18, color: C.muted, fontFace: "Calibri"
  });

  addImageSafe(s, "cv_baseline_comparison.png", 0.8, 1.3, 8.4, 3.0);

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.5, w: 9, h: 0.85,
    fill: { color: C.slate900 }, line: { style: "none" }
  });
  s.addText([
    { text: "SVM lidera: Recall=0.959, ROC-AUC=0.995", options: { breakLine: true } },
    { text: "NB y KNN empatan: Recall=0.906", options: { breakLine: true } },
    { text: "LDA más bajo: Recall=0.876", options: {} }
  ], {
    x: 0.7, y: 4.55, w: 8.6, h: 0.75,
    fontSize: 14, color: C.white, fontFace: "Calibri", valign: "middle"
  });
}

// ─── SLIDE 9: BIAS-VARIANZA ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate100 };
  s.addText("Bias-Varianza", {
    x: 0.5, y: 0.35, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.slate900, fontFace: "Calibri"
  });

  addImageSafe(s, "overfitting_train_vs_cv.png", 0.5, 1.0, 6.5, 3.2);

  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.2, y: 1.0, w: 2.3, h: 3.2,
    fill: { color: C.white }, line: { style: "none" },
    shadow: makeShadow(0.06)
  });
  s.addText("Insights", {
    x: 7.35, y: 1.15, w: 2.0, h: 0.3,
    fontSize: 16, bold: true, color: C.blue, fontFace: "Calibri"
  });
  s.addText([
    { text: "SVM: gap mínimo → bien regularizado", options: { bullet: true, breakLine: true } },
    { text: "RF: gap ~0.07 → overfitting leve", options: { bullet: true, breakLine: true } },
    { text: "NB/LDA: gap chico → underfitting", options: { bullet: true, breakLine: true } },
    { text: "KNN: gap moderado → sensible a k", options: { bullet: true } }
  ], {
    x: 7.35, y: 1.55, w: 2.0, h: 2.4,
    fontSize: 12, color: C.slate800, fontFace: "Calibri", valign: "top"
  });
}

// ─── SLIDE 10: GAPS ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate100 };
  s.addText("Overfitting Gaps", {
    x: 0.5, y: 0.35, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.slate900, fontFace: "Calibri"
  });

  addImageSafe(s, "overfitting_gaps.png", 0.8, 1.2, 8.4, 3.0);

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.4, w: 9, h: 0.9,
    fill: { color: C.white }, line: { style: "none" },
    shadow: makeShadow(0.06)
  });
  s.addText([
    { text: "Umbral = 0.05 (línea roja)", options: { breakLine: true } },
    { text: "RF cruza umbral → controlar max_depth", options: { breakLine: true } },
    { text: "Gap bajo + CV alto = buen trade-off", options: {} }
  ], {
    x: 0.7, y: 4.5, w: 8.6, h: 0.7,
    fontSize: 14, color: C.slate800, fontFace: "Calibri", valign: "middle"
  });
}

// ─── SLIDE 11: CURVAS 1D ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate100 };
  s.addText("Curvas de Validación", {
    x: 0.5, y: 0.35, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.slate900, fontFace: "Calibri"
  });

  const imgs = [
    { path: "svm/val_curve_C (regularización).png", cap: "SVM: C óptimo ~1–10; C alto → overfit" },
    { path: "knn/val_curve_k (número de vecinos).png", cap: "KNN: k óptimo 5–9; k=1 overfit" },
    { path: "rf/val_curve_Profundidad máxima del árbol.png", cap: "RF: max_depth ~6–10; sin límite → overfit" }
  ];
  const imgW = 2.85, imgH = 2.5, gap = 0.15, startX = 0.4, yImg = 1.0;
  imgs.forEach((img, i) => {
    const x = startX + i * (imgW + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: yImg, w: imgW, h: imgH + 0.5,
      fill: { color: C.white }, line: { style: "none" },
      shadow: makeShadow(0.06)
    });
    addImageSafe(s, img.path, x + 0.05, yImg + 0.05, imgW - 0.1, imgH - 0.1);
    s.addText(img.cap, {
      x: x + 0.05, y: yImg + imgH, w: imgW - 0.1, h: 0.4,
      fontSize: 11, color: C.muted, align: "center", fontFace: "Calibri"
    });
  });
}

// ─── SLIDE 12: HEATMAPS ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate100 };
  s.addText("GridSearchCV", {
    x: 0.5, y: 0.35, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.slate900, fontFace: "Calibri"
  });

  const imgs = [
    { path: "svm/hyperparam_grid.png", cap: "SVM: C=3.16, kernel=rbf → Recall=0.953" },
    { path: "knn/hyperparam_grid.png", cap: "KNN: k=7, weights=uniform → Recall=0.924" },
    { path: "rf/hyperparam_grid.png", cap: "RF: max_depth=6, n_est=100 → Recall=0.929" }
  ];
  const imgW = 2.85, imgH = 2.5, gap = 0.15, startX = 0.4, yImg = 1.0;
  imgs.forEach((img, i) => {
    const x = startX + i * (imgW + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: yImg, w: imgW, h: imgH + 0.5,
      fill: { color: C.white }, line: { style: "none" },
      shadow: makeShadow(0.06)
    });
    addImageSafe(s, img.path, x + 0.05, yImg + 0.05, imgW - 0.1, imgH - 0.1);
    s.addText(img.cap, {
      x: x + 0.05, y: yImg + imgH, w: imgW - 0.1, h: 0.4,
      fontSize: 11, color: C.muted, align: "center", fontFace: "Calibri"
    });
  });
}

// ─── SLIDE 13: IMPACTO TUNING ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate100 };
  s.addText("Impacto del Tuning", {
    x: 0.5, y: 0.35, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.slate900, fontFace: "Calibri"
  });

  addImageSafe(s, "before_after_tuning.png", 1.0, 1.1, 8.0, 2.8);

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.1, w: 9, h: 1.2,
    fill: { color: C.white }, line: { style: "none" },
    shadow: makeShadow(0.06)
  });
  s.addText([
    { text: "SVM: sin cambio — C=1 era default óptimo", options: { bullet: true, breakLine: true } },
    { text: "RF: leve mejora (+0.005) con n_estimators=200", options: { bullet: true, breakLine: true } },
    { text: "LDA: mejora ROC-AUC con shrinkage=0.1", options: { bullet: true, breakLine: true } },
    { text: "KNN: sin mejora significativa", options: { bullet: true } }
  ], {
    x: 0.7, y: 4.2, w: 8.6, h: 1.0,
    fontSize: 14, color: C.slate800, fontFace: "Calibri", valign: "top"
  });
}

// ─── SLIDE 14: SELECCIÓN ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate900 };

  s.addText("Modelo Final", {
    x: 0.5, y: 0.4, w: 5, h: 0.5, fontSize: 28, bold: true, color: C.white, fontFace: "Calibri"
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.0, w: 9, h: 1.1,
    fill: { color: C.blueDark }, line: { color: C.cyan, width: 2 },
    shadow: makeShadow(0.2)
  });
  s.addText([
    { text: "El modelo se selecciona por validación cruzada — NO por test set.", options: { bold: true, breakLine: true } },
    { text: "El test set se evalúa UNA SOLA VEZ. Usarlo para selección introduce optimistic bias.", options: {} }
  ], {
    x: 0.7, y: 1.1, w: 8.6, h: 0.95,
    fontSize: 15, color: C.white, fontFace: "Calibri", valign: "top"
  });

  s.addText("Ranking por Recall CV tuned:", {
    x: 0.5, y: 2.35, w: 5, h: 0.3,
    fontSize: 16, bold: true, color: C.cyan, fontFace: "Calibri"
  });

  const ranking = [
    { rank: "1", model: "SVM", val: "0.959", sel: true },
    { rank: "2", model: "RF", val: "0.929", sel: false },
    { rank: "3", model: "KNN / NB", val: "0.906", sel: false },
    { rank: "4", model: "LDA", val: "0.882", sel: false }
  ];
  ranking.forEach((r, i) => {
    const y = 2.75 + i * 0.45;
    const color = r.sel ? C.emerald : C.slate700;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.4, h: 0.35,
      fill: { color }, line: { style: "none" }
    });
    s.addText(r.rank, {
      x: 0.5, y, w: 0.4, h: 0.35,
      fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri"
    });
    s.addText(r.model, {
      x: 1.05, y, w: 2.5, h: 0.35,
      fontSize: 15, bold: true, color: C.white, valign: "middle", fontFace: "Calibri"
    });
    s.addText(r.val, {
      x: 3.5, y, w: 1.0, h: 0.35,
      fontSize: 15, bold: true, color: r.sel ? C.emerald : C.white, valign: "middle", fontFace: "Calibri"
    });
    if (r.sel) {
      s.addText("✓ seleccionado", {
        x: 4.5, y, w: 1.5, h: 0.35,
        fontSize: 12, color: C.emerald, valign: "middle", fontFace: "Calibri", bold: true
      });
    }
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.0, y: 2.35, w: 3.5, h: 2.3,
    fill: { color: C.slate800 }, line: { style: "none" },
    shadow: makeShadow(0.15)
  });
  s.addText("SVM", {
    x: 6.2, y: 2.5, w: 3.1, h: 0.4,
    fontSize: 20, bold: true, color: C.cyan, fontFace: "Calibri"
  });
  s.addText("Kernel RBF\nC = 1\nRecall CV = 0.959\nROC-AUC CV = 0.995", {
    x: 6.2, y: 2.95, w: 3.1, h: 1.5,
    fontSize: 14, color: C.white, fontFace: "Calibri", valign: "top"
  });
}

// ─── SLIDE 15: EVALUACIÓN TEST ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate100 };
  s.addText("Evaluación Test", {
    x: 0.5, y: 0.35, w: 5, h: 0.45, fontSize: 28, bold: true, color: C.slate900, fontFace: "Calibri"
  });
  s.addText("SVM (RBF, C=1)", {
    x: 0.5, y: 0.75, w: 6, h: 0.45, fontSize: 18, color: C.muted, fontFace: "Calibri"
  });

  addImageSafe(s, "svm/confusion_matrix_test.png", 0.5, 1.2, 4.5, 2.8);
  addImageSafe(s, "svm/roc_curve_test.png", 5.2, 1.2, 4.3, 2.8);

  const metricRows = [
    ["Recall", "ROC-AUC", "F1", "Accuracy"],
    ["0.929", "0.995", "0.940", "0.956"]
  ];
  s.addShape(pres.shapes.RECTANGLE, {
    x: 2.5, y: 4.05, w: 5.0, h: 0.85,
    fill: { color: C.slate900 }, line: { style: "none" },
    shadow: makeShadow(0.1)
  });
  s.addTable(metricRows.map((r, i) => r.map((cell) => ({
    text: cell,
    options: {
      fill: { color: C.slate900 },
      color: i === 0 ? C.cyan : C.white,
      bold: i === 0 || i === 1,
      fontSize: 18,
      align: "center",
      fontFace: "Calibri"
    }
  }))), {
    x: 2.5, y: 4.1, w: 5.0, h: 0.75,
    border: { pt: 0.5, color: C.slate700 },
    colW: [1.25, 1.25, 1.25, 1.25], fontFace: "Calibri"
  });

  s.addText([
    { text: "Recall test (0.929) ≈ Recall CV (0.959) → generaliza bien", options: { bullet: true, breakLine: true } },
    { text: "3 FN de 42 muestras malignas", options: { bullet: true, breakLine: true } },
    { text: "ROC-AUC = 0.995 → discriminación casi perfecta", options: { bullet: true } }
  ], {
    x: 0.5, y: 5.0, w: 9, h: 0.6,
    fontSize: 12, color: C.slate800, fontFace: "Calibri", valign: "top"
  });
}

// ─── SLIDE 16: CONCLUSIONES ───
{
  let s = pres.addSlide();
  s.background = { color: C.slate900 };

  s.addText("Conclusiones", {
    x: 0.5, y: 0.4, w: 5, h: 0.5, fontSize: 32, bold: true, color: C.white, fontFace: "Calibri"
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 4.3, h: 2.8,
    fill: { color: C.slate800 }, line: { style: "none" },
    shadow: makeShadow(0.12)
  });
  s.addText("Resultados", {
    x: 0.7, y: 1.25, w: 3.9, h: 0.3,
    fontSize: 16, bold: true, color: C.cyan, fontFace: "Calibri"
  });
  s.addText([
    { text: "SVM RBF = mejor clasificador (Recall CV 0.959)", options: { bullet: true, breakLine: true } },
    { text: "Todos los modelos > 0.87 Recall", options: { bullet: true, breakLine: true } },
    { text: "Tuning marginal — defaults razonables", options: { bullet: true, breakLine: true } },
    { text: "Pipeline con scaler interno = no data leakage", options: { bullet: true } }
  ], {
    x: 0.7, y: 1.6, w: 3.9, h: 2.1,
    fontSize: 13, color: C.white, fontFace: "Calibri", valign: "top"
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.1, w: 4.3, h: 2.8,
    fill: { color: C.slate800 }, line: { style: "none" },
    shadow: makeShadow(0.12)
  });
  s.addText("Metodología", {
    x: 5.4, y: 1.25, w: 3.9, h: 0.3,
    fontSize: 16, bold: true, color: C.cyan, fontFace: "Calibri"
  });
  s.addText([
    { text: "La métrica define el problema: Accuracy confunde, Recall aclara", options: { bullet: true, breakLine: true } },
    { text: "CV estratificado indispensable con clases desbalanceadas", options: { bullet: true, breakLine: true } },
    { text: "Análisis train/CV > test para decisiones de diseño", options: { bullet: true, breakLine: true } },
    { text: "Separar selección (CV) de evaluación (test) es no-negociable", options: { bullet: true } }
  ], {
    x: 5.4, y: 1.6, w: 3.9, h: 2.1,
    fontSize: 13, color: C.white, fontFace: "Calibri", valign: "top"
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 4.2, w: 8.4, h: 0.9,
    fill: { color: C.blue }, line: { style: "none" },
    shadow: makeShadow(0.2)
  });
  s.addText('"Un modelo clínico debe optimizar lo que importa: detectar enfermos. La métrica es la hipótesis."', {
    x: 1.0, y: 4.35, w: 8.0, h: 0.7,
    fontSize: 15, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri"
  });
}

pres.writeFile({ fileName: OUT_FILE })
  .then(() => console.log("OK:", OUT_FILE))
  .catch((e) => { console.error("ERROR:", e); process.exit(1); });
