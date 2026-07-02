import http.server
import socketserver
import json
import os
import shutil
import urllib.parse
import subprocess

PORT = 3000
DASHBOARD_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.dirname(DASHBOARD_DIR)

def select_folder_dialog():
    try:
        import tkinter as tk
        from tkinter import filedialog
        
        root = tk.Tk()
        root.withdraw()  # Oculta la ventana principal
        root.attributes('-topmost', True)  # Fuerza a estar arriba
        
        selected_path = filedialog.askdirectory(
            title='Selecciona la carpeta de destino',
            parent=root
        )
        root.destroy()
        return selected_path
    except Exception as e:
        print(f"Error al abrir el selector de carpetas: {e}")
        return ""

class DashboardHandler(http.server.BaseHTTPRequestHandler):
    def end_headers(self):
        # Habilitar CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # Determinar el archivo solicitado
        parsed_url = urllib.parse.urlparse(self.path)
        path_str = parsed_url.path
        
        if path_str == '/api/select-folder':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            selected_path = select_folder_dialog()
            self.wfile.write(json.dumps({'path': selected_path}).encode('utf-8'))
            return

        if path_str == '/':
            path_str = '/index.html'

        # Eliminar el leading slash para concatenar rutas
        rel_path = path_str.lstrip('/')
        file_path = os.path.abspath(os.path.join(DASHBOARD_DIR, rel_path))

        # Seguridad: evitar salirse de la carpeta del dashboard
        if not file_path.startswith(DASHBOARD_DIR):
            self.send_response(403)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Acceso denegado')
            return

        if os.path.exists(file_path) and os.path.isfile(file_path):
            self.send_response(200)
            
            # Asignar MIME type
            ext = os.path.splitext(file_path)[1].lower()
            mime_types = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'text/javascript',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml'
            }
            content_type = mime_types.get(ext, 'application/octet-stream')
            self.send_header('Content-Type', content_type)
            self.end_headers()
            
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Archivo no encontrado')

    def do_POST(self):
        if self.path == '/api/create-project':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                config = json.loads(post_data.decode('utf-8'))
                project_name = config.get('projectName')
                target_path = config.get('targetPath')
                language = config.get('language')
                file_format = config.get('format')
                selected_languages = config.get('selectedLanguages', [])
                if not selected_languages and language and language != 'No especificado':
                    selected_languages = [{'name': language, 'format': file_format}]
                optuna_active = config.get('optunaActive')
                optuna_details = config.get('optunaDetails')
                modelado_models = config.get('modeladoModels', 'XGBoost, Random Forest, LightGBM, Redes Neuronales')
                area_name = config.get('areaName')
                area_details = config.get('areaDetails')
                active_agents = config.get('activeAgents', {})
                additional_coding = config.get('additionalCoding')
                
                # Nuevos parámetros
                dashboard_active = config.get('dashboardActive', False)
                dashboard_type = config.get('dashboardType', '')
                copy_latex_report = config.get('copyLaTeXReport', False)
                copy_latex_presentation = config.get('copyLaTeXPresentation', False)
                oratoria_active = config.get('oratoriaActive', False)
                dialogos_active = config.get('dialogosActive', False)
                video_editor = False
                video_format = config.get('videoFormat', '')
                video_style = config.get('videoStyle', '')
                video_details = config.get('videoDetails', '')
                youtube_creator = False
                yt_oratoria = config.get('ytOratoria', False)
                yt_ejemplos = config.get('ytEjemplos', False)
                youtube_details = config.get('youtubeDetails', '')
                
                agent_architect = active_agents.get('architect', False)
                loop_pattern = config.get('loopPattern', 'Directo')
                brand_voice_active = config.get('brandVoiceActive', False)
                seo_optimizer_active = config.get('seoOptimizerActive', False)
                repurposing_active = config.get('repurposingActive', False)
                content_calendar_active = config.get('contentCalendarActive', False)
                docs_presentations_active = False
                business_saas_active = False

                if not project_name or not target_path:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'Nombre del proyecto y ruta de destino requeridos.'}).encode('utf-8'))
                    return

                # Resolver ruta de destino final
                full_project_path = os.path.join(target_path, project_name)

                if os.path.exists(full_project_path):
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': f'El directorio ya existe: ${full_project_path}'}).encode('utf-8'))
                    return

                # 1. Crear estructura básica
                os.makedirs(os.path.join(full_project_path, 'IA', 'agentes'), exist_ok=True)
                os.makedirs(os.path.join(full_project_path, 'IA', 'habilidades'), exist_ok=True)
                os.makedirs(os.path.join(full_project_path, 'IA', 'expertices'), exist_ok=True)
                os.makedirs(os.path.join(full_project_path, 'IA', 'herramientas'), exist_ok=True)
                os.makedirs(os.path.join(full_project_path, 'Documentacion', 'Ejemplos'), exist_ok=True)
                os.makedirs(os.path.join(full_project_path, 'Documentacion', 'Informes'), exist_ok=True)
                os.makedirs(os.path.join(full_project_path, 'Codigos'), exist_ok=True)
                if active_agents.get('research'):
                    os.makedirs(os.path.join(full_project_path, 'Documentacion', 'Documento_Literatura'), exist_ok=True)
                if video_editor:
                    os.makedirs(os.path.join(full_project_path, 'Codigos', 'Videos', 'Recursos'), exist_ok=True)
                    os.makedirs(os.path.join(full_project_path, 'Codigos', 'Videos', 'Exportados'), exist_ok=True)
                if youtube_creator:
                    os.makedirs(os.path.join(full_project_path, 'IA', 'expertices', 'dialogos_consolidados'), exist_ok=True)

                # Crear bitácora inicial
                bitacora_content = f"# Bitácora de Proyecto: {project_name}\n\n"
                bitacora_content += "Este archivo registra de forma estructurada el avance, decisiones técnicas y estado general del proyecto para mantener la coherencia y el contexto entre sesiones.\n\n"
                bitacora_content += "## 1. Estado Actual del Proyecto\n"
                bitacora_content += "- **Última actualización:** (Proyecto inicializado)\n"
                bitacora_content += "- **Agente Activo:** Ninguno (Inicialización del sistema)\n"
                lang_str = ", ".join([f"{l.get('name')} ({l.get('format')})" for l in selected_languages]) if selected_languages else "No especificado"
                bitacora_content += f"- **Lenguaje Principal:** {lang_str}\n"
                bitacora_content += "\n## 2. Decisiones Técnicas y Supuestos\n"
                bitacora_content += "- Creación inicial de la estructura del proyecto y copia de agentes/habilidades base.\n"
                bitacora_content += "\n## 3. Registro Histórico de Actividades\n"
                bitacora_content += "| Fecha y Hora | Agente / Rol | Actividad Detallada | Entregables / Cambios Producidos |\n"
                bitacora_content += "| :--- | :--- | :--- | :--- |\n"
                bitacora_content += "| 2026-06-16 | Sistema | Inicialización del entorno del proyecto | Creación de directorios y copias de configuración |\n"
                bitacora_content += "\n## 4. Tareas Pendientes e Hitos del Proyecto\n"
                bitacora_content += "- [ ] Cargar y validar conjunto de datos inicial.\n"
                bitacora_content += "- [ ] Realizar Análisis Exploratorio de Datos (EDA) usando [Estadístico Base].\n"
                if agent_architect:
                    bitacora_content += f"- [ ] Configurar y validar orquestación de loops ({loop_pattern}) usando [Agente Arquitecto de Agentes].\n"
                if active_agents.get('modelado'):
                    bitacora_content += "- [ ] Entrenar y optimizar modelos con Optuna, guardando resultados en `metrics.xlsx` usando [Agente de Modelado].\n"
                if brand_voice_active:
                    bitacora_content += "- [ ] Analizar voz de marca y validar coherencia del guión usando el script de Python.\n"
                if active_agents.get('latex'):
                    bitacora_content += "- [ ] Redactar y diagramar informe técnico final en subcarpetas de informes usando [Redactor de LaTeX].\n"
                if docs_presentations_active:
                    bitacora_content += "- [ ] Redactar informes científicos y diseñar diapositivas premium con alto impacto cognitivo.\n"
                if business_saas_active:
                    bitacora_content += "- [ ] Evaluar métricas de negocio (LTV, CAC, Churn) y optimizar embudos de conversión.\n"
                
                with open(os.path.join(full_project_path, 'IA', 'bitacora.md'), 'w', encoding='utf-8') as f:
                    f.write(bitacora_content)

                # Helper para copiar archivo si existe
                def copy_file(src_name, dst_subpath):
                    src_path = os.path.join(TEMPLATE_DIR, src_name)
                    dst_path = os.path.join(full_project_path, dst_subpath)
                    if os.path.exists(src_path):
                        shutil.copy2(src_path, dst_path)

                # Helper para copiar carpeta de forma recursiva
                def copy_folder(src_name, dst_subpath):
                    src_path = os.path.join(TEMPLATE_DIR, src_name)
                    dst_path = os.path.join(full_project_path, dst_subpath)
                    if os.path.exists(src_path):
                        if os.path.exists(dst_path):
                            shutil.rmtree(dst_path)
                        shutil.copytree(src_path, dst_path)

                # 2. Copiar archivos comunes y seleccionados
                copy_file('IA/habilidades/lectura_pdf_markitdown.md', 'IA/habilidades/lectura_pdf_markitdown.md')
                copy_file('IA/expertices/estilo_escritura.md', 'IA/expertices/estilo_escritura.md')
                copy_file('IA/habilidades/programacion_general.md', 'IA/habilidades/programacion_general.md')
                copy_file('IA/agentes/estadistico.md', 'IA/agentes/estadistico.md')
                copy_file('IA/expertices/expertiz_estadistica.md', 'IA/expertices/expertiz_estadistica.md')

                # Habilidades de lenguajes seleccionados
                for lang_item in selected_languages:
                    lang_name = lang_item.get('name')
                    lang_skill = f"programacion_{lang_name.lower()}.md"
                    copy_file(f"IA/habilidades/{lang_skill}", f"IA/habilidades/{lang_skill}")

                # Agente de modelado
                if active_agents.get('modelado'):
                    src_path = os.path.join(TEMPLATE_DIR, 'IA/agentes/modelado.md')
                    dst_path = os.path.join(full_project_path, 'IA/agentes/modelado.md')
                    if os.path.exists(src_path):
                        with open(src_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        if modelado_models:
                            content = content.replace('XGBoost, Random Forest, LightGBM, Redes Neuronales', modelado_models)
                        with open(dst_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                    if optuna_active:
                        copy_file('IA/habilidades/optimizacion_optuna.md', 'IA/habilidades/optimizacion_optuna.md')

                # Agente LaTeX y plantillas
                if active_agents.get('latex'):
                    copy_file('IA/agentes/redactor_latex.md', 'IA/agentes/redactor_latex.md')
                    copy_file('IA/habilidades/redaccion_latex.md', 'IA/habilidades/redaccion_latex.md')
                    
                    # Copiar selectivamente LaTeX
                    if copy_latex_report:
                        copy_folder('Plantillas_Latex/Plantilla_Informe', 'Plantillas_Latex/Plantilla_Informe')
                    if copy_latex_presentation:
                        copy_folder('Plantillas_Latex/Plantilla_Presentación', 'Plantillas_Latex/Plantilla_Presentación')

                # Opciones de comunicación y expertises adicionales
                if oratoria_active or active_agents.get('latex'):
                    copy_file('IA/expertices/expertiz_oratoria.md', 'IA/expertices/expertiz_oratoria.md')
                




                # Copia del Agente Arquitecto de Agentes
                if agent_architect:
                    copy_file('IA/agentes/arquitecto_agentes.md', 'IA/agentes/arquitecto_agentes.md')
                    copy_file('IA/habilidades/orquestacion_agentes.md', 'IA/habilidades/orquestacion_agentes.md')
                    copy_file('IA/expertices/expertiz_agent_architect.md', 'IA/expertices/expertiz_agent_architect.md')

                # Agente Programador y plantillas web
                if active_agents.get('programador'):
                    copy_file('IA/agentes/programador.md', 'IA/agentes/programador.md')
                    copy_file('IA/habilidades/desarrollo_web.md', 'IA/habilidades/desarrollo_web.md')
                    copy_file('IA/expertices/expertiz_diseno.md', 'IA/expertices/expertiz_diseno.md')
                    copy_folder('Pagina_Web', 'Pagina_Web')

                # Agente Diseñador Gráfico y recursos de branding
                if active_agents.get('disenador'):
                    copy_file('IA/agentes/disenador.md', 'IA/agentes/disenador.md')
                    copy_file('IA/habilidades/renderizado_diseno.md', 'IA/habilidades/renderizado_diseno.md')
                    copy_file('IA/expertices/expertiz_branding.md', 'IA/expertices/expertiz_branding.md')

                # Copiar ejemplos de escritura
                copy_folder('Documentacion/Ejemplos', 'Documentacion/Ejemplos')

                # Copiar nuevos agentes expertos y habilidades
                if active_agents.get('dataEng'):
                    copy_file('IA/agentes/data_engineer.md', 'IA/agentes/data_engineer.md')
                if active_agents.get('xai'):
                    copy_file('IA/agentes/xai_expert.md', 'IA/agentes/xai_expert.md')
                if active_agents.get('mlops'):
                    copy_file('IA/agentes/mlops_engineer.md', 'IA/agentes/mlops_engineer.md')
                    copy_file('IA/habilidades/despliegue_mlops.md', 'IA/habilidades/despliegue_mlops.md')
                if active_agents.get('qa'):
                    copy_file('IA/agentes/qa_reviewer.md', 'IA/agentes/qa_reviewer.md')
                if active_agents.get('research'):
                    copy_file('IA/agentes/investigador.md', 'IA/agentes/investigador.md')
                    copy_file('IA/habilidades/curaduria_literatura.md', 'IA/habilidades/curaduria_literatura.md')
                if active_agents.get('simulation'):
                    copy_file('IA/agentes/simulacion.md', 'IA/agentes/simulacion.md')
                if active_agents.get('gitCicd'):
                    copy_file('IA/agentes/git_cicd.md', 'IA/agentes/git_cicd.md')
                if active_agents.get('privacy'):
                    copy_file('IA/agentes/privacidad_datos.md', 'IA/agentes/privacidad_datos.md')
                if active_agents.get('sustainability'):
                    copy_file('IA/agentes/sostenibilidad.md', 'IA/agentes/sostenibilidad.md')
                if active_agents.get('ia'):
                    copy_file('IA/agentes/ia_expert.md', 'IA/agentes/ia_expert.md')
                    copy_file('IA/habilidades/conexion_api_ia.md', 'IA/habilidades/conexion_api_ia.md')


                # Configuración de Dashboard
                if dashboard_active:
                    os.makedirs(os.path.join(full_project_path, 'Dashboard'), exist_ok=True)
                    if dashboard_type == 'Dash':
                        copy_file('IA/habilidades/dashboard_dash.md', 'IA/habilidades/dashboard_dash.md')
                        # Generar plantilla app.py
                        app_py_content = "import dash\nfrom dash import html, dcc\n\napp = dash.Dash(__name__)\n\napp.layout = html.Div([\n    html.H1('Dashboard en Dash (Python)')\n])\n\nif __name__ == '__main__':\n    app.run_server(debug=True)\n"
                        with open(os.path.join(full_project_path, 'Dashboard', 'app.py'), 'w', encoding='utf-8') as f:
                            f.write(app_py_content)
                    elif dashboard_type == 'Shiny':
                        copy_file('IA/habilidades/dashboard_shiny.md', 'IA/habilidades/dashboard_shiny.md')
                        # Copiar la plantilla Shiny subida por el usuario
                        copy_folder('Plantilla_Shiny/dashboard', 'Dashboard')
                    elif dashboard_type == 'React':
                        copy_file('IA/habilidades/dashboard_react.md', 'IA/habilidades/dashboard_react.md')
                        # Generar package.json y App.jsx base
                        pkg_json = '{\n  "name": "react-dashboard",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}\n'
                        os.makedirs(os.path.join(full_project_path, 'Dashboard', 'src'), exist_ok=True)
                        app_jsx = "import React from 'react';\n\nexport default function App() {\n  return <h1>Dashboard en React</h1>;\n}\n"
                        with open(os.path.join(full_project_path, 'Dashboard', 'package.json'), 'w', encoding='utf-8') as f:
                            f.write(pkg_json)
                        with open(os.path.join(full_project_path, 'Dashboard', 'src', 'App.jsx'), 'w', encoding='utf-8') as f:
                            f.write(app_jsx)

                # Generar requirements.txt si aplica
                has_python = any(l.get('name') == 'Python' for l in selected_languages)
                if has_python:
                    requirements = ["pandas", "numpy", "matplotlib", "seaborn", "scikit-learn", "statsmodels", "markitdown", "openpyxl"]
                    if optuna_active:
                        requirements.append("optuna")
                    if video_editor:
                        requirements.append("moviepy")
                    if dashboard_active and dashboard_type == 'Dash':
                        requirements.append("dash")
                        requirements.append("plotly")
                    
                    with open(os.path.join(full_project_path, 'requirements.txt'), 'w', encoding='utf-8') as f:
                        f.write("\n".join(requirements) + "\n")

                # 3. Crear PRODUCT.md descriptivo para contextualizar a la IA
                product_md = f"# Proyecto: {project_name}\n\n"
                product_md += f"## Configuración de Entorno y Agentes\n"
                product_md += f"* **Lenguajes de Programación**: {lang_str}\n"
                if additional_coding:
                    product_md += f"* **Especificación de Programación**: {additional_coding}\n"
                if area_name:
                    product_md += f"* **Área de Expertiz**: {area_name}\n"
                    product_md += f"  * Detalles: {area_details}\n"
                
                if agent_architect:
                    product_md += f"* **Orquestación de Loops**: Activo (Patrón: {loop_pattern})\n"
                if dashboard_active:
                    product_md += f"* **Dashboard**: Activo ({dashboard_type})\n"
                
                if oratoria_active:
                    product_md += f"* **Estrategias de Oratoria**: Activo (Manual de Oratoria Clásica)\n"
                if dialogos_active:
                    product_md += f"* **Creación de Diálogos**: Activo (Estilo del Usuario)\n"
                if video_editor:
                    product_md += f"* **Video Creador y Editor**: Activo ({video_format} | {video_style})\n"
                
                if brand_voice_active:
                    product_md += f"* **Análisis de Voz (Brand Voice)**: Activo\n"
                if seo_optimizer_active:
                    product_md += f"* **Optimizador SEO**: Activo\n"
                if repurposing_active:
                    product_md += f"* **Matriz de Repropósito**: Activa\n"
                if content_calendar_active:
                    product_md += f"* **Calendario Editorial**: Activo\n"
                if docs_presentations_active:
                    product_md += f"* **Documentos y Slides Premium (En Evaluación)**: Activo\n"
                if business_saas_active:
                    product_md += f"* **Análisis de Negocio y SaaS (En Evaluación)**: Activo\n"
                
                product_md += f"\n## Agentes Habilitados en /IA/agentes/\n"
                for agent, active in active_agents.items():
                    if active:
                        product_md += f"- **Agente {agent.upper()}**: Habilitado.\n"
                        if agent == 'modelado' and modelado_models:
                            product_md += f"  * Modelos especificados: {modelado_models}\n"
                
                if optuna_active:
                    product_md += f"\n## Lógica de Modelado y Optuna\n"
                    product_md += f"- **Optimización de Hiperparámetros**: Activa mediante Optuna.\n"
                    product_md += f"- **Modelos y Lógica**: {optuna_details}\n"

                with open(os.path.join(full_project_path, 'PRODUCT.md'), 'w', encoding='utf-8') as f:
                    f.write(product_md)

                # Crear bloc de notas con los datos del autor de las plantillas y agentes
                autor_content = (
                    "by Angel Llanos Herrera\n\n"
                    "Mis Redes y Contacto:\n"
                    "- LinkedIn: https://www.linkedin.com/in/angel-llanos/\n"
                    "- Correo: angel.llanos.herrera@gmail.com\n"
                    "- GitHub: https://github.com/AngelTLH\n"
                )
                with open(os.path.join(full_project_path, 'autor.txt'), 'w', encoding='utf-8') as f:
                    f.write(autor_content)

                # 4. Generar el prompt_inicio.txt para que esté disponible en el proyecto
                prompt = f"Actúa como una IA especializada cargando el entorno del proyecto: \"{project_name}\".\n"
                prompt += "Asume las directrices, habilidades y expertises definidos en la carpeta \"/IA/\" de este repositorio. No proceses archivos pesados (PDFs, ZIPs) desde cero si ya cuentas con el conocimiento sintetizado en los archivos de la carpeta \"/IA/expertices/\".\n\n"

                if area_name:
                    prompt += f"### AREA DE EXPERTIZ PRINCIPAL: {area_name}\n"
                    if area_details:
                        prompt += f"Detalles de aplicación en el proyecto: {area_details}\n"
                    prompt += "\n"

                prompt += "### CONFIGURACIÓN DE DESARROLLO:\n"
                prompt += f"- Lenguajes de Programación: **{lang_str}**\n"
                if selected_languages:
                    for l in selected_languages:
                        prompt += f"- Formato de Archivo Principal para {l.get('name')}: **{l.get('format')}** (Debes escribir tu código siguiendo estrictamente este formato).\n"
                else:
                    prompt += "- Formato de Archivo Principal: **No especificado**\n"
                if additional_coding:
                    prompt += f"- Directrices de código específicas: {additional_coding}\n"
                if agent_architect:
                    prompt += f"- Patrón de Loop de Agentes Activo: **{loop_pattern}** (Razonamiento estructurado según este patrón).\n"
                if video_editor:
                    prompt += f"- Formato/Plataforma de Video: **{video_format}**\n"
                    prompt += f"- Estilo de Edición de Video: **{video_style}**\n"
                    if video_details:
                        prompt += f"- Directrices de Video: {video_details}\n"
                prompt += "\n"

                prompt += "### ROLES Y AGENTES ACTIVOS:\n"
                prompt += "1. **Agente Estadístico Base**: Rol por defecto en \"/IA/agentes/estadistico.md\" apoyado en \"/IA/expertices/expertiz_estadistica.md\". Liderarás el análisis de datos (EDA), pruebas descriptivas y consistencia estadística.\n"
                
                agent_count = 2
                if active_agents.get('dataEng'):
                    prompt += f"{agent_count}. **Agente de Ingeniería de Datos**: Rol en \"/IA/agentes/data_engineer.md\". Te encargarás de la ingesta de datos, limpieza de nulos y codificación de variables.\n"
                    agent_count += 1
                
                if active_agents.get('modelado'):
                    prompt += f"{agent_count}. **Agente de Modelado**: Rol en \"/IA/agentes/modelado.md\". Te encargarás del ajuste de modelos predictivos y de clasificación (usando específicamente: {modelado_models}).\n"
                    if optuna_active:
                        prompt += "   * **Optimización con Optuna**: Activa. Siguiendo la habilidad en \"/IA/habilidades/optimizacion_optuna.md\".\n"
                        if optuna_details:
                            prompt += f"   * Lógica y modelos requeridos: {optuna_details}\n"
                    if active_agents.get('xai'):
                        prompt += "   * **Explicabilidad (XAI)**: Activa. Rol en \"/IA/agentes/xai_expert.md\" para interpretar el modelo entrenado con SHAP e importancia de variables.\n"
                    if active_agents.get('mlops'):
                        prompt += "   * **MLOps**: Activa. Rol en \"/IA/agentes/mlops_engineer.md\" apoyado en la habilidad \"/IA/habilidades/despliegue_mlops.md\" para exportar el modelo y generar microservicios/APIs (Docker/FastAPI).\n"
                    agent_count += 1

                if active_agents.get('latex'):
                    prompt += f"{agent_count}. **Agente Redactor de LaTeX**: Rol en \"/IA/agentes/redactor_latex.md\" y habilidad en \"/IA/habilidades/redaccion_latex.md\". Escribirás informes utilizando las plantillas en \"/Plantillas_Latex/\".\n"
                    agent_count += 1

                if active_agents.get('programador'):
                    prompt += f"{agent_count}. **Agente Programador Frontend**: Rol en \"/IA/agentes/programador.md\", habilidades en \"/IA/habilidades/desarrollo_web.md\" y expertiz en \"/IA/expertices/expertiz_diseno.md\". Trabajarás con las plantillas de \"/Pagina_Web/\".\n"
                    agent_count += 1

                if active_agents.get('disenador'):
                    prompt += f"{agent_count}. **Agente Diseñador Gráfico**: Rol en \"/IA/agentes/disenador.md\" apoyado en la habilidad de \"/IA/habilidades/renderizado_diseno.md\" y la expertiz en \"/IA/expertices/expertiz_branding.md\". Diseñarás logos vectoriales, esquemas de color, contrastes, posts de Instagram, miniaturas y fondos de pantalla con un enfoque consultivo.\n"
                    agent_count += 1

                if active_agents.get('qa'):
                    qa_langs = ", ".join([l.get('name') for l in selected_languages]) if selected_languages else "cualquier lenguaje"
                    prompt += f"{agent_count}. **Agente de QA y Revisor de Código**: Rol en \"/IA/agentes/qa_reviewer.md\". Auditarás la calidad del código, sintaxis, PEP8 y la correctitud de las pruebas unitarias basadas en {qa_langs}.\n"
                    agent_count += 1

                if active_agents.get('research'):
                    prompt += f"{agent_count}. **Agente Investigador de Literatura**: Rol en \"/IA/agentes/investigador.md\" apoyado en la habilidad \"/IA/habilidades/curaduria_literatura.md\". Recabarás literatura científica real y verificarás su consistencia a través de los PDFs subidos en \"/Documentacion/Documento_Literatura/\".\n"
                    agent_count += 1

                if active_agents.get('simulation'):
                    prompt += f"{agent_count}. **Agente de Simulación**: Rol en \"/IA/agentes/simulacion.md\". Modelarás escenarios complejos, simulaciones de Monte Carlo y análisis de sensibilidad de parámetros.\n"
                    agent_count += 1

                if active_agents.get('gitCicd'):
                    prompt += f"{agent_count}. **Agente de Git y CI/CD**: Rol en \"/IA/agentes/git_cicd.md\". Automatizarás workflows, gestionarás repositorios y crearás pipelines de CI/CD (GitHub Actions).\n"
                    agent_count += 1

                if active_agents.get('privacy'):
                    prompt += f"{agent_count}. **Agente de Privacidad de Datos**: Rol en \"/IA/agentes/privacidad_datos.md\". Auditarás el dataset para aplicar técnicas de anonimización y asegurar la gobernanza ética.\n"
                    agent_count += 1

                if active_agents.get('sustainability'):
                    prompt += f"{agent_count}. **Agente de Sostenibilidad**: Rol en \"/IA/agentes/sostenibilidad.md\". Evaluarás el impacto ambiental, eficiencia de algoritmos y alineación con los ODS.\n"
                    agent_count += 1

                if active_agents.get('ia'):
                    prompt += f"{agent_count}. **Agente Especialista en IA**: Rol en \"/IA/agentes/ia_expert.md\" apoyado en \"/IA/habilidades/conexion_api_ia.md\". Diseñador de arquitecturas de Deep Learning, NLP, e integrarás agentes de IA mediante APIs (Gemini, ChatGPT) en interfaces web o dashboards conversacionales.\n"
                    agent_count += 1

                if agent_architect:
                    prompt += f"{agent_count}. **Agente Arquitecto de Agentes**: Rol en \"/IA/agentes/arquitecto_agentes.md\" apoyado en la habilidad \"/IA/habilidades/orquestacion_agentes.md\" y el manual \"/IA/expertices/expertiz_agent_architect.md\". Coordinarás los flujos, loops de agentes y llamadas a herramientas (MCP).\n"
                    agent_count += 1

                if video_editor:
                    prompt += f"{agent_count}. **Agente Creador y Editor de Videos**: Rol en \"/IA/agentes/editor_video.md\", habilidades en \"/IA/habilidades/edicion_creacion_video.md\" y expertiz en \"/IA/expertices/expertiz_videos_virales.md\". Te encargarás de diseñar el guión/storyboard y automatizar la edición de videos virales en formato **{video_format}** con un estilo **{video_style}** partiendo de audios pregrabados.\n"
                    agent_count += 1

                if youtube_creator:
                    prompt += f"{agent_count}. **Guionista / Creador YouTube**: Rol en \"/IA/agentes/creador_contenido_youtube.md\" y habilidad en \"/IA/habilidades/creacion_dialogos_youtube.md\". Te especializas en la redacción de diálogos y guiones de alto impacto para videos de YouTube.\n"
                    if yt_oratoria:
                        prompt += "   * **Técnicas de Oratoria**: Activas. Aplicarás los principios de oratoria de impacto de \"/IA/expertices/expertiz_oratoria.md\".\n"
                    if yt_ejemplos:
                        prompt += "   * **Ejemplos Consolidados**: Activo. Cargarás e imitarás los guiones depositados en \"/IA/expertices/dialogos_consolidados/\".\n"
                    if youtube_details:
                        prompt += f"   * **Detalles del Canal/Guión**: {youtube_details}\n"
                    agent_count += 1

                if dashboard_active:
                    prompt += f"{agent_count}. **Dashboard ({dashboard_type})**: Activo. Guiado por la habilidad en \"/IA/habilidades/dashboard_{dashboard_type.lower()}.md\". Programarás el dashboard en la carpeta \"/Dashboard/\".\n"
                    agent_count += 1
                prompt += "\n"

                prompt += "### REGLAS DE ACCIÓN MANDATORIAS (SIEMPRE ACTIVAS):\n"
                prompt += "1. **Mención Explícita del Agente Activo**: Al emitir cualquier respuesta, código, análisis o reporte, debes declarar explícitamente en el chat el rol o agente de \"/IA/agentes/\" que estás asumiendo en ese momento (ej: `[Rol: Estadístico Base]` o `[Rol: Agente de Modelado]`) al inicio de tu mensaje.\n"
                prompt += "2. **Generación y Actualización de Bitácora**: Es obligatorio mantener actualizado el archivo \"IA/bitacora.md\". Al finalizar cada tarea, sesión o cambio en el código, debes documentar el progreso, decisiones tomadas y siguientes pasos (asegurando el uso de mayúsculas donde sea gramaticalmente correcto en títulos, inicios de párrafo y nombres propios).\n"
                prompt += "3. **Exportación de Métricas a Excel**: Los resultados de entrenamientos, optimización de hiperparámetros y métricas de modelos de machine learning deben guardarse estrictamente en formato Excel (`metrics.xlsx`), nunca en formato JSON.\n"
                prompt += "4. **Aislamiento de Informes en Subcarpetas**: Cada informe, reporte o presentación de LaTeX debe estar aislado en una subcarpeta dedicada dentro de \"/Documentacion/Informes/\" (ej: \"/Documentacion/Informes/Reporte_EDA/\"), conteniendo todos sus archivos fuentes (.tex), auxiliares e imágenes.\n"
                
                mandatory_count = 5
                if video_editor:
                    prompt += f"{mandatory_count}. **Edición de Video Basada en Retención**: Los videos generados deben estructurarse con ganchos (*hooks*) de 3 segundos, cortes de ritmo constantes (cada 2 segundos de promedio), superposición de textos de Pillow con safe zones (centro vertical) y mezcla de audio con ganancia equilibrada (voz principal dominante, música a -15dB).\n"
                    mandatory_count += 1
                if youtube_creator:
                    prompt += f"{mandatory_count}. **Estructura de Guion YouTube**: Los guiones redactados deben incluir ganchos magnéticos en los primeros 3 segundos, cortes de ritmo narrativo claros, llamadas a la acción (CTA) contextuales y técnicas de oratoria para garantizar la retención de la audiencia.\n"
                    mandatory_count += 1
                if active_agents.get('research'):
                    prompt += f"{mandatory_count}. **Verificación Bibliográfica Obligatoria**: Toda cita, afirmación o sustento académico incluido en los reportes debe contrastarse activamente con los PDFs reales depositados en \"/Documentacion/Documento_Literatura/\". Se debe generar de forma obligatoria el archivo Excel `citas_verificacion.xlsx` conteniendo las columnas: Cita, Documento Asociado, Número de Página Citada y Autores.\n"
                    mandatory_count += 1
                
                prompt += f"{mandatory_count}. **Conversión y Lectura de PDFs con MarkItDown**: Cuando debas leer cualquier archivo PDF en este espacio, debes usar la herramienta 'markitdown' (ejecutando comandos en consola o un script rápido de Python) para pasarlo a formato Markdown \".md\" y leer únicamente el archivo \".md\" resultante (conforme a \"/IA/habilidades/lectura_pdf_markitdown.md\").\n"
                mandatory_count += 1
                prompt += f"{mandatory_count}. **Clonación del Estilo de Escritura del Usuario**: Al redactar informes, justificaciones, análisis o conclusiones, debes imitar exactamente el estilo detallado en \"/IA/expertices/estilo_escritura.md\" (tono formal, riguroso, uso de conectores formales y tercera persona impersonal).\n"
                mandatory_count += 1
                prompt += f"{mandatory_count}. **Parsimonia en el Código**: En el desarrollo de tus códigos (en \"/Codigos/\"), mantén estructuras limpias, comentadas y documentadas siguiendo la habilidad \"/IA/habilidades/programacion_general.md\".\n"
                
                rule_count = 8
                if oratoria_active:
                    prompt += f"{rule_count}. **Estrategias de Oratoria**: Al estructurar discursos, defensas o presentaciones, debes apegarte estrictamente a las técnicas de comunicación persuasiva y oratoria de impacto documentadas en \"/IA/expertices/expertiz_oratoria.md\".\n"
                    rule_count += 1
                if dialogos_active:
                    prompt += f"{rule_count}. **Creación de Diálogos**: Al redactar diálogos, simulaciones, debates o guiones, debes aplicar las reglas de estructuración y roles académicos definidas en \"/IA/expertices/expertiz_dialogos.md\", reflejando tu estilo formal e impersonal.\n"
                    rule_count += 1
                if brand_voice_active:
                    prompt += f"{rule_count}. **Clonación y Análisis de Voz**: Analizarás y replicarás de manera consistente la voz de marca utilizando el script de Python en \"/IA/herramientas/brand_voice_analyzer.py\" y la expertiz en \"/IA/expertices/expertiz_brand_voice.md\".\n"
                    rule_count += 1
                if seo_optimizer_active:
                    prompt += f"{rule_count}. **Optimización SEO de Contenido**: Evaluarás y optimizarás la visibilidad y metadatos de tu producción utilizando el script de Python en \"/IA/herramientas/seo_optimizer.py\" para maximizar la efectividad algorítmica.\n"
                    rule_count += 1
                if repurposing_active:
                    prompt += f"{rule_count}. **Matriz de Repropósito de Contenido**: Adaptarás y fragmentarás el contenido para múltiples plataformas (Shorts, posts de LinkedIn, hilos de X o blogs) siguiendo el manual en \"/IA/expertices/expertiz_content_frameworks.md\" y \"/IA/expertices/expertiz_social_media.md\".\n"
                    rule_count += 1
                if content_calendar_active:
                    prompt += f"{rule_count}. **Calendario Editorial Mensual**: Planificarás y distribuirás las publicaciones siguiendo la plantilla y las proporciones equilibradas en \"/IA/expertices/expertiz_content_calendar.md\".\n"
                    rule_count += 1
                if docs_presentations_active:
                    prompt += f"{rule_count}. **Documentación y Presentaciones Premium**: Estructurarás tus informes científicos y tus diapositivas según las directrices de alto impacto cognitivo y diagramación en \"/IA/habilidades/documentacion_presentaciones.md\" y \"/IA/expertices/expertiz_docs_presentations.md\".\n"
                    rule_count += 1
                if business_saas_active:
                    prompt += f"{rule_count}. **Análisis de Negocio y SaaS**: Utilizarás el marco de métricas comerciales (LTV, CAC, Churn) y optimización de conversión según \"/IA/habilidades/analisis_negocio_saas.md\" y \"/IA/expertices/expertiz_business_saas.md\".\n"
                    rule_count += 1
                prompt += "\n"
                
                prompt += "Por favor, confirma que has leído y asimilado este prompt, así como los manuales en la carpeta \"/IA/\", y dime que estás listo para iniciar el trabajo."

                with open(os.path.join(full_project_path, 'IA', 'prompt_inicio.txt'), 'w', encoding='utf-8') as f:
                    f.write(prompt)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'message': f'Proyecto "{project_name}" creado con éxito en {full_project_path}',
                    'path': full_project_path
                }).encode('utf-8'))

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': f'Error en el servidor local: {str(e)}'}).encode('utf-8'))

class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    pass

def run():
    server_address = ('', PORT)
    httpd = ThreadingHTTPServer(server_address, DashboardHandler)
    print(f"Servidor local de Python ejecutándose en http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()

if __name__ == '__main__':
    run()
