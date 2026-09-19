# Habilidad de Programación General

Esta guía describe los fundamentos lógicos y metodológicos aplicables a cualquier lenguaje de programación (Python, R, Java, JS), garantizando un diseño de código eficiente, mantenible y robusto.

---

## 1. Lógica Algorítmica y Eficiencia
* **Complejidad Algorítmica**: Analizar y documentar el impacto de la complejidad temporal y espacial (notación Big O) de las funciones críticas de procesamiento de datos.
* **Estructuras de Datos**: Seleccionar las estructuras óptimas para cada problema (ej: diccionarios/maps para búsquedas $O(1)$, listas para secuencias indexadas, conjuntos para operaciones de pertenencia única).
* **Control de Flujo Limpio**:
  * Evitar anidaciones excesivas de condicionales (límite de 3 niveles de indentación).
  * Aplicar cláusulas de guarda (*guard clauses*) para resolver casos de salida temprana al inicio de las funciones, reduciendo bloques `else` innecesarios.

---

## 2. Principios de Clean Code y Diseño
* **Legibilidad y Nombres Significativos**:
  * Los nombres de variables, funciones y clases deben autodeclarar su propósito. Evitar nombres de una sola letra (excepto en bucles cortos `i`, `j`).
  * Utilizar verbos para nombres de funciones (ej: `calcular_media()`, `validar_datos()`) y sustantivos para variables (ej: `edad_pacientes`).
* **Modularidad y DRY (Don't Repeat Yourself)**:
  * Si un fragmento de código con lógica idéntica se repite dos o más veces, debe ser extraído a una función o método parametrizado.
  * Mantener las funciones enfocadas en una sola tarea (Principio de Responsabilidad Única).
* **Control de Versiones (Git)**:
  * Escribir mensajes de commit atómicos, claros y descriptivos en imperativo (ej: *"feat: agregar cálculo de razón de verosimilitud"* o *"fix: corregir tipado en entrada stime"*).

---

## 3. Depuración y Resolución de Errores
* **Método de Aislamiento**: Ante un fallo o bug, aislar la sección de código problemática, replicar el error mediante un caso de prueba mínimo y verificar los datos en cada etapa intermedia.
* **Logging Eficiente**: Reemplazar impresiones genéricas en consola (`print`) por un sistema de logging estructurado que categorice los mensajes por niveles de severidad (`DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`).

---

## 4. Organización Física de Archivos, Compilados y Rutas Personalizadas
* **Estructuración en Subcarpetas dentro de `/Codigos/`**:
  * Queda estrictamente prohibido guardar scripts o archivos sueltos en la raíz de `/Codigos/`.
  * Todo código debe alojarse en subcarpetas funcionales según su naturaleza (ej: `/Codigos/EDA/`, `/Codigos/Modelos/`, `/Codigos/Reportes/`, `/Codigos/Limpieza/`, `/Codigos/Tests/`).
* **Duplicación Obligatoria de Entregables Compilados**:
  * Cuando un script o documento ejecutable (como `.Rmd`, `.qmd`, `.ipynb`, scripts de visualización) compile documentos finales en PDF (`.pdf`) o HTML (`.html`):
    * El documento compilado debe mantenerse en la subcarpeta correspondiente dentro de `/Codigos/` junto al código ejecutable para garantizar reproducibilidad técnica.
    * Debe copiarse obligatoriamente una réplica idéntica a su subcarpeta dedicada en `/Documentacion/Informes/<Nombre_Informe>/`, permitiendo al usuario revisar el entregable final de forma centralizada.
* **Memoria y Respeto de Rutas Personalizadas**:
  * Si el usuario solicita guardar archivos en una carpeta específica o no convencional para un módulo de trabajo, el agente debe registrar la ruta en `IA/bitacora.md`.
  * En todas las interacciones posteriores donde se mencione o se trabaje en dicho módulo, el agente debe emplear de forma prioritaria y obligatoria esa ruta personalizada, sin revertir a las convenciones estándar a menos que se indique lo contrario.

