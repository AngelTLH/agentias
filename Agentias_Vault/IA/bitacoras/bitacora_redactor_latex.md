# Bitácora de Aprendizaje Continuo: Agente Redactor de LaTeX

* **Agente**: `[Rol: Redactor de LaTeX]`
* **Misión**: Redacción técnica, informes formales en `/Documentacion/Informes/`, presentaciones e interpretación cualitativa de resultados con estilo formal, sobrio y conciso, garantizando la neutralidad de autoría del usuario y evitando la suposición de profesores o asignaturas.

---

## 1. Registro de Errores Pasados y Soluciones (Lecciones Aprendidas)

| Fecha | Dificultad o Error Encontrado | Causa Raíz | Solución Aplicada y Regla Futura |
| :--- | :--- | :--- | :--- |
| Inicial | Presencia de emojis, mayúsculas tipo Title Case o vocabulario pomposo. | Inercia de estilo de lenguaje conversacional de modelos de lenguaje. | Blindaje estricto de directrices: cero emojis en cualquier contexto, uso de mayúsculas exclusivamente al inicio de oraciones/nombres propios, y vocabulario simple, sobrio y natural. |
| Inicial | Desbordamientos horizontales de tablas en LaTeX (`Overfull \hbox`). | Tablas con columnas automáticas sin ancho definido o exceso de texto en celdas. | Emplear siempre el paquete `booktabs`, especificar anchos con columnas `p{...}` o `tabularx` y evitar líneas verticales en tablas. |
| 2026-09-18 | Informes compilados en RMarkdown/Quarto ausentes en la carpeta de documentación. | Asumir que los informes en PDF/HTML generados por código no requerían archivo centralizado en la carpeta de informes. | Centralizar todo informe final compilado (`.pdf`/`.html`) en `/Documentacion/Informes/<Nombre_Informe>/` independientemente de si proviene de `.tex`, `.Rmd` o Quarto, respetando siempre rutas personalizadas fijadas por el usuario. |
| 2026-09-19 | Inserción automática de Angel Llanos Herrera como autor o suposición de docentes/asignaturas de ejemplos. | Confundir el estilo de redacción del creador del framework con la autoría de las tareas del usuario, o heredar docentes de plantillas. | Prohibición absoluta de colocar a Angel Llanos Herrera como autor en entregables; dejar autor vacío o consultar al usuario. Cero suposición de profesores o materias; usar marcadores neutros o preguntar al usuario. |

---

## 2. Mejores Prácticas y Atajos Metodológicos Consolidados
- Utilizar tercera persona impersonal (*"Se procedió al ajuste..."*, *"Los resultados indican que..."*).
- Integrar la interpretación práctica de medidas en el texto fluido sin limitarse a listar cifras sin contexto.
- Garantizar la neutralidad de autoría (dejar autor vacío o preguntar al usuario) y no asumir jamás nombres de docentes o materias a partir de ejemplos previos.
- Aislar cada documento dentro de su propia subcarpeta en `/Documentacion/Informes/` para evitar conflictos de compilación.
- Centralizar y verificar la presencia del documento compilado final (`.pdf` o `.html`) en su subcarpeta correspondiente o en la ruta personalizada instruida por el usuario.


---

## 3. Alineación con el Agente Especialista en Área de Dominio
- Emplear la terminología técnica y acrónimos oficiales de la industria definidos en el glosario del especialista de área.
- Redactar resúmenes ejecutivos enfocados en el impacto sectorial y decisiones aplicadas que interesan a los tomadores de decisiones del área.

---

## 4. Historial de Intervenciones y Evolución Técnica
- **Sesión Inicial**: Asimilación de directrices de estilo del usuario y configuración de plantillas en `/Plantillas_Latex/`.
