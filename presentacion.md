---
marp: true
theme: uncover
paginate: true
size: 16:9
---

<style>
:root {
  --bg-dark: #0F172A;
  --bg-light: #F8FAFC;
  --primary: #1E40AF;
  --accent-red: #DC2626;
  --accent-green: #16A34A;
  --accent-teal: #0891B2;
  --text-dark: #1E293B;
  --text-muted: #64748B;
  --box-bg: #EFF6FF;
}

section {
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  color: var(--text-dark);
  background: var(--bg-light);
  font-size: 16px;
  padding: 30px 50px;
}

section.lead {
  background: var(--bg-dark);
  color: white;
  text-align: center;
}

section.lead h1 {
  color: white;
  font-size: 42pt;
  border: none;
}

section.lead h2 {
  color: #93C5FD;
  font-size: 22pt;
}

section.lead p {
  color: #94A3B8;
}

section h1 {
  color: var(--primary);
  font-size: 28pt;
  border-left: 6px solid var(--accent-teal);
  padding-left: 16px;
  margin-bottom: 20px;
}

section h2 {
  color: var(--primary);
  font-size: 22pt;
}

section strong {
  color: var(--primary);
}

section em {
  color: var(--accent-red);
  font-style: normal;
  font-weight: bold;
}

table {
  font-size: 13px;
  margin: 10px auto;
  border-collapse: collapse;
}

th {
  background: var(--primary);
  color: white;
  padding: 6px 12px;
}

td {
  padding: 5px 12px;
  border-bottom: 1px solid #E2E8F0;
}

code {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  background: #F1F5F9;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 14px;
}

.callout {
  background: var(--box-bg);
  border-left: 4px solid var(--primary);
  padding: 12px 16px;
  margin: 12px 0;
  border-radius: 4px;
  font-size: 14px;
}

.callout-red {
  background: #FEE2E2;
  border-left: 4px solid var(--accent-red);
  padding: 12px 16px;
  margin: 12px 0;
  border-radius: 4px;
  font-size: 14px;
}

.callout-warn {
  background: #FEF3C7;
  border-left: 4px solid #F59E0B;
  padding: 12px 16px;
  margin: 12px 0;
  border-radius: 4px;
  font-size: 14px;
}

.callout-dark {
  background: #2563EB;
  border-left: 4px solid #93C5FD;
  padding: 14px 18px;
  margin: 12px 0;
  border-radius: 6px;
  font-size: 14px;
  color: #FFFFFF;
}
.callout-dark p, .callout-dark strong, .callout-dark em {
  color: #FFFFFF;
}

.metric-big {
  font-size: 28pt;
  font-weight: bold;
  color: var(--accent-green);
  font-family: 'JetBrains Mono', monospace;
}

.metric-label {
  font-size: 11pt;
  color: var(--text-muted);
}

.badge {
  display: inline-block;
  background: var(--accent-red);
  color: white;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10pt;
  font-weight: bold;
}

.badge-green {
  display: inline-block;
  background: var(--accent-green);
  color: white;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10pt;
  font-weight: bold;
}

.badge-teal {
  display: inline-block;
  background: var(--accent-teal);
  color: white;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10pt;
  font-weight: bold;
}

img {
  max-width: 100%;
}

section::after {
  font-size: 10px;
  color: var(--text-muted);
}

ul {
  margin-top: 6px;
  margin-bottom: 6px;
}

li {
  margin-bottom: 4px;
  font-size: 15px;
}

.columns {
  display: flex;
  gap: 30px;
}
.col {
  flex: 1;
}
</style>

<!-- SLIDE 1: Portada -->
<!-- _class: lead -->

# Clasificación Supervisada

## Detección de Cáncer de Mama — Wisconsin Dataset

<p style="margin-top: 40px;">72.75 Aprendizaje Automático — ITBA</p>

<p style="margin-top: 20px; font-size: 11pt;">Mayo 2026</p>

---

<!-- SLIDE 2: Dataset -->

# El Dataset: Wisconsin Diagnostic Breast Cancer

<div class="columns">
<div class="col">

