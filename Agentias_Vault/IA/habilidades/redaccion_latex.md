# Habilidad de Redacción y Formateo en LaTeX

Esta guía instruye al agente sobre cómo estructurar, dar formato y compilar informes técnicos y presentaciones utilizando las plantillas LaTeX específicas del usuario.

---

## 1. Configuración de Estructura y Preámbulo (LaTeX)

Cuando se genere código LaTeX para informes técnicos, se deben seguir las especificaciones del preámbulo institucional del usuario:

* **Clase del Documento**: `\documentclass[10pt,a4paper]{article}`.
* **Paquetes Requeridos**:
  ```latex
  \usepackage[utf8]{inputenc}
  \usepackage[spanish, es-tabla]{babel} % es-tabla renombra "Cuadro" a "Tabla"
  \usepackage[margin=2.8cm, top=3cm, bottom=3cm, headheight=24pt]{geometry}
  \usepackage[table]{xcolor} % Para dar color a celdas de tablas
  \usepackage{amsmath, amssymb} % Fórmulas avanzadas
  \usepackage{tabularx} % Tablas ajustadas al ancho de página
  \usepackage{booktabs} % Líneas de tabla de alta calidad
  \usepackage{tcolorbox} % Cajas de diseño
  \tcbuselibrary{skins}
  \usepackage{fancyhdr} % Encabezados y pies de página personalizados
  \usepackage{titlesec} % Formateo de secciones
  \usepackage{enumitem} % Listas personalizadas
  \usepackage{float} % Posicionamiento rígido [H]
  \usepackage{lastpage} % Cálculo de total de páginas
  \usepackage{graphicx} % Inclusión de imágenes
  \usepackage{caption} % Personalización de títulos de figuras/tablas
  \usepackage{listings} % Formateo de código fuente
  \usepackage{hyperref} % Enlaces interactivos
  ```
* **Colores Institucionales y Corporativos Neutros**: Definir los siguientes colores de la plantilla visual:
  ```latex
  \definecolor{PrimaryBlue}{RGB}{20, 60, 110}      % Azul oscuro corporativo neutro
  \definecolor{LightBlue}{RGB}{240, 245, 252}      % Azul claro para tablas
  \definecolor{WarningRed}{RGB}{170, 45, 45}       % Rojo oscuro para notas importantes
  \definecolor{LightRed}{RGB}{253, 240, 240}       % Rojo claro para fondo de notas
  ```
* **Encabezado y Pie de Página (`fancyhdr`)**:
  * Encabezado con línea y textos genéricos de Institución y Asignatura (nunca asumir nombres fijos):
    ```latex
    \pagestyle{fancy}
    \fancyhf{}
    \fancyhead[L]{\textcolor{PrimaryBlue}{\textbf{[Nombre de la Institución]}}}
    \fancyhead[R]{\textcolor{PrimaryBlue}{[Asignatura / Documento Técnico]}}
    \cfoot{\small Página \thepage\ de \pageref{LastPage}}
    \renewcommand{\headrulewidth}{1pt}
    \renewcommand{\headrule}{\hbox to\headwidth{\color{PrimaryBlue}\leaders\hrule height \headrulewidth\hfill}}
    ```

---

## 2. Formateo de Componentes del Documento

### A. Títulos de Secciones
Las secciones deben teñirse con el color azul corporativo neutro:
```latex
\titleformat{\section}{\color{PrimaryBlue}\Large\bfseries}{\thesection.}{0.5em}{}
\titleformat{\subsection}{\color{PrimaryBlue}\large\bfseries}{\thesubsection.}{0.5em}{}
```

### B. Tablas Estructuradas (`tabularx`)
Las tablas deben tener líneas horizontales gruesas y la cabecera teñida con texto blanco.
```latex
\begin{table}[htbp]
\centering
\caption{Descripción de las variables del modelo}
\label{tab:ejemplo}
\renewcommand{\arraystretch}{1.2}
\arrayrulecolor{PrimaryBlue}
\begin{tabularx}{\dimexpr\textwidth-6pt\relax}{@{} l X X @{}}
\toprule[1.5pt]
\textbf{Columna 1} & \textbf{Columna 2} & \textbf{Columna X} \\ 
\midrule[1pt]
\texttt{variable1} & Descripción larga 1 & Detalle... \\
\texttt{variable2} & Descripción larga 2 & Detalle... \\
\bottomrule[1.5pt]
\end{tabularx}
\arrayrulecolor{black}
\end{table}
```

### C. Bloques de Código Fuente (`listings`)
Definir un estilo limpio para código (ej. R) utilizando los colores del preámbulo:
```latex
\definecolor{CodeBack}{RGB}{248, 248, 248}
\definecolor{CodeComment}{RGB}{80, 120, 80}
\definecolor{CodeKeyword}{RGB}{20, 60, 110}
\definecolor{CodeString}{RGB}{170, 45, 45}

\lstdefinestyle{Rstyle}{
    language=R,
    basicstyle=\ttfamily\footnotesize,
    keywordstyle=\color{CodeKeyword}\bfseries,
    commentstyle=\color{CodeComment}\itshape,
    stringstyle=\color{CodeString},
    backgroundcolor=\color{CodeBack},
    frame=single,
    rulecolor=\color{PrimaryBlue},
    breaklines=true,
    showstringspaces=false,
    numbers=left,
    numberstyle=\tiny\color{gray},
    tabsize=2,
    captionpos=b
}
```

### D. Inclusión de Figuras
Las figuras deben usar el posicionamiento rígido `[H]` para mantener el flujo editorial y referenciarse correctamente:
```latex
\begin{figure}[H]
\centering
\includegraphics[width=0.45\textwidth]{imagenes/mi_grafico.jpeg}
\caption{Título descriptivo de la figura}
\label{fig:referencia}
\end{figure}
```

---

## 3. Organización y Almacenamiento de Informes
* **Aislamiento Obligatorio en Subcarpetas**: Está estrictamente prohibido guardar archivos de informes sueltos en la raíz de `/Documentacion/Informes/`.
* **Estructuración de Carpetas**: Cada reporte técnico o presentación en LaTeX debe alojarse en su propia subcarpeta exclusiva dentro de `/Documentacion/Informes/` (ej: `/Documentacion/Informes/Reporte_EDA/` o `/Documentacion/Informes/Reporte_Modelamiento/`). 
* **Archivos Contenidos**: Dentro de cada subcarpeta se deben guardar tanto los códigos fuente (`.tex`), los archivos auxiliares de compilación (`.aux`, `.log`, `.out`, etc.), las imágenes de soporte y el documento compilado final (`.pdf`).

---

## 4. Mandato de Neutralidad de Autoría y Cero Suposición Académica
* **Autoría del Entregable**: Angel Llanos Herrera es el autor del framework Agentias (marca de agua de la plataforma). Queda terminantemente prohibido colocar su nombre como autor en la portada o metadatos (`\author{...}`) de los documentos o tareas del usuario. El autor debe quedar vacío, con un marcador neutro (`[Nombre del Autor]`) o consultarse directamente al usuario.
* **Cero Suposición de Profesores o Asignaturas**: Los agentes jamás deben inferir o inventar nombres de docentes, evaluadores, asignaturas o universidades basándose en documentos de ejemplo o referencias previas. Siempre se deben utilizar marcadores de posición neutros (`[Nombre del Docente]`, `[Asignatura]`, `[Nombre de la Institución]`) o consultar explícitamente al usuario.
