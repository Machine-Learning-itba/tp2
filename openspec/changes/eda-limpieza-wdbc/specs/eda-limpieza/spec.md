## ADDED Requirements

### Requirement: Notebook de carga y vision general
El notebook 01_limpieza.ipynb SHALL cargar wdbc.data con nombres de columna descriptivos derivados de wdbc.names, eliminar la columna ID, y codificar el target (B=0, M=1).

#### Scenario: Carga correcta del dataset
- **WHEN** se ejecuta la celda de carga
- **THEN** el DataFrame tiene 569 filas, 31 columnas (30 features + 1 target codificado numericamente), y la columna ID no esta presente

#### Scenario: Verificacion de missing values
- **WHEN** se ejecuta df.isnull().sum()
- **THEN** el resultado es 0 para todas las columnas

### Requirement: EDA visual de distribuciones
El notebook SHALL generar histogramas con curva de Gauss ajustada para las 30 features, boxplots globales (IQR), y boxplots por clase (B vs M) que permitan visualizar que features discriminan entre clases.

#### Scenario: Histogramas generados
- **WHEN** se ejecuta la seccion de distribuciones
- **THEN** se genera un grid de 30 histogramas con curva normal superpuesta mostrando media y desvio

#### Scenario: Boxplots por clase generados
- **WHEN** se ejecuta la seccion de boxplots por clase
- **THEN** se genera un grid de boxplots donde cada feature muestra su distribucion separada por B y M, permitiendo identificar features discriminativas

### Requirement: Analisis de correlacion
El notebook SHALL generar un heatmap de correlacion de Pearson 30x30, listar todos los pares de features con |r| > 0.70, y calcular la correlacion point-biserial de cada feature con el target.

#### Scenario: Correlacion entre features reportada
- **WHEN** se ejecuta la seccion de correlacion
- **THEN** se genera una tabla de pares con |r| > 0.70 ordenados por correlacion absoluta descendente

#### Scenario: Correlacion con target reportada
- **WHEN** se ejecuta la seccion de correlacion con target
- **THEN** se genera una lista de features ordenadas por correlacion absoluta con diagnosis

### Requirement: Feature selection por multicolinealidad
El notebook SHALL eliminar features redundantes siguiendo criterios documentados: (1) de {radio, perimetro, area} conservar UNO basado en informacion discriminativa, (2) para mean/se/worst analizar correlacion empirica caso por caso conservando la que mas aporta, (3) compactness y features derivadas se evaluan contra las originales. El threshold para considerar correlacion problematica SHALL ser |r| > 0.80.

#### Scenario: Seleccion dentro de grupo geometrico
- **WHEN** se analiza el grupo {radius, perimeter, area}
- **THEN** se conserva unicaente la feature con mayor valor discriminativo y se documentan las correlaciones del par eliminado

#### Scenario: Seleccion mean/se/worst por feature
- **WHEN** se analiza cada feature base con sus 3 estadisticos (mean, SE, worst)
- **THEN** se conservan las estadisticas que no superen |r| > 0.80 entre si; las que lo superen se reducen conservando la de mayor correlacion absoluta con el target

#### Scenario: Decision documentada
- **WHEN** se elimina una feature
- **THEN** el notebook incluye una celda markdown explicando la razon con la correlacion exacta y la comparacion con la feature conservada

### Requirement: Outlier check
El notebook SHALL realizar un analisis de outliers identificando valores fuera del rango IQR*1.5 para cada feature, tanto global como por clase. La conclusion esperada es que no se eliminan outliers por tratarse de datos medicos reales.

#### Scenario: Outliers identificados
- **WHEN** se ejecuta el analisis de outliers
- **THEN** se reporta la cantidad y porcentaje de outliers IQR por feature

#### Scenario: Decision de no eliminacion
- **WHEN** se evaluan los outliers detectados
- **THEN** el notebook documenta que no se eliminan porque representan tumores inusualmente grandes/irregulares, no errores de medicion

### Requirement: Comparacion antes/despues
El notebook SHALL incluir una seccion que compare el dataset antes y despues de la feature selection, mostrando: numero de features original vs final, heatmaps de correlacion antes y despues, y un resumen de features eliminadas con su razon.

#### Scenario: Resumen de cambios
- **WHEN** se ejecuta la seccion de comparacion
- **THEN** se muestra una tabla con cada feature eliminada, la feature con la que estaba correlacionada, el valor de r, y la razon de la eliminacion

### Requirement: Split estratificado y export
El notebook SHALL realizar un split estratificado 80/20 (random_state=42) sobre el dataset limpio (post feature selection, SIN escalar) y exportar 2 archivos CSV a data/processed/: train.csv y test.csv, cada uno con features + target.

#### Scenario: Split correcto
- **WHEN** se ejecuta el split
- **THEN** train.csv tiene ~455 filas, test.csv tiene ~114 filas, y la proporcion B/M se mantiene en ambos conjuntos (diferencia < 1%)

#### Scenario: Archivos exportados
- **WHEN** se ejecuta la celda de export
- **THEN** existen los archivos data/processed/train.csv y data/processed/test.csv, ambos con features + columna target, sin escalar

### Requirement: Entorno reproducible
El proyecto SHALL incluir un archivo requirements.txt con las dependencias necesarias (pandas, numpy, matplotlib, seaborn, scipy, scikit-learn, jupyter) y instrucciones para crear el virtual environment.

#### Scenario: Instalacion limpia
- **WHEN** se crea un venv nuevo y se ejecuta pip install -r requirements.txt
- **THEN** todas las dependencias se instalan sin errores y el notebook se puede ejecutar completamente
