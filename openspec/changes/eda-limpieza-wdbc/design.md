## Context

El TP2 requiere clasificacion supervisada sobre el dataset WDBC (Breast Cancer Wisconsin Diagnostic). El dataset tiene 569 instancias, 30 features numericos (10 features base x 3 estadisticos: mean, SE, worst), y un target binario (B/M). El dataset no tiene missing values declarados.

La estructura de features genera multicolinealidad severa en dos ejes: (1) radio/perimetro/area son funcionalmente dependientes, y (2) mean/se/worst de una misma feature estan altamente correlacionados. Ademas, compactness es una formula derivada de perimetro y area.

El TP1 (regresion sobre Wine Quality) establece el patron a seguir: notebook de EDA + limpieza, preprocesamiento compartido, modelos separados.

## Goals / Non-Goals

**Goals:**
- EDA completo con visualizaciones que sirvan para la presentacion del TP
- Feature selection documentada que elimine redundancia por multicolinealidad
- Split estratificado 80/20 exportado sin escalar
- Comparacion visual antes/despues de la limpieza
- Entorno reproducible (venv + requirements.txt)

**Non-Goals:**
- Escalado de datos (se delega a cada modelo dentro de su Pipeline de CV)
- Implementacion de modelos clasificadores
- Feature engineering (creacion de nuevas features)
- Balanceo de clases (63/37 es moderado, se manejara con metricas apropiadas)

## Decisions

**D1: Feature selection por correlacion empirica (opcion C)**
Para cada grupo de features correlacionadas, se analiza cual aporta mas informacion discriminativa (correlacion con target, variabilidad) en lugar de aplicar una regla fija. Se usa |r| > 0.80 como threshold para identificar pares candidatos a reduccion.

Alternativa descartada: quedarse solo con "worst" features (agresivo, pierde informacion potencial).

**D2: De {radio, perimetro, area} se conserva UNO**
Las tres son funcionalmente dependientes (perimetro = 2*pi*r, area = pi*r^2). La eleccion se basa en cual tiene mayor correlacion con el target y mayor variabilidad relativa.

**D3: Export sin escalar**
Los CSVs exportados no tienen escalado aplicado. Cada notebook de modelo carga los datos y escala dentro de un Pipeline de sklearn que se ajusta solo en el train fold de cada iteracion de CV. Esto evita data leakage dentro del cross-validation.

**D4: No se eliminan outliers**
Los datos provienen de mediciones de imagenes medicas con 4 digitos significativos. Los valores extremos representan tumores inusualmente grandes o irregulares, no errores de medicion. Eliminarlos seria eliminar los casos clinicamente mas relevantes.

**D5: Split estratificado en el notebook de limpieza**
El split se hace una sola vez (random_state=42) y se exporta. Todos los modelos usan el mismo split, garantizando comparabilidad. La estratificacion asegura proporcion B/M similar en train y test.

**D6: Virtual environment con requirements.txt**
Se crea un venv con las dependencias necesarias para todo el TP2 (no solo limpieza), para que los notebooks de modelos tambien lo usen.

## Risks / Trade-offs

- **[Sobre-selecion de features]** Si somos muy agresivos eliminando features correlacionadas, podriamos perder senal util. → Mitigacion: usar threshold de 0.80 (no 0.90), analizar cada par caso por caso, y documentar la variabilidad explicada que se pierde.
- **[569 samples es poco]** Con solo 569 instancias y 30 features, la relacion samples/features es baja (~19:1). Reducir features mejora esta relacion. → La feature selection por multicolinealidad es beneficiosa aqui.
- **[Correlacion no implica redundancia predictiva]** Dos features con r=0.85 pueden tener interacciones distintas con el target. → Mitigacion: verificar que la feature eliminada no tenga mejor correlacion individual con el target que la conservada.
