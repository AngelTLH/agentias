# Expertiz en Diseño e Interacción Frontend (Impeccable & Motion)

Este manual técnico define los estándares estéticos, de diseño UI/UX y principios de animación en los que debe basarse la IA para construir páginas y aplicaciones web premium.

---

## 1. Composición de Color y Contraste
* **Garantía de Contraste (Accesibilidad)**: El texto del cuerpo debe cumplir obligatoriamente con una relación de contraste de $\ge 4.5:1$ contra su fondo. Para textos grandes o negritas, el límite es $\ge 3:1$.
* **Evitar el Monocultivo de Grises**: Los textos sobre fondos de color no deben ser grises genéricos; se deben usar tonos más oscuros del color de fondo o transparencias del color del texto para integrarse de forma natural.
* **Estrategias de Paletas (Usar OKLCH)**:
  * *Restringido*: Tonos neutros + un color de acento $\le 10\%$. Ideal para dashboards.
  * *Comprometido*: Un color saturado que cubra del $30\%$ al $60\%$ de la superficie. Ideal para identidad de marca.
  * *Drenched (Inundado)*: Toda la interfaz adopta el color de la marca (ej: secciones hero específicas).
  * *Evitar el Beige/Cream por defecto*: El fondo color "crema" o "arena" es un cliché común de la IA. Usa blancos puros con ligeros tintes de la marca o grises oscuros premium cuando el contexto lo justifique.

---

## 2. Tipografía y Estilo Editorial
* **Longitud de Línea**: Limitar el ancho del texto de lectura de 65 a 75 caracteres (`max-width: 65ch` o `75ch`) para optimizar la legibilidad.
* **Maridaje de Fuentes**: Evitar emparejar fuentes similares. Utilizar el contraste (serifa + sans-serif, geométrica + humanista) o usar múltiples pesos de una misma familia tipográfica.
* **Escala Visual**: Para los títulos principales (Hero), el tamaño de fuente debe controlarse mediante `clamp()` con un límite de $\le 6\text{rem}$ (~96px) para evitar saturar visualmente al usuario.
* **Espaciado entre Letras**: La separación para títulos grandes no debe ser menor de $-0.04\text{em}$ (`letter-spacing: -0.02em` a `-0.04em`).
* **Control de Huérfanas**: Utilizar `text-wrap: balance` en títulos (h1–h3) y `text-wrap: pretty` en textos largos.

---

## 3. Estructura de Layout y Componentes
* **Alternar el Ritmo**: Variar los espacios y las alturas de sección para crear un ritmo de lectura atractivo en lugar de usar rejillas homogéneas.
* **Uso Moderado de Tarjetas (Cards)**: No estructurar toda la página en base a bloques cerrados (cards). Nunca anidar tarjetas dentro de otras. Utilizar espacios en blanco y líneas finas para separar secciones.
* **Flexbox y Grid**: Usar Flexbox para distribuciones unidimensionales (1D) y Grid para estructuras bidimensionales (2D).
* **z-Index Semántico**: Definir una escala jerárquica clara (ej: dropdown $\rightarrow$ sticky $\rightarrow$ modal-backdrop $\rightarrow$ modal $\rightarrow$ toast $\rightarrow$ tooltip) en lugar de valores arbitrarios como `999` o `9999`.

---

## 4. Principios de Movimiento (Motion Design)
Las animaciones y micro-interacciones no deben ser una ocurrencia tardía; deben integrarse como parte central de la experiencia:

* **La Compuerta de Frecuencia**: Evaluar qué tan a menudo el usuario interactúa con un elemento para definir su animación:
  * *Frecuencia Alta (cientos de veces al día, ej: botones de navegación, formularios)*: Sin animación o transición instantánea ($\le 150\text{ms}$).
  * *Frecuencia Media (diario, ej: menús desplegables)*: Movimiento rápido y sutil ($200\text{ms}$ - $300\text{ms}$).
  * *Frecuencia Baja (ej: pantallas de carga, onboarding)*: Movimientos expresivos y fluidos ($300\text{ms}$ - $500\text{ms}$).
  * *Acciones por Teclado*: Nunca animar elementos activados mediante atajos de teclado.
* **Lentes de Diseñadores de Referencia**:
  * *Enfoque Emil Kowalski (Vercel)*: Restricción, velocidad, menor de $300\text{ms}$ (180ms ideal). Perfecto para herramientas profesionales.
  * *Enfoque Jakub Krehel (jakub.kr)*: Pulido extremo, suavidad, de $200\text{ms}$ a $500\text{ms}$ para transiciones complejas.
  * *Enfoque Jhey Tompkins (@jh3yy)*: Expresivo, lúdico, dinámico. Ideal para landings creativas y portfolios.
* **Curvas de Easing**: Usar salidas exponenciales limpias (ej: `cubic-bezier(0.16, 1, 0.3, 1)` o *ease-out-expo*). Evitar rebotes y efectos elásticos caricaturescos en interfaces profesionales.
* **Accesibilidad Obligatoria**: Respetar `prefers-reduced-motion` mediante una alternativa estática (ej. un fundido de opacidad instantáneo):
  ```css
  @media (prefers-reduced-motion: reduce) {
      .elemento-animado {
          animation: none !important;
          transition: opacity 0.1s ease !important;
      }
  }
  ```
* **Reveals y Degradación**: Las animaciones de aparición (reveals) deben mejorar la visibilidad de un elemento que ya existe por defecto. Nunca bloquees la visibilidad del contenido mediante clases de transición que dependan puramente de JavaScript para activarse (si JS falla o tarda, el contenido queda en blanco).

---

## 5. Prohibiciones Estéticas (Baneos Absolutos)
* **Bordes de Acento Laterales (Side-stripes)**: Bordes de color gruesos ($>1\text{px}$) a la izquierda o derecha de tarjetas o alertas como único acento visual.
* **Texto con Degradado (Gradient Text)**: Texto con gradientes que dificulte la lectura. Priorizar colores sólidos de alta legibilidad.
* **Glassmorphism por Defecto**: Fondos borrosos de cristal usados de forma masiva y sin justificación. Reservar para capas de menú flotantes o tooltips muy selectos.
* **Métrica Hero Cliche**: Diseños con números gigantes, etiquetas diminutas y gradientes coloridos al estilo cliché de SaaS.
* **Parrillas de Cards Idénticas**: Repetir el mismo diseño de tarjetas con un icono, un título y un texto de manera infinita.
* **Kickers en Mayúsculas (Eyebrows)**: Etiquetas pequeñas en mayúsculas con espaciado amplio por encima de cada encabezado (ej: "ABOUT US", "PORTFOLIO"). Esto denota una estructura típica de IA. Remplazar por cadencias tipográficas diferentes.
* **Numeración Falsa (01, 02, 03)**: Numerar secciones solo como decoración cuando no representan un flujo ordenado real.
