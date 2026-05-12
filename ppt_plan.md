# PPT Plan: Clasificación Supervisada — Wisconsin Breast Cancer

## Sistema de diseño

**Dimensiones:** 33.87 × 19.05 cm (16:9)

### Paleta de colores

| Rol | Hex | Uso |
|---|---|---|
| `bg_dark` | `#0F172A` | fondo slides portada / transición |
| `bg_light` | `#F8FAFC` | fondo slides de contenido |
| `primary` | `#1E40AF` | títulos, headers |
| `accent_red` | `#DC2626` | maligno, alerta, énfasis |
| `accent_green` | `#16A34A` | tuned, mejor modelo |
| `accent_teal` | `#0891B2` | métricas, info |
| `text_dark` | `#1E293B` | texto principal |
| `text_muted` | `#64748B` | subtítulos, captions |
| `box_bg` | `#EFF6FF` | cajas de highlight / callout |
| `divider` | `#CBD5E1` | líneas separadoras |

### Tipografía (Google Fonts — compatibles con Google Slides)

- **Títulos principales:** `Plus Jakarta Sans Bold` (700)
- **Subtítulos / headers de sección:** `Plus Jakarta Sans SemiBold` (600)
- **Cuerpo / bullets:** `DM Sans Regular` (400)
- **Código / valores numéricos destacados:** `JetBrains Mono` (400)
- **Tamaños:** Título slide = 36pt | Subtitle = 22pt | Body = 16pt | Caption = 12pt

### Elementos de diseño

- Banda de color izquierda (0.5 cm) en slides de contenido — color varía por sección
- Número de slide bottom-right, `text_muted`, 10pt
- Header strip (`#1E40AF`, 14% altura) con título de sección en blanco en slides interiores
- Cajas `callout` redondeadas (borde radius 8pt) para datos clave

---

## Slides (16 en total)

### SLIDE 1 — Portada

- **Fondo:** `#0F172A`
- **Elementos:**
  - Rectángulo decorativo esquina inferior derecha: gradiente `#1E40AF` → `#0891B2`
  - Supertítulo: `"72.75 Aprendizaje Automático — ITBA"` · blanco 40% opacidad · 13pt
  - Título: `"Clasificación Supervisada"` · blanco · 42pt · Plus Jakarta Sans Bold
  - Subtítulo: `"Detección de Cáncer de Mama — Wisconsin Dataset"` · `#93C5FD` · 22pt
  - Línea decorativa horizontal `#0891B2`, 3px, ancho 40% desde izquierda
  - Footer: autor + fecha · 11pt · gris claro

---

### SLIDE 2 — Exploración del dataset

- **Banda izquierda:** `#0891B2`
- **Título:** "El Dataset: Wisconsin Diagnostic Breast Cancer"
- **Layout:** 60/40 (texto izq, stats der)
- **Bullets izquierda:**
  - 569 muestras · 30 features originales → 17 seleccionadas tras limpieza
  - Etiqueta binaria: Benigno (B=0) / Maligno (M=1)
  - Features: mediciones del núcleo celular (radio, textura, perímetro, etc.)
  - 3 grupos de features: `_mean`, `_se`, `_worst`
- **Caja callout derecha** (fondo `#EFF6FF`):
  - `"B: 357 (62.7%)"` · verde
  - `"M: 212 (37.3%)"` · rojo
  - Nota: "Dataset desbalanceado → split estratificado obligatorio"
- **Nota metodológica inferior:** "Train: 455 muestras | Test: 114 muestras (80/20 estratificado)"

---

### SLIDE 3 — Limpieza y preprocesamiento

- **Banda izquierda:** `#7C3AED`
- **Título:** "Pipeline de Preprocesamiento"
- **Layout:** diagrama de flujo horizontal (4 cajas) arriba + bullets abajo
- **Cajas del flujo** (conectadas con flechas `→`):
  1. `Raw Data (569×30)`
  2. `Limpieza & Feature Selection (569×17)`
  3. `Train/Test Split 80/20 estratificado`
  4. `StandardScaler dentro de CV/Pipeline`
- **Bullets:**
  - Eliminación de features correlacionadas (`|r| > 0.95`): 13 features removidas
  - Eliminación de outliers extremos (IQR × 3)
  - Split 80/20 estratificado → preserva proporción B/M en ambos sets
  - StandardScaler aplicado DENTRO del pipeline → sin data leakage
- **Callout** (fondo `#FEF3C7`, borde `#F59E0B`):
  > "Escalar antes del split contaminaría el test set con información del train. El scaler se ajusta solo sobre el fold de entrenamiento en cada iteración de CV."

