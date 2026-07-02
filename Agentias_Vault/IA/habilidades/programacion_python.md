# Habilidad de Programación en Python

Esta guía técnica instruye al agente sobre cómo estructurar, documentar y optimizar el desarrollo en Python, diferenciando los formatos de salida y aplicando los estándares de calidad del usuario.

---

## 1. Estructura según el Formato de Archivo

### A. Formato Jupyter Notebook (`.ipynb`)
Cuando se trabaja en cuadernos interactivos (indicado por el usuario o en la configuración del Dashboard), el código debe estar altamente documentado mediante celdas Markdown alternadas con celdas de código.

* **Celdas de Título e Introducción**: Al inicio de cada sección, crear una celda Markdown detallando el objetivo de la sección (ej: *"Carga de datos"*, *"Ajuste del modelo"*).
* **Comentarios y Explicaciones**: El texto en Markdown debe narrar la justificación de las decisiones técnicas y matemáticas tomadas, adaptándose al **Estilo de Escritura del Usuario** (riguroso, técnico y formal).
* **Estructura típica de celdas**:
  1. *Markdown*: Explicación de la variable o método a aplicar.
  2. *Código*: Ejecución modular del método.
  3. *Markdown*: Interpretación rápida del output obtenido.
* **Limpieza de Celdas**: Evitar celdas redundantes, impresiones masivas e innecesarias de bases de datos enteras (usar `.head()`, `summary()`, etc.) y mantener un flujo continuo y legible.

### B. Formato de Script Modular (`.py`)
Cuando se trabaja en archivos de script de Python planos:
* **Estructura Modular**: Dividir el código en funciones cortas con una sola responsabilidad.
* **Docstrings**: Cada función, clase o método debe incluir su docstring en formato de Google o Sphinx que explique su propósito, parámetros de entrada con su tipo y el valor de retorno.
* **Función de Control Principal (`main`)**: Los scripts ejecutables deben encapsular su lógica dentro de un bloque `if __name__ == '__main__':` y llamar a una función principal `main()`.
* **Manejo de Excepciones**: Uso adecuado de bloques `try-except` para capturar errores de ejecución (logs a consola y archivos locales).

---

## 2. Buenas Prácticas y Estilo de Código
* **PEP 8**: Cumplimiento estricto del estándar PEP 8 (nombres de variables en snake_case, constantes en UPPER_CASE, clases en CamelCase, sangrado de 4 espacios, etc.).
* **Entornos Virtuales**:
  * Utilizar siempre entornos virtuales aislados (`.venv`) para no contaminar el Python global.
  * Mantener el archivo `requirements.txt` actualizado mediante `pip freeze` después de cada instalación.
* **Librerías Permitidas**:
  * Manipulación de datos: `pandas`, `numpy`.
  * Visualización: `matplotlib`, `seaborn` (utilizando paletas visuales sobrias y de alto contraste).
  * Ciencia de Datos: `scikit-learn`, `statsmodels`.
  * Optimización: `optuna` (ver guía de optimización específica).
