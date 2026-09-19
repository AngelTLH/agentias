# Catálogo de Agentes Especializados (Agentias Vault)

Este directorio contiene los perfiles, prompts de activación, protocolos operativos y directrices técnicas de los agentes autónomos de IA que integran la edición pública y abierta de **Agentias**.

Cada agente opera bajo el **Estándar Universal de Agente (UAS)**, requiriendo activación explícita mediante el comando `[Rol: <Nombre>]`, protocolos consultivos de diagnóstico previo, procedimientos de operación estandarizados (SOP) y una estricta Definición de Terminado (DoD).

---

## 📊 1. Ciencia de Datos, Estadística y Machine Learning
* **[Agente Especialista en Área de Dominio](experto_area.md)** (`[Rol: Agente Especialista en {Área_Dominio}]`): Máxima autoridad técnica y de negocio en el área específica elegida para el proyecto. Guía transversalmente a todos los agentes en semántica de variables, reglas de la industria, restricciones de negocio y glosario sectorial.
* **[Agente Estadístico Base](estadistico.md)** (`[Rol: Estadístico Base]`): Análisis exploratorio de datos (EDA), comprobación formal de supuestos distributional-paramétricos, contrastes de hipótesis y modelos lineales.
* **[Agente de Modelado y Optimización](modelado.md)** (`[Rol: Agente de Modelado]`): Entrenamiento de modelos predictivos (LightGBM, XGBoost, CatBoost, Redes Neuronales), optimización de hiperparámetros con Optuna y persistencia en `metrics.xlsx`.
* **[Agente de Ingeniería y Preparación de Datos](data_engineer.md)** (`[Rol: Ingeniero de Datos]`): Pipelines ETL reproducibles, imputación estadística de nulos, ingeniería de variables y normalización de esquemas.
* **[Agente de Explicabilidad (XAI Expert)](xai_expert.md)** (`[Rol: Especialista en XAI]`): Interpretabilidad algorítmica de cajas negras, valores de Shapley con SHAP (TreeExplainer, Beeswarm, Waterfall) y gráficos de dependencia.
* **[Agente de Simulación y Monte Carlo](simulacion.md)** (`[Rol: Agente de Simulación]`): Modelado estocástico, simulaciones de Monte Carlo vectorizadas, análisis de sensibilidad global e intervalos empíricos.

---

## 💻 2. Ingeniería de Software, Arquitectura y Despliegue
* **[Agente Programador Frontend](programador.md)** (`[Rol: Programador Frontend]`): Desarrollo de interfaces interactivas, dashboards y páginas web responsivas con Clean Code, HTML semántico y accesibilidad (WCAG).
* **[Agente de QA y Revisor de Código](qa_reviewer.md)** (`[Rol: Revisor de QA]`): Auditoría estática de código, tipado estático, cobertura de pruebas unitarias (pytest/testthat) y control de casos límite.
* **[Agente de MLOps y Despliegue](mlops_engineer.md)** (`[Rol: Ingeniero de MLOps]`): Microservicios REST de inferencia (FastAPI), contenedorización ligera con Docker multi-stage y linaje de artefactos.
* **[Agente de Git y Automatización CI/CD](git_cicd.md)** (`[Rol: Especialista en Git y CI/CD]`): Commits convencionales atómicos, resolución de conflictos y workflows de GitHub Actions.
* **[Agente Arquitecto de Agentes](arquitecto_agentes.md)** (`[Rol: Arquitecto Agentes]`): Diseño de flujos multi-agente, loops de razonamiento adaptativos (ReAct, Plan-and-Execute) e integración con herramientas y MCP.
* **[Agente de Seguridad de Código y SecOps](secops_engineer.md)** (`[Rol: Ingeniero de SecOps]`): Auditoría de seguridad (SAST/SCA), prevención de fugas de secretos, sanitización de consultas SQL y blindaje de endpoints.
* **[Agente de Optimización de Rendimiento](performance_optimizer.md)** (`[Rol: Ingeniero de Rendimiento]`): Profiling de CPU y memoria (cProfile, memory_profiler), downcasting de DataFrames, vectorización y aceleración ONNX.

---

## 🧠 3. Inteligencia Artificial, Ética y Sostenibilidad
* **[Agente Especialista en IA](ia_expert.md)** (`[Rol: Especialista en IA]`): Arquitecturas de Deep Learning (PyTorch, Transformers), integración de APIs de frontera (Gemini, Claude, OpenAI) y memoria conversacional.
* **[Agente de Privacidad de Datos](privacidad_datos.md)** (`[Rol: Auditor de Privacidad]`): Detección de PII, hashing con salt, generalización, k-anonimato ($k \ge 5$) y cumplimiento ético.
* **[Agente de Sostenibilidad Computacional](sostenibilidad.md)** (`[Rol: Agente de Sostenibilidad]`): Medición de emisiones ($\text{kg CO}_2\text{eq}$) y consumo energético con CodeCarbon, Green AI y alineación con ODS.

---

## 📝 4. Documentación Académica y Dirección de Arte
* **[Agente Redactor de LaTeX](redactor_latex.md)** (`[Rol: Redactor de LaTeX]`): Informes técnicos formales, papers y presentaciones Beamer aislados en subcarpetas, con tablas `booktabs` y bibliografía BibTeX.
* **[Agente Diseñador Gráfico](disenador.md)** (`[Rol: Diseñador Gráfico]`): Dirección de arte, branding holístico, logos vectoriales en SVG, contraste cromático y plantillas de difusión.
* **[Agente Investigador de Literatura](investigador.md)** (`[Rol: Investigador de Literatura]`): Curaduría científica de papers en `/Documentacion/Documento_Literatura/`, lectura con `markitdown` y matriz `citas_verificacion.xlsx`.
