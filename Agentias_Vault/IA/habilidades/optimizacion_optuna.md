# Habilidad de Optimización con Optuna

Esta guía detalla la lógica de código, estructuración de experimentos y buenas prácticas obligatorias para realizar optimizaciones de hiperparámetros mediante la librería Optuna.

---

## 1. Estructura de la Función Objetivo (`objective`)
La función objetivo debe encapsular la lógica del entrenamiento del modelo y el cálculo de la métrica a optimizar:

* **Sugerencia de Parámetros (`trial.suggest_*`)**: Definir de forma limpia los rangos y distribuciones de cada hiperparámetro:
  * Rangos continuos: `trial.suggest_float("name", low, high, log=True|False)`
  * Rangos discretos: `trial.suggest_int("name", low, high)`
  * Valores categóricos: `trial.suggest_categorical("name", ["opcion1", "opcion2"])`
* **Validación Cruzada**: La métrica devuelta por la función objetivo debe ser el promedio de validación cruzada ($K$-fold) para prevenir el sobreajuste.
* **Poda de Ensayos Malos (Pruning)**:
  * Integrar pruners nativos de Optuna (`optuna.pruners.MedianPruner`) y reportar la métrica intermedia en cada iteración del entrenamiento usando `trial.report(value, step)`.
  * Comprobar si se debe detener el trial prematuramente mediante:
    ```python
    if trial.should_prune():
        raise optuna.exceptions.TrialPruned()
    ```

---

## 2. Configuración y Ejecución del Estudio (`study`)
* **Creación de Estudio**:
  * Definir la dirección de optimización (`direction="maximize"` o `direction="minimize"` según corresponda al error o la precisión/AUC).
  * Asignar un sampler adecuado (`optuna.samplers.TPESampler(seed=42)` por defecto para optimización bayesiana estable).
* **Persistencia en Base de Datos Local**:
  * Para estudios largos, configurar un almacenamiento persistente mediante una base de datos SQLite local en la carpeta del proyecto:
    ```python
    study = optuna.create_study(
        study_name="opt_model_name",
        storage="sqlite:///optuna_study.db",
        load_if_exists=True,
        direction="maximize"
    )
    ```
  * Esto permite reanudar estudios pausados y guardar el histórico completo de los trials.

---

## 3. Reporte de Resultados y Exportación a Excel
* **Exportación Obligatoria a Excel (`metrics.xlsx`)**: Los resultados de la optimización y entrenamiento deben guardarse estrictamente en un archivo Excel (`metrics.xlsx`). No se permite usar formatos JSON para las métricas finales.
  ```python
  import pandas as pd

  # Exportar todos los trials a un DataFrame y guardarlo en un archivo Excel (.xlsx)
  trials_df = study.trials_dataframe()
  
  # Guardar el historial de ensayos y los parámetros de los trials
  with pd.ExcelWriter("metrics.xlsx", engine="openpyxl") as writer:
      trials_df.to_excel(writer, index=False, sheet_name="Historial de Ensayos")
      
      # Guardar el mejor trial en una pestaña resumen dedicada
      best_params_df = pd.DataFrame([study.best_params])
      best_params_df["best_score"] = study.best_value
      best_params_df.to_excel(writer, index=False, sheet_name="Mejor Modelo")
  ```
* **Extracción del Mejor Trial**: Imprimir de forma estructurada los mejores hiperparámetros y el score final a consola.
* **Visualizaciones de Optuna**:
  * Utilizar el módulo `optuna.visualization` para generar gráficos de:
    * Historial de optimización (`plot_optimization_history`).
    * Importancia de hiperparámetros (`plot_param_importances`).
    * Relaciones paralelas (`plot_parallel_coordinate`).