- **569 muestras** · 30 features originales → **17 seleccionadas** tras limpieza
- Etiqueta binaria: Benigno (B=0) / Maligno (M=1)
- Features: mediciones del núcleo celular (radio, textura, perímetro, etc.)
- 3 grupos: `_mean`, `_se`, `_worst`
- Train: **455** muestras | Test: **114** muestras (80/20 estratificado)

</div>
<div class="col">

<div class="callout">
<p><strong style="color: #16A34A;">B: 357 (62.7%)</strong> — Benigno</p>
<p><strong style="color: #DC2626;">M: 212 (37.3%)</strong> — Maligno</p>
<p style="margin-top: 10px; font-size: 13px;">⚠ Dataset desbalanceado → split estratificado obligatorio</p>
</div>

</div>
</div>

---

<!-- SLIDE 3: Preprocesamiento -->

# Pipeline de Preprocesamiento

```
Raw Data (569×30)  →  Feature Selection (569×17)  →  Train/Test Split 80/20  →  StandardScaler (dentro de CV)
```

- Eliminación de features correlacionadas (`|r| > 0.80`): **13 features removidas**
- Outliers **retenidos** — valores extremos son clinicamente significativos (mayormente malignos)
- Split 80/20 estratificado → preserva proporción B/M en ambos sets
- StandardScaler aplicado **DENTRO** del pipeline → sin data leakage

<div class="callout-warn">
⚠ "Escalar antes del split contaminaría el test set con información del train. El scaler se ajusta solo sobre el fold de entrenamiento en cada iteración de CV."
</div>

---

<!-- SLIDE 4: Contexto clínico -->

# Contexto Clínico: No todas las métricas son iguales

<div class="columns">
<div class="col">

| | Predicho M | Predicho B |
|---|---|---|
| **Real M** | TP ✓ | **FN** ✗ |
| **Real B** | FP ✗ | TN ✓ |

</div>
<div class="col">

- <em style="color: #DC2626;">FN:</em> tumor maligno → clasificado benigno → **no recibe tratamiento** → consecuencia grave
- FP: benigno → clasificado maligno → biopsia innecesaria → costoso pero no fatal
- Conclusión: **minimizar FN = maximizar Sensibilidad (Recall)**

</div>
</div>

<div class="callout-red">
🔴 "En diagnóstico oncológico, un FN puede costar una vida. Optimizamos Recall."
</div>

---

<!-- SLIDE 5: Métricas -->

# Métricas clave — Definiciones

<div class="columns">
<div class="col">

> **Sensibilidad / Recall (TPR)** 🔴 **MÉTRICA PRINCIPAL**
> `TP / (TP + FN)` — ¿De todos los enfermos, cuántos detectamos?

> **Especificidad (TNR)**
> `TN / (TN + FP)` — ¿De todos los sanos, cuántos identificamos correctamente?

</div>
<div class="col">

> **VPP (Precisión)**
> `TP / (TP + FP)` — ¿De los clasificados como enfermos, cuántos lo son?

> **VPN**
> `TN / (TN + FN)` — ¿De los clasificados como sanos, cuántos lo son?

</div>
</div>

<p style="font-size: 13px; color: #64748B;">Recall y Especificidad están en trade-off — aumentar uno tiende a bajar el otro</p>

---

<!-- SLIDE 6: ROC-AUC -->

# ROC-AUC y métricas complementarias

<div class="columns">
<div class="col">

- **ROC** = curva TPR vs FPR para todos los umbrales posibles
- **AUC** = área bajo la curva = capacidad discriminativa general
- "Threshold-free" → útil para comparar modelos sin fijar umbral
- Segunda métrica: desempata entre modelos con recall similar

</div>
<div class="col">

| Métrica | Por qué no es la principal |
|---|---|
| Accuracy | Engañosa con desbalance (trivial = 62.7%) |
| F1-Score | Combina Recall+Precisión por igual |
| Precisión | Penaliza FP, no FN |
| MCC | Robusto pero difícil de interpretar |

</div>
</div>

---

<!-- SLIDE 7: Modelos -->

# 5 Clasificadores — Características

