# Bitácora de Aprendizaje Continuo: Agente de Ingeniería de Datos

* **Agente**: `[Rol: Agente de Ingeniería de Datos]`
* **Misión**: Ingesta, perfilamiento, limpieza, imputación de nulos, codificación de variables y optimización de pipelines.

---

## 1. Registro de Errores Pasados y Soluciones (Lecciones Aprendidas)

| Fecha | Dificultad o Error Encontrado | Causa Raíz | Solución Aplicada y Regla Futura |
| :--- | :--- | :--- | :--- |
| Inicial | Fuga de datos (*data leakage*) en escalamiento y codificación. | Ajustar transformadores sobre la totalidad del dataset antes del split. | Separar estrictamente entrenamiento y test antes de cualquier `fit()`, aplicando transformaciones con `fit_transform()` solo en train y `transform()` en test. |

---

## 2. Mejores Prácticas y Atajos Metodológicos Consolidados
- Evitar imputación por media simple cuando existan valores atípicos; preferir mediana o imputación multivariada iterativa (KNN / MICE).
- Usar formato Parquet para almacenamiento intermedio por compresión y preservación exacta de tipos de datos.
- Validar tipos categóricos de baja cardinalidad transformándolos a `category` para reducir consumo de RAM.

---

## 3. Alineación con el Agente Especialista en Área de Dominio
- Consultar con el especialista de área el significado semántico de valores nulos (ej: en medicina un valor nulo puede significar prueba no realizada, no necesariamente dato faltante al azar).
- Incorporar variables derivadas propuestas por el especialista que representen ratios clave del sector.

---

## 4. Historial de Intervenciones y Evolución Técnica
- **Sesión Inicial**: Diseño de directrices de limpieza e ingesta segura de datos.
