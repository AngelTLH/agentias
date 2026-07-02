# Agentias 🤖💼

> **Entorno modular y orquestador local para inicializar proyectos de Ciencia de Datos, Modelado, Documentación y Desarrollo Web estructurados para Agentes de IA.**

---

**Agentias** es un framework de andamiaje (*scaffolding*) y una interfaz interactiva diseñada para crear proyectos optimizados para ser trabajados codo con codo con Inteligencias Artificiales y Agentes Autónomos. A través de perfiles preconfigurados, reglas estrictas y plantillas de alta calidad (LaTeX, R/Shiny, Dash, React, Páginas Web de Ventas), **Agentias** garantiza que cualquier IA que cargue el entorno trabaje con el máximo nivel de rigurosidad, orden y profesionalidad.

Desarrollado con pasión por **Angel Llanos Herrera**.

---

## 🚀 Características Clave

* 🛠️ **Creación de Proyectos en un Clic**: Interfaz web intuitiva para configurar lenguajes, modelos de machine learning (XGBoost, Random Forest, etc.), optimizadores (Optuna), dashboards, reportes en LaTeX y configuraciones de marca.
* 👥 **Agentes Especializados Preconfigurados**: Carga directa de perfiles detallados en `/IA/agentes/` para guiar a la IA (Estadístico, Modelado, Ingeniero de Datos, Diseñador Gráfico, Redactor de LaTeX, Experto en Privacidad, entre otros).
* 📋 **Bitácora Automatizada (`bitacora.md`)**: Sistema estructurado para que los agentes registren sus avances, decisiones de diseño y pasos siguientes, facilitando la persistencia de contexto entre sesiones.
* 📈 **Flujos de Trabajo Científicos y de Negocios**: Estándares de calidad rigurosos (guardado de métricas en Excel, separación de reportes, directrices de oratoria e identidad de marca).
* 🎛️ **Orquestador Local Ligero**: Servidor integrado en Python que se ejecuta localmente sin necesidad de complejas dependencias externas.

---

## 📂 Estructura del Repositorio

La distribución pública de Agentias se organiza de la siguiente manera:

```text
Agentias_Publico/
├── Iniciar_Agentias.bat        # Lanzador rápido para Windows (servidor + navegador)
└── Agentias_Vault/             # Carpeta raíz con las plantillas y el Dashboard
    ├── Codigos/                # Directorio base para los scripts del proyecto
    ├── Dashboard/              # Interfaz interactiva local (HTML, CSS, JS, Python)
    ├── Documentacion/          # Plantillas de documentación y ejemplos de informes
    │   └── Ejemplos/           # Informes estándar como referencia para la IA
    ├── IA/                     # Estructura del sistema experto
    │   ├── agentes/            # Definición de roles (Estadístico, Programador, etc.)
    │   ├── expertices/         # Manuales de diseño, escritura, estadística y oratoria
    │   ├── habilidades/        # Guías de acción (programación, latex, markitdown)
    │   └── herramientas/       # Herramientas auxiliares de automatización
    ├── Pagina_Web/             # Plantillas de páginas web de ventas y landings
    └── Plantillas_Latex/       # Plantillas premium de informes y presentaciones
```

---

## 💻 Instalación y Uso Rápido

### Requisitos Previos
* **Python 3.x** instalado en el sistema.

### Instrucciones de Ejecución
1. Descarga o clona este repositorio en tu máquina local.
2. Haz doble clic en el archivo **`Iniciar_Agentias.bat`** (o ejecútalo desde tu consola).
3. Se abrirá automáticamente tu navegador web predeterminado en `http://localhost:3000`.
4. Configura los parámetros de tu nuevo proyecto (nombre, ruta, agentes activos, tecnologías) y presiona **"Crear Proyecto"**.
5. Se generará la estructura completa con el archivo `prompt_inicio.txt` en la raíz del nuevo proyecto, listo para ser copiado y entregado a tu IA de preferencia (ChatGPT, Claude, Gemini, etc.).

---

## 🧠 Integración con Inteligencias Artificiales

Cuando creas un proyecto con Agentias, se incluye un archivo de contexto llamado `prompt_inicio.txt`. Al iniciar tu chat o sesión con un agente de IA, simplemente copia y pega el contenido de este archivo. Esto instruirá a la IA para:
1. **Asumir los Roles**: Cambiar dinámicamente entre los perfiles configurados (ej: `[Rol: Estadístico Base]`).
2. **Respetar las Reglas del Proyecto**: Guardar las métricas de ML en `metrics.xlsx`, actualizar la bitácora, estructurar los informes en LaTeX e imitar tu estilo de escritura.
3. **Usar las Habilidades**: Saber exactamente cómo leer PDFs usando `markitdown` o cómo estructurar una presentación científica.

---

## 🤝 Apoya el Proyecto

Si Agentias te resulta útil y te ayuda a automatizar o estructurar tus proyectos, considera apoyar el desarrollo continuo:

* **Ko-fi**: [Apóyame en Ko-fi](https://ko-fi.com/angelllanos) ☕
* **GitHub Sponsors**: [Conviértete en patrocinador](https://github.com/sponsors/AngelTLH) 💖

---

## ✉️ Contacto y Soporte

Desarrollado por **Angel Llanos Herrera**.
* **LinkedIn**: [angel-llanos](https://www.linkedin.com/in/angel-llanos/)
* **GitHub**: [@AngelTLH](https://github.com/AngelTLH)
* **Correo**: angel.llanos.herrera@gmail.com
