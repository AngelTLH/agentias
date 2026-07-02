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
    '.jpg': 'image/jpg',
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
                    language,
                    format,
                    selectedLanguages = [],
                    optunaActive,
                    optunaDetails,
                    modeladoModels,
                    areaName,
                    areaDetails,
                    activeAgents,
                    additionalCoding,
                    oratoriaActive,
                    dialogosActive,
                    dashboardActive,
                    dashboardType,
                    copyLaTeXReport,
                    copyLaTeXPresentation,
                    videoFormat,
                    videoStyle,
                    videoDetails,
                    ytOratoria,
                    ytEjemplos,
                    youtubeDetails
                } = config;

                let actualSelectedLanguages = selectedLanguages;
                if (actualSelectedLanguages.length === 0 && language && language !== 'No especificado') {
                    actualSelectedLanguages = [{ name: language, format: format }];
                }

                const videoEditor = false;
                const youtubeCreator = false;

                if (!projectName || !targetPath) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Nombre del proyecto y ruta de destino requeridos.' }));
                    return;
                }

                // Resolver la ruta destino completa (ej: C:\Proyectos\Mi_Proyecto)
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

                // 1. Crear estructura básica
                fs.mkdirSync(fullProjectPath, { recursive: true });
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
                if (videoEditor) {
                    fs.mkdirSync(path.join(fullProjectPath, 'Codigos', 'Videos', 'Recursos'), { recursive: true });
                    fs.mkdirSync(path.join(fullProjectPath, 'Codigos', 'Videos', 'Exportados'), { recursive: true });
                }
                if (youtubeCreator) {
                    fs.mkdirSync(path.join(fullProjectPath, 'IA', 'expertices', 'dialogos_consolidados'), { recursive: true });
                }

                // Crear bitácora inicial
                let bitacoraContent = `# Bitácora de Proyecto: ${projectName}\n\n`;
                bitacoraContent += "Este archivo registra de forma estructurada el avance, decisiones técnicas y estado general del proyecto para mantener la coherencia y el contexto entre sesiones.\n\n";
                bitacoraContent += "## 1. Estado Actual del Proyecto\n";
                bitacoraContent += "- **Última actualización:** (Proyecto inicializado)\n";
                bitacoraContent += "- **Agente Activo:** Ninguno (Inicialización del sistema)\n";
                const langStr = actualSelectedLanguages.map(l => `${l.name} (${l.format})`).join(', ') || 'No especificado';
                bitacoraContent += `- **Lenguaje Principal:** ${langStr}\n`;
                bitacoraContent += "\n## 2. Decisiones Técnicas y Supuestos\n";
                bitacoraContent += "- Creación inicial de la estructura del proyecto y copia de agentes/habilidades base.\n";
                bitacoraContent += "\n## 3. Registro Histórico de Actividades\n";
                bitacoraContent += "| Fecha y Hora | Agente / Rol | Actividad Detallada | Entregables / Cambios Producidos |\n";
                bitacoraContent += "| :--- | :--- | :--- | :--- |\n";
                bitacoraContent += "| 2026-06-16 | Sistema | Inicialización del entorno del proyecto | Creación de directorios y copias de configuración |\n";
                bitacoraContent += "\n## 4. Tareas Pendientes e Hitos del Proyecto\n";
                bitacoraContent += "- [ ] Cargar y validar conjunto de datos inicial.\n";
                bitacoraContent += "- [ ] Realizar Análisis Exploratorio de Datos (EDA) usando [Estadístico Base].\n";
                if (activeAgents.modelado) {
                    bitacoraContent += "- [ ] Entrenar y optimizar modelos con Optuna, guardando resultados en `metrics.xlsx` usando [Agente de Modelado].\n";
                }
                if (activeAgents.latex) {
                    bitacoraContent += "- [ ] Redactar y diagramar informe técnico final en subcarpetas de informes usando [Redactor de LaTeX].\n";
                }
                fs.writeFileSync(path.join(fullProjectPath, 'IA', 'bitacora.md'), bitacoraContent, 'utf-8');

                // 2. Copiar archivos comunes y seleccionados
                // Habilidad PDF
                const pdfSkillSrc = path.join(TEMPLATE_DIR, 'IA', 'habilidades', 'lectura_pdf_markitdown.md');
                const pdfSkillDst = path.join(fullProjectPath, 'IA', 'habilidades', 'lectura_pdf_markitdown.md');
                if (fs.existsSync(pdfSkillSrc)) {
                    fs.copyFileSync(pdfSkillSrc, pdfSkillDst);
                }

                // Estilo de escritura
                const styleSrc = path.join(TEMPLATE_DIR, 'IA', 'expertices', 'estilo_escritura.md');
                const styleDst = path.join(fullProjectPath, 'IA', 'expertices', 'estilo_escritura.md');
                if (fs.existsSync(styleSrc)) {
                    fs.copyFileSync(styleSrc, styleDst);
                }

                // Habilidad de Programación General
                const generalProgSrc = path.join(TEMPLATE_DIR, 'IA', 'habilidades', 'programacion_general.md');
                const generalProgDst = path.join(fullProjectPath, 'IA', 'habilidades', 'programacion_general.md');
                if (fs.existsSync(generalProgSrc)) {
                    fs.copyFileSync(generalProgSrc, generalProgDst);
                }

                // Agente Estadístico Base (siempre activo)
                const statAgentSrc = path.join(TEMPLATE_DIR, 'IA', 'agentes', 'estadistico.md');
                const statAgentDst = path.join(fullProjectPath, 'IA', 'agentes', 'estadistico.md');
                if (fs.existsSync(statAgentSrc)) {
                    fs.copyFileSync(statAgentSrc, statAgentDst);
                }
                const statExpSrc = path.join(TEMPLATE_DIR, 'IA', 'expertices', 'expertiz_estadistica.md');
                const statExpDst = path.join(fullProjectPath, 'IA', 'expertices', 'expertiz_estadistica.md');
                if (fs.existsSync(statExpSrc)) {
                    fs.copyFileSync(statExpSrc, statExpDst);
                }

                // Habilidades de lenguajes seleccionados
                actualSelectedLanguages.forEach(langItem => {
                    const langSkillName = `programacion_${langItem.name.toLowerCase()}.md`;
                    const langSkillSrc = path.join(TEMPLATE_DIR, 'IA', 'habilidades', langSkillName);
                    const langSkillDst = path.join(fullProjectPath, 'IA', 'habilidades', langSkillName);
                    if (fs.existsSync(langSkillSrc)) {
                        fs.copyFileSync(langSkillSrc, langSkillDst);
                    }
                });

                // Agente de Modelado
                if (activeAgents.modelado) {
                    const modAgentSrc = path.join(TEMPLATE_DIR, 'IA', 'agentes', 'modelado.md');
                    const modAgentDst = path.join(fullProjectPath, 'IA', 'agentes', 'modelado.md');
                    if (fs.existsSync(modAgentSrc)) {
                        fs.copyFileSync(modAgentSrc, modAgentDst);
                    }
                    if (optunaActive) {
                        const optunaSrc = path.join(TEMPLATE_DIR, 'IA', 'habilidades', 'optimizacion_optuna.md');
                        const optunaDst = path.join(fullProjectPath, 'IA', 'habilidades', 'optimizacion_optuna.md');
                        if (fs.existsSync(optunaSrc)) {
                            fs.copyFileSync(optunaSrc, optunaDst);
                        }
                    }
                }

                // Agente Redactor LaTeX
                if (activeAgents.latex) {
                    const latexAgentSrc = path.join(TEMPLATE_DIR, 'IA', 'agentes', 'redactor_latex.md');
                    const latexAgentDst = path.join(fullProjectPath, 'IA', 'agentes', 'redactor_latex.md');
                    if (fs.existsSync(latexAgentSrc)) {
                        fs.copyFileSync(latexAgentSrc, latexAgentDst);
                    }
                    const latexSkillSrc = path.join(TEMPLATE_DIR, 'IA', 'habilidades', 'redaccion_latex.md');
                    const latexSkillDst = path.join(fullProjectPath, 'IA', 'habilidades', 'redaccion_latex.md');
                    if (fs.existsSync(latexSkillSrc)) {
                        fs.copyFileSync(latexSkillSrc, latexSkillDst);
                    }
                    // Copiar selectivamente plantillas LaTeX
                    if (copyLaTeXReport) {
                        copyFolderSync(path.join(TEMPLATE_DIR, 'Plantillas_Latex', 'Plantilla_Informe'), path.join(fullProjectPath, 'Plantillas_Latex', 'Plantilla_Informe'));
                    }
                    if (copyLaTeXPresentation) {
                        copyFolderSync(path.join(TEMPLATE_DIR, 'Plantillas_Latex', 'Plantilla_Presentación'), path.join(fullProjectPath, 'Plantillas_Latex', 'Plantilla_Presentación'));
                    }
                }

                // Opciones de comunicación y expertises adicionales
                if (oratoriaActive || activeAgents.latex) {
                    const oratoriaExpSrc = path.join(TEMPLATE_DIR, 'IA', 'expertices', 'expertiz_oratoria.md');
                    const oratoriaExpDst = path.join(fullProjectPath, 'IA', 'expertices', 'expertiz_oratoria.md');
                    if (fs.existsSync(oratoriaExpSrc)) {
                        fs.copyFileSync(oratoriaExpSrc, oratoriaExpDst);
                    }
                }


                // Agente Programador Frontend / Web
                if (activeAgents.programador) {
                    const progAgentSrc = path.join(TEMPLATE_DIR, 'IA', 'agentes', 'programador.md');
                    const progAgentDst = path.join(fullProjectPath, 'IA', 'agentes', 'programador.md');
                    if (fs.existsSync(progAgentSrc)) {
                        fs.copyFileSync(progAgentSrc, progAgentDst);
                    }
                    const webSkillSrc = path.join(TEMPLATE_DIR, 'IA', 'habilidades', 'desarrollo_web.md');
                    const webSkillDst = path.join(fullProjectPath, 'IA', 'habilidades', 'desarrollo_web.md');
                    if (fs.existsSync(webSkillSrc)) {
                        fs.copyFileSync(webSkillSrc, webSkillDst);
                    }
                    const disenoExpSrc = path.join(TEMPLATE_DIR, 'IA', 'expertices', 'expertiz_diseno.md');
                    const disenoExpDst = path.join(fullProjectPath, 'IA', 'expertices', 'expertiz_diseno.md');
                    if (fs.existsSync(disenoExpSrc)) {
                        fs.copyFileSync(disenoExpSrc, disenoExpDst);
                    }
                    // Copiar plantillas de Pagina_Web
                    const webTemplateSrc = path.join(TEMPLATE_DIR, 'Pagina_Web');
                    const webTemplateDst = path.join(fullProjectPath, 'Pagina_Web');
                    copyFolderSync(webTemplateSrc, webTemplateDst);
                }

                // Copiar ejemplos de escritura cargados
                const examplesSrc = path.join(TEMPLATE_DIR, 'Documentacion', 'Ejemplos');
                const examplesDst = path.join(fullProjectPath, 'Documentacion', 'Ejemplos');
                copyFolderSync(examplesSrc, examplesDst);

                // Copiar nuevos agentes expertos y habilidades

                if (activeAgents.dataEng) {
                    copyFile('IA/agentes/data_engineer.md', 'IA/agentes/data_engineer.md');
                }
                if (activeAgents.xai) {
                    copyFile('IA/agentes/xai_expert.md', 'IA/agentes/xai_expert.md');
                }
                if (activeAgents.mlops) {
                    copyFile('IA/agentes/mlops_engineer.md', 'IA/agentes/mlops_engineer.md');
                }
                if (activeAgents.qa) {
                    copyFile('IA/agentes/qa_reviewer.md', 'IA/agentes/qa_reviewer.md');
                }
                if (activeAgents.research) {
                    copyFile('IA/agentes/investigador.md', 'IA/agentes/investigador.md');
                    copyFile('IA/habilidades/curaduria_literatura.md', 'IA/habilidades/curaduria_literatura.md');
                }
                if (activeAgents.simulation) {
                    copyFile('IA/agentes/simulacion.md', 'IA/agentes/simulacion.md');
                }
                if (activeAgents.gitCicd) {
                    copyFile('IA/agentes/git_cicd.md', 'IA/agentes/git_cicd.md');
                }
                if (activeAgents.privacy) {
                    copyFile('IA/agentes/privacidad_datos.md', 'IA/agentes/privacidad_datos.md');
                }
                if (activeAgents.sustainability) {
                    copyFile('IA/agentes/sostenibilidad.md', 'IA/agentes/sostenibilidad.md');
                }
                if (activeAgents.ia) {
                    copyFile('IA/agentes/ia_expert.md', 'IA/agentes/ia_expert.md');
                    copyFile('IA/habilidades/conexion_api_ia.md', 'IA/habilidades/conexion_api_ia.md');
                }
                if (videoEditor) {
                    copyFile('IA/agentes/editor_video.md', 'IA/agentes/editor_video.md');
                    copyFile('IA/habilidades/edicion_creacion_video.md', 'IA/habilidades/edicion_creacion_video.md');
                    copyFile('IA/expertices/expertiz_videos_virales.md', 'IA/expertices/expertiz_videos_virales.md');
                }

                // Configuración de Dashboard
                if (dashboardActive) {
                    const dashboardDst = path.join(fullProjectPath, 'Dashboard');
                    if (!fs.existsSync(dashboardDst)) {
                        fs.mkdirSync(dashboardDst, { recursive: true });
                    }
                    if (dashboardType === 'Dash') {
                        const dashSkillSrc = path.join(TEMPLATE_DIR, 'IA', 'habilidades', 'dashboard_dash.md');
                        const dashSkillDst = path.join(fullProjectPath, 'IA', 'habilidades', 'dashboard_dash.md');
                        if (fs.existsSync(dashSkillSrc)) {
                            fs.copyFileSync(dashSkillSrc, dashSkillDst);
                        }
                        const appPyContent = "import dash\nfrom dash import html, dcc\n\napp = dash.Dash(__name__)\n\napp.layout = html.Div([\n    html.H1('Dashboard en Dash (Python)')\n])\n\nif __name__ == '__main__':\n    app.run_server(debug=True)\n";
                        fs.writeFileSync(path.join(dashboardDst, 'app.py'), appPyContent, 'utf-8');
                    } else if (dashboardType === 'Shiny') {
                        const shinySkillSrc = path.join(TEMPLATE_DIR, 'IA', 'habilidades', 'dashboard_shiny.md');
                        const shinySkillDst = path.join(fullProjectPath, 'IA', 'habilidades', 'dashboard_shiny.md');
                        if (fs.existsSync(shinySkillSrc)) {
                            fs.copyFileSync(shinySkillSrc, shinySkillDst);
                        }
                        // Copiar la plantilla Shiny subida por el usuario
                        const shinyTemplateSrc = path.join(TEMPLATE_DIR, 'Plantilla_Shiny', 'dashboard');
                        copyFolderSync(shinyTemplateSrc, dashboardDst);
                    } else if (dashboardType === 'React') {
                        const reactSkillSrc = path.join(TEMPLATE_DIR, 'IA', 'habilidades', 'dashboard_react.md');
                        const reactSkillDst = path.join(fullProjectPath, 'IA', 'habilidades', 'dashboard_react.md');
                        if (fs.existsSync(reactSkillSrc)) {
                            fs.copyFileSync(reactSkillSrc, reactSkillDst);
                        }
                        const pkgJson = '{\n  "name": "react-dashboard",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}\n';
                        fs.mkdirSync(path.join(dashboardDst, 'src'), { recursive: true });
                        const appJsx = "import React from 'react';\n\nexport default function App() {\n  return <h1>Dashboard en React</h1>;\n}\n";
                        fs.writeFileSync(path.join(dashboardDst, 'package.json'), pkgJson, 'utf-8');
                        fs.writeFileSync(path.join(dashboardDst, 'src', 'App.jsx'), appJsx, 'utf-8');
                    }
                }

                // 3. Crear archivo PRODUCT.md descriptivo del proyecto para contextualizar a la IA
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
                if (dashboardActive) {
                    productMd += `* **Dashboard**: Activo (${dashboardType})\n`;
                }
                if (oratoriaActive) {
                    productMd += `* **Estrategias de Oratoria**: Activo (Manual de Oratoria Clásica)\n`;
                }
                if (dialogosActive) {
                    productMd += `* **Creación de Diálogos**: Activo (Estilo del Usuario)\n`;
                }
                if (videoEditor) {
                    productMd += `* **Video Creador y Editor**: Activo (${videoFormat} | ${videoStyle})\n`;
                }
                if (youtubeCreator) {
                    productMd += `* **Guionista / Creador YouTube**: Activo\n`;
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

                // Crear bloc de notas con los datos del autor de las plantillas y agentes
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
                    if (optunaActive) {
                        requirements.push("optuna");
                    }
                    if (videoEditor) {
                        requirements.push("moviepy");
                    }
                    if (dashboardActive && dashboardType === 'Dash') {
                        requirements.push("dash");
                        requirements.push("plotly");
                    }
                    fs.writeFileSync(path.join(fullProjectPath, 'requirements.txt'), requirements.join('\n') + '\n', 'utf-8');
                }

                // 4. Generar el prompt_inicio.txt para que esté disponible en el proyecto
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
                if (videoEditor) {
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

                if (activeAgents.ia) {
                    prompt += `${agentCount}. **Agente Especialista en IA**: Rol en "/IA/agentes/ia_expert.md" apoyado en la habilidad "/IA/habilidades/conexion_api_ia.md". Diseñarás arquitecturas de Deep Learning, NLP, e integrarás agentes de IA mediante APIs (Gemini, ChatGPT) en interfaces web o dashboards conversacionales.\n`;
                    agentCount++;
                }

                if (videoEditor) {
                    prompt += `${agentCount}. **Agente Creador y Editor de Videos**: Rol en "/IA/agentes/editor_video.md", habilidades en "/IA/habilidades/edicion_creacion_video.md" y expertiz en "/IA/expertices/expertiz_videos_virales.md". Te encargarás de diseñar el guión/storyboard y automatizar la edición de videos virales en formato **${videoFormat}** con un estilo **${videoStyle}** partiendo de audios pregrabados.\n`;
                    agentCount++;
                }
                if (youtubeCreator) {
                    prompt += `${agentCount}. **Guionista / Creador YouTube**: Rol en "/IA/agentes/creador_contenido_youtube.md" y habilidad en "/IA/habilidades/creacion_dialogos_youtube.md". Te especializas en la redacción de diálogos y guiones de alto impacto para videos de YouTube.\n`;
                    if (ytOratoria) {
                        prompt += "   * **Técnicas de Oratoria**: Activas. Aplicarás los principios de oratoria de impacto de \"/IA/expertices/expertiz_oratoria.md\".\n";
                    }
                    if (ytEjemplos) {
                        prompt += "   * **Ejemplos Consolidados**: Activo. Cargarás e imitarás los guiones depositados en \"/IA/expertices/dialogos_consolidados/\".\n";
                    }
                    if (youtubeDetails) {
                        prompt += `   * **Detalles del Canal/Guión**: ${youtubeDetails}\n`;
                    }
                    agentCount++;
                }

                if (dashboardActive) {
                    prompt += `${agentCount}. **Dashboard (${dashboardType})**: Activo. Guiado por la habilidad en "/IA/habilidades/dashboard_${dashboardType.toLowerCase()}.md". Programarás el dashboard en la carpeta "/Dashboard/".\n`;
                    agentCount++;
                }
                prompt += "\n";

                prompt += `### REGLAS DE ACCIÓN MANDATORIAS (SIEMPRE ACTIVAS):\n`;
                prompt += `1. **Mención Explícita del Agente Activo**: Al emitir cualquier respuesta, código, análisis o reporte, debes declarar explícitamente en el chat el rol o agente de "/IA/agentes/" que estás asumiendo en ese momento (ej: \`[Rol: Estadístico Base]\` o \`[Rol: Agente de Modelado]\`) al inicio de tu mensaje.\n`;
                prompt += `2. **Generación y Actualización de Bitácora**: Es obligatorio mantener actualizado el archivo "IA/bitacora.md". Al finalizar cada tarea, sesión o cambio en el código, debes documentar el progreso, decisiones tomadas y siguientes pasos (asegurando el uso de mayúsculas donde sea gramaticalmente correcto en títulos, inicios de párrafo y nombres propios).\n`;
                prompt += `3. **Exportación de Métricas a Excel**: Los resultados de entrenamientos, optimización de hiperparámetros y métricas de modelos de machine learning deben guardarse estrictamente en formato Excel (\`metrics.xlsx\`), nunca en formato JSON.\n`;
                prompt += `4. **Aislamiento de Informes en Subcarpetas**: Cada informe, reporte o presentación de LaTeX debe estar aislado en una subcarpeta dedicada dentro de "/Documentacion/Informes/" (ej: "/Documentacion/Informes/Reporte_EDA/"), conteniendo todos sus archivos fuentes (.tex), auxiliares e imágenes.\n`;
                
                let mandatoryCount = 5;
                if (videoEditor) {
                    prompt += `${mandatoryCount}. **Edición de Video Basada en Retención**: Los videos generados deben estructurarse con ganchos (*hooks*) de 3 segundos, cortes de ritmo constantes (cada 2 segundos de promedio), superposición de textos de Pillow con safe zones (centro vertical) y mezcla de audio con ganancia equilibrada (voz principal dominante, música a -15dB).\n`;
                    mandatoryCount++;
                }
                if (youtubeCreator) {
                    prompt += `${mandatoryCount}. **Estructura de Guion YouTube**: Los guiones redactados deben incluir ganchos magnéticos en los primeros 3 segundos, cortes de ritmo narrativo claros, llamadas a la acción (CTA) contextuales y técnicas de oratoria para garantizar la retención de la audiencia.\n`;
                    mandatoryCount++;
                }
                if (activeAgents.research) {
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
                if (oratoriaActive) {
                    prompt += `${ruleCount}. **Estrategias de Oratoria**: Al estructurar discursos, defensas o presentaciones, debes apegarte estrictamente a las técnicas de comunicación persuasiva y oratoria de impacto documentadas en "/IA/expertices/expertiz_oratoria.md".\n`;
                    ruleCount++;
                }
                if (dialogosActive) {
                    prompt += `${ruleCount}. **Creación de Diálogos**: Al redactar diálogos, simulaciones, debates o guiones, debes aplicar las reglas de estructuración y roles académicos definidas en "/IA/expertices/expertiz_dialogos.md", reflejando tu estilo formal e impersonal.\n`;
                    ruleCount++;
                }
                prompt += `\n`;
                prompt += `Por favor, confirma que has leído y asimilado este prompt, así como los manuales en la carpeta "/IA/", y dime que estás listo para iniciar el trabajo.`;

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
