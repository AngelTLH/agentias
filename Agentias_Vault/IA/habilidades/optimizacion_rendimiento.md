# Habilidad de Optimización de Rendimiento, Memoria y Profiling

Esta habilidad establece las técnicas y directrices de ingeniería para perfilar, optimizar el uso de memoria RAM, reducir los tiempos de cómputo y minimizar la latencia de inferencia en proyectos de ciencia de datos y desarrollo de software.

---

## 1. Profiling y Diagnóstico de Cuellos de Botella
* **Principio de Medición Previa**: Nunca optimizar a ciegas sin antes medir empíricamente los cuellos de botella (Ley de Amdahl).
* **Herramientas de Diagnóstico**:
  * **Python (CPU)**: Usar el módulo estándar `cProfile` o herramientas interactivas como `line_profiler` (`@profile`) para identificar qué líneas exactas consumen la mayor parte del tiempo de ejecución.
  * **Python (Memoria)**: Usar `memory_profiler` o `tracemalloc` para rastrear picos de asignación de RAM y detectar memory leaks.
  * **R**: Emplear `profvis` para visualizar de forma interactiva el árbol de ejecución y consumo de memoria.

---

## 2. Optimización de Memoria en DataFrames
* **Downcasting de Tipos de Datos (Pandas / Polars)**:
  * Convertir enteros de 64 bits (`int64`) a subtipos de menor huella (`int32`, `int16`, `int8`) cuando el rango de valores lo permita.
  * Reducir flotantes de doble precisión (`float64`) a precisión simple (`float32`) si la precisión numérica no se ve comprometida.
  * Convertir columnas de texto repetitivas a tipo `category` en Pandas, reduciendo el consumo de memoria hasta en un 80%.
* **Lectura en Chunks y Procesamiento por Lotes**: Para archivos grandes que exceden la memoria RAM disponible, procesar mediante bloques con `pandas.read_csv(..., chunksize=N)` o migrar a motores lazy como **Polars** o **DuckDB**.

---

## 3. Vectorización y Paralelización
* **Eliminación de Bucles Explícitos**:
  * Prohibido iterar filas de DataFrames mediante `for` o `.iterrows()`.
  * Reemplazar por operaciones vectorizadas nativas en NumPy/Pandas o métodos optimizados `.apply()` con funciones de C subyacentes.
* **Procesamiento Paralelo**:
  * Aprovechar múltiples núcleos mediante `joblib.Parallel` o el módulo `multiprocessing` para tareas intensivas en CPU (embarrassingly parallel), como validaciones cruzadas personalizadas o simulaciones de Monte Carlo.

---

## 4. Latencia de Inferencia en Modelos de Machine Learning
* **Exportación a Formatos de Alto Rendimiento**:
  * Para modelos entrenados en Scikit-Learn, PyTorch o XGBoost, exportar al formato **ONNX** y ejecutar inferencias con `onnxruntime` para aceleración de latencia.
* **Batch Inferences**: Agrupar peticiones de inferencia entrantes en lotes (*micro-batching*) para maximizar el throughput en entornos de producción con APIs REST.
