# Sistema de Aprendizaje Continuo y Memoria de Agentes (Bitácoras Especializadas)

Este directorio alberga las **bitácoras individuales de los agentes especialistas** del ecosistema Agentias.

A diferencia de la bitácora general del proyecto (`IA/bitacora.md`) —que registra los hitos ejecutivos y el estado global—, las bitácoras individuales funcionan como la **memoria técnica y el diario de aprendizaje continuo** de cada rol.

---

## 🔄 El Ciclo de Aprendizaje Continuo por Agente

Cada vez que un agente especialista es invocado para una tarea, debe ejecutar de forma obligatoria el siguiente ciclo de dos pasos:

### 1. Paso 0: Consulta Previa de Lecciones y Errores Pasados
Antes de escribir una sola línea de código, plantear un modelo, redactar un informe o ejecutar un análisis:
- El agente consulta su propia bitácora (`IA/bitacoras/bitacora_[rol].md`).
- Revisa los errores cometidos en sesiones anteriores (ej: tipos de datos incompatibles, problemas de convergencia, advertencias de compilación en LaTeX, variables con fuga de datos).
- Adopta las mejores prácticas y atajos validados previamente para no tropezar con el mismo problema dos veces.

### 2. Paso 5: Registro Post-Ejecución de Lecciones Aprendidas
Al concluir su intervención:
- El agente documenta en su bitácora los nuevos hallazgos, dificultades enfrentadas, soluciones implementadas y técnicas que demostraron mayor eficacia.
- Registra cualquier alineación o directriz recibida por el **Agente Especialista en Área de Dominio**.
- Eleva progresivamente su nivel de especialización y profesionalismo con cada sesión de trabajo.

---

## 📁 Estructura de Bitácoras por Agente

| Archivo | Agente Asignado | Ámbito de Aprendizaje Continuo |
| :--- | :--- | :--- |
| [bitacora_estadistico.md](bitacora_estadistico.md) | Estadístico Base | Supuestos inferenciales, distribución de variables, anomalías detectadas y pruebas estadísticas óptimas. |
| [bitacora_data_engineer.md](bitacora_data_engineer.md) | Ingeniería de Datos | Estrategias de limpieza, imputación de nulos, codificación y optimización de pipelines. |
| [bitacora_modelado.md](bitacora_modelado.md) | Modelado y Machine Learning | Comportamiento de algoritmos, espacios de búsqueda en Optuna, podado de trials y métricas en `metrics.xlsx`. |
| [bitacora_programador.md](bitacora_programador.md) | Programador (Python/R/Web) | Modularidad de funciones, bugs resueltos, manejo de excepciones y optimizaciones sintácticas. |
| [bitacora_redactor_latex.md](bitacora_redactor_latex.md) | Redactor de LaTeX | Diagramación de tablas `booktabs`, control de advertencias de cajas, coherencia de estilo y tono impersonal sobrio. |
| [bitacora_qa_reviewer.md](bitacora_qa_reviewer.md) | QA y Revisor de Código | Checklist de calidad (DoD), fallos recurrentes detectados en revisiones y prevención de regresiones. |
| [bitacora_experto_area.md](bitacora_experto_area.md) | Especialista en Área de Dominio | Reglas de negocio, restricciones de la industria, diccionario terminológico y retroalimentación transversal. |
