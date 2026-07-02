# Habilidad de Despliegue, Empaquetado y MLOps Productivo

Esta habilidad define los estándares y directrices técnicas para empaquetar, serializar y desplegar modelos de machine learning y aplicaciones web en entornos de producción.

---

## 1. Serialización del Modelo
*   **Formatos Permitidos**:
    *   **Python**: Usar `joblib` para modelos tradicionales (Scikit-Learn, XGBoost, LightGBM) debido a su eficiencia con arrays de numpy, o `pickle` como alternativa. Para modelos de Deep Learning, preferir el formato nativo `.keras` u `.h5`, o exportar a **ONNX** para interoperabilidad.
    *   **R**: Guardar objetos serializados utilizando `saveRDS()` (formato `.rds`) para permitir su lectura individual y asignación a nuevas variables.
*   **Garantía de Metadatos**: Al guardar el modelo, es obligatorio adjuntar un diccionario de metadatos que registre la fecha de entrenamiento, las variables de entrada requeridas, sus tipos de datos, la versión de las librerías utilizadas y el índice de rendimiento obtenido en la validación.

---

## 2. Construcción de APIs REST
Las APIs deben ser el único punto de entrada para realizar inferencias en tiempo real:
*   **Frameworks recomendados**:
    *   **FastAPI (Python)**: Utilizar clases de `pydantic` (`BaseModel`) para validar de forma estricta el esquema y tipo de los datos recibidos (request). Habilitar la documentación Swagger automática y estructurar los endpoints en base a métodos `POST` para inferencias.
    *   **Plumber (R)**: Documentar funciones mediante anotaciones roxygen2 (ej. `#* @post /predict`) para exponer la API REST de inferencia.
*   **Control de Errores y Logs**: Implementar bloques `try-except` globales que atrapen fallos de formato o nulos en la entrada de datos, retornando códigos HTTP semánticos (ej. `422 Unprocessable Entity` para datos inválidos) y registrando el error detallado en el canal de salida estándar (logs).

---

## 3. Contenedorización con Docker
Para asegurar la consistencia del entorno en cualquier servidor:
*   **Dockerfile Multi-stage**: Estructurar el archivo Dockerfile utilizando compilaciones de múltiples etapas para mantener la imagen de producción ligera y libre de dependencias de desarrollo.
*   **Base Segura**: Utilizar imágenes base oficiales y ligeras (como `python:3.10-slim` o `rocker/r-ver:4.3`).
*   **Variables de Entorno**: Configurar todas las credenciales de APIs, rutas y modos de ejecución a través de variables de entorno, nunca dejándolas escritas en el código fuente (hardcoded).
