## 1. Entorno y estructura

- [x] 1.1 Crear virtual environment (`python -m venv venv`) y requirements.txt con: pandas, numpy, matplotlib, seaborn, scipy, scikit-learn, jupyter
- [x] 1.2 Instalar dependencias y verificar que el kernel de Jupyter funcione
- [x] 1.3 Crear directorio `data/processed/`

## 2. Carga y vision general

- [x] 2.1 Crear `01_limpieza.ipynb` con markdown de titulo y alcance del TP2
- [x] 2.2 Celda de carga: leer `wdbc.data` sin header, asignar nombres de columna segun `wdbc.names` (feature_N_mean, feature_N_se, feature_N_worst)
- [x] 2.3 Eliminar columna ID, codificar target (B=0, M=1), verificar dtypes
- [x] 2.4 Celdas de vision general: `df.info()`, `df.describe()`, `df.isnull().sum()`
- [x] 2.5 Barplot de distribucion de clases B/M con conteo y porcentaje

## 3. EDA visual: distribuciones

- [x] 3.1 Grid de histogramas + curva Gauss ajustada para las 30 features (3 filas x 10 cols o 6x5)
- [x] 3.2 Grid de boxplots globales (IQR outliers) con conteo de outliers por feature
- [x] 3.3 Grid de boxplots por clase (B vs M) para las 30 features — clave para identificar features discriminativas

## 4. Analisis de correlacion

- [x] 4.1 Heatmap de correlacion de Pearson 30x30 (triangular inferior)
- [x] 4.2 Celda que liste todos los pares con |r| > 0.70 ordenados por correlacion absoluta descendente
- [x] 4.3 Correlacion point-biserial de cada feature con diagnosis, ordenada por valor absoluto descendente
- [x] 4.4 Tabla especifica de correlacion mean↔worst, mean↔se, se↔worst para cada feature base (evaluar opcion C)

## 5. Feature selection por multicolinealidad

- [x] 5.1 Markdown explicando criterio (|r| > 0.80) y approach
- [x] 5.2 Analizar grupo geometrico {radius, perimeter, area}: calcular correlacion entre ellos y con target, conservar el mas discriminativo, documentar
- [x] 5.3 Analizar {compactness, concavity, concave_points}: verificar si compactness (derivada) es redundante
- [x] 5.4 Para cada feature base, analizar mean/se/worst: si par con |r| > 0.80, conservar la de mayor |r| con target, documentar cada decision
- [x] 5.5 Ejecutar la limpieza: crear DataFrame limpio con features seleccionadas
- [x] 5.6 Markdown con tabla resumen: feature eliminada, correlacion con feature conservada, razon

## 6. Outlier check

- [x] 6.1 Calcular outliers IQR (1.5 * IQR) por feature en el dataset limpio, global y por clase
- [x] 6.2 Reportar cantidad y porcentaje de outliers por feature
- [x] 6.3 Markdown con conclusion: no se eliminan outliers (datos medicos reales, no errores)

## 7. Comparacion antes/despues

- [x] 7.1 Heatmap de correlacion del dataset limpio (post feature selection)
- [x] 7.2 Boxplots por clase con solo las features finales
- [x] 7.3 Markdown con resumen: N features original vs final, features eliminadas y por que

## 8. Split y export

- [x] 8.1 Stratified train_test_split (80/20, random_state=42) sobre dataset limpio
- [x] 8.2 Verificar proporciones B/M en train y test (diferencia < 1%)
- [x] 8.3 Exportar train.csv y test.csv a data/processed/ (features + target juntos, sin escalar)