---

### SLIDE 4 — ¿Por qué importa la métrica?

- **Banda izquierda:** `#DC2626`
- **Título:** "Contexto Clínico: No todas las métricas son iguales"
- **Layout:** 2 columnas
- **Izquierda — tabla de confusión conceptual 2×2:**
  - TP (verde `#16A34A`): Maligno → Maligno
  - FP (naranja `#EA580C`): Benigno → Maligno
  - FN (rojo `#DC2626`, más grande): Maligno → Benigno ← EL PELIGROSO
  - TN (verde claro): Benigno → Benigno
- **Derecha — bullets:**
  - **FN:** tumor maligno clasificado como benigno → paciente no recibe tratamiento → consecuencia grave
  - **FP:** benigno clasificado como maligno → biopsia innecesaria → costoso pero no fatal
  - Conclusión: minimizar FN = maximizar Sensibilidad (Recall)
- **Callout rojo** (fondo `#FEE2E2`, borde `#DC2626`):
  > "En diagnóstico oncológico, un FN puede costar una vida. Optimizamos Recall."

---

### SLIDE 5 — Métricas: definiciones

- **Banda izquierda:** `#0891B2`
- **Título:** "Métricas clave — Definiciones"
- **Layout:** grilla 2×2 de cajas
- **Caja 1 — Sensibilidad / Recall (TPR)** (fondo verde claro, borde verde, destacada):
  - Fórmula: `TP / (TP + FN)`
  - "¿De todos los enfermos, cuántos detectamos?"
  - Badge: "MÉTRICA PRINCIPAL"
- **Caja 2 — Especificidad (TNR)**:
  - Fórmula: `TN / (TN + FP)`
  - "¿De todos los sanos, cuántos identificamos correctamente?"
- **Caja 3 — VPP (Precisión)**:
  - Fórmula: `TP / (TP + FP)`
  - "¿De los clasificados como enfermos, cuántos lo son realmente?"
- **Caja 4 — VPN**:
  - Fórmula: `TN / (TN + FN)`
  - "¿De los clasificados como sanos, cuántos lo son realmente?"
- **Nota inferior:** "Recall y Especificidad están en trade-off — aumentar uno tiende a bajar el otro"

---

### SLIDE 6 — ROC-AUC y métricas descartadas

- **Banda izquierda:** `#0891B2`
- **Título:** "ROC-AUC y métricas complementarias"
- **Layout:** izquierda descripción ROC (40%) | derecha tabla descartadas (60%)
- **Izquierda:**
  - ROC = curva TPR vs FPR para todos los umbrales posibles
  - AUC = área bajo la curva = capacidad discriminativa general
  - "Threshold-free" → útil para comparar modelos sin fijar umbral
  - Segunda métrica de ranking: desempata entre modelos con recall similar
- **Derecha — tabla:**

  | Métrica | Por qué no es la principal |
  |---|---|
  | Accuracy | Engañosa con clases desbalanceadas (modelo trivial = 62.7%) |
  | F1-Score | Combina Recall + Precisión por igual — en oncología Recall > Precisión |
  | Precisión (VPP) | Penaliza FP, no FN — prioridad incorrecta para este dominio |
  | MCC | Robusto pero difícil de interpretar para audiencia clínica |

- **Callout:** "Reportamos F1 y Accuracy como métricas secundarias para completitud."

---

### SLIDE 7 — Modelos evaluados

- **Banda izquierda:** `#1E40AF`
- **Título:** "5 Clasificadores — Características"
- **Layout:** tabla de 5 filas × 3 columnas

  | Modelo | Tipo | Tendencia natural |
  |---|---|---|
  | Naive Bayes | Generativo, paramétrico | Underfitting (asume independencia entre features) |
  | LDA | Discriminativo lineal | Underfitting (frontera lineal, asume Gaussiana) |
  | SVM (RBF) | Discriminativo, kernel | Overfitting si C alto |
  | KNN | Basado en instancias | Depende de k: bajo k → overfit |
  | Random Forest | Ensemble (bagging) | Overfit si max_depth sin límite |

- **Nota inferior:** "CV estratificado 5-fold en todos los modelos. Los resultados son de validación — el test set NO fue tocado."

---

### SLIDE 8 — CV Baseline

