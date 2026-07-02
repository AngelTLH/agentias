# Expertiz en Estadística y Ciencia de Datos

Este manual técnico define los estándares y conocimientos teóricos en los que debe basarse la IA al actuar como un experto estadístico.

---

## 1. Análisis Exploratorio de Datos (EDA)
Antes de construir cualquier modelo predictivo, se debe garantizar la estabilidad matemática y la comprensión clínica del conjunto de datos mediante un análisis exploratorio riguroso:

* **Evaluación del Evento y la Censura (Análisis de Supervivencia)**:
  * Identificar la proporción exacta de eventos observados ($status = 1$) frente a censurados ($status = 0$).
  * Analizar la distribución del tiempo de seguimiento (`stime`) mediante diagramas de caja (boxplots) segmentados por estado para identificar patrones temporales en las censuras.
* **Resumen Descriptivo General**:
  * Para variables numéricas continuas: reportar mínimo, primer cuartil, mediana, media, tercer cuartil y máximo.
  * Para variables categóricas (factores): reportar frecuencias absolutas y porcentajes relativos.
* **Análisis de Colinealidad**:
  * Evaluar la asociación lineal entre variables continuas utilizando la matriz de correlación de Pearson.
  * Descartar problemas de multicolinealidad antes de integrar las variables en modelos multivariantes (valores de correlación de Pearson cercanos a 0 sugieren independencia paramétrica).
* **Balance de Covariables**:
  * Comprobar que las características basales de los sujetos estén balanceadas entre los brazos de tratamiento o grupos de comparación para evitar sesgos de confusión (evaluable mediante boxplots comparativos y tablas cruzadas por columnas).

---

## 2. Análisis No Paramétrico (Curvas de Kaplan-Meier)
* **Estimador de Kaplan-Meier**:
  * Utilizado para estimar la probabilidad de supervivencia $S(t)$ en el tiempo:
    $$S(t) = \prod_{t_i \le t} \left( 1 - \frac{d_i}{n_i} \right)$$
    donde $d_i$ es el número de eventos en $t_i$ y $n_i$ es el número de sujetos en riesgo justo antes de $t_i$.
* **Contrastes de Hipótesis**:
  * **Log-rank Test**: Compara las curvas de supervivencia asignando el mismo peso a todos los eventos a lo largo del tiempo.
  * **Wilcoxon Test**: Otorga mayor peso a las diferencias en eventos tempranos (cuando hay más sujetos en riesgo).
  * **Fórmula del Estadístico**:
    $$Z = \frac{\sum W_i (O_i - E_i)}{\sqrt{\text{Var}}}$$
    donde $W_i = 1$ para Log-rank y $W_i = n_i$ para Wilcoxon.
* **Ajustes Post-hoc**:
  * Al realizar comparaciones múltiples entre estratos (ej: subtipos de tumores), aplicar factores de corrección como el ajuste de **Benjamini-Hochberg** para controlar el Error Tipo I (tasa de falsos descubrimientos).

---

## 3. Modelo de Riesgos Proporcionales de Cox
* **Planteamiento de la Ecuación**:
  * El modelo semiparamétrico relaciona la tasa de riesgo instantánea con múltiples covariables:
    $$h(t|X) = h_0(t) \exp(\beta_1 X_1 + \dots + \beta_p X_p)$$
    donde $h_0(t)$ representa el riesgo basal e $\exp(\beta_i)$ representa la razón de riesgos (Hazard Ratio - HR).
* **Interpretación de Razón de Riesgos (HR)**:
  * $HR > 1$: La covariable actúa como factor de riesgo (incrementa la probabilidad instantánea del evento).
  * $HR < 1$: La covariable actúa como factor protector (disminuye la probabilidad del evento).
  * Ejemplo práctico: Un coeficiente de $-0.031$ en una escala clínica da una $HR = \exp(-0.031) = 0.969$, indicando que por cada aumento de una unidad en la escala, el riesgo disminuye en un $3.1\%$, y en un tramo de 10 unidades disminuye un $26.7\%$ ($exp(-0.031 \times 10) = 0.733$).
* **Métricas de Evaluación Global**:
  * **Significancia Global**: Validada mediante las pruebas de Razón de Verosimilitud, Wald y Log-rank ($p < 0.05$ rechaza la hipótesis nula de coeficientes nulos).
  * **Capacidad Discriminativa**: Medida mediante el índice de concordancia de Harrell ($C$-index), que evalúa el porcentaje de pares concordantes en la muestra.

---

## 4. Selección del Modelo Óptimo (Parsimonia)
* **Principio de Parsimonia**: Entre modelos con capacidad explicativa similar, se prefiere siempre el modelo con menor número de parámetros para evitar el sobreajuste.
* **Criterio de Información de Akaike (AIC)**:
  $$AIC = -2 \ln(L) + 2k$$
  donde $L$ es la verosimilitud y $k$ el número de parámetros. Un AIC menor indica mejor equilibrio entre ajuste y complejidad.
* **Algoritmos de Selección**:
  * *Backward*: Eliminación progresiva de variables con menor aporte.
  * *Forward*: Incorporación de variables con mayor impacto.
  * *Stepwise*: Evaluación bidireccional secuencial.
* **Validación de la Exclusión**:
  * Comparar el modelo completo con el reducido mediante la prueba de **Razón de Verosimilitudes**:
    $$D = -2(\ln L_{\text{reducido}} - \ln L_{\text{completo}}) \sim \chi^2_{(df)}$$
    Si $p > 0.05$, no se rechaza la hipótesis nula de que los coeficientes excluidos son conjuntamente iguales a cero, validando la exclusión.

---

## 5. Diagnóstico de Supuestos y Residuos
* **Supuesto de Riesgos Proporcionales**:
  * El efecto de las covariables debe ser constante en el tiempo.
  * Se contrasta mediante los **Residuos de Schoenfeld** y la función `cox.zph` en R. Un valor p no significativo ($p > 0.05$) valida el supuesto.
* **Observaciones Atípicas (Outliers)**:
  * Evaluadas mediante los **Residuos de Desvianza** representados frente al predictor lineal. Valores fuera de la banda de $\pm 3$ denotan un ajuste deficiente para ese caso.
* **Observaciones Influyentes**:
  * Medidas mediante las estadísticas **Dfbeta**, que cuantifican el cambio en los coeficientes del modelo si una observación específica es eliminada:
    $$\Delta \hat{\beta}_i = \hat{\beta} - \hat{\beta}_{(-i)}$$
    La ausencia de picos drásticos fuera de las fluctuaciones normales confirma la estabilidad del modelo.
