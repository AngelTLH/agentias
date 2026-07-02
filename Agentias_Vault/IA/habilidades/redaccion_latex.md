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
* **Colores Institucionales (UCM)**: Definir siempre los siguientes colores de la plantilla visual:
  ```latex
  \definecolor{UCMblue}{RGB}{0, 70, 135}      % Azul oscuro institucional
  \definecolor{UCMlightblue}{RGB}{235, 245, 255} % Azul claro para fondo de tablas
  \definecolor{UCMred}{RGB}{150, 40, 50}      % Rojo oscuro para notas importantes
  \definecolor{UCMlightred}{RGB}{250, 235, 240}  % Rojo claro para fondo de notas
  ```
* **Encabezado y Pie de Página (`fancyhdr`)**:
  * Encabezado con línea azul y textos de Universidad y Asignatura:
    ```latex
    \pagestyle{fancy}
    \fancyhf{}
    \fancyhead[L]{\textcolor{UCMblue}{\textbf{Universidad Católica del Maule}}}
    \fancyhead[R]{\textcolor{UCMblue}{Trabajo Evaluado N.$^{\circ}$ 2}}
    \cfoot{\small Pagina \thepage\ de \pageref{LastPage}}
    \renewcommand{\headrulewidth}{1pt}
    \renewcommand{\headrule}{\hbox to\headwidth{\color{UCMblue}\leaders\hrule height \headrulewidth\hfill}}
    ```

---

## 2. Formateo de Componentes del Documento

### A. Títulos de Secciones
Las secciones deben teñirse con el color institucional azul:
```latex
\titleformat{\section}{\color{UCMblue}\Large\bfseries}{\thesection.}{0.5em}{}
\titleformat{\subsection}{\color{UCMblue}\large\bfseries}{\thesubsection.}{0.5em}{}
```

### B. Tablas Estructuradas (`tabularx`)
Las tablas deben tener líneas horizontales gruesas y la cabecera teñida de azul con texto blanco.
```latex
\begin{table}[htbp]
\centering
\caption{Descripción de las variables del modelo}
\label{tab:ejemplo}
\renewcommand{\arraystretch}{1.2}
\arrayrulecolor{UCMblue}
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
\definecolor{CodeKeyword}{RGB}{0, 70, 135}
\definecolor{CodeString}{RGB}{150, 40, 50}

\lstdefinestyle{Rstyle}{
    language=R,
    basicstyle=\ttfamily\footnotesize,
    keywordstyle=\color{CodeKeyword},
    commentstyle=\color{CodeComment}\itshape,
    stringstyle=\color{CodeString},
    backgroundcolor=\color{CodeBack},
    frame=single,
    rulecolor=\color{UCMblue},
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
