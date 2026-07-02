# Habilidad de Programación en R

Esta guía técnica instruye al agente sobre cómo estructurar, documentar y optimizar el desarrollo en R, diferenciando los formatos de salida y aplicando los estándares de calidad del usuario.

---

## 1. Estructura según el Formato de Archivo

### A. Formato RMarkdown (`.Rmd`)
Cuando se trabaja en documentos dinámicos RMarkdown:
* **Estructura de Bloques (Chunks)**: Dividir el análisis en chunks independientes y con nombres descriptivos (ej: `{r cargar-datos}`, `{r modelo-cox}`).
* **Configuración del Chunk**: Utilizar las opciones de chunk (`echo = TRUE`, `warning = FALSE`, `message = FALSE`) para mantener el informe compilado limpio de advertencias pero mostrando el código relevante.
* **Prosa Explicativa**: Utilizar la sintaxis Markdown fuera de los chunks para narrar el flujo analítico y la interpretación estadística detallada al estilo de escritura formal del usuario.
* **Inline R**: Utilizar código R en línea (ej: `` `r median(cancer$stime)` ``) para referenciar valores estadísticos en el texto, evitando hardcodear números.

### B. Formato de Script Plano (`.R`)
Cuando se trabaja en scripts de R tradicionales:
* **Estructura de Secciones**: Utilizar cabeceras comentadas claras (ej: `# 1. Introducción ----------`) para segmentar el código.
* **Modularización**: Agrupar la lógica repetitiva en funciones parametrizadas.
* **Documentación**: Explicar al inicio del script las variables requeridas por la base de datos de entrada y el propósito del análisis.
* **Manejo de Librerías**: Cargar todas las librerías necesarias al principio del script utilizando `library()` (evitar `require()`).

---

## 2. Estilo de R y Buenas Prácticas
* **Estilo Tidyverse**: Priorizar el uso del pipe nativo (`|>`) o el pipe clásico (`%>%`) de `magrittr` para encadenar operaciones de manipulación de datos (`dplyr`, `tidyr`).
* **Visualizaciones con ggplot2**:
  * Diseñar gráficos profesionales utilizando `ggplot2` y `survminer` para análisis de supervivencia.
  * Personalizar temas sobrios (`theme_minimal()`, `theme_classic()`) y paletas cromáticas coherentes (evitar colores primarios de R por defecto).
* **Nombres de Variables**: Seguir la convención `snake_case` para variables y funciones.
* **Carga de Datos**: Utilizar paquetes modernos y eficientes para importar datos como `rio` (`import()`) o `readr`, garantizando rutas relativas limpias.
