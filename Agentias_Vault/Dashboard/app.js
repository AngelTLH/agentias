document.addEventListener('DOMContentLoaded', () => {
    // Manejo de Temas (Cactus Claro y Cactus Oscuro)
    const btnThemeLight = document.getElementById('btn-theme-light');
    const btnThemeDark = document.getElementById('btn-theme-dark');

    const themes = {
        light: {
            '--bg-color': '#faf6e8',
            '--card-bg': '#fffdfa',
            '--border-color': '#e8ddb5',
            '--text-primary': '#1b3022',
            '--text-secondary': '#49584b',
            '--primary-color': '#386641',
            '--primary-glow': 'rgba(56, 102, 65, 0.3)',
            '--accent-color': '#f2a65a',
            '--accent-glow': 'rgba(242, 166, 90, 0.2)',
            '--border-radius': '40px 15px 45px 20px',
            '--success-color': '#2d6a4f',
            '--error-color': '#bc4749',
            '--info-color': '#b58900',
            '--input-bg': 'rgba(255, 255, 255, 0.8)',
            '--input-text': '#1b3022',
            '--checkbox-bg': 'rgba(255, 255, 255, 0.5)',
            '--checkbox-active-bg': 'rgba(56, 102, 65, 0.08)',
            '--shadow-color': 'rgba(90, 80, 60, 0.08)',
            '--header-gradient': 'linear-gradient(135deg, #1b3022 0%, #386641 100%)',
            '--prompt-bg': '#fffdfa',
            '--prompt-text': '#386641'
        },
        dark: {
            '--bg-color': '#13161c',
            '--card-bg': '#1a2022',
            '--border-color': '#3a4446',
            '--text-primary': '#f0f3f5',
            '--text-secondary': '#a6b1ba',
            '--primary-color': '#84b082',
            '--primary-glow': 'rgba(132, 176, 130, 0.4)',
            '--accent-color': '#c8b6ff',
            '--accent-glow': 'rgba(200, 182, 255, 0.3)',
            '--border-radius': '40px 15px 45px 20px',
            '--success-color': '#10b981',
            '--error-color': '#ef4444',
            '--info-color': '#f59e0b',
            '--input-bg': 'rgba(0, 0, 0, 0.3)',
            '--input-text': '#f0f3f5',
            '--checkbox-bg': 'rgba(0, 0, 0, 0.2)',
            '--checkbox-active-bg': 'rgba(132, 176, 130, 0.08)',
            '--shadow-color': 'rgba(0, 0, 0, 0.4)',
            '--header-gradient': 'linear-gradient(135deg, #ffffff 0%, #84b082 100%)',
            '--prompt-bg': '#0d0f12',
            '--prompt-text': '#84b082'
        }
    };

    function applyTheme(themeName) {
        const theme = themes[themeName];
        const root = document.documentElement;
        Object.keys(theme).forEach(variable => {
            root.style.setProperty(variable, theme[variable]);
        });
        
        if (themeName === 'light') {
            btnThemeLight.classList.add('active');
            btnThemeDark.classList.remove('active');
        } else {
            btnThemeDark.classList.add('active');
            btnThemeLight.classList.remove('active');
        }
    }

    btnThemeLight.addEventListener('click', () => applyTheme('light'));
    btnThemeDark.addEventListener('click', () => applyTheme('dark'));

    // Aplicar light (Cactus Claro) por defecto
    applyTheme('light');

    const langPythonCheck = document.getElementById('lang-python');
    const langRCheck = document.getElementById('lang-r');
    const langJavaCheck = document.getElementById('lang-java');
    const formatGroupPython = document.getElementById('format-group-python');
    const formatGroupR = document.getElementById('format-group-r');
    const fileFormatPython = document.getElementById('file-format-python');
    const fileFormatR = document.getElementById('file-format-r');
    const agentModelCheck = document.getElementById('agent-model');
    const modeladoSection = document.getElementById('modelado-section');
    const optunaSection = document.getElementById('optuna-section');
    const optunaActiveCheck = document.getElementById('optuna-active');
    const optunaFields = document.getElementById('optuna-fields');
    
    // Elementos de Dashboard
    const dashboardActiveCheck = document.getElementById('dashboard-active');
    const dashboardFields = document.getElementById('dashboard-fields');
    const dashboardTypeSelect = document.getElementById('dashboard-type');
    
    // Elementos de LaTeX
    const agentLatexCheck = document.getElementById('agent-latex');
    const agentDesignCheck = document.getElementById('agent-design');
    const latexSection = document.getElementById('latex-section');
    const latexReportCheck = document.getElementById('latex-report');
    const latexPresentationCheck = document.getElementById('latex-presentation');



    const btnGenerate = document.getElementById('btn-generate');
    const btnCopy = document.getElementById('btn-copy');
    const promptOutput = document.getElementById('prompt-output');
    const projectForm = document.getElementById('project-form');
    const statusNotification = document.getElementById('status-notification');

    // Helper to get selected languages
    function getSelectedLanguages() {
        const selectedLanguages = [];
        if (langPythonCheck && langPythonCheck.checked) {
            selectedLanguages.push({ name: 'Python', format: fileFormatPython.value });
        }
        if (langRCheck && langRCheck.checked) {
            selectedLanguages.push({ name: 'R', format: fileFormatR.value });
        }
        if (langJavaCheck && langJavaCheck.checked) {
            selectedLanguages.push({ name: 'Java', format: '.java' });
        }
        return selectedLanguages;
    }

    // 1. Manejo del cambio de lenguajes (Formatos y Dashboard dinámicos)
    function updateDynamicFields() {
        const isPython = langPythonCheck && langPythonCheck.checked;
        const isR = langRCheck && langRCheck.checked;
        const isJava = langJavaCheck && langJavaCheck.checked;

        if (formatGroupPython) formatGroupPython.style.display = isPython ? 'block' : 'none';
        if (formatGroupR) formatGroupR.style.display = isR ? 'block' : 'none';

        const checkboxes = [langPythonCheck, langRCheck, langJavaCheck].filter(Boolean);
        const checkedCount = checkboxes.filter(c => c.checked).length;
        checkboxes.forEach(c => {
            if (!c.checked) {
                c.disabled = checkedCount >= 2;
            } else {
                c.disabled = false;
            }
        });

        let dashboardOptionsHtml = '';
        if (checkedCount === 0) {
            dashboardOptionsHtml += '<option value="Dash">Dash (Python)</option>';
            dashboardOptionsHtml += '<option value="Shiny">Shiny (R)</option>';
            dashboardOptionsHtml += '<option value="React">React (Frontend)</option>';
        } else {
            if (isPython) dashboardOptionsHtml += '<option value="Dash">Dash (Python)</option>';
            if (isR) dashboardOptionsHtml += '<option value="Shiny">Shiny (R)</option>';
            if (isJava) dashboardOptionsHtml += '<option value="React">React (Frontend)</option>';
        }
        if (dashboardTypeSelect) {
            dashboardTypeSelect.innerHTML = dashboardOptionsHtml;
        }
    }
    
    if (langPythonCheck) langPythonCheck.addEventListener('change', updateDynamicFields);
    if (langRCheck) langRCheck.addEventListener('change', updateDynamicFields);
    if (langJavaCheck) langJavaCheck.addEventListener('change', updateDynamicFields);
    updateDynamicFields(); // Disparar al cargar

    // 2. Mostrar/Ocultar sección de Optuna y Modelado basado en Agente de Modelado
    agentModelCheck.addEventListener('change', () => {
        if (agentModelCheck.checked) {
            modeladoSection.style.display = 'block';
            optunaSection.style.display = 'block';
        } else {
            modeladoSection.style.display = 'none';
            optunaSection.style.display = 'none';
            optunaActiveCheck.checked = false;
            optunaFields.classList.remove('show');
        }
    });
    optunaSection.style.display = 'none';
    modeladoSection.style.display = 'none';

    optunaActiveCheck.addEventListener('change', () => {
        if (optunaActiveCheck.checked) {
            optunaFields.classList.add('show');
        } else {
            optunaFields.classList.remove('show');
        }
    });

    // 3. Mostrar/Ocultar sección de Dashboard
    dashboardActiveCheck.addEventListener('change', () => {
        if (dashboardActiveCheck.checked) {
            dashboardFields.classList.add('show');
        } else {
            dashboardFields.classList.remove('show');
        }
    });

    // 4. Mostrar/Ocultar sección de LaTeX
    agentLatexCheck.addEventListener('change', () => {
        if (agentLatexCheck.checked) {
            latexSection.style.display = 'block';
        } else {
            latexSection.style.display = 'none';
        }
    });
    latexSection.style.display = 'none';



    // Toggle para Arquitecto de Agentes
    const agentArchitectCheck = document.getElementById('agent-architect');
    const architectSection = document.getElementById('architect-section');

    agentArchitectCheck.addEventListener('change', () => {
        if (agentArchitectCheck.checked) {
            architectSection.style.display = 'block';
        } else {
            architectSection.style.display = 'none';
        }
    });
    architectSection.style.display = 'none';

    // 5. Función para compilar el prompt dinámico
    function compilePrompt() {
        const projectName = document.getElementById('project-name').value || '[Nombre_Proyecto]';
        const areaName = document.getElementById('area-name').value;
        const areaDetails = document.getElementById('area-details').value;
        
        const selectedLanguages = getSelectedLanguages();
        const languageStr = selectedLanguages.map(l => l.name).join(', ') || 'No especificado';
        const codingDetails = document.getElementById('coding-details').value;
        
        const isModel = agentModelCheck.checked;
        const isLatex = agentLatexCheck.checked;
        const isWeb = document.getElementById('agent-web').checked;
        const isDesign = agentDesignCheck.checked;
        const isDataEng = document.getElementById('agent-data-eng').checked;
        const isXai = document.getElementById('agent-xai').checked;
        const isMlops = document.getElementById('agent-mlops').checked;
        const isQa = document.getElementById('agent-qa').checked;
        const isResearch = document.getElementById('agent-research').checked;
        const isSimulation = document.getElementById('agent-simulation').checked;
        const isGitCicd = document.getElementById('agent-git-cicd').checked;
        const isPrivacy = document.getElementById('agent-privacy').checked;
        const isSustainability = document.getElementById('agent-sustainability').checked;
        const isIa = document.getElementById('agent-ia').checked;
        const isVideo = false;
        const isYoutube = false;
        const ytOratoria = false;
        const ytEjemplos = false;
        const ytDetails = '';
        
        const isArchitect = document.getElementById('agent-architect').checked;
        const loopPattern = document.getElementById('architect-loop-pattern').value;
        const isContentSuite = false;
        const isBrandVoice = false;
        const isSeoOpt = false;
        const isRepurposing = false;
        const isCalendar = false;
        const isDocsPresentations = false;
        const isBusinessSaaS = false;
        
        const videoFormat = '';
        const videoStyle = '';
        const videoDetails = '';
        
        const modeladoModels = document.getElementById('modelado-models').value;
        const isOptuna = optunaActiveCheck.checked;
        const optunaDetails = document.getElementById('optuna-details').value;

        const isDashboard = dashboardActiveCheck.checked;
        const dashboardType = dashboardTypeSelect.value;

        const isOratoria = false;
        const isDialogos = false;

        let prompt = `Actúa como una IA especializada cargando el entorno del proyecto: "${projectName}".\n`;
        prompt += `Asume las directrices, habilidades y expertises definidos en la carpeta "/IA/" de este repositorio. No proceses archivos pesados (PDFs, ZIPs) desde cero si ya cuentas con el conocimiento sintetizado en los archivos de la carpeta "/IA/expertices/".\n\n`;

        if (areaName) {
            prompt += `### AREA DE EXPERTIZ PRINCIPAL: ${areaName}\n`;
            if (areaDetails) {
                prompt += `Detalles de aplicación en el proyecto: ${areaDetails}\n`;
            }
            prompt += `\n`;
        }

        prompt += `### CONFIGURACIÓN DE DESARROLLO:\n`;
        prompt += `- Lenguaje de Programación: **${languageStr}**\n`;
        if (selectedLanguages.length > 0) {
            selectedLanguages.forEach(l => {
                prompt += `- Formato de Archivo Principal para {l.name}: **${l.format}** (Debes escribir tu código siguiendo estrictamente este formato).\n`.replace('{l.name}', l.name);
            });
        } else {
            prompt += `- Formato de Archivo Principal: **No especificado**\n`;
        }
        if (codingDetails) {
            prompt += `- Directrices de código específicas: ${codingDetails}\n`;
        }
        if (isArchitect) {
            prompt += `- Patrón de Loop de Agentes Activo: **${loopPattern}** (Razonamiento estructurado según este patrón).\n`;
        }
        if (isVideo) {
            prompt += `- Formato/Plataforma de Video: **${videoFormat}**\n`;
            prompt += `- Estilo de Edición de Video: **${videoStyle}**\n`;
            if (videoDetails) {
                prompt += `- Directrices de Video: ${videoDetails}\n`;
            }
        }
        prompt += `\n`;

        prompt += `### ROLES Y AGENTES ACTIVOS:\n`;
        prompt += `1. **Agente Estadístico Base**: Rol por defecto en "/IA/agentes/estadistico.md" apoyado en "/IA/expertices/expertiz_estadistica.md". Liderarás el análisis de datos (EDA), pruebas descriptivas y consistencia estadística.\n`;
        
        let agentCount = 2;
        if (isDataEng) {
            prompt += `${agentCount}. **Agente de Ingeniería de Datos**: Rol en "/IA/agentes/data_engineer.md". Te encargarás de la ingesta de datos, limpieza de nulos y codificación de variables.\n`;
            agentCount++;
        }
        
        if (isModel) {
            prompt += `${agentCount}. **Agente de Modelado**: Rol en "/IA/agentes/modelado.md". Te encargarás del ajuste de modelos predictivos y de clasificación (usando específicamente: ${modeladoModels || 'XGBoost, Random Forest, LightGBM, Redes Neuronales'}).\n`;
            if (isOptuna) {
                prompt += `   * **Optimización con Optuna**: Activa. Siguiendo la habilidad en "/IA/habilidades/optimizacion_optuna.md".\n`;
                if (optunaDetails) {
                    prompt += `   * Lógica y modelos requeridos: ${optunaDetails}\n`;
                }
            }
            if (isXai) {
                prompt += `   * **Explicabilidad (XAI)**: Activa. Rol en "/IA/agentes/xai_expert.md" para interpretar el modelo entrenado con SHAP e importancia de variables.\n`;
            }
            if (isMlops) {
                prompt += `   * **MLOps**: Activa. Rol en "/IA/agentes/mlops_engineer.md" apoyado en la habilidad "/IA/habilidades/despliegue_mlops.md" para exportar el modelo y generar microservicios/APIs (Docker/FastAPI).\n`;
            }
            agentCount++;
        }

        if (isLatex) {
            prompt += `${agentCount}. **Agente Redactor de LaTeX**: Rol en "/IA/agentes/redactor_latex.md" y habilidad en "/IA/habilidades/redaccion_latex.md". Escribirás informes utilizando las plantillas en "/Plantillas_Latex/".\n`;
            agentCount++;
        }

        if (isWeb) {
            prompt += `${agentCount}. **Agente Programador Frontend**: Rol en "/IA/agentes/programador.md", habilidades en "/IA/habilidades/desarrollo_web.md" y expertiz en "/IA/expertices/expertiz_diseno.md". Trabajarás con las plantillas de "/Pagina_Web/".\n`;
            agentCount++;
        }

        if (isDesign) {
            prompt += `${agentCount}. **Agente Diseñador Gráfico**: Rol en "/IA/agentes/disenador.md" apoyado en la habilidad de "/IA/habilidades/renderizado_diseno.md" y la expertiz en "/IA/expertices/expertiz_branding.md". Diseñarás logos vectoriales, esquemas de color, contrastes, posts de Instagram, miniaturas y fondos de pantalla con un enfoque consultivo.\n`;
            agentCount++;
        }

        if (isQa) {
            const qaLangs = selectedLanguages.map(l => l.name).join(', ') || 'cualquier lenguaje';
            prompt += `${agentCount}. **Agente de QA y Revisor de Código**: Rol en "/IA/agentes/qa_reviewer.md". Auditarás la calidad del código, sintaxis, PEP8 y la correctitud de las pruebas unitarias basadas en ${qaLangs}.\n`;
            agentCount++;
        }

        if (isResearch) {
            prompt += `${agentCount}. **Agente Investigador de Literatura**: Rol en "/IA/agentes/investigador.md" apoyado en la habilidad "/IA/habilidades/curaduria_literatura.md". Recabarás literatura científica real y verificarás su consistencia a través de los PDFs subidos en "/Documentacion/Documento_Literatura/".\n`;
            agentCount++;
        }

        if (isSimulation) {
            prompt += `${agentCount}. **Agente de Simulación**: Rol en "/IA/agentes/simulacion.md". Modelarás escenarios complejos, simulaciones de Monte Carlo y análisis de sensibilidad de parámetros.\n`;
            agentCount++;
        }

        if (isGitCicd) {
            prompt += `${agentCount}. **Agente de Git y CI/CD**: Rol en "/IA/agentes/git_cicd.md". Automatizarás workflows, gestionarás repositorios y crearás pipelines de CI/CD (GitHub Actions).\n`;
            agentCount++;
        }

        if (isPrivacy) {
            prompt += `${agentCount}. **Agente de Privacidad de Datos**: Rol en "/IA/agentes/privacidad_datos.md". Auditarás el dataset para aplicar técnicas de anonimización y asegurar la gobernanza ética.\n`;
            agentCount++;
        }

        if (isSustainability) {
            prompt += `${agentCount}. **Agente de Sostenibilidad**: Rol en "/IA/agentes/sostenibilidad.md". Evaluarás el impacto ambiental, eficiencia de algoritmos y alineación con los ODS.\n`;
            agentCount++;
        }

        if (isIa) {
            prompt += `${agentCount}. **Agente Especialista en IA**: Rol en "/IA/agentes/ia_expert.md" apoyado en "/IA/habilidades/conexion_api_ia.md". Diseñador de arquitecturas de Deep Learning, NLP, e integrarás agentes de IA mediante APIs (Gemini, ChatGPT) en interfaces web o dashboards conversacionales.\n`;
            agentCount++;
        }

        if (isArchitect) {
            prompt += `${agentCount}. **Agente Arquitecto de Agentes**: Rol en "/IA/agentes/arquitecto_agentes.md" apoyado en la habilidad "/IA/habilidades/orquestacion_agentes.md" y el manual "/IA/expertices/expertiz_agent_architect.md". Coordinarás los flujos, loops de agentes y llamadas a herramientas (MCP).\n`;
            agentCount++;
        }

        if (isVideo) {
            prompt += `${agentCount}. **Agente Creador y Editor de Videos**: Rol en "/IA/agentes/editor_video.md", habilidades en "/IA/habilidades/edicion_creacion_video.md" y expertiz en "/IA/expertices/expertiz_videos_virales.md". Te encargarás de diseñar el guión/storyboard y automatizar la edición de videos virales en formato **${videoFormat}** con un estilo **${videoStyle}** partiendo de audios pregrabados.\n`;
            agentCount++;
        }

        if (isYoutube) {
            prompt += `${agentCount}. **Guionista / Creador YouTube**: Rol en "/IA/agentes/creador_contenido_youtube.md" y habilidad en "/IA/habilidades/creacion_dialogos_youtube.md". Te especializas en la redacción de diálogos y guiones de alto impacto para videos de YouTube.\n`;
            if (ytOratoria) {
                prompt += `   * **Técnicas de Oratoria**: Activas. Aplicarás los principios de oratoria de impacto de "/IA/expertices/expertiz_oratoria.md".\n`;
            }
            if (ytEjemplos) {
                prompt += `   * **Ejemplos Consolidados**: Activo. Cargarás e imitarás los guiones depositados en "/IA/expertices/dialogos_consolidados/".\n`;
            }
            if (ytDetails) {
                prompt += `   * **Detalles del Canal/Guión**: ${ytDetails}\n`;
            }
            agentCount++;
        }

        if (isDashboard) {
            prompt += `${agentCount}. **Dashboard (${dashboardType})**: Activo. Guiado por la habilidad en "/IA/habilidades/dashboard_${dashboardType.toLowerCase()}.md". Programarás el dashboard interactivo en la carpeta "/Dashboard/".\n`;
            agentCount++;
        }
        prompt += `\n`;

        prompt += `### REGLAS DE ACCIÓN MANDATORIAS (SIEMPRE ACTIVAS):\n`;
        prompt += `1. **Mención Explícita del Agente Activo**: Al emitir cualquier respuesta, código, análisis o reporte, debes declarar explícitamente en el chat el rol o agente de "/IA/agentes/" que estás asumiendo en ese momento (ej: \`[Rol: Estadístico Base]\` o \`[Rol: Agente de Modelado]\`) al inicio de tu mensaje.\n`;
        prompt += `2. **Generación y Actualización de Bitácora**: Es obligatorio mantener actualizado el archivo "IA/bitacora.md". Al finalizar cada tarea, sesión o cambio en el código, debes documentar el progreso, decisiones tomadas y siguientes pasos (asegurando el uso de mayúsculas donde sea gramaticalmente correcto en títulos, inicios de párrafo y nombres propios).\n`;
        prompt += `3. **Exportación de Métricas a Excel**: Los resultados de entrenamientos, optimización de hiperparámetros y métricas de modelos de machine learning deben guardarse estrictamente en formato Excel (\`metrics.xlsx\`), nunca en formato JSON.\n`;
        prompt += `4. **Aislamiento de Informes en Subcarpetas**: Cada informe, reporte o presentación de LaTeX debe estar aislado en una subcarpeta dedicada dentro de "/Documentacion/Informes/" (ej: "/Documentacion/Informes/Reporte_EDA/"), conteniendo todos sus archivos fuentes (.tex), auxiliares e imágenes.\n`;
        
        let mandatoryCount = 5;
        if (isVideo) {
            prompt += `${mandatoryCount}. **Edición de Video Basada en Retención**: Los videos generados deben estructurarse con ganchos (*hooks*) de 3 segundos, cortes de ritmo constantes (cada 2 segundos de promedio), superposición de textos de Pillow con safe zones (centro vertical) y mezcla de audio con ganancia equilibrada (voz principal dominante, música a -15dB).\n`;
            mandatoryCount++;
        }
        if (isYoutube) {
            prompt += `${mandatoryCount}. **Estructura de Guion YouTube**: Los guiones redactados deben incluir ganchos magnéticos en los primeros 3 segundos, cortes de ritmo narrativo claros, llamadas a la acción (CTA) contextuales y técnicas de oratoria para garantizar la retención de la audiencia.\n`;
            mandatoryCount++;
        }
        if (isResearch) {
            prompt += `${mandatoryCount}. **Verificación Bibliográfica Obligatoria**: Toda cita, afirmación o sustento académico incluido en los reportes debe contrastarse activamente con los PDFs reales depositados en "/Documentacion/Documento_Literatura/". Se debe generar de forma obligatoria el archivo Excel \`citas_verificacion.xlsx\` conteniendo las columnas: Cita, Documento Asociado, Número de Página Citada y Autores.\n`;
            mandatoryCount++;
        }
        
        prompt += `${mandatoryCount}. **Conversión y Lectura de PDFs con MarkItDown**: Cuando debas leer cualquier archivo PDF en este espacio, debes usar la herramienta 'markitdown' (ejecutando comandos en consola o un script rápido de Python) para pasarlo a formato Markdown ".md" y leer únicamente el archivo ".md" resultante (conforme a "/IA/habilidades/lectura_pdf_markitdown.md").\n`;
        mandatoryCount++;
        prompt += `${mandatoryCount}. **Clonación del Estilo de Escritura del Usuario**: Al redactar informes, justificaciones, análisis o conclusiones, debes imitar exactamente el estilo detallado en "/IA/expertices/estilo_escritura.md" (tono formal, riguroso, uso de conectores formales y tercera persona impersonal).\n`;
        mandatoryCount++;
        prompt += `${mandatoryCount}. **Parsimonia en el Código**: En el desarrollo de tus códigos (en "/Codigos/"), mantén estructuras limpias, comentadas y documentadas siguiendo la habilidad "/IA/habilidades/programacion_general.md".\n`;
        mandatoryCount++;
        
        let ruleCount = mandatoryCount;
        if (isOratoria) {
            prompt += `${ruleCount}. **Estrategias de Oratoria**: Al estructurar discursos, defensas o presentaciones, debes apegarte estrictamente a las técnicas de comunicación persuasiva y oratoria de impacto documentadas en "/IA/expertices/expertiz_oratoria.md".\n`;
            ruleCount++;
        }
        if (isDialogos) {
            prompt += `${ruleCount}. **Creación de Diálogos**: Al redactar diálogos, simulaciones, debates o guiones, debes aplicar las reglas de estructuración y roles académicos definidas en "/IA/expertices/expertiz_dialogos.md", reflejando tu estilo formal e impersonal.\n`;
            ruleCount++;
        }
        if (isBrandVoice) {
            prompt += `${ruleCount}. **Clonación y Análisis de Voz**: Analizarás y replicarás de manera consistente la voz de marca utilizando el script de Python en "/IA/herramientas/brand_voice_analyzer.py" y la expertiz en "/IA/expertices/expertiz_brand_voice.md".\n`;
            ruleCount++;
        }
        if (isSeoOpt) {
            prompt += `${ruleCount}. **Optimización SEO de Contenido**: Evaluarás y optimizarás la visibilidad y metadatos de tu producción utilizando el script de Python en "/IA/herramientas/seo_optimizer.py" para maximizar la efectividad algorítmica.\n`;
            ruleCount++;
        }
        if (isRepurposing) {
            prompt += `${ruleCount}. **Matriz de Repropósito de Contenido**: Adaptarás y fragmentarás el contenido para múltiples plataformas (Shorts, posts de LinkedIn, hilos de X o blogs) siguiendo el manual en "/IA/expertices/expertiz_content_frameworks.md" y "/IA/expertices/expertiz_social_media.md".\n`;
            ruleCount++;
        }
        if (isCalendar) {
            prompt += `${ruleCount}. **Calendario Editorial Mensual**: Planificarás y distribuirás las publicaciones siguiendo la plantilla y las proporciones equilibradas en "/IA/expertices/expertiz_content_calendar.md".\n`;
            ruleCount++;
        }
        if (isDocsPresentations) {
            prompt += `${ruleCount}. **Documentación y Presentaciones Premium**: Estructurarás tus informes científicos y tus diapositivas según las directrices de alto impacto cognitivo y diagramación en "/IA/habilidades/documentacion_presentaciones.md" y "/IA/expertices/expertiz_docs_presentations.md".\n`;
            ruleCount++;
        }
        if (isBusinessSaaS) {
            prompt += `${ruleCount}. **Análisis de Negocio y SaaS**: Utilizarás el marco de métricas comerciales (LTV, CAC, Churn) y optimización de conversión según "/IA/habilidades/analisis_negocio_saas.md" y "/IA/expertices/expertiz_business_saas.md".\n`;
            ruleCount++;
        }
        prompt += `\n`;
        
        prompt += `Por favor, confirma que has leído y asimilado este prompt, así como los manuales en la carpeta "/IA/", y dime que estás listo para iniciar el trabajo.`;

        // Modificador helper para pasar lowercase en JS
        return prompt.replace(/dashboard_react|dashboard_shiny|dashboard_dash/g, match => match.toLowerCase());
    }

    // 6. Botón de generar prompt
    btnGenerate.addEventListener('click', () => {
        const promptText = compilePrompt();
        promptOutput.textContent = promptText;
        showNotification('Prompt compilado y listo para copiar.', 'info');
    });

    // 7. Botón de copiar
    btnCopy.addEventListener('click', () => {
        const promptText = promptOutput.textContent;
        navigator.clipboard.writeText(promptText).then(() => {
            const originalText = btnCopy.textContent;
            btnCopy.textContent = '¡Copiado!';
            btnCopy.style.backgroundColor = 'var(--success-color)';
            setTimeout(() => {
                btnCopy.textContent = originalText;
                btnCopy.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }, 1500);
        }).catch(err => {
            showNotification('Error al copiar al portapapeles: ' + err, 'error');
        });
    });

    // 8. Enviar formulario para crear proyecto local
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const projectName = document.getElementById('project-name').value;
        const targetPath = document.getElementById('project-path').value;
        const areaName = document.getElementById('area-name').value;
        const areaDetails = document.getElementById('area-details').value;
        const selectedLanguages = getSelectedLanguages();
        const language = selectedLanguages.map(l => l.name).join(', ') || 'No especificado';
        const format = selectedLanguages.map(l => l.format).join(', ') || 'N/A';
        const codingDetails = document.getElementById('coding-details').value;
        
        const isModel = agentModelCheck.checked;
        const isLatex = agentLatexCheck.checked;
        const isWeb = document.getElementById('agent-web').checked;
        const isDesign = agentDesignCheck.checked;
        const isDataEng = document.getElementById('agent-data-eng').checked;
        const isXai = document.getElementById('agent-xai').checked;
        const isMlops = document.getElementById('agent-mlops').checked;
        const isQa = document.getElementById('agent-qa').checked;
        const isResearch = document.getElementById('agent-research').checked;
        const isSimulation = document.getElementById('agent-simulation').checked;
        const isGitCicd = document.getElementById('agent-git-cicd').checked;
        const isPrivacy = document.getElementById('agent-privacy').checked;
        const isSustainability = document.getElementById('agent-sustainability').checked;
        const isIa = document.getElementById('agent-ia').checked;
        const isVideo = false;
        const isYoutube = false;
        const ytOratoria = false;
        const ytEjemplos = false;
        const ytDetails = '';
        
        const videoFormat = '';
        const videoStyle = '';
        const videoDetails = '';
        
        const modeladoModels = document.getElementById('modelado-models').value;
        const isOptuna = optunaActiveCheck.checked;
        const optunaDetails = document.getElementById('optuna-details').value;

        const isDashboard = dashboardActiveCheck.checked;
        const dashboardType = dashboardTypeSelect.value;
        
        const isLaTeXReport = latexReportCheck.checked;
        const isLaTeXPresentation = latexPresentationCheck.checked;

        const isOratoria = false;
        const isDialogos = false;
        
        const isArchitect = document.getElementById('agent-architect').checked;
        const loopPattern = document.getElementById('architect-loop-pattern').value;
        const isContentSuite = false;
        const isBrandVoice = false;
        const isSeoOpt = false;
        const isRepurposing = false;
        const isCalendar = false;
        const isDocsPresentations = false;
        const isBusinessSaaS = false;

        const requestData = {
            projectName,
            targetPath,
            language,
            format,
            selectedLanguages,
            optunaActive: isModel && isOptuna,
            optunaDetails,
            modeladoModels,
            areaName,
            areaDetails,
            activeAgents: {
                modelado: isModel,
                latex: isLatex,
                programador: isWeb,
                disenador: isDesign,
                dataEng: isDataEng,
                xai: isXai,
                mlops: isMlops,
                qa: isQa,
                research: isResearch,
                simulation: isSimulation,
                gitCicd: isGitCicd,
                privacy: isPrivacy,
                sustainability: isSustainability,
                ia: isIa,
                videoEditor: isVideo,
                youtubeCreator: isYoutube,
                architect: isArchitect
            },
            videoFormat,
            videoStyle,
            videoDetails,
            ytOratoria,
            ytEjemplos,
            youtubeDetails: ytDetails,
            additionalCoding: codingDetails,
            dashboardActive: isDashboard,
            dashboardType,
            copyLaTeXReport: isLatex && isLaTeXReport,
            copyLaTeXPresentation: isLatex && isLaTeXPresentation,
            oratoriaActive: isOratoria,
            dialogosActive: isDialogos,
            loopPattern,
            brandVoiceActive: isBrandVoice,
            seoOptimizerActive: isSeoOpt,
            repurposingActive: isRepurposing,
            contentCalendarActive: isCalendar,
            docsPresentationsActive: isDocsPresentations,
            businessSaaSActive: isBusinessSaaS
        };

        showNotification('Creando proyecto en el disco local...', 'info');

        fetch('http://localhost:3000/api/create-project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(res => {
            if (res.status === 200) {
                showNotification(res.body.message + '. El prompt maestro se ha guardado en /IA/prompt_inicio.txt', 'success');
                // Generar y colocar el prompt en la caja
                const promptText = compilePrompt();
                promptOutput.textContent = promptText;
            } else {
                showNotification('Error al crear proyecto: ' + res.body.error, 'error');
            }
        })
        .catch(err => {
            showNotification('Error de conexión con el servidor local. Asegúrate de tener ejecutándose server.py en la terminal (iniciar haciendo doble clic en Iniciar_Dashboard.bat).', 'error');
            console.error(err);
        });
    });

    // Botón para elegir carpeta desde el PC
    const btnSelectPath = document.getElementById('btn-select-path');
    const projectPathInput = document.getElementById('project-path');

    btnSelectPath.addEventListener('click', () => {
        const originalText = btnSelectPath.textContent;
        btnSelectPath.textContent = 'Buscando...';
        btnSelectPath.disabled = true;
        
        // Mostrar advertencia sobre posible apertura en segundo plano
        showNotification('⚠️ Nota: Se está abriendo el selector de carpetas. Si no aparece en primer plano, por favor revisa si la ventana quedó minimizada o detrás del navegador en tu barra de tareas.', 'info');
        
        fetch('http://localhost:3000/api/select-folder')
            .then(response => response.json())
            .then(data => {
                if (data.path) {
                    projectPathInput.value = data.path;
                    showNotification('Ruta de destino seleccionada correctamente.', 'success');
                } else {
                    showNotification('Búsqueda cancelada o no se seleccionó ninguna ruta.', 'info');
                }
                btnSelectPath.textContent = originalText;
                btnSelectPath.disabled = false;
            })
            .catch(err => {
                console.error('Error al seleccionar carpeta:', err);
                showNotification('No se pudo conectar con el servidor local para abrir el selector de carpetas. Asegúrate de que el servidor está corriendo.', 'error');
                btnSelectPath.textContent = originalText;
                btnSelectPath.disabled = false;
            });
    });

    // Utilidad de notificaciones
    function showNotification(text, type) {
        statusNotification.textContent = text;
        statusNotification.className = `notification ${type}`;
    }

    // --- Modal de Bienvenida ---
    const welcomeModal = document.getElementById('welcome-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    if (welcomeModal && btnCloseModal) {
        // Mostrar modal con un pequeño delay para animación suave
        setTimeout(() => {
            welcomeModal.classList.add('active');
        }, 300);

        btnCloseModal.addEventListener('click', () => {
            welcomeModal.classList.remove('active');
        });

        // También cerrar al hacer clic fuera del contenedor
        welcomeModal.addEventListener('click', (e) => {
            if (e.target === welcomeModal) {
                welcomeModal.classList.remove('active');
            }
        });
    }
});
