# AGENTS.md — TP2 Clasificación Supervisada (ML ITBA 72.75)

## Project Overview

Binary classification of breast tumors (benign/malignant) using the WDBC dataset.
Five sklearn classifiers are trained, tuned via k-fold CV, and compared on a held-out test set.
Academic project — deliverables are Jupyter notebooks + a 15-minute presentation (defense: 2026-05-13).

---

## Repository Layout

```
tp2/
├── 01_limpieza.ipynb          # EDA, feature selection, train/test split → exports processed CSVs
├── 02_clasificacion.ipynb     # All 5 classifiers, CV, hyperparam tuning, comparison (TO BUILD)
├── wdbc.data                  # Raw UCI dataset (569 rows, no header)
├── wdbc.names                 # Feature descriptions
├── consigna.pdf               # Assignment spec
├── requirements.txt           # Pinned Python deps
└── data/
    └── processed/
        ├── train.csv          # 455 rows × 18 cols (17 features + diagnosis)
        └── test.csv           # 114 rows × 18 cols (17 features + diagnosis)
```

Outputs (created by `02_clasificacion.ipynb`):
```
outputs/
├── naive_bayes/
├── lda/
├── svm/
├── knn/
└── rf/
```

---

## Dataset

- **Source:** UCI Breast Cancer Wisconsin Diagnostic (WDBC)
- **Raw:** `wdbc.data` — 569 instances, 32 columns (id, diagnosis, 30 features)
- **Processed (post `01_limpieza.ipynb`):** 17 features + `diagnosis` target

### Features retained after cleaning (17 total)

| Feature | Type | Note |
|---|---|---|
| `perimeter_mean` | mean | best of {radius, perimeter, area}_mean |
| `concave_points_mean` | mean | best of {compactness, concavity, concave_points}_mean |
| `symmetry_mean` | mean | no high inter-correlation |
| `fractal_dimension_mean` | mean | no high inter-correlation |
| `radius_se` | SE | best of {radius, perimeter, area}_se |
| `texture_se` | SE | dropped texture_mean (r=0.91 with texture_worst) |
| `smoothness_se` | SE | dropped smoothness_mean (r=0.81 with smoothness_worst) |
| `compactness_se` | SE | kept over compactness_mean/worst |
| `concave_points_se` | SE | |
| `symmetry_se` | SE | |
| `fractal_dimension_se` | SE | |
| `texture_worst` | worst | |
| `perimeter_worst` | worst | best of {radius, perimeter, area}_worst |
| `smoothness_worst` | worst | |
| `concave_points_worst` | worst | best of {compactness, concavity, concave_points}_worst |
| `symmetry_worst` | worst | |
| `fractal_dimension_worst` | worst | |

- **Target:** `diagnosis` — 0 = benign, 1 = malignant
- **Class balance:** 62.6% benign / 37.4% malignant (train); same ratio in test (stratified split)
- **Outliers:** intentionally retained — extreme values are clinically meaningful (mostly malignant)

---

## Notebook 01 — `01_limpieza.ipynb`

**Inputs:** `wdbc.data`
**Outputs:** `data/processed/train.csv`, `data/processed/test.csv`

### Steps
1. Load raw data, assign column names from `wdbc.names` schema
2. Drop `id`, encode `diagnosis` (B→0, M→1)
3. EDA: histograms, boxplots global, boxplots by class
4. Correlation matrix (Pearson) + pairs with |r| > 0.70
5. Feature selection by multicollinearity (|r| > 0.80 threshold):
   - Group geometric: {radius, perimeter, area} → keep highest |r(diagnosis)|
   - Derived: {compactness, concavity, concave_points} → keep highest |r(diagnosis)|
   - mean/SE/worst per base feature → keep highest |r(diagnosis)|
6. Outlier summary (IQR×1.5) — documented, not removed
7. Stratified 80/20 train-test split (`random_state=42`)
8. Export CSVs

---

## Notebook 02 — `02_clasificacion.ipynb` (to build)

