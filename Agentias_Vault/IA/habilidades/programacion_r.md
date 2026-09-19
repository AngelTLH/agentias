# Habilidad de Programación en R

Esta guía técnica instruye al agente sobre cómo estructurar, documentar y optimizar el desarrollo en R, diferenciando los formatos de salida y aplicando los estándares de calidad del usuario.

---

## 1. Estructura según el Formato de Archivo

### A. Formato RMarkdown (`.Rmd`) y Quarto (`.qmd`)
Cuando se trabaja en documentos dinámicos e interactivos:
* **Ubicación del Archivo Fuente**: Todo archivo `.Rmd` o `.qmd` debe residir dentro de una subcarpeta organizada en `/Codigos/` (ej: `/Codigos/Reportes/`, `/Codigos/Analisis_Rmd/`), nunca suelto en la raíz.
* **Estructura de Bloques (Chunks)**: Dividir el análisis en chunks independientes y con nombres descriptivos (ej: `{r cargar-datos}`, `{r modelo-cox}`).
* **Configuración del Chunk**: Utilizar las opciones de chunk (`echo = TRUE`, `warning = FALSE`, `message = FALSE`) para mantener el informe compilado limpio de advertencias pero mostrando el código relevante.
* **Prosa Explicativa**: Utilizar la sintaxis Markdown fuera de los chunks para narrar el flujo analítico y la interpretación estadística detallada al estilo de escritura formal del usuario (sin emojis, sin Title Case, lenguaje simple y directo).
* **Inline R**: Utilizar código R en línea (ej: `` `r median(cancer$stime)` ``) para referenciar valores estadísticos en el texto, evitando hardcodear números.
* **Protocolo de Compilación y Duplicación Obligatoria**:
  * Al compilar mediante `rmarkdown::render()` o Quarto, el entregable final (`.pdf` o `.html`) debe mantenerse en la subcarpeta de `/Codigos/` para preservar la trazabilidad de desarrollo.
  * Simultáneamente, es obligatorio copiar dicho archivo compilado (`.pdf` o `.html`) a su subcarpeta dedicada en `/Documentacion/Informes/<Nombre_Informe>/` para que el usuario o evaluador disponga del documento final en la sección de informes:
    ```r
    # Compilar en carpeta de código
    rmarkdown::render("Codigos/Reportes/informe_eda.Rmd", output_format = "pdf_document")

    # Duplicar entregable hacia Documentacion/Informes
    dir.create("Documentacion/Informes/Informe_EDA", recursive = TRUE, showWarnings = FALSE)
    file.copy("Codigos/Reportes/informe_eda.pdf", "Documentacion/Informes/Informe_EDA/informe_eda.pdf", overwrite = TRUE)
    ```

### B. Formato de Script Plano (`.R`)
Cuando se trabaja en scripts de R tradicionales:
* **Organización en Subcarpetas**: Todo script `.R` debe alojarse dentro de una subcarpeta temática en `/Codigos/` (ej: `/Codigos/EDA/`, `/Codigos/Modelos/`, `/Codigos/Preprocesamiento/`). Queda prohibido dejar scripts sueltos en `/Codigos/`.
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
