# Bitácora de Aprendizaje Continuo: Agente Programador

* **Agente**: `[Rol: Programador]`
* **Misión**: Implementación de scripts limpios, modulares, reproducibles y eficientes en la carpeta `/Codigos/`.

---

## 1. Registro de Errores Pasados y Soluciones (Lecciones Aprendidas)

| Fecha | Dificultad o Error Encontrado | Causa Raíz | Solución Aplicada y Regla Futura |
| :--- | :--- | :--- | :--- |
| Inicial | Scripts monolíticos difíciles de depurar y sin modularización. | Escribir código lineal sin encapsulación en funciones ni punto de entrada. | Estructurar todo script con funciones con responsabilidad única, type hints, docstrings claros y bloque `if __name__ == '__main__':`. |
| 2026-09-18 | Informes compilados (.Rmd/.qmd) inaccesibles en documentación y scripts sueltos en la raíz de `/Codigos/`. | Compilar sin duplicar a `/Documentacion/Informes/` y depositar scripts planos en raíz. | Organizar todo script en subcarpetas temáticas (`/Codigos/EDA/`, `/Codigos/Modelos/`, `/Codigos/Reportes/`) y duplicar inmediatamente el PDF/HTML compilado a `/Documentacion/Informes/<Nombre_Informe>/`. Respetar siempre rutas personalizadas fijadas por el usuario. |
| 2026-09-19 | Inclusión no solicitada de autoría fija en metadatos o cabeceras de código. | Asumir que la autoría de scripts del usuario debía asignarse al creador de Agentias. | Cero atribución automática: en encabezados de scripts (`# Author:` o docstrings), dejar el campo vacío, con placeholder o consultar al usuario. |

---

## 2. Mejores Prácticas y Atajos Metodológicos Consolidados
- Evitar mutabilidad de DataFrames con `inplace=True` por deprecaciones y efectos secundarios; preferir asignaciones explícitas.
- Manejar rutas relativas a la raíz del proyecto usando `pathlib.Path` en lugar de concatenaciones rígidas de cadenas con barras invertidas.
- Escribir pruebas unitarias con `pytest` para funciones de transformación crítica.
- Neutralidad de autoría: jamás colocar a Angel Llanos Herrera como autor de scripts, módulos o programas creados para el usuario.
- En scripts generadores de reportes (.Rmd, Quarto o Python), automatizar la copia del artefacto final hacia `/Documentacion/Informes/<Nombre_Informe>/` tras cada compilación exitosa.
- Respetar estrictamente carpetas personalizadas indicadas por el usuario, registrándolas en `IA/bitacora.md`.


---

## 3. Alineación con el Agente Especialista en Área de Dominio
- Utilizar nomenclaturas de variables, tablas y esquemas consistentes con la terminología técnica del sector provista por el especialista de área.
- Integrar validaciones de rango y tipo que capturen inconsistencias de negocio antes del procesamiento.

---

## 4. Historial de Intervenciones y Evolución Técnica
- **Sesión Inicial**: Establecimiento de estándares de código limpio y arquitectura modular en `/Codigos/`.
