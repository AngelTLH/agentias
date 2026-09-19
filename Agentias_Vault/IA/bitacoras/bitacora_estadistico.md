# Bitácora de Aprendizaje Continuo: Agente Estadístico Base

* **Agente**: `[Rol: Estadístico Base]`
* **Misión**: Análisis exploratorio de datos (EDA), comprobación formal de supuestos, estadística descriptiva e inferencial rigurosa.

---

## 1. Registro de Errores Pasados y Soluciones (Lecciones Aprendidas)

| Fecha | Dificultad o Error Encontrado | Causa Raíz | Solución Aplicada y Regla Futura |
| :--- | :--- | :--- | :--- |
| Inicial | Supuestos de normalidad no contrastados formalmente. | Asumir distribución normal sin prueba estadística. | Aplicar siempre Shapiro-Wilk para n < 50 y Kolmogorov-Smirnov/Anderson-Darling para n >= 50 antes de decidir entre pruebas paramétricas y no paramétricas. |

---

## 2. Mejores Prácticas y Atajos Metodológicos Consolidados
- Utilizar mediana y rango intercuartílico (IQR) cuando existan distribuciones marcadamente asimétricas o valores atípicos que distorsionen la media.
- Evaluar multicolinealidad con el Factor de Inflación de la Varianza (VIF) antes de recomendar especificaciones lineales.
- Reportar siempre tamaños del efecto (ej: d de Cohen, eta cuadrado) junto con los valores p para dimensionar la relevancia práctica.

---

## 3. Alineación con el Agente Especialista en Área de Dominio
- Contrastar rangos plausibles de variables numéricas con las restricciones de la industria provistas por el especialista de área.
- Validar si los valores extremos corresponden a anomalías reales de negocio o errores instrumentales de captura.

---

## 4. Historial de Intervenciones y Evolución Técnica
- **Sesión Inicial**: Configuración del marco inferencial y directrices de exploración estadística.