- **Banda izquierda:** `#1E40AF`
- **Título:** "Paso 1: Baseline con hiperparámetros por defecto"
- **Imagen:** `outputs/cv_baseline_comparison.png` (80% ancho, centrada)
- **Bullets:**
  - SVM lidera: Recall=0.959, ROC-AUC=0.995
  - NB y KNN empatan: Recall=0.906
  - LDA más bajo: Recall=0.876 — frontera lineal insuficiente
- **Callout:** "Todos los resultados son de validación cruzada 5-fold — test set intacto"

---

### SLIDE 9 — Análisis bias-varianza

- **Banda izquierda:** `#7C3AED`
- **Título:** "Análisis Bias-Varianza: Train vs CV"
- **Imagen:** `outputs/overfitting_train_vs_cv.png` (75% ancho, parte superior)
- **Bullets:**
  - SVM: gap mínimo → bien regularizado con C=1, kernel RBF
  - RF: gap Recall ≈ 0.07 → overfitting leve, árboles memorizan train
  - NB/LDA: gap chico pero valores moderados → underfitting por simplificaciones del modelo
  - KNN: gap moderado → sensible al valor de k

---

### SLIDE 10 — Gaps de overfitting

- **Banda izquierda:** `#7C3AED`
- **Título:** "Gap Train − CV por modelo"
- **Imagen:** `outputs/overfitting_gaps.png` (80% ancho, centrada)
- **Bullets:**
  - Umbral overfitting = 0.05 (línea roja en el gráfico)
  - RF cruza umbral en Recall → max_depth debe controlarse
  - SVM y NB por debajo del umbral → comportamiento estable
- **Nota inferior:** "Gap bajo + CV alto = buen trade-off sesgo-varianza"

---

### SLIDE 11 — Curvas de validación 1D

- **Banda izquierda:** `#16A34A`
- **Título:** "Tuning 1D: Curvas de Validación"
- **Layout:** 3 imágenes en fila con caption debajo de cada una
  - `outputs/svm/val_curve_C (regularización).png` → Caption: "SVM: C óptimo ~1–10; C muy alto → overfit"
  - `outputs/knn/val_curve_k (número de vecinos).png` → Caption: "KNN: k óptimo 5–9; k=1 overfittea, k grande underfittea"
  - `outputs/rf/val_curve_Profundidad máxima del árbol.png` → Caption: "RF: max_depth ~6–10 equilibra; sin límite → overfit"

---

### SLIDE 12 — Grid 2D: Heatmaps

- **Banda izquierda:** `#16A34A`
- **Título:** "Tuning 2D: GridSearchCV — Heatmaps"
- **Layout:** 3 imágenes en fila con caption
  - `outputs/svm/hyperparam_grid.png` → Caption: "SVM: mejor C=1, kernel=rbf → Recall=0.959"
  - `outputs/knn/hyperparam_grid.png` → Caption: "KNN: mejor k=7, weights=uniform → Recall=0.906"
  - `outputs/rf/hyperparam_grid.png` → Caption: "RF: mejor max_depth=None, n_estimators=200 → Recall=0.929"

---

### SLIDE 13 — Impacto del tuning

- **Banda izquierda:** `#16A34A`
- **Título:** "Impacto del Tuning de Hiperparámetros"
- **Imagen:** `outputs/before_after_tuning.png` (70% ancho, centrada)
- **Bullets:**
  - SVM: sin cambio — C=1 ya era el default óptimo, confirma estabilidad
  - RF: leve mejora en Recall (+0.005) con n_estimators=200
  - LDA: mejora ROC-AUC con shrinkage=0.1 (solver lsqr)
  - KNN: sin mejora significativa

---

### SLIDE 14 — Selección del modelo final (slide de énfasis)

- **Fondo:** `#0F172A` (oscuro)
- **Título:** "Selección del Modelo Final" · blanco · 36pt
- **Callout principal** (fondo `#1E3A8A`, borde `#60A5FA`, redondeado, centrado):
  > "El modelo se selecciona en base a los resultados de validación cruzada — NO de test."
  > El test set se evalúa UNA SOLA VEZ, sobre el modelo ya elegido. Usarlo para selección introduce optimistic bias.
- **Ranking por Recall CV tuned:**
  1. **SVM — 0.959** ✓ seleccionado
  2. RF — 0.929
  3. KNN / NB — 0.906
  4. LDA — 0.882
- **Nota:** "SVM con kernel RBF, C=1 → mejor Recall CV Y mejor ROC-AUC CV"

---

### SLIDE 15 — Evaluación final en test: SVM

