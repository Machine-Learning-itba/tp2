# PPT Plan: Clasificación Supervisada — Wisconsin Breast Cancer

## Sistema de diseño

**Herramienta:** MARP (Markdown → PDF/PPTX)
**Dimensiones:** 16:9

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

### Tipografía

- **Títulos:** `Plus Jakarta Sans Bold` (700)
- **Cuerpo:** `DM Sans Regular` (400)
- **Código / valores numéricos:** `JetBrains Mono` (400)

---

## Slides (22 en total)

### SLIDE 1 — Portada

- **Fondo:** `#0F172A`
- **Título:** "Clasificación Supervisada"
- **Subtítulo:** "Detección de Cáncer de Mama — Wisconsin Dataset"
- **Supertítulo:** "72.75 Aprendizaje Automático — ITBA"
- **Footer:** autor + fecha

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
  - Eliminación de features correlacionadas (`|r| > 0.80`): 13 features removidas
  - Outliers retenidos — valores extremos son clinicamente significativos (mayormente malignos)
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
  - LDA más bajo: Recall=0.877 — frontera lineal insuficiente
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

### SLIDE 11 — Curva de Validación: Naive Bayes

- **Banda izquierda:** `#16A34A`
- **Título:** "Curva de Validación — Naive Bayes"
- **Imagen:** `outputs/naive_bayes/val_curve_Var smoothing.png` (65% ancho, centrada)
- **Bullets:**
  - Parámetro: `var_smoothing` (escala logarítmica)
  - NB tiene poca sensibilidad al smoothing → underfitting estructural
  - Train y CV cerca → gap bajo, pero rendimiento moderado

---

### SLIDE 12 — Curva de Validación: LDA

- **Banda izquierda:** `#16A34A`
- **Título:** "Curva de Validación — LDA"
- **Imagen:** `outputs/lda/val_curve_Shrinkage (regularización).png` (65% ancho, centrada)
- **Bullets:**
  - Parámetro: `shrinkage` (regularización)
  - LDA con shrinkage leve mejora ROC-AUC (0.989)
  - Train y CV convergen → gap bajo

---

### SLIDE 13 — Curva de Validación: SVM

- **Banda izquierda:** `#16A34A`
- **Título:** "Curva de Validación — SVM (C)"
- **Imagen:** `outputs/svm/val_curve_C (regularización).png` (65% ancho, centrada)
- **Bullets:**
  - C óptimo ~1–10; C muy alto → overfit
  - Kernel RBF con C=1 ya es estable → default razonable

---

### SLIDE 14 — Curva de Validación: KNN

- **Banda izquierda:** `#16A34A`
- **Título:** "Curva de Validación — KNN (k vecinos)"
- **Imagen:** `outputs/knn/val_curve_k (número de vecinos).png` (65% ancho, centrada)
- **Bullets:**
  - k óptimo 5–9; k=1 overfittea, k grande underfittea
  - Trade-off claro entre bias y varianza

---

### SLIDE 15 — Curva de Validación: Random Forest

- **Banda izquierda:** `#16A34A`
- **Título:** "Curva de Validación — RF (max_depth)"
- **Imagen:** `outputs/rf/val_curve_Profundidad_maxima_del_arbol.png` (65% ancho, centrada)
- **Bullets:**
  - max_depth ≤ 4 mantiene gap bajo 0.05; ≥5 → overfitting claro
  - Train alcanza 1.0 desde depth=8 → memoriza, gap crece a 0.07

---

### SLIDE 16 — GridSearch: SVM

- **Banda izquierda:** `#16A34A`
- **Título:** "GridSearchCV — SVM"
- **Imagen:** `outputs/svm/hyperparam_grid.png` (65% ancho, centrada)
- **Bullets:**
  - GridSearch confirmó: C=1.0, kernel=rbf → Recall CV = 0.959
  - Kernel lineal consistentemente inferior

---

### SLIDE 17 — GridSearch: KNN

- **Banda izquierda:** `#16A34A`
- **Título:** "GridSearchCV — KNN"
- **Imagen:** `outputs/knn/hyperparam_grid.png` (65% ancho, centrada)
- **Bullets:**
  - GridSearch halló: k=3, weights=uniform → Recall CV = 0.924
  - Default k=5 → Recall 0.918 — gap aceptable (0.010), suficiente para este dataset
  - k=3 gap = 0.022 (no overfitting severo, pero default ya es razonable)

---

### SLIDE 18 — GridSearch: Random Forest