| Modelo | Tipo | Tendencia natural |
|---|---|---|
| **Naive Bayes** | Generativo, paramétrico | Underfitting (asume independencia) |
| **LDA** | Discriminativo lineal | Underfitting (frontera lineal) |
| **SVM (RBF)** | Discriminativo, kernel | Overfitting si C alto |
| **KNN** | Basado en instancias | Depende de k: bajo k → overfit |
| **Random Forest** | Ensemble (bagging) | Overfit si max_depth sin límite |

<p style="font-size: 13px; color: #64748B;">CV estratificado 5-fold en todos. Resultados de validación — test set NO fue tocado.</p>

---

<!-- SLIDE 8: CV Baseline -->

# Paso 1: Baseline con hiperparámetros por defecto

![w:800](outputs/cv_baseline_comparison.png)

- **SVM lidera:** Recall=**0.959**, ROC-AUC=**0.995**
- RF: Recall=**0.924** | KNN: Recall=**0.918** | NB: Recall=**0.906**
- **LDA más bajo:** Recall=**0.876** — frontera lineal insuficiente

<div class="callout">
Todos los resultados son de validación cruzada 5-fold — test set intacto
</div>

---

<!-- SLIDE 9: Bias-varianza -->

# Análisis Bias-Varianza: Train vs CV

![w:750](outputs/overfitting_train_vs_cv.png)

- **SVM:** gap mínimo → bien regularizado con C=1, kernel RBF
- **RF:** gap Recall ≈ 0.05 (max_depth=4) → overfitting borderline, árboles memorizan train
- **NB/LDA:** gap chico pero valores moderados → underfitting estructural
- **KNN:** gap moderado → sensible al valor de k

---

<!-- SLIDE 10: Gaps overfitting -->

# Gap Train − CV por modelo

![w:800](outputs/overfitting_gaps.png)

- Umbral overfitting = **0.05** (línea roja en el gráfico)
- **RF** cruza umbral en Recall → max_depth debe controlarse
- SVM y NB por debajo del umbral → comportamiento estable

<p style="font-size: 13px; color: #64748B;">Gap bajo + CV alto = buen trade-off sesgo-varianza</p>

---

<!-- SLIDE 11: Val curve NB -->

# Curva de Validación — Naive Bayes

![w:600](outputs/naive_bayes/val_curve_Var_smoothing.png)

- Parámetro: `var_smoothing` (escala logarítmica)
- NB tiene poca sensibilidad al smoothing → **underfitting estructural**
- Train y CV cerca → gap bajo, pero rendimiento moderado

---

<!-- SLIDE 12: Val curve LDA -->

# Curva de Validación — LDA

![w:600](outputs/lda/val_curve_Shrinkage_regularizacion.png)

- Parámetro: `shrinkage` (regularización)
- LDA con shrinkage leve mejora ROC-AUC (**0.989**)
- Train y CV convergen → gap bajo

---

<!-- SLIDE 13: Val curve SVM -->

# Curva de Validación — SVM (C)

![w:600](outputs/svm/val_curve_C_regularizacion.png)

- **C óptimo ~1–10**; C muy alto → overfit
- Kernel RBF con C=1 ya es estable → default razonable

---

<!-- SLIDE 14: Val curve KNN -->

# Curva de Validación — KNN (k vecinos)

![w:600](outputs/knn/val_curve_k_numero_de_vecinos.png)

- **k óptimo 5–9**; k=1 overfittea, k grande underfittea
- Trade-off claro entre bias y varianza

---

<!-- SLIDE 15: Val curve RF -->

# Curva de Validación — RF (max_depth)

![w:600](outputs/rf/val_curve_Profundidad_maxima_del_arbol.png)

- **max_depth ≤ 4** mantiene gap bajo 0.05; ≥5 → overfitting claro
- Train alcanza 1.0 desde depth=8 → memoriza, gap crece a 0.07

---

<!-- SLIDE 16: Grid SVM -->

# GridSearchCV — SVM

![w:600](outputs/svm/hyperparam_grid.png)

- GridSearch confirmó: **C=1.0, kernel=rbf** → Recall CV = **0.959**
- Kernel lineal consistentemente inferior

