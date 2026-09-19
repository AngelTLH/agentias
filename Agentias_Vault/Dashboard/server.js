const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const TEMPLATE_DIR = path.resolve(__dirname, '..'); // Directorio padre (Agentias_Vault)

// Función auxiliar para copiar directorios de forma recursiva
function copyFolderSync(from, to) {
    if (!fs.existsSync(from)) return;
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }
    fs.readdirSync(from).forEach(element => {
        const stat = fs.lstatSync(path.join(from, element));
        if (stat.isDirectory()) {
            copyFolderSync(path.join(from, element), path.join(to, element));
        } else if (stat.isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        }
    });
}

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'GET') {
        if (req.url === '/api/select-folder') {
            const { exec } = require('child_process');
            const psScript = "Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName Microsoft.VisualBasic; Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\\\"user32.dll\\\")] public static extern bool SetForegroundWindow(IntPtr hWnd); }' -ErrorAction SilentlyContinue; $folderPicker = New-Object System.Windows.Forms.OpenFileDialog; $folderPicker.ValidateNames = $false; $folderPicker.CheckFileExists = $false; $folderPicker.CheckPathExists = $true; $folderPicker.FileName = 'Seleccionar carpeta.'; $folderPicker.Title = 'Selecciona la carpeta de destino'; $parent = New-Object System.Windows.Forms.Form; $parent.TopMost = $true; $parent.Opacity = 0; $parent.ShowInTaskbar = $false; $parent.Add_Shown({ [Win32]::SetForegroundWindow($this.Handle); try { [Microsoft.VisualBasic.Interaction]::AppActivate('Selecciona la carpeta de destino'); } catch {} }); if ($folderPicker.ShowDialog($parent) -eq [System.Windows.Forms.DialogResult]::OK) { $selectedPath = Split-Path $folderPicker.FileName; Write-Output $selectedPath }; $parent.Dispose(); $folderPicker.Dispose();";
            
            exec(`powershell -NoProfile -Command "${psScript}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error opening folder browser dialog:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: error.message }));
                    return;
                }
                const selectedPath = stdout.trim();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ path: selectedPath }));
            });
            return;
        }

        // Servir archivos estáticos del Dashboard
        let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
        
        // Evitar salir del directorio del Dashboard por seguridad
        if (!filePath.startsWith(__dirname)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Acceso denegado');
            return;
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Archivo no encontrado');
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`Error de servidor: ${error.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    } else if (req.method === 'POST' && req.url === '/api/create-project') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const config = JSON.parse(body);
                const {
                    projectName,
                    targetPath,
                    language,
                    format,
                    selectedLanguages = [],
                    optunaActive = false,
                    optunaDetails = '',
                    modeladoModels = '',
                    areaName = '',
                    areaDetails = '',
                    activeAgents = {},
                    additionalCoding = '',
                    oratoriaActive = false,
                    dialogosActive = false,
                    dashboardActive = false,
                    dashboardType = 'React',
                    copyLaTeXReport = false,
                    copyLaTeXPresentation = false,
                    loopPattern = 'Directo',
                    brandVoiceActive = false,
                    seoOptimizerActive = false,
                    repurposingActive = false,
                    contentCalendarActive = false,
                    docsPresentationsActive = false,
                    businessSaaSActive = false
                } = config;

                let actualSelectedLanguages = selectedLanguages;
                if (actualSelectedLanguages.length === 0 && language && language !== 'No especificado') {
                    actualSelectedLanguages = [{ name: language, format: format }];
                }

                const agentArchitect = activeAgents.architect || false;

                if (!projectName || !targetPath) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Nombre del proyecto y ruta de destino requeridos.' }));
                    return;
                }

                // Resolver la ruta destino completa
                const fullProjectPath = path.join(targetPath, projectName);

                const copyFile = (srcRel, dstRel) => {
                    const src = path.join(TEMPLATE_DIR, srcRel);
                    const dst = path.join(fullProjectPath, dstRel);
                    if (fs.existsSync(src)) fs.copyFileSync(src, dst);
                };

                if (fs.existsSync(fullProjectPath)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: `El directorio ya existe: ${fullProjectPath}` }));
                    return;
                }

                // 1. Crear estructura básica de carpetas
                fs.mkdirSync(path.join(fullProjectPath, 'IA', 'agentes'), { recursive: true });
                fs.mkdirSync(path.join(fullProjectPath, 'IA', 'habilidades'), { recursive: true });
                fs.mkdirSync(path.join(fullProjectPath, 'IA', 'expertices'), { recursive: true });
                fs.mkdirSync(path.join(fullProjectPath, 'IA', 'herramientas'), { recursive: true });
                fs.mkdirSync(path.join(fullProjectPath, 'Documentacion', 'Ejemplos'), { recursive: true });
                fs.mkdirSync(path.join(fullProjectPath, 'Documentacion', 'Informes'), { recursive: true });
                fs.mkdirSync(path.join(fullProjectPath, 'Codigos'), { recursive: true });
                if (activeAgents.research) {
                    fs.mkdirSync(path.join(fullProjectPath, 'Documentacion', 'Documento_Literatura'), { recursive: true });
                }

                // Crear bitácora inicial
                let bitacoraContent = `# Bitácora de Proyecto: ${projectName}\n\n`;
                bitacoraContent += "Este archivo registra de forma estructurada el avance, decisiones técnicas y estado general del proyecto para mantener la coherencia y el contexto entre sesiones.\n\n";
                bitacoraContent += "## 1. Estado Actual del Proyecto\n";
                bitacoraContent += "- **Última actualización:** (Proyecto inicializado)\n";
                bitacoraContent += "- **Agente Activo:** Ninguno (Inicialización del sistema)\n";
                const langDesc = actualSelectedLanguages.map(l => `${l.name} (${l.format})`).join(', ') || 'No especificado';
                bitacoraContent += `- **Lenguaje Principal:** ${langDesc}\n`;
                bitacoraContent += "\n## 2. Decisiones Técnicas y Supuestos\n";
                bitacoraContent += "- Creación inicial de la estructura del proyecto y copia de agentes/habilidades base.\n";
                bitacoraContent += "\n## 3. Registro Histórico de Actividades\n";
                bitacoraContent += "| Fecha y Hora | Agente / Rol | Actividad Detallada | Entregables / Cambios Producidos |\n";
                bitacoraContent += "| :--- | :--- | :--- | :--- |\n";
                bitacoraContent += "| 2026-09-18 | Sistema | Inicialización del entorno del proyecto | Creación de directorios y copias de configuración |\n";
                bitacoraContent += "\n## 4. Tareas Pendientes e Hitos del Proyecto\n";
                bitacoraContent += "- [ ] Cargar y validar conjunto de datos inicial.\n";
                bitacoraContent += "- [ ] Realizar Análisis Exploratorio de Datos (EDA) usando [Estadístico Base].\n";
                if (agentArchitect) {
                    bitacoraContent += `- [ ] Configurar y validar orquestación de loops (${loopPattern}) usando [Agente Arquitecto de Agentes].\n`;
                }
                if (activeAgents.modelado) {
                    bitacoraContent += "- [ ] Entrenar y optimizar modelos con Optuna, guardando resultados en `metrics.xlsx` usando [Agente de Modelado].\n";
                }
                if (activeAgents.secops) {
                    bitacoraContent += "- [ ] Realizar auditoría de seguridad SAST/SCA y sanitización de inputs usando [Agente de Seguridad y SecOps].\n";
                }
                if (activeAgents.performance) {
                    bitacoraContent += "- [ ] Ejecutar profiling de CPU/RAM y vectorizar DataFrames usando [Agente de Optimización de Rendimiento].\n";
                }
                if (brandVoiceActive) {
                    bitacoraContent += "- [ ] Analizar voz de marca y validar coherencia del texto usando el script de Python.\n";
                }
                if (activeAgents.latex) {
                    bitacoraContent += "- [ ] Redactar y diagramar informe técnico final en subcarpetas de informes usando [Redactor de LaTeX].\n";
                }
                if (docsPresentationsActive) {
                    bitacoraContent += "- [ ] Redactar informes científicos y diseñar diapositivas premium con alto impacto cognitivo.\n";
                }
                if (businessSaaSActive) {
                    bitacoraContent += "- [ ] Evaluar métricas de negocio (LTV, CAC, Churn) y optimizar embudos de conversión.\n";
                }

                fs.writeFileSync(path.join(fullProjectPath, 'IA', 'bitacora.md'), bitacoraContent, 'utf-8');

                // 2. Copiar archivos comunes y base
                copyFile('AGENTS.md', 'AGENTS.md');
                copyFolderSync(path.join(TEMPLATE_DIR, 'IA', 'bitacoras'), path.join(fullProjectPath, 'IA', 'bitacoras'));
                copyFile('IA/habilidades/lectura_pdf_markitdown.md', 'IA/habilidades/lectura_pdf_markitdown.md');
                copyFile('IA/expertices/estilo_escritura.md', 'IA/expertices/estilo_escritura.md');
                copyFile('IA/habilidades/programacion_general.md', 'IA/habilidades/programacion_general.md');
                copyFile('IA/agentes/estadistico.md', 'IA/agentes/estadistico.md');
                copyFile('IA/expertices/expertiz_estadistica.md', 'IA/expertices/expertiz_estadistica.md');

                // Agente Especialista en Área de Dominio
                if (areaName) {
                    copyFile('IA/agentes/experto_area.md', 'IA/agentes/experto_area.md');
                    const expertFile = path.join(fullProjectPath, 'IA', 'agentes', 'experto_area.md');
                    if (fs.existsSync(expertFile)) {
                        let content = fs.readFileSync(expertFile, 'utf-8');
                        content = content.replace(/{Area_Dominio}/g, areaName);
                        content = content.replace(/{Detalles_Aplicacion}/g, areaDetails || 'No especificados');
                        fs.writeFileSync(expertFile, content, 'utf-8');
                    }
                    const expertBitacora = path.join(fullProjectPath, 'IA', 'bitacoras', 'bitacora_experto_area.md');
                    if (fs.existsSync(expertBitacora)) {
                        let bContent = fs.readFileSync(expertBitacora, 'utf-8');
                        bContent = bContent.replace(/{Area_Dominio}/g, areaName);
                        fs.writeFileSync(expertBitacora, bContent, 'utf-8');
                    }
                }

                // Copiar habilidades de programación según selección
                actualSelectedLanguages.forEach(langItem => {
                    const langSkill = `programacion_${langItem.name.toLowerCase()}.md`;
                    copyFile(path.join('IA', 'habilidades', langSkill), path.join('IA', 'habilidades', langSkill));
                });

                // Agente de modelado
                if (activeAgents.modelado) {
                    const modeladoSrc = path.join(TEMPLATE_DIR, 'IA', 'agentes', 'modelado.md');
                    const modeladoDst = path.join(fullProjectPath, 'IA', 'agentes', 'modelado.md');
                    if (fs.existsSync(modeladoSrc)) {
                        let content = fs.readFileSync(modeladoSrc, 'utf-8');
                        if (modeladoModels) {
                            content = content.replace('XGBoost, Random Forest, LightGBM, Redes Neuronales', modeladoModels);
                        }
                        fs.writeFileSync(modeladoDst, content, 'utf-8');
                    }
                    if (optunaActive) {
                        copyFile('IA/habilidades/optimizacion_optuna.md', 'IA/habilidades/optimizacion_optuna.md');
                    }
                }

                // Agente Redactor LaTeX
                if (activeAgents.latex) {
                    copyFile('IA/agentes/redactor_latex.md', 'IA/agentes/redactor_latex.md');
                    copyFile('IA/habilidades/redaccion_latex.md', 'IA/habilidades/redaccion_latex.md');
                    if (copyLaTeXReport) {
                        copyFolderSync(path.join(TEMPLATE_DIR, 'Plantillas_Latex', 'Plantilla_Informe'), path.join(fullProjectPath, 'Plantillas_Latex', 'Plantilla_Informe'));
                    }
                    if (copyLaTeXPresentation) {
                        copyFolderSync(path.join(TEMPLATE_DIR, 'Plantillas_Latex', 'Plantilla_Presentación'), path.join(fullProjectPath, 'Plantillas_Latex', 'Plantilla_Presentación'));
                    }
                }

                if (oratoriaActive || activeAgents.latex) {
                    copyFile('IA/expertices/expertiz_oratoria.md', 'IA/expertices/expertiz_oratoria.md');
                }

                // Agente Programador Frontend / Web
                if (activeAgents.programador) {
                    copyFile('IA/agentes/programador.md', 'IA/agentes/programador.md');
                    copyFile('IA/habilidades/desarrollo_web.md', 'IA/habilidades/desarrollo_web.md');
                    copyFile('IA/expertices/expertiz_diseno.md', 'IA/expertices/expertiz_diseno.md');
                    copyFolderSync(path.join(TEMPLATE_DIR, 'Pagina_Web'), path.join(fullProjectPath, 'Pagina_Web'));
                }

                // Agente Diseñador Gráfico y recursos de branding
                if (activeAgents.disenador) {
                    copyFile('IA/agentes/disenador.md', 'IA/agentes/disenador.md');
                    copyFile('IA/habilidades/renderizado_diseno.md', 'IA/habilidades/renderizado_diseno.md');
                    copyFile('IA/expertices/expertiz_branding.md', 'IA/expertices/expertiz_branding.md');
                }

                // Copiar ejemplos de escritura
                copyFolderSync(path.join(TEMPLATE_DIR, 'Documentacion', 'Ejemplos'), path.join(fullProjectPath, 'Documentacion', 'Ejemplos'));

                // Copiar agentes y habilidades adicionales
                if (activeAgents.dataEng) copyFile('IA/agentes/data_engineer.md', 'IA/agentes/data_engineer.md');
                if (activeAgents.xai) copyFile('IA/agentes/xai_expert.md', 'IA/agentes/xai_expert.md');
                if (activeAgents.mlops) {
                    copyFile('IA/agentes/mlops_engineer.md', 'IA/agentes/mlops_engineer.md');
                    copyFile('IA/habilidades/despliegue_mlops.md', 'IA/habilidades/despliegue_mlops.md');
                }
                if (activeAgents.qa) copyFile('IA/agentes/qa_reviewer.md', 'IA/agentes/qa_reviewer.md');
                if (activeAgents.research) {
                    copyFile('IA/agentes/investigador.md', 'IA/agentes/investigador.md');
                    copyFile('IA/habilidades/curaduria_literatura.md', 'IA/habilidades/curaduria_literatura.md');
                }
                if (activeAgents.simulation) copyFile('IA/agentes/simulacion.md', 'IA/agentes/simulacion.md');
                if (activeAgents.gitCicd) copyFile('IA/agentes/git_cicd.md', 'IA/agentes/git_cicd.md');
                if (activeAgents.privacy) copyFile('IA/agentes/privacidad_datos.md', 'IA/agentes/privacidad_datos.md');
                if (activeAgents.sustainability) copyFile('IA/agentes/sostenibilidad.md', 'IA/agentes/sostenibilidad.md');
                if (activeAgents.secops) {
                    copyFile('IA/agentes/secops_engineer.md', 'IA/agentes/secops_engineer.md');
                    copyFile('IA/habilidades/seguridad_codigo_secops.md', 'IA/habilidades/seguridad_codigo_secops.md');
                }
                if (activeAgents.performance) {
                    copyFile('IA/agentes/performance_optimizer.md', 'IA/agentes/performance_optimizer.md');
                    copyFile('IA/habilidades/optimizacion_rendimiento.md', 'IA/habilidades/optimizacion_rendimiento.md');
                }
                if (activeAgents.ia) {
                    copyFile('IA/agentes/ia_expert.md', 'IA/agentes/ia_expert.md');
                    copyFile('IA/habilidades/conexion_api_ia.md', 'IA/habilidades/conexion_api_ia.md');
                }
                if (agentArchitect) {
                    copyFile('IA/agentes/arquitecto_agentes.md', 'IA/agentes/arquitecto_agentes.md');
                    copyFile('IA/habilidades/orquestacion_agentes.md', 'IA/habilidades/orquestacion_agentes.md');
                    copyFile('IA/expertices/expertiz_agent_architect.md', 'IA/expertices/expertiz_agent_architect.md');
                }

                // Configuración de Dashboard
                if (dashboardActive) {
                    const dashboardDst = path.join(fullProjectPath, 'Dashboard');
                    if (!fs.existsSync(dashboardDst)) {
                        fs.mkdirSync(dashboardDst, { recursive: true });
                    }
                    if (dashboardType === 'Dash') {
                        copyFile('IA/habilidades/dashboard_dash.md', 'IA/habilidades/dashboard_dash.md');
                        const appPyContent = "import dash\nfrom dash import html, dcc\n\napp = dash.Dash(__name__)\n\napp.layout = html.Div([\n    html.H1('Dashboard en Dash (Python)')\n])\n\nif __name__ == '__main__':\n    app.run_server(debug=True)\n";
                        fs.writeFileSync(path.join(dashboardDst, 'app.py'), appPyContent, 'utf-8');
                    } else if (dashboardType === 'Shiny') {
                        copyFile('IA/habilidades/dashboard_shiny.md', 'IA/habilidades/dashboard_shiny.md');
                        copyFolderSync(path.join(TEMPLATE_DIR, 'Plantilla_Shiny', 'dashboard'), dashboardDst);
                    } else if (dashboardType === 'React') {
                        copyFile('IA/habilidades/dashboard_react.md', 'IA/habilidades/dashboard_react.md');
                        const pkgJson = '{\n  "name": "react-dashboard",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}\n';
                        fs.mkdirSync(path.join(dashboardDst, 'src'), { recursive: true });
                        const appJsx = "import React from 'react';\n\nexport default function App() {\n  return <h1>Dashboard en React</h1>;\n}\n";
                        fs.writeFileSync(path.join(dashboardDst, 'package.json'), pkgJson, 'utf-8');
                        fs.writeFileSync(path.join(dashboardDst, 'src', 'App.jsx'), appJsx, 'utf-8');
                    }
                }

                // 3. Crear archivo PRODUCT.md descriptivo
                let productMd = `# Proyecto: ${projectName}\n\n`;
                productMd += `## Configuración de Entorno y Agentes\n`;
                const langStr = actualSelectedLanguages.map(l => `${l.name} (${l.format})`).join(', ') || 'No especificado';
                productMd += `* **Lenguajes de Programación**: ${langStr}\n`;
                if (additionalCoding) {
                    productMd += `* **Especificación de Programación**: ${additionalCoding}\n`;
                }
                if (areaName) {
                    productMd += `* **Área de Expertiz**: ${areaName}\n`;
                    productMd += `  * Detalles: ${areaDetails}\n`;
                }
                if (agentArchitect) {
                    productMd += `* **Orquestación de Loops**: Activo (Patrón: ${loopPattern})\n`;
                }
                if (dashboardActive) {
                    productMd += `* **Dashboard**: Activo (${dashboardType})\n`;
                }
                if (oratoriaActive) {
                    productMd += `* **Estrategias de Oratoria**: Activo (Manual de Oratoria Clásica)\n`;
                }
                if (dialogosActive) {
                    productMd += `* **Creación de Diálogos**: Activo (Estilo del Usuario)\n`;
                }
                if (brandVoiceActive) {
                    productMd += `* **Análisis de Voz (Brand Voice)**: Activo\n`;
                }
                if (seoOptimizerActive) {
                    productMd += `* **Optimizador SEO**: Activo\n`;
                }
                if (repurposingActive) {
                    productMd += `* **Matriz de Repropósito**: Activa\n`;
                }
                if (contentCalendarActive) {
                    productMd += `* **Calendario Editorial**: Activo\n`;
                }
                if (docsPresentationsActive) {
                    productMd += `* **Documentos y Slides Premium**: Activo\n`;
                }
                if (businessSaaSActive) {
                    productMd += `* **Análisis de Negocio y SaaS**: Activo\n`;
                }
                productMd += `\n## Agentes Habilitados en /IA/agentes/\n`;
                Object.keys(activeAgents).forEach(agent => {
                    if (activeAgents[agent]) {
                        productMd += `- **Agente ${agent.toUpperCase()}**: Habilitado.\n`;
                    }
                });
                if (optunaActive) {
                    productMd += `\n## Lógica de Modelado y Optuna\n`;
                    productMd += `- **Optimización de Hiperparámetros**: Activa mediante Optuna.\n`;
                    productMd += `- **Modelos y Lógica**: ${optunaDetails}\n`;
                }

                fs.writeFileSync(path.join(fullProjectPath, 'PRODUCT.md'), productMd, 'utf-8');

                // Crear autor.txt
                const autorContent = "by Angel Llanos Herrera\n\n" +
                    "Mis Redes y Contacto:\n" +
                    "- LinkedIn: https://www.linkedin.com/in/angel-llanos/\n" +
                    "- Correo: angel.llanos.herrera@gmail.com\n" +
                    "- GitHub: https://github.com/AngelTLH\n";
                fs.writeFileSync(path.join(fullProjectPath, 'autor.txt'), autorContent, 'utf-8');

                // Generar requirements.txt si aplica
                const hasPython = actualSelectedLanguages.some(l => l.name === 'Python');
                if (hasPython) {
                    const requirements = ["pandas", "numpy", "matplotlib", "seaborn", "scikit-learn", "statsmodels", "markitdown", "openpyxl"];
                    if (optunaActive) requirements.push("optuna");
                    if (dashboardActive && dashboardType === 'Dash') {
                        requirements.push("dash");
                        requirements.push("plotly");
                    }
                    fs.writeFileSync(path.join(fullProjectPath, 'requirements.txt'), requirements.join('\n') + '\n', 'utf-8');
                }

                // 4. Generar el prompt_inicio.txt
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
                prompt += `- Lenguajes de Programación: **${langStr}**\n`;
                if (actualSelectedLanguages.length > 0) {
                    actualSelectedLanguages.forEach(l => {
                        prompt += `- Formato de Archivo Principal para ${l.name}: **${l.format}** (Debes escribir tu código siguiendo estrictamente este formato).\n`;
                    });
                } else {
                    prompt += `- Formato de Archivo Principal: **No especificado**\n`;
                }
                if (additionalCoding) {
                    prompt += `- Directrices de código específicas: ${additionalCoding}\n`;
                }
                if (agentArchitect) {
                    prompt += `- Patrón de Loop de Agentes Activo: **${loopPattern}** (Razonamiento estructurado según este patrón).\n`;
                }
                prompt += `\n`;

                prompt += `### ROLES Y AGENTES ACTIVOS:\n`;
                let agentCount = 1;
                if (areaName) {
                    prompt += `${agentCount}. **Agente Especialista en ${areaName}**: Rol en "/IA/agentes/experto_area.md" y bitácora en "/IA/bitacoras/bitacora_experto_area.md". Actúas como máxima autoridad de dominio y negocio para validar variables, restricciones y terminología técnica del sector.\n`;
                    agentCount++;
                }
                prompt += `${agentCount}. **Agente Estadístico Base**: Rol por defecto en "/IA/agentes/estadistico.md" apoyado en "/IA/expertices/expertiz_estadistica.md". Liderarás el análisis de datos (EDA), pruebas descriptivas y consistencia estadística.\n`;
                agentCount++;
                if (activeAgents.dataEng) {
                    prompt += `${agentCount}. **Agente de Ingeniería de Datos**: Rol en "/IA/agentes/data_engineer.md". Te encargarás de la ingesta de datos, limpieza de nulos y codificación de variables.\n`;
                    agentCount++;
                }

                if (activeAgents.modelado) {
                    prompt += `${agentCount}. **Agente de Modelado**: Rol en "/IA/agentes/modelado.md". Te encargarás del ajuste de modelos predictivos y de clasificación (usando específicamente: ${modeladoModels || 'XGBoost, Random Forest, LightGBM, Redes Neuronales'}).\n`;
                    if (optunaActive) {
                        prompt += `   * **Optimización con Optuna**: Activa. Siguiendo la habilidad en "/IA/habilidades/optimizacion_optuna.md".\n`;
                        if (optunaDetails) {
                            prompt += `   * Lógica y modelos requeridos: ${optunaDetails}\n`;
                        }
                    }
                    if (activeAgents.xai) {
                        prompt += `   * **Explicabilidad (XAI)**: Activa. Rol en "/IA/agentes/xai_expert.md" para interpretar el modelo entrenado con SHAP e importancia de variables.\n`;
                    }
                    if (activeAgents.mlops) {
                        prompt += `   * **MLOps**: Activa. Rol en "/IA/agentes/mlops_engineer.md" para exportar el modelo y generar microservicios/APIs (Docker/FastAPI).\n`;
                    }
                    agentCount++;
                }

                if (activeAgents.latex) {
                    prompt += `${agentCount}. **Agente Redactor de LaTeX**: Rol en "/IA/agentes/redactor_latex.md" y habilidad en "/IA/habilidades/redaccion_latex.md". Escribirás informes utilizando las plantillas en "/Plantillas_Latex/".\n`;
                    agentCount++;
                }

                if (activeAgents.programador) {
                    prompt += `${agentCount}. **Agente Programador Frontend**: Rol en "/IA/agentes/programador.md", habilidades en "/IA/habilidades/desarrollo_web.md" y expertiz en "/IA/expertices/expertiz_diseno.md". Trabajarás con las plantillas de "/Pagina_Web/".\n`;
                    agentCount++;
                }

                if (activeAgents.disenador) {
                    prompt += `${agentCount}. **Agente Diseñador Gráfico**: Rol en "/IA/agentes/disenador.md" apoyado en la habilidad de "/IA/habilidades/renderizado_diseno.md" y la expertiz en "/IA/expertices/expertiz_branding.md". Diseñarás logos vectoriales, esquemas de color, contrastes, posts de Instagram, miniaturas y fondos de pantalla con un enfoque consultivo.\n`;
                    agentCount++;
                }

                if (activeAgents.qa) {
                    const qaLangs = actualSelectedLanguages.map(l => l.name).join(', ') || 'cualquier lenguaje';
                    prompt += `${agentCount}. **Agente de QA y Revisor de Código**: Rol en "/IA/agentes/qa_reviewer.md". Auditarás la calidad del código, sintaxis, PEP8 y la correctitud de las pruebas unitarias basadas en ${qaLangs}.\n`;
                    agentCount++;
                }

                if (activeAgents.research) {
                    prompt += `${agentCount}. **Agente Investigador de Literatura**: Rol en "/IA/agentes/investigador.md" apoyado en la habilidad "/IA/habilidades/curaduria_literatura.md". Recabarás literatura científica real y verificarás su consistencia a través de los PDFs subidos en "/Documentacion/Documento_Literatura/".\n`;
                    agentCount++;
                }

                if (activeAgents.simulation) {
                    prompt += `${agentCount}. **Agente de Simulación**: Rol en "/IA/agentes/simulacion.md". Modelarás escenarios complejos, simulaciones de Monte Carlo y análisis de sensibilidad de parámetros.\n`;
                    agentCount++;
                }

                if (activeAgents.gitCicd) {
                    prompt += `${agentCount}. **Agente de Git y CI/CD**: Rol en "/IA/agentes/git_cicd.md". Automatizarás workflows, gestionarás repositorios y crearás pipelines de CI/CD (GitHub Actions).\n`;
                    agentCount++;
                }

                if (activeAgents.privacy) {
                    prompt += `${agentCount}. **Agente de Privacidad de Datos**: Rol en "/IA/agentes/privacidad_datos.md". Auditarás el dataset para aplicar técnicas de anonimización y asegurar la gobernanza ética.\n`;
                    agentCount++;
                }

                if (activeAgents.sustainability) {
                    prompt += `${agentCount}. **Agente de Sostenibilidad**: Rol en "/IA/agentes/sostenibilidad.md". Evaluarás el impacto ambiental, eficiencia de algoritmos y alineación con los ODS.\n`;
                    agentCount++;
                }

                if (activeAgents.secops) {
                    prompt += `${agentCount}. **Agente de Seguridad y SecOps**: Rol en "/IA/agentes/secops_engineer.md" y habilidad en "/IA/habilidades/seguridad_codigo_secops.md". Realizarás auditoría estática de vulnerabilidades (SAST/SCA), sanitización de inputs y prevención de fuga de credenciales o secretos.\n`;
                    agentCount++;
                }

                if (activeAgents.performance) {
                    prompt += `${agentCount}. **Agente de Optimización de Rendimiento**: Rol en "/IA/agentes/performance_optimizer.md" y habilidad en "/IA/habilidades/optimizacion_rendimiento.md". Optimizarás consumo de RAM, vectorización de DataFrames, cuellos de botella con cProfile y aceleración de inferencia con ONNX.\n`;
                    agentCount++;
                }

                if (activeAgents.ia) {
                    prompt += `${agentCount}. **Agente Especialista en IA**: Rol en "/IA/agentes/ia_expert.md" apoyado en la habilidad "/IA/habilidades/conexion_api_ia.md". Diseñarás arquitecturas de Deep Learning, NLP, e integrarás agentes de IA mediante APIs (Gemini, ChatGPT) en interfaces web o dashboards conversacionales.\n`;
                    agentCount++;
                }

                if (agentArchitect) {
                    prompt += `${agentCount}. **Agente Arquitecto de Agentes**: Rol en "/IA/agentes/arquitecto_agentes.md" apoyado en la habilidad "/IA/habilidades/orquestacion_agentes.md" y el manual "/IA/expertices/expertiz_agent_architect.md". Coordinarás los flujos, loops de agentes y llamadas a herramientas (MCP).\n`;
                    agentCount++;
                }

                if (dashboardActive) {
                    prompt += `${agentCount}. **Dashboard (${dashboardType})**: Activo. Guiado por la habilidad en "/IA/habilidades/dashboard_${dashboardType.toLowerCase()}.md". Programarás el dashboard en la carpeta "/Dashboard/".\n`;
                    agentCount++;
                }
                prompt += `\n`;

                prompt += `### REGLAS DE ACCIÓN MANDATORIAS (SIEMPRE ACTIVAS):\n`;
                prompt += `1. **Mención Explícita del Agente Activo**: Al emitir cualquier respuesta, código, análisis o reporte, debes declarar explícitamente en el chat el rol o agente de "/IA/agentes/" que estás asumiendo en ese momento (ej: \`[Rol: Estadístico Base]\` o \`[Rol: Redactor de LaTeX]\`) al inicio de tu mensaje.\n`;
                prompt += `2. **Orquestación y Despacho Multi-Agente ante Consultas Compuestas**: Cuando el usuario solicite tareas complejas o multifacéticas (ej: "modelar datos y hacerme un informe" o "limpiar datos, programar una función y redactar conclusiones"), queda terminantemente prohibido responder como un asistente monolítico genérico. Debes desglosar la respuesta coordinando a los agentes especialistas requeridos:\n`;
                prompt += `   * **[Rol: Agente de Modelado / Estadístico]**: Define las decisiones analíticas, supuestos, modelos y métricas objetivas.\n`;
                prompt += `   * **[Rol: Programador]**: Escribe el código limpio, modular y documentado en la carpeta "/Codigos/".\n`;
                prompt += `   * **[Rol: Redactor de LaTeX]**: Redacta cualquier informe técnico, resumen, interpretación de métricas o conclusiones, clonando estrictamente el estilo del usuario.\n`;
                prompt += `   * **[Rol: Revisor de QA]**: Valida que no existan errores y confirma el registro en la bitácora.\n`;
                prompt += `3. **Gestión de Bitácora y Memoria de Continuidad de Sesiones**: Es obligatorio mantener actualizado el archivo "IA/bitacora.md". Al finalizar cada tarea, sesión o cambio en el código, debes documentar el progreso, decisiones tomadas y siguientes pasos (asegurando el uso de mayúsculas donde sea gramaticalmente correcto en títulos, inicios de párrafo y nombres propios). Asimismo, cada vez que el usuario inicie o retome una sesión indicando revisar este prompt ("revisa la carpeta IA prompt_inicio"), debes consultar obligatoriamente "IA/bitacora.md" y el estado de las carpetas ("/Codigos/", "/Documentacion/", "/Datos/") para reconstruir la memoria histórica del proyecto, resumir en qué punto quedó el trabajo y consultar los siguientes pasos pendientes.\n`;
                prompt += `4. **Exportación de Métricas a Excel**: Los resultados de entrenamientos, optimización de hiperparámetros y métricas de modelos de machine learning deben guardarse estrictamente en formato Excel (\`metrics.xlsx\`), nunca en formato JSON.\n`;
                prompt += `5. **Aislamiento de Informes en Subcarpetas y Duplicación de Compilados**: Cada informe, reporte o presentación (LaTeX, RMarkdown \`.Rmd\`, Quarto \`.qmd\`, Jupyter Notebooks, etc.) debe contar con su subcarpeta dedicada dentro de "/Documentacion/Informes/<Nombre_Informe>/". Cuando se compile un archivo reproducible generando archivos .pdf o .html, el documento compilado debe guardarse tanto en su carpeta de compilación dentro de "/Codigos/" como copiarse obligatoriamente a su subcarpeta en "/Documentacion/Informes/<Nombre_Informe>/".\n`;
                
                let mandatoryCount = 6;
                if (activeAgents.research) {
                    prompt += `${mandatoryCount}. **Verificación Bibliográfica Obligatoria**: Toda cita, afirmación o sustento académico incluido en los reportes debe contrastarse activamente con los PDFs reales depositados en "/Documentacion/Documento_Literatura/". Se debe generar de forma obligatoria el archivo Excel \`citas_verificacion.xlsx\` conteniendo las columnas: Cita, Documento Asociado, Número de Página Citada y Autores.\n`;
                    mandatoryCount++;
                }
                
                prompt += `${mandatoryCount}. **Conversión y Lectura de PDFs con MarkItDown**: Cuando debas leer cualquier archivo PDF en este espacio, debes usar la herramienta 'markitdown' (ejecutando comandos en consola o un script rápido de Python) para pasarlo a formato Markdown ".md" y leer únicamente el archivo ".md" resultante (conforme a "/IA/habilidades/lectura_pdf_markitdown.md").\n`;
                mandatoryCount++;
                prompt += `${mandatoryCount}. **Prohibición Total y Absoluta de Emojis**: Queda terminantemente prohibido el uso de emojis en cualquier informe, documento, dashboard, presentación, código, comentario o bitácora. Cero emojis en todas las respuestas y entregables.\n`;
                mandatoryCount++;
                prompt += `${mandatoryCount}. **Uso Correcto de Mayúsculas (Cero Title Case)**: Las mayúsculas se usarán únicamente donde sea gramaticalmente correcto según las normas del español (inicios de oración, nombres propios y siglas). Queda estrictamente prohibido capitalizar cada palabra en títulos o subtítulos (ej: usar "Análisis descriptivo de variables" y jamás "Análisis Descriptivo De Variables").\n`;
                mandatoryCount++;
                prompt += `${mandatoryCount}. **Clonación del Estilo de Redacción Basado en Ejemplos**: Todo documento, informe técnico, texto para dashboard o análisis debe redactarse con el tono sobrio, técnico, conciso e impersonal documentado en "/Documentacion/Ejemplos/" y en la guía "/IA/expertices/estilo_escritura.md". El lenguaje debe ser concreto, claro, simple y natural, evitando palabras poco frecuentes, rebuscadas o pomposas.\n`;
                mandatoryCount++;
                prompt += `${mandatoryCount}. **Neutralidad de Autoría y Cero Suposición Académica**: Angel Llanos Herrera es el autor y creador del framework Agentias (marca de agua de la plataforma). No obstante, para cualquier informe, código, tarea, script o trabajo que los agentes elaboren para el usuario, queda terminantemente prohibido colocar a Angel Llanos Herrera como autor del documento o entregable. En los documentos generados se debe dejar el campo de autor vacío o con un marcador neutro (ej: \`[Nombre del autor]\`), o bien consultar explícitamente al usuario qué nombre de autor desea colocar. De igual modo, queda estrictamente prohibido que los agentes asuman, inventen o completen nombres de profesores, docentes, evaluadores, universidades o asignaturas basándose en archivos de ejemplo o referencias históricas. En trabajos académicos o profesionales, el agente debe preguntar al usuario el nombre del docente, asignatura o institución, o usar marcadores de posición genéricos.\n`;
                mandatoryCount++;
                prompt += `${mandatoryCount}. **Organización Modular y Parsimonia en el Código**: En el desarrollo de tus códigos (en "/Codigos/"), mantén estructuras limpias, modulares y estrictamente organizadas en subcarpetas temáticas (ej: "/Codigos/EDA/", "/Codigos/Modelos/", "/Codigos/Reportes/"), prohibiéndose scripts sueltos en la raíz de "/Codigos/". Sigue la habilidad "/IA/habilidades/programacion_general.md".\n`;
                mandatoryCount++;
                prompt += `${mandatoryCount}. **Aprendizaje Continuo y Memoria Técnica por Agente**: Cada agente especialista debe consultar su bitácora técnica correspondiente en "/IA/bitacoras/" antes de ejecutar una tarea (Paso 0) para no repetir errores pasados, y registrar aprendizajes, técnicas validadas y dificultades resueltas al culminar su intervención (Paso 5). El especialista en área de dominio registrará en su bitácora los estándares de negocio transversales.\n`;
                mandatoryCount++;
                prompt += `${mandatoryCount}. **Memoria y Respeto de Rutas Personalizadas**: Si el usuario indica una carpeta o ruta personalizada para un proyecto o tarea específica, debes registrarla en "IA/bitacora.md" y recordarla de forma estricta cada vez que se trabaje en ese tema, sin revertir a las rutas predeterminadas a menos que el usuario lo solicite explícitamente.\n`;
                mandatoryCount++;

                
                if (activeAgents.secops) {
                    prompt += `${mandatoryCount}. **Auditoría de Seguridad y Secretos**: Está estrictamente prohibido commitear credenciales o claves API en texto plano; todo input externo o query SQL debe estar parametrizado y sanitizado.\n`;
                    mandatoryCount++;
                }
                if (activeAgents.performance) {
                    prompt += `${mandatoryCount}. **Optimización de Memoria y CPU**: Prohibido el uso de loops lentos en DataFrames; toda operación debe ser vectorizada o utilizar downcasting de tipos numéricos cuando la memoria supere 500MB.\n`;
                    mandatoryCount++;
                }
                
                let ruleCount = mandatoryCount;
                if (oratoriaActive) {
                    prompt += `${ruleCount}. **Estrategias de Oratoria**: Al estructurar discursos, defensas o presentaciones, debes apegarte estrictamente a las técnicas de comunicación persuasiva y oratoria de impacto documentadas en "/IA/expertices/expertiz_oratoria.md".\n`;
                    ruleCount++;
                }
                if (dialogosActive) {
                    prompt += `${ruleCount}. **Creación de Diálogos**: Al redactar diálogos, simulaciones, debates o guiones, debes aplicar las reglas de estructuración y roles académicos definidas en "/IA/expertices/expertiz_dialogos.md", reflejando tu estilo formal e impersonal.\n`;
                    ruleCount++;
                }
                if (brandVoiceActive) {
                    prompt += `${ruleCount}. **Clonación y Análisis de Voz**: Analizarás y replicarás de manera consistente la voz de marca utilizando el script de Python en "/IA/herramientas/brand_voice_analyzer.py" y la expertiz en "/IA/expertices/expertiz_brand_voice.md".\n`;
                    ruleCount++;
                }
                if (seoOptimizerActive) {
                    prompt += `${ruleCount}. **Optimización SEO de Contenido**: Evaluarás y optimizarás la visibilidad y metadatos de tu producción utilizando el script de Python en "/IA/herramientas/seo_optimizer.py" para maximizar la efectividad algorítmica.\n`;
                    ruleCount++;
                }
                if (repurposingActive) {
                    prompt += `${ruleCount}. **Matriz de Repropósito de Contenido**: Adaptarás y fragmentarás el contenido para múltiples plataformas (Shorts, posts de LinkedIn, hilos de X o blogs) siguiendo el manual en "/IA/expertices/expertiz_content_frameworks.md" y "/IA/expertices/expertiz_social_media.md".\n`;
                    ruleCount++;
                }
                if (contentCalendarActive) {
                    prompt += `${ruleCount}. **Calendario Editorial Mensual**: Planificarás y distribuirás las publicaciones siguiendo la plantilla y las proporciones equilibradas en "/IA/expertices/expertiz_content_calendar.md".\n`;
                    ruleCount++;
                }
                if (docsPresentationsActive) {
                    prompt += `${ruleCount}. **Documentación y Presentaciones Premium**: Estructurarás tus informes científicos y tus diapositivas según las directrices de alto impacto cognitivo y diagramación en "/IA/habilidades/documentacion_presentaciones.md" y "/IA/expertices/expertiz_docs_presentations.md".\n`;
                    ruleCount++;
                }
                if (businessSaaSActive) {
                    prompt += `${ruleCount}. **Análisis de Negocio y SaaS**: Utilizarás el marco de métricas comerciales (LTV, CAC, Churn) y optimización de conversión según "/IA/habilidades/analisis_negocio_saas.md" y "/IA/expertices/expertiz_business_saas.md".\n`;
                    ruleCount++;
                }
                prompt += `### COMANDOS RÁPIDOS DE ACTIVACIÓN (SLASH COMMANDS):\n`;
                prompt += `- \`/continuar\` o \`/resume\`: Activa inmediatamente el Modo Continuidad de Trabajo (revisa \`IA/bitacora.md\`, \`/IA/bitacoras/\`, \`/Codigos/\`, \`/Datos/\`, \`/Documentacion/\`, saluda bajo el rol correspondiente, resume el estado y pregunta por los pendientes). Es el equivalente directo a "revisa la carpeta IA prompt_inicio".\n`;
                prompt += `- \`/inicio\` o \`/start\`: Activa el Modo Inicio de Entorno (Día 1).\n`;
                prompt += `- \`/estado\` o \`/status\`: Presenta un diagnóstico rápido del proyecto, modelos y métricas.\n`;
                prompt += `- \`/guardar\` o \`/pausa\`: Activa el Protocolo de Guardado y Cierre de Sesión (actualiza \`IA/bitacora.md\`, bitácoras en \`/IA/bitacoras/\`, valida duplicación de compilados y emite reporte listo para \`/continuar\`). Es el equivalente directo a "guarda lo necesario para continuar en otra ocasión".\n`;
                prompt += `- \`/bitacoras\`: Revisa o audita el historial de aprendizaje técnico en \`/IA/bitacoras/\`.\n`;
                prompt += `- \`/agentes\`: Muestra el listado de roles y agentes activos.\n\n`;
                
                prompt += `### PROTOCOLO DE ACTIVACIÓN Y MEMORIA DE CONTINUIDAD (INICIO Y RETOME DE SESIÓN):\n`;
                prompt += `Al recibir un comando rápido (ej: \`/continuar\`, \`/resume\`, \`/inicio\`, \`/estado\`, \`/guardar\`) o la instrucción tradicional para revisar este prompt ("revisa la carpeta IA prompt_inicio"), debes ejecutar inmediatamente el siguiente chequeo contextual antes de emitir tu primera respuesta:\n`;
                prompt += `1. **Inspección Previa de Memoria (\`IA/bitacora.md\`)**: Lee el estado actual, el registro histórico y la sección de tareas pendientes.\n`;
                prompt += `2. **Inspección de Artefactos**: Revisa qué archivos existen en \`/Codigos/\`, \`/Datos/\`, \`/Documentacion/\` y si existe \`metrics.xlsx\`.\n`;
                prompt += `3. **Determinación del Modo de Sesión**:\n`;
                prompt += `   * **Modo Inicio de Entorno (Día 1 / Proyecto Nuevo)**: Si la bitácora solo contiene la inicialización y no hay código desarrollado, confirma la carga del entorno bajo el rol inicial (ej: \`[Rol: Estadístico Base]\`), resume las capacidades del equipo de agentes y propone el plan de arranque para la Fase 1 (ingesta y EDA).\n`;
                prompt += `   * **Modo Continuidad de Trabajo (Sesión de Retome / Días Posteriores)**: Si la bitácora ya tiene avances o existen archivos creados en sesiones anteriores, **reconstruye la memoria completa del proyecto**. En tu primer mensaje:\n`;
                prompt += `     a) Declara el rol del agente pertinente (\`[Rol: ...]\`).\n`;
                prompt += `     b) Presenta un **Breve Resumen de Continuidad**: en qué estado quedó el proyecto, qué decisiones clave se tomaron y qué archivos se generaron en la última sesión.\n`;
                prompt += `     c) Identifica y lista las **Tareas Pendientes Inmediatas** registradas en la bitácora.\n`;
                prompt += `     d) Pregunta directamente al usuario si desea continuar con la siguiente tarea pendiente o si prefiere abordar una directiva distinta hoy.\n`;
                prompt += `4. **Cierre de Sesión y Registro de Hitos (\`/guardar\` o \`/pausa\`)**: Al recibir el comando \`/guardar\` o al culminar la jornada, ejecuta el guardado integral en \`IA/bitacora.md\` y \`/IA/bitacoras/\` para garantizar la continuidad perfecta al reanudar con \`/continuar\`.\n`;

                const promptFinal = prompt.replace(/dashboard_react|dashboard_shiny|dashboard_dash/g, match => match.toLowerCase());
                fs.writeFileSync(path.join(fullProjectPath, 'IA', 'prompt_inicio.txt'), promptFinal, 'utf-8');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: `Proyecto "${projectName}" creado con éxito en ${fullProjectPath}`,
                    path: fullProjectPath
                }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: `Error procesando la solicitud: ${err.message}` }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada');
    }
});

server.listen(PORT, () => {
    console.log(`Servidor local ejecutándose en http://localhost:${PORT}`);
});