**Inputs:** `data/processed/train.csv`, `data/processed/test.csv`
**Outputs:** `outputs/{model}/` per-model plot directories

### Architecture: single notebook, loop over all models

A top **CONFIG cell** defines which models to run and their hyperparameter grids.
The pipeline is model-agnostic: `Pipeline([StandardScaler, classifier])`.
A loop iterates over all models, runs CV, collects metrics, exports plots.

### CONFIG cell variables
```python
MODELS_TO_RUN = ["naive_bayes", "lda", "svm", "knn", "rf"]  # subset to run
METRICS       = ["recall", "roc_auc"]                        # chosen + justified
CV_FOLDS      = 5
RANDOM_STATE  = 42
OUTPUT_DIR    = "outputs"
```

### Model registry (cell after CONFIG)
```python
MODEL_REGISTRY = {
    "naive_bayes": GaussianNB(),
    "lda":         LinearDiscriminantAnalysis(),
    "svm":         SVC(probability=True, random_state=RANDOM_STATE),
    "knn":         KNeighborsClassifier(),
    "rf":          RandomForestClassifier(random_state=RANDOM_STATE),
}
PARAM_GRIDS = {
    "svm":  {"classifier__C": [...], "classifier__kernel": [...]},
    "knn":  {"classifier__n_neighbors": [...], "classifier__weights": [...]},
    "rf":   {"classifier__n_estimators": [...], "classifier__max_depth": [...]},
}
```

### Per-model pipeline (inside loop)
1. Build `Pipeline([("scaler", StandardScaler()), ("classifier", model)])`
2. `StratifiedKFold(n_splits=CV_FOLDS)` CV → collect fold metrics
3. For models with `PARAM_GRIDS`: plot validation curves per hyperparameter
4. Refit best estimator on full train set
5. Evaluate on test set
6. Export all plots to `outputs/{model_name}/`

### Final comparison cell
- Bar chart: all models × all metrics (CV mean ± std)
- Select best model → final test evaluation → confusion matrix + ROC curve

---

## Classifiers Required (consigna §2.1)

| Model | sklearn class | Hyperparams to tune |
|---|---|---|
| Naive Bayes | `GaussianNB` | none required |
| LDA | `LinearDiscriminantAnalysis` | none required |
| SVM | `SVC` | `C`, `kernel` |
| KNN | `KNeighborsClassifier` | `n_neighbors`, `weights` |
| RF | `RandomForestClassifier` | `n_estimators`, `max_depth` |

---

## Metrics (consigna §2.3)

Two metrics must be chosen and justified. Recommended for this dataset:
- **Recall (sensitivity):** minimize false negatives (missed malignant tumors) — clinical priority
- **ROC-AUC:** threshold-agnostic ranking metric, handles class imbalance

Both computed inside the CV pipeline to avoid data leakage.

---

## CV & Data Leakage Rules

- `StandardScaler` is **always inside** the sklearn `Pipeline` — never fit on full train before CV
- Test set (`test.csv`) is **never touched** until final model evaluation
- `StratifiedKFold` preserves class ratio across folds
- Validation curves use CV scores only (no test data)

---

## Dependencies

```
matplotlib==3.10.8
numpy==2.4.3
pandas==3.0.1
scikit-learn==1.8.0
scipy==1.17.1
seaborn==0.13.2
jupyter==1.1.1
```

Python 3.13 (miniconda). Install: `pip install -r requirements.txt`

---

## Presentation Requirements (consigna)

- 15 min talk + 10 min Q&A
- Must include: train/val/test separation explanation, CV scheme, metric justification, validation curves with overfitting/underfitting discussion, final model choice rationale
- Send slides + code **24h before** defense (2026-05-12)
- All numeric results must appear in slides

---

## Status

| Notebook | Status |
|---|---|
| `01_limpieza.ipynb` | Complete — outputs exported to `data/processed/` |
| `02_clasificacion.ipynb` | Not started |
