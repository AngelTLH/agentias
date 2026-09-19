# Habilidad de Programación en SQL

Esta guía técnica instruye al agente sobre cómo estructurar, optimizar y documentar el desarrollo en SQL (consultas puras y transformaciones compiladas), aplicando las mejores prácticas de ingeniería de datos y desarrollo analítico.

---

## 1. Estructura según el Formato de Archivo

### A. Formato Script / Consulta SQL (`.sql`)
Cuando se trabaja en archivos `.sql` tradicionales de consulta o migración:
* **Cabecera Informativa**: Incluir un bloque inicial comentado indicando el objetivo de la consulta, autor, fecha y tablas/vistas impactadas.
* **Modularidad con CTEs**: Priorizar Expresiones de Tabla Comunes (`WITH CTE_Nombre AS (...)`) sobre subconsultas anidadas. Cada CTE debe tener un propósito analítico claro y único.
* **Selección Explícita**: Especificar explícitamente las columnas requeridas (`SELECT id, fecha, monto...`), evitando el uso ineficiente de `SELECT *`.
* **Formateo y Mayúsculas**: Escribir palabras clave reservadas en mayúsculas (`SELECT`, `FROM`, `WHERE`, `GROUP BY`, `JOIN`, `ON`) y nombres de tablas o campos en minúsculas/`snake_case`.

### B. Formato Dataform / Query Compilada (`.sqlx`)
Cuando se trabaja con frameworks de desarrollo analítico como Dataform:
* **Bloque de Configuración**: Definir el tipo de tabla (`table`, `incremental`, `view`) e hiperparámetros en el encabezado `config { type: "...", schema: "..." }`.
* **Referencias Declarativas**: Utilizar funciones de referencia declarativas (`${ref("tabla_origen")}`) para mantener la linaje automático de datos.
* **Aserciones de Calidad**: Declarar aserciones para verificar claves primarias únicas (`uniqueKey`) y restricciones de no nulos (`nonNull`).

---

## 2. Buenas Prácticas y Optimización de Consultas
* **Filtrado Temprano**: Aplicar filtros en la cláusula `WHERE` antes de realizar agregaciones o `JOINs` voluminosos para reducir el volumen de datos en memoria.
* **Condiciones de JOIN explícitas**: Especificar claramente el tipo de `JOIN` (`INNER`, `LEFT`, `FULL`) y asegurar condiciones de cruce sobre columnas indexadas o llaves primarias/foráneas.
* **Agregaciones Transparentes**: Al usar `GROUP BY`, listar los índices numéricos o nombres explícitos de columnas agrupadas para máxima legibilidad.
* **Comentarios y Documentación**: Documentar reglas de negocio complejas dentro de la consulta mediante comentarios en línea (`--`) o de bloque (`/* ... */`).
* **Seguridad y Parametrización**: Utilizar consultas parametrizadas (`?` o `@parametro`) en integraciones con backends para evitar inyecciones SQL.