- **Banda izquierda:** `#DC2626`
- **Título:** "Evaluación en Test — SVM (RBF, C=1)"
- **Layout:** 50/50
  - Izquierda: `outputs/svm/confusion_matrix_test.png`
  - Derecha: `outputs/svm/roc_curve_test.png`
- **Tabla de métricas** (debajo):

  | Recall | ROC-AUC | F1 | Accuracy |
  |---|---|---|---|
  | **0.929** | **0.995** | 0.940 | 0.956 |

- **Bullets:**
  - Recall test (0.929) ≈ Recall CV (0.959) → generaliza bien, sin overfit significativo
  - Solo 3 FN (tumores malignos no detectados) de 42 muestras malignas
  - ROC-AUC = 0.995 → discriminación casi perfecta

---

### SLIDE 16 — Conclusiones

- **Fondo:** `#0F172A`
- **Título:** "Conclusiones" · blanco
- **Layout:** 2 columnas de bullets
- **Columna izquierda — Resultados:**
  - SVM con kernel RBF es el mejor clasificador (Recall CV=0.959)
  - Todos los modelos superan 0.87 de Recall — dataset relativamente bien separable
  - El tuning mejoró marginalmente — defaults de sklearn eran razonables
  - Pipeline con StandardScaler interno garantiza evaluación libre de data leakage
- **Columna derecha — Aprendizajes metodológicos:**
  - La elección de métrica define el problema: Accuracy hubiera confundido, Recall lo aclaró
  - CV estratificado es indispensable con clases desbalanceadas
  - El análisis train/CV es más informativo que el resultado de test para decisiones de diseño
  - Separar selección de modelo (CV) de evaluación final (test) es no-negociable
- **Callout final** (fondo `#1E40AF`, texto blanco):
  > "Un modelo clínico debe optimizar lo que importa: detectar enfermos. La métrica es la hipótesis."

---

## Implementación técnica

### Dependencias

```bash
pip install python-pptx pillow
```

Fuentes descargadas localmente desde Google Fonts (Plus Jakarta Sans, DM Sans, JetBrains Mono) y referenciadas por nombre — en Google Slides aparecerán correctamente si están disponibles allí.

### Paths de imágenes

```
BASE = /home/jaiba/tp2/outputs/
outputs/cv_baseline_comparison.png
outputs/before_after_tuning.png
outputs/overfitting_train_vs_cv.png
outputs/overfitting_gaps.png
outputs/svm/val_curve_C (regularización).png
outputs/knn/val_curve_k (número de vecinos).png
outputs/rf/val_curve_Profundidad máxima del árbol.png
outputs/svm/hyperparam_grid.png
outputs/knn/hyperparam_grid.png
outputs/rf/hyperparam_grid.png
outputs/svm/confusion_matrix_test.png
outputs/svm/roc_curve_test.png
```

### Archivo de salida

```
/home/jaiba/tp2/outputs/presentacion_clasificacion.pptx
```

### Estructura del script Python

```python
from pptx import Presentation
from pptx.util import Cm, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches
import copy

SLIDE_W = Cm(33.87)
SLIDE_H = Cm(19.05)

# Colores
BG_DARK      = RGBColor(0x0F, 0x17, 0x2A)
BG_LIGHT     = RGBColor(0xF8, 0xFA, 0xFC)
PRIMARY      = RGBColor(0x1E, 0x40, 0xAF)
ACCENT_RED   = RGBColor(0xDC, 0x26, 0x26)
ACCENT_GREEN = RGBColor(0x16, 0xA3, 0x4A)
ACCENT_TEAL  = RGBColor(0x08, 0x91, 0xB2)
ACCENT_VIOLET= RGBColor(0x7C, 0x3A, 0xED)
TEXT_DARK    = RGBColor(0x1E, 0x29, 0x3B)
TEXT_MUTED   = RGBColor(0x64, 0x74, 0x8B)
BOX_BG       = RGBColor(0xEF, 0xF6, 0xFF)
WHITE        = RGBColor(0xFF, 0xFF, 0xFF)

# Helpers
def add_slide(prs): ...           # agrega slide en blanco
def set_bg(slide, color): ...     # fondo sólido
def add_band(slide, color): ...   # banda izquierda 0.5cm
def add_header(slide, text, color): ...  # strip superior con título
def add_text_box(slide, text, left, top, width, height, ...): ...
def add_callout(slide, text, left, top, width, height, bg, border): ...
def add_image(slide, path, left, top, width): ...
def add_table(slide, data, headers, left, top, width, height): ...
def add_slide_number(slide, n): ...

# Construir slides 1-16 usando helpers
```