---

<!-- SLIDE 17: Grid KNN -->

# GridSearchCV — KNN

![w:600](outputs/knn/hyperparam_grid.png)

- GridSearch halló: **k=3, weights=uniform** → Recall CV = **0.924**
- Default k=5 → Recall **0.918** — gap aceptable (0.010), suficiente para este dataset
- k=3 gap = 0.022 (no overfitting severo, pero default ya es razonable)

---

<!-- SLIDE 18: Grid RF -->

# GridSearchCV — Random Forest

![w:600](outputs/rf/hyperparam_grid.png)

- GridSearch halló: **max_depth=8, n_estimators=100** → Recall CV = **0.929**
- Se eligió **max_depth=4**: gap baja de 0.071 a 0.052 — reduce overfitting
- max_depth ≥5: train alcanza 1.0 → memoriza; max_depth=None gap idéntico a 8

---

<!-- SLIDE 19: Impacto tuning -->

# Impacto del Tuning de Hiperparámetros

![w:700](outputs/before_after_tuning.png)

- **SVM:** sin cambio — C=1 confirmado óptimo por GridSearch
- **LDA:** Recall +0.006, ROC-AUC +0.002 (shrinkage=0.1) — única mejora sustancial
- **RF:** Recall -0.006 (max_depth=None→4) — reduce gap de 0.071 a 0.052
- **KNN / NB:** sin cambio — defaults sklearn ya razonables

---

<!-- SLIDE 20: Selección modelo -->
<!-- _class: lead -->

# Selección del Modelo Final

<div class="callout-dark" style="text-align: left;">

El modelo se selecciona en base a los resultados de **validación cruzada** — NO de test.
El test set se evalúa **UNA SOLA VEZ**, sobre el modelo ya elegido. Usarlo para selección introduce optimistic bias.

</div>

### Ranking por Recall CV (tuned)

| # | Modelo | Recall CV | ROC-AUC CV |
|---|---|---|---|
| **1** | **SVM (RBF, C=1)** | **0.959** ✓ | **0.995** |
| 2 | RF (depth=4) / KNN (k=5) | 0.918 | 0.987 / 0.980 |
| 3 | NB | 0.906 | 0.985 |
| 4 | LDA | 0.882 | 0.991 |

---

<!-- SLIDE 21: Evaluación test -->

# Evaluación en Test — SVM (RBF, C=1)

<div class="columns">
<div class="col">

![w:350](outputs/svm/confusion_matrix_test.png)

</div>
<div class="col">

![w:350](outputs/svm/roc_curve_test.png)

</div>
</div>

| Recall | ROC-AUC | F1 | Accuracy |
|---|---|---|---|
| **0.929** | **0.995** | 0.940 | 0.956 |

- Recall test (0.929) ≈ Recall CV (0.959) → generaliza bien
- Solo **3 FN** de 42 muestras malignas
- ROC-AUC = 0.995 → discriminación casi perfecta

---

<!-- SLIDE 22: Conclusiones -->
<!-- _class: lead -->

# Conclusiones

<div style="display: flex; gap: 40px; text-align: left; font-size: 14px;">
<div style="flex: 1;">

**Resultados**
- SVM RBF: mejor clasificador (Recall CV=**0.959**)
- Todos superan 0.87 de Recall — dataset bien separable
- Tuning mejoró marginalmente — defaults razonables
- Pipeline con StandardScaler interno → sin data leakage

</div>
<div style="flex: 1;">

**Lo que nos enseñaron los modelos**
- Curvas de validación: trade-off bias-varianza claro (RF depth≥5 → overfit, k=1 → overfit)
- GridSearch no siempre da la mejor opción: RF depth=8 óptimo en grid, pero depth=4 reduce overfitting real
- Tuning fue marginal excepto LDA (+0.006 con shrinkage) — defaults sklearn razonables
- Limitar max_depth en RF reduce gap pero también recall — trade-off inevitable

</div>
</div>

<div class="callout-dark" style="margin-top: 30px;">
"Un modelo clínico debe optimizar lo que importa: detectar enfermos. La métrica es la hipótesis."
</div>
