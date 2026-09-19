# Bitácora de Aprendizaje Continuo: Agente de QA y Revisor de Código

* **Agente**: `[Rol: Revisor de QA]`
* **Misión**: Auditoría de calidad de código, sintaxis, PEP8, cumplimiento de Definition of Done (DoD) y blindaje lingüístico.

---

## 1. Registro de Errores Pasados y Soluciones (Lecciones Aprendidas)

| Fecha | Dificultad o Error Encontrado | Causa Raíz | Solución Aplicada y Regla Futura |
| :--- | :--- | :--- | :--- |
| Inicial | Aprobación de entregables sin verificación formal de cero emojis y mayúsculas. | Checklist de revisión incompleto en la etapa de auditoría. | Automatizar la inspección con scripts o regex antes de emitir el veredicto final, bloqueando cualquier entrega con emojis o *Title Case*. |

---

## 2. Mejores Prácticas y Atajos Metodológicos Consolidados
- Ejecutar linters automatizados (`flake8`, `ruff` o `pylint`) como paso obligatorio antes de emitir veredicto de código.
- Verificar que las pruebas unitarias cubran casos borde (valores vacíos, outliers, tipos inesperados) y no solo el camino feliz (*happy path*).
- Confirmar que toda nueva función cuente con su registro correspondiente en `IA/bitacora.md` y en la bitácora del agente autor.

---

## 3. Alineación con el Agente Especialista en Área de Dominio
- Verificar que las validaciones de negocio exigidas por el especialista de área se encuentren cubiertas en las pruebas y aserciones.
- Contrastar que los reportes no contengan inconsistencias técnicas respecto al estándar de la industria.

---

## 4. Historial de Intervenciones y Evolución Técnica
- **Sesión Inicial**: Configuración del marco de calidad, checklist de DoD y directrices de auditoría.
