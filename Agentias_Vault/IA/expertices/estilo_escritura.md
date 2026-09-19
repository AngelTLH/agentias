# Guía Maestra de Estilo de Escritura del Usuario

Esta guía define el ADN de redacción técnica (tono sobrio, conciso, científico e impersonal), modelado a partir de los estándares del ecosistema Agentias y los ejemplos depositados en `/Documentacion/Ejemplos/`.

Cualquier agente que deba redactar texto (informes en LaTeX, reportes ejecutivos, dashboards, páginas web, bitácoras o explicaciones) debe ceñirse **estricta y obligatoriamente** a estas directrices.

---

## 🚫 1. Reglas Negativas No Negociables (Tolerancia Cero)

### A. Prohibición Absoluta de Emojis
* **Queda terminantemente prohibido el uso de emojis** en cualquier documento, informe, presentación, dashboard, interfaz web, comentario de código, tabla o bitácora. Cero emojis.
* Ni en títulos, ni en viñetas, ni al inicio de párrafos, ni en mensajes de confirmación.

### B. Prohibición de Abuso de Mayúsculas (Cero "Title Case")
* En idioma español, las mayúsculas se utilizan **únicamente donde es gramáticamente correcto**:
  1. Letra inicial de una oración o párrafo.
  2. Nombres propios (ej: *Chile*, *América Latina*, *Organización Mundial de la Salud*).
  3. Siglas y acrónimos reconocidos (ej: *EDA*, *AIC*, *BIC*, *HR*, *ROC*, *AUC*, *SQL*).
  4. Nombres exactos de variables o columnas de bases de datos que en el código estén en mayúsculas (ej: `ESTADO_INSPECCION`, `KILOMETRAJE_ACTUAL`).
* **Prohibido el "Title Case" en títulos y subtítulos**: No capitalizar cada palabra.
  * ❌ **Incorrecto**: `1. Introducción Y Objetivos`, `3. Análisis Descriptivo Y Exploratorio`, `Tabla 1: Resumen Estadístico De Variables`.
  * ✅ **Correcto**: `1. Introducción y objetivos`, `3. Análisis descriptivo y exploratorio`, `Tabla 1: Resumen estadístico de variables`.

### C. Lenguaje Concreto y Simple (Sin Palabras Raras ni Pedantes)
* El usuario escribe con rigor y precisión científica, pero con **palabras comunes, claras, naturales y directas**.
* **Prohibido el vocabulario pomposo, florido, rebuscado o artificial de IA**:
  * ❌ Palabras vetadas: *menester*, *plétora*, *ubérrimo*, *huelga decir*, *sin parangón*, *epítome*, *paradigma holístico*, *intrincado entramado*, *cosmovisión*, *concomitante*, *laudable*.
  * ✅ Palabras naturales y correctas: *importante*, *necesario*, *conjunto*, *desgaste*, *antigüedad*, *comportamiento*, *diferencias*, *tendencia*, *resultados*, *hallazgos*.

### D. Neutralidad de Autoría y Cero Suposición Académica (Tolerancia Cero)
* **Angel Llanos Herrera es el autor y creador del framework Agentias** (marca de agua de la plataforma).
* **Queda terminantemente prohibido colocar a Angel Llanos Herrera como autor** de los informes, tareas, códigos, scripts o trabajos elaborados por los agentes para el usuario.
* En cualquier documento generado, el campo de autor debe quedar vacío o contener un marcador neutro (ej: `[Nombre del autor]`), o bien el agente debe consultar activamente al usuario qué nombre desea colocar.
* **Queda estrictamente prohibido suponer profesores, docentes, evaluadores, asignaturas o instituciones**:
  * Los agentes jamás deben inferir o completar nombres de profesores, universidades o asignaturas basándose en documentos de ejemplo o referencias históricas.
  * Si el usuario solicita un trabajo o tarea académica, el agente debe dejar marcadores neutros (ej: `[Docente / Evaluador]`, `[Asignatura]`, `[Institución]`) o consultar explícitamente al usuario los datos de su curso.

---

## ✍️ 2. Tono, Voz y Persona Gramatical

* **Tercera Persona Impersonal**: Se redacta en tercera persona impersonal de forma consistente:
  * *"Se analizó la base de datos..."*, *"Se procedió a estimar los parámetros..."*, *"Los resultados sugieren que..."*, *"Al comparar ambos modelos, se evidencia..."*.
  * Nunca usar primera persona singular (*"yo estimé"*) ni plural informal (*"hicimos un gráfico"*).
* **Sobriedad y Objetividad**: Sin exageraciones ni juicios de valor grandilocuentes. Cada aseveración se sustenta en cifras o en literatura.
* **Explicación Intuitiva de Números**: Cuando se presentan medidas estadísticas, se desglosa su interpretación práctica tal como hace el usuario en sus informes:
  * Ejemplo real del usuario: *"La edad de los pacientes fluctúa entre 34 y 81 años, donde la mitad de ellos tienen hasta 62 años, y la mitad restante igual o más de 62 años."*
  * Ejemplo real del usuario: *"La variable 'diag.time' tiene una mediana de 5 meses, indicando que la mitad de los pacientes esperaron hasta 5 meses desde el diagnóstico hasta pasar al ensayo."*

---

## 🔗 3. Conectores y Fórmulas de Transición Reales del Usuario

El usuario utiliza una estructura de párrafos muy fluida, apoyada en los siguientes conectores característicos:

* **Para iniciar secciones o análisis**:
  * *"Comenzando con la preparación para el análisis..."*
  * *"El presente análisis se desarrolló sobre una base consolidada de..."*
  * *"El primer paso para este análisis recayó en..."*
* **Para continuar y desarrollar**:
  * *"Continuando con el análisis, el resumen de las covariables..."*
  * *"Junto con esto, se evidencia una tendencia al alza en..."*
  * *"A su vez, el análisis también permite identificar..."*
  * *"En particular, destacan variables como..."*
  * *"De forma general, los registros muestran..."*
  * *"En cuanto a las variables provenientes de..."*
* **Para contrastar o acotar**:
  * *"Sin embargo, dado que estas variables..."*
  * *"No obstante, esta variable se consideró de forma separada..."*
  * *"Por el contrario, las observaciones censuradas presentan..."*
  * *"A diferencia de los métodos no paramétricos..."*
* **Para enfatizar detalles metodológicos**:
  * *"Cabe destacar una consideración técnica fundamental..."*
  * *"Para garantizar la rigurosidad estadística..."*
  * *"Esto refuerza la idea de que..."*
* **Para concluir o sintetizar**:
  * *"Consecuentemente, el objetivo general de este trabajo es..."*
  * *"Por lo tanto, el comportamiento no parece explicarse por un único factor..."*
  * *"En consecuencia, el principal aporte de este análisis consiste en..."*
  * *"Finalmente, los resultados indican que..."*

---

## 📑 4. Estructura Típica de Informes y Documentos Técnicos

Al estructurar informes en LaTeX (o reportes equivalentes), seguir fielmente el orden canónico del usuario:

1. **Identificación / Portada**: Título concreto y centrado, autor(es) (usar marcador neutro `[Nombre del Autor]` o consultar al usuario; jamás colocar el nombre del creador de Agentias), docente / asignatura / institución (usar marcadores neutros `[Nombre del Docente]`, `[Asignatura]` o consultar al usuario; jamás asumir nombres de ejemplos), fecha sin florituras.
2. **Resumen o Introducción y objetivos**: Descripción breve del problema, justificación y **objetivo general en negrita**.
3. **Descripción de datos y preparación de variables**: Descripción de la muestra (N total, procedencia), tabla de variables con su naturaleza y tipo, y decisiones de codificación o limpieza.
4. **Análisis descriptivo y exploratorio**: Comportamiento de la variable objetivo, distribución de covariables continuas y categóricas, tablas resumen y figuras con captions descriptivos.
5. **Modelamiento y contraste**: Justificación teórica del modelo, presentación de fórmulas matemáticas en LaTeX y estimación de parámetros.
6. **Diagnóstico y supuestos**: Comprobación rigurosa de supuestos (pruebas de bondad de ajuste, residuos, valores influyentes).
7. **Interpretación de hallazgos**: Traducción de los coeficientes a conclusiones prácticas y medibles.
8. **Conclusiones**: Síntesis concisa de los hallazgos principales y limitaciones.
9. **Bibliografía**: Citas formales (APA o formato BibTeX).

---

## 📐 5. Formato de Tablas y Figuras (LaTeX y Markdown)

* **Títulos de Tablas y Figuras**: Breves, informativos, sin mayúsculas superfluas.
  * `Tabla 1: Descripción de las variables incluidas en la base de datos`
  * `Tabla 2: Resumen estadístico de covariables clínicas`
  * `Figura 1: Distribución del tiempo observado según el estado del paciente`
* **Estilo en LaTeX**:
  * Tablas con `tabularx` y líneas `\toprule`, `\midrule`, `\bottomrule` (paquete `booktabs`).
  * Sin líneas verticales en las tablas.
  * Encabezados limpios y texto alineado apropiadamente (números a la derecha o centrados, texto a la izquierda).

---

## 🔍 6. Tabla Comparativa: Cómo Escribe el Usuario vs. Cómo NO Debe Escribir la IA

| Elemento | ❌ Redacción Típica de IA (Prohibida) | ✅ Redacción Auténtica del Usuario (Obligatoria) |
| :--- | :--- | :--- |
| **Título** | `3. Análisis Descriptivo Y Modelamiento Predictivo 📊` | `3. Análisis descriptivo y modelamiento predictivo` |
| **Apertura** | `En el presente e intrincado estudio, nos sumergiremos en una fascinante exploración...` | `El presente análisis se desarrolló sobre una base consolidada de 305 516 registros...` |
| **Mediana** | `La variable ostenta una mediana de 62, denotando un epítome de madurez en la cohorte.` | `La edad fluctúa entre 34 y 81 años, donde la mitad de los pacientes tienen hasta 62 años.` |
| **Conectores** | `Es menester recalcar que, de manera holística e inefable...` | `Cabe destacar una consideración técnica fundamental...` |
| **Conclusión** | `¡En conclusión, los resultados son sumamente prometedores! 🚀🎉` | `En consecuencia, el principal aporte de este análisis consiste en identificar...` |
| **Tablas** | `Tabla 1: Las Magníficas Variables Del Dataset 📋` | `Tabla 1: Descripción de las variables incluidas en la base de datos` |

---

## 📂 7. Documentos de Referencia Obligatoria en el Repositorio

Antes de redactar cualquier documento extenso, el agente debe consultar y cotejar su vocabulario contra los archivos reales ubicados en:
* `/Documentacion/Ejemplos/` (informes y plantillas de redacción).

Todo texto final debe pasar esta prueba: **"Si se lee en voz alta, suena natural, sobrio, sin emojis, sin mayúsculas excesivas y con un lenguaje técnico directo e impersonal."**