- **Banda izquierda:** `#16A34A`
- **Título:** "GridSearchCV — Random Forest"
- **Imagen:** `outputs/rf/hyperparam_grid.png` (65% ancho, centrada)
- **Bullets:**
  - GridSearch halló: max_depth=8, n_estimators=100 → Recall CV = 0.929
  - Se eligió max_depth=4: gap baja de 0.071 a 0.052 — reduce overfitting
  - max_depth ≥5: train alcanza 1.0 → memoriza; max_depth=None gap idéntico a 8

---

### SLIDE 19 — Impacto del tuning

- **Banda izquierda:** `#16A34A`
- **Título:** "Impacto del Tuning de Hiperparámetros"
- **Imagen:** `outputs/before_after_tuning.png` (70% ancho, centrada)
- **Bullets:**
  - SVM: sin cambio — C=1 confirmado óptimo por GridSearch
  - LDA: Recall +0.006, ROC-AUC +0.002 (shrinkage=0.1) — única mejora sustancial
  - RF: Recall -0.006 (max_depth=None→4) — reduce gap de 0.071 a 0.052
  - KNN / NB: sin cambio — defaults sklearn ya razonables

---

### SLIDE 20 — Selección del modelo final (slide de énfasis)

- **Fondo:** `#0F172A` (oscuro)
- **Título:** "Selección del Modelo Final" · blanco · 36pt
- **Callout principal** (fondo `#1E3A8A`, borde `#60A5FA`, redondeado, centrado):
  > "El modelo se selecciona en base a los resultados de validación cruzada — NO de test."
  > El test set se evalúa UNA SOLA VEZ, sobre el modelo ya elegido. Usarlo para selección introduce optimistic bias.
- **Ranking por Recall CV tuned:**
  1. **SVM — 0.959** ✓ seleccionado
  2. RF — 0.929
  3. KNN / NB — 0.906
  4. LDA — 0.877
- **Nota:** "SVM con kernel RBF, C=1 → mejor Recall CV Y mejor ROC-AUC CV"

---

### SLIDE 21 — Evaluación final en test: SVM

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

### SLIDE 22 — Conclusiones

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

## Métricas reales (source: metrics.txt)

| Modelo | Recall CV | ROC-AUC CV | Recall Test | ROC-AUC Test | F1 Test | Accuracy Test |
|---|---|---|---|---|---|---|
| SVM | 0.959 | 0.995 | 0.929 | 0.995 | 0.940 | 0.956 |
| RF | 0.929 | 0.990 | 0.881 | 0.996 | 0.937 | 0.956 |
| KNN | 0.906 | 0.983 | 0.810 | 0.989 | 0.872 | 0.912 |
| NB | 0.906 | 0.985 | 0.881 | 0.988 | 0.892 | 0.921 |
| LDA | 0.877 | 0.989 | 0.881 | 0.998 | 0.937 | 0.956 |

---

## Implementación técnica

### Herramienta: MARP

```bash
npm install -g @marp-team/marp-cli
marp presentacion.md --pdf
marp presentacion.md --pptx
```

### Paths de imágenes

```
outputs/cv_baseline_comparison.png
outputs/before_after_tuning.png
outputs/overfitting_train_vs_cv.png
outputs/overfitting_gaps.png
outputs/naive_bayes/val_curve_Var smoothing.png
outputs/lda/val_curve_Shrinkage (regularización).png
outputs/svm/val_curve_C (regularización).png
outputs/knn/val_curve_k (número de vecinos).png
outputs/rf/val_curve_Profundidad máxima del árbol.png
outputs/svm/hyperparam_grid.png
outputs/knn/hyperparam_grid.png
outputs/rf/hyperparam_grid.png
outputs/svm/confusion_matrix_test.png
outputs/svm/roc_curve_test.png
```

### Archivos de salida

```
presentacion.pdf
presentacion.pptx
```

---

## Correcciones realizadas vs plan anterior

| Item | Antes | Ahora |
|---|---|---|
| Umbral correlación | `|r| > 0.95` (incorrecto) | `|r| > 0.80` (correcto, verificado en 01_limpieza.ipynb) |
| Outliers | "Eliminación de outliers extremos (IQR × 3)" | "Retenidos — clinicamente significativos" |
| LDA Recall CV | 0.882 | 0.877 (valor real de metrics.txt) |
| Slides curvas validación | 1 slide con 3 imágenes | 5 slides (1 por modelo) |
| Slides gridsearch | 1 slide con 3 imágenes | 3 slides (1 por modelo) |
| Total slides | 16 | 22 |
| Herramienta | python-pptx | MARP |
