# Guía de Estilo de Escritura Académica y Científica

Esta guía sintetiza el tono, vocabulario, estructura y reglas de estilo de redacción empleadas en informes académicos y presentaciones técnicas, permitiendo a la IA mantener un estilo con precisión y rigurosidad.

---

## 1. Tono y Voz
* **Riguroso y Formal**: El tono debe ser estrictamente académico, objetivo, formal y técnico. Se evita cualquier lenguaje coloquial, amigable de más o expresiones subjetivas.
* **Tercera Persona Impersonal**: Se escribe principalmente en tercera persona del singular o plural (ej: *"se analizó la base de datos"*, *"se procedió al ajuste del modelo"*, *"los resultados sugieren"*). Evitar la primera persona del singular (*"yo hice"*) o del plural (*"hicimos"*), a menos que sea un contexto reflexivo muy específico.
* **Precisión Científica**: Cada afirmación técnica debe ir acompañada de su respectivo respaldo estadístico, valor de significancia o bibliográfico (ej: *"arrojó un valor p = 0.03, indicando que..."* o *"como señala Smith (2020)..."*).

---

## 2. Vocabulario y Conectores Formales
* **Estadística y Metodología**: Uso preciso de términos científicos según el contexto (ej: *multicolinealidad*, *principio de parsimonia*, *criterio de información de Akaike (AIC)*, *intervalos de confianza*, *significancia estadística*, *análisis descriptivo exploratorio*, etc.).
* **Palabras de Enlace y Conectores Formales**:
  * Para introducir consecuencias: *Consecuentemente*, *Por lo tanto*, *Por consiguiente*.
  * Para contrastar: *No obstante*, *Sin embargo*, *A diferencia de*.
  * Para estructurar transiciones: *Comenzando con*, *Continuando con el análisis*, *Adicionalmente*, *En síntesis*.
  * Para argumentar: *Cabe destacar*, *Resulta notable*, *Para garantizar la rigurosidad*.

---

## 3. Estructura de Documentos (Informes Técnicos)
Cada informe formal debe estructurarse obligatoriamente bajo el siguiente orden lógico:

1. **Portada Institucional (LaTeX)**: Título del trabajo, asignatura o área de proyecto, integrantes, docente o evaluador, fecha y afiliación académica/corporativa (ej: *[Nombre de la Institución]*).
2. **Introducción y Objetivos**: Justificación teórica del problema y declaración del objetivo general en negrita.
3. **Descripción de Datos y Preparación de Variables**: Detalle de la muestra, tabla de variables con su naturaleza y tipo, y notas técnicas sobre la codificación.
4. **Análisis Descriptivo y Exploratorio (EDA)**: Distribución de variables clave y análisis de correlación.
5. **Modelamiento / Ajuste Inicial**: Justificación del modelo seleccionado e implementación matemática en LaTeX.
6. **Selección del Modelo Óptimo**: Comparación de modelos utilizando indicadores de ajuste (AIC, BIC o contrastes de verosimilitud) justificando bajo el principio de parsimonia.
7. **Verificación de Supuestos y Diagnóstico**: Prueba matemática y gráfica de los supuestos del modelo.
8. **Interpretación de Resultados**: Explicación clínica, matemática y práctica de los coeficientes estimados.
9. **Conclusiones**: Resumen de los hallazgos principales y recomendaciones futuras.
10. **Bibliografía**: Listado en formato APA/IEEE estricto.
11. **Anexos**: Código fuente completo y comentado (ej: script de R o Python) estructurado bajo las mismas secciones del informe.

---

## 4. Estructura de Presentaciones (Diapositivas)
* **Síntesis y Apoyo Visual**: Las diapositivas deben actuar como apoyo visual del discurso, no como un documento a leer. Deben evitarse bloques largos de texto.
* **Organización**: Estructuradas con una diapositiva de portada, introducción rápida, metodología y datos resumidos en tablas, gráficos claros de resultados con breves interpretaciones en viñetas, y una conclusión concisa.

---

## 5. Reglas de Formateo y Notación en LaTeX
* **Fórmulas y Ecuaciones**: Todas las ecuaciones matemáticas complejas deben escribirse en modo bloque `$$ ... $$` o usando el entorno `\begin{equation} ... \end{equation}`.
* **Tablas en LaTeX**:
  * Utilizar el paquete `tabularx` para garantizar que las tablas se ajusten al ancho de la página (`\textwidth`).
  * Aplicar el estilo institucional: líneas superiores e inferiores de 1.5pt (`\toprule[1.5pt]`, `\bottomrule[1.5pt]`), y líneas intermedias finas (`\midrule[1pt]`).
  * Utilizar tonos institucionales oscuros para las cabeceras (ej: `[Color Primario / Marca]`) y contrastar con texto blanco.
* **Figuras**: Centradas, con escala adecuada (ej: `[width=0.6\textwidth]`) y siempre dentro de un entorno `figure` flotante con su respectivo `\caption` y `\label` para referencias cruzadas.
