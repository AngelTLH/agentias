# Habilidad de Orquestación de Agentes y Patrones de Loops

Esta habilidad define las directrices estructurales para que la IA organice su razonamiento y ejecute tareas complejas mediante diferentes patrones de loops de agentes.

---

## 1. Patrones de Loops Disponibles

### A. Modo Directo (Sin Loop)
*   **Propósito**: Respuesta rápida y eficiente en un solo turno.
*   **Técnica**: El agente procesa la solicitud directamente y emite el resultado final de inmediato. Ideal para consultas sencillas, aclaraciones o pequeñas modificaciones de código.

### B. Modo ReAct (Reason + Act)
*   **Propósito**: Razonamiento estructurado antes de realizar acciones en el entorno.
*   **Técnica**: Para cada subtarea, el agente debe seguir obligatoriamente la secuencia:
    1.  **Pensamiento (Thought)**: Analizar el estado actual y lo que se necesita hacer.
    2.  **Acción (Action)**: Declarar la herramienta o comando a ejecutar.
    3.  **Observación (Observation)**: Evaluar el resultado de la acción antes de proceder al siguiente paso.

### C. Modo Plan-and-Execute (Planificar y Ejecutar)
*   **Propósito**: Resolución de tareas complejas e interdependientes de largo alcance.
*   **Técnica**:
    1.  **Planificación**: Crear un plan estructurado con hitos numerados antes de escribir código.
    2.  **Ejecución**: Ejecutar las tareas de forma secuencial.
    3.  **Evaluación y Refinamiento**: Al final de cada hito, comparar el resultado con el objetivo del plan y ajustar los pasos restantes si es necesario.

### D. Modo Supervisor + Evaluador (Garantía de Calidad Iterativa)
*   **Propósito**: Entregables que requieren máxima rigurosidad y cero defectos.
*   **Técnica**:
    1.  **Generación (Supervisor)**: El rol ejecutor genera el código, informe o diseño.
    2.  **Auditoría (Evaluador)**: El rol revisor (`qa_reviewer` o similar) audita críticamente el entregable buscando errores de sintaxis, violaciones a la guía de estilo o problemas de rendimiento.
    3.  **Refinamiento**: El supervisor corrige el entregable basándose en la auditoría. El ciclo se repite hasta que el evaluador apruebe el resultado final sin observaciones.

---

## 2. Directrices de Ejecución

*   **Identificación del Modo**: El agente debe identificar al inicio de la conversación qué modo de loop está activo en la configuración del proyecto y declarar su apego al mismo.
*   **Evitar Cadenas de Error**: Si una llamada a una herramienta o un bloque de código falla, detenerse inmediatamente, analizar el error en el paso de *Observación* o *Evaluación* y formular una alternativa. No repetir la misma acción fallida en un bucle infinito.
