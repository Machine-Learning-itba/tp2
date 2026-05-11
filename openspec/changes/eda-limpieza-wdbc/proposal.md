## Why

El TP2 de Aprendizaje Automatico requiere entrenar y evaluar 5 clasificadores supervisados (Naive Bayes, LDA, SVM, KNN, RF) sobre el dataset Breast Cancer Wisconsin (WDBC). Antes de modelar, es necesario realizar un EDA riguroso, limpiar el dataset (feature selection por multicolinealidad), y preparar los datos en formato listo para consumo por los notebooks de cada modelo. Sin esta etapa, los modelos reciben features redundantes que degradan performance y complican la interpretacion.

## What Changes

- Se crea un notebook `01_limpieza.ipynb` que carga `wdbc.data`, realiza EDA completo, selecciona features, y exporta train/test splits.
- Se crea un virtual environment con `requirements.txt` para reproducibilidad.
- Se eliminan features con alta correlacion (|r| > 0.80) entre si, analizando caso por caso (opcion C para mean/se/worst).
- Se realiza split estratificado 80/20 y se exportan 2 CSVs (train.csv, test.csv) sin escalar (escalado se hace dentro de cada modelo via Pipeline CV).
- Se documenta cada decision de feature selection con justificacion.

## Capabilities

### New Capabilities
- `eda-limpieza`: Notebook de exploracion, limpieza y preparacion del dataset WDBC. Incluye EDA visual, analisis de correlacion, feature selection por multicolinealidad, outlier check, split estratificado, y export de datos procesados.

### Modified Capabilities

## Impact

- Nuevos archivos: `01_limpieza.ipynb`, `requirements.txt`, `data/processed/{train,test}.csv`
- Dependencias: pandas, numpy, matplotlib, seaborn, scipy, scikit-learn, jupyter
- Los notebooks de modelos (posteriores) consumiran los CSVs exportados
