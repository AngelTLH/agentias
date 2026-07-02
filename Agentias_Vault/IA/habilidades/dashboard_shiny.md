# Habilidad de Desarrollo de Dashboards con Shiny (R) — Plantilla Inspecciones Vehiculares

Esta guía técnica describe el diseño, la arquitectura y las directrices de mantenimiento para el dashboard interactivo de R Shiny basado en la plantilla de **Inspecciones Vehiculares**. 

El agente debe seguir estas especificaciones al modificar, depurar o extender la aplicación.

---

## 1. Arquitectura y Estructura del Proyecto
El dashboard se organiza en una subcarpeta `/Dashboard/` dentro del proyecto generado. Los componentes clave son:

* **Punto de Entrada**: `inspecciones_shiny.R`. Contiene tanto la definición visual (`ui`) como la lógica de negocio (`server`).
* **Estructura de Datos (`/data/`)**:
  * Contiene el set de datos principal en formato Parquet: `RANDOMIZED_INSPECCIONES_RNVM_MM_FP_PRT.parquet` (cargado mediante `arrow::read_parquet`).
  * Contiene el diccionario de variables en Excel: `Diccionario_INSPECCIONES_RNVM_MM_FP_PRT.xlsx` (con pestañas `INSPECCIONES`, `MM_TECNICO`, `FP_PERSONAS`, `PRT_REVISION`).
* **Recursos Adicionales**:
  * `/imagenes/`: Logos corporativos e institucionales (`ucm_logo.png`, `bci_logo.png`).
  * `/informe/`: Informe complementario en PDF (`Análisis de datos de base de inspecciones.pdf`).

### Dependencias Principales:
* `shiny`, `bslib` (diseño responsivo y temas CSS bootstrap 5).
* `data.table` (manipulación ultrarrápida de datos).
* `arrow` (lectura eficiente de archivos Parquet).
* `plotly` (gráficos interactivos e interactividad avanzada).
* `DT` (tablas paginadas interactivas).
* `readxl` (lectura de las hojas del diccionario de variables).

---

## 2. Preparación y Limpieza de Datos (Pipeline de Carga)
El script realiza una serie de normalizaciones críticas antes de renderizar la aplicación:
1. **Resolución de Rutas**: Utiliza funciones dedicadas (`resolve_data_path()`, `resolve_image_root()`, `resolve_dictionary_path()`) que priorizan variables de entorno antes de recurrir a rutas relativas locales.
2. **Tratamiento de Valores Especiales**:
   * `normalize_no_aplica()`: Convierte strings vacíos, `"NA"`, `"N/A"` y `"NULL"` en valores `NA_character_` reales de R.
3. **Conversión Numérica Segura**:
   * `parse_numeric_safely()`: Elimina puntos como separadores de miles, reemplaza comas por puntos decimales y maneja excepciones de texto para parsear variables como `SCORE`, `EDAD_INSPECCIONAR` y tasas a tipo `numeric` (`double`).
4. **Normalización de Estados**:
   * `normalize_estado_inspeccion()`: Convierte las variantes de estado a un factor limpio de dos niveles: `"Aprobada"` y `"Rechazada"`.
5. **Fecha y Meses**: Convierte `FECHA_INSPECCION` a `IDate` y deriva la variable temporal `MES` para series de tiempo.

---

## 3. Diseño Visual y Layout (UI)
El maquetado utiliza la función `page_navbar()` de `bslib` adaptada para pantallas de alta resolución con estilo corporativo:
* **Cabecera Personalizada (`topbar-branding-wrap`)**: Muestra los logos y un cuadro de créditos estático a la derecha (`topbar-info-box`).
* **Barra Lateral de Filtros (`sidebar`)**:
  * Filtros de rango continuo: año de fabricación, fecha de inspección.
  * Filtros de categorías: estado de inspección, año, tipo de vehículo, lugar, tipo de inspección, error de kilometraje.
  * Botones de control modal: "Información", "Diccionario", "Informe".
* **Páginas de Navegación (`nav_panel`)**:
  1. **Resumen**: Tarjetas KPI compactas (`value_box`) con métricas agregadas (Total, Aprobación, Rechazo, Edades promedio) y gráficos de distribución y series mensuales de aprobación.
  2. **Factores persona**: Gráficos cruzados de segmento socioeconómico (GSE) y comparaciones según sexo, ciclo de vida o score de riesgo.
  3. **Perfil Vehicular**: Análisis por marca, antigüedad, tipo de uso e indicadores de gama del automóvil.
  4. **Riesgo de Rechazo**: Mapas de correlación cuantitativa (heatmap interactivo) y boxplots de variables críticas.
  5. **Revisión Técnica Nacional (RTN)**: Resumen tabular dinámico e indicadores de procedencia de las plantas de revisión.
  6. **Diferencias**: Panel de análisis estadístico inferencial automatizado.
  7. **Datos**: Visualización directa de la tabla completa utilizando `DTOutput`.

---

## 4. Reactividad y Servidor (`server`)
Al dar soporte o expandir la aplicación, considera el flujo de reactivos:
* **Reactivo Principal `filtered_dt()`**: Filtra la base de datos `dt` reactivamente según los criterios de la barra lateral. Todos los gráficos y tablas del dashboard consumen esta expresión reactiva para garantizar consistencia estadística instantánea.
* **Control de Modales y Documentos**:
  * `input$open_info`: Lanza un diálogo modal detallando objetivos específicos.
  * `input$open_informe`: Abre un modal de pantalla ancha que incrusta el informe PDF a través de un tag `tags$iframe` apuntando al recurso estático `informe/`.
  * `input$open_diccionario`: Renderiza un layout de pestañas dinámicas donde cada pestaña carga un set de datos de variables extraído de las hojas del Excel.
* **Análisis de Diferencias Significativas**:
  * Evalúa de forma dinámica el tipo de datos seleccionado (`categorical` vs `numeric`) contra la variable binaria `ESTADO_INSPECCION`.
  * Diseñado para computar pruebas estadísticas (ej. Chi-cuadrado para categóricas, Test de Student o Wilcoxon para numéricas) y presentar la justificación clínica y matemática en formato HTML.
* **Optimización de Gráficos**:
  * Utiliza `plot_layout_exec()` para homogeneizar fuentes, fondos blancos y espaciados de Plotly.
  * La función `add_bar_pct_labels()` recorre la estructura JSON de Plotly para inyectar etiquetas de porcentaje en el centro de las barras.
