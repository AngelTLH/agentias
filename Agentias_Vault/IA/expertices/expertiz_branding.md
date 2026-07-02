# Expertiz en Identidad de Marca, Colorimetría y Composición Visual (Branding Holístico)

Este manual técnico establece las directrices académicas e industriales de diseño que debe dominar la IA para crear marcas coherentes, profesionales e impactantes desde cero.

---

## 1. Colorimetría y Composición de Paletas
El color no es puramente estético; define la psicología y la accesibilidad de la marca:
* **Fórmula de Contraste WCAG 2.1**: Todo texto principal debe mantener un contraste mínimo de $\ge 4.5:1$ contra su fondo. En interfaces oscuras, prefiere fondos suavizados (ej: `#0b0f19` en vez de negro puro `#000000`) para reducir la fatiga visual.
* **Uso de Espacios de Color Modernos (OKLCH)**:
  * Emplea `oklch()` para definir paletas con brillo y matices uniformes.
  * *Estructura 60-30-10*:
    * **60% Dominante**: Color de fondo (blancos matizados, grises oscuros o tonos neutros).
    * **30% Estructural / Secundario**: Textos, tarjetas, bordes, elementos de soporte.
    * **10% Acento**: Botones principales, enlaces, avisos de importancia crítica.
* **Psicología Cromática Aplicada**:
  * *Azul/Cian*: Confianza, tecnología, rigor científico, finanzas.
  * *Esmeralda/Verde*: Crecimiento, sostenibilidad, salud, ecología.
  * *Índigo/Violeta*: Premium, innovación, creatividad, exclusividad.
  * *Naranja/Ámbar*: Dinamismo, advertencia constructiva, accesibilidad, energía.

---

## 2. Tipografía y Jerarquía Editorial
La legibilidad y el ritmo visual dependen de un maridaje de fuentes coherente:
* **Emparejamiento de Fuentes (Type Pairing)**:
  * *Títulos (Display/Header)*: Usa fuentes con alta personalidad cargadas desde Google Fonts (ej: *Outfit*, *Playfair Display*, *Space Grotesk*, *Syne*).
  * *Cuerpo (Body)*: Fuentes limpias y altamente legibles en tamaños pequeños (ej: *Inter*, *Roboto*, *Plus Jakarta Sans*, *Lora*).
* **Escala Tipográfica Modular**:
  * Título Principal (Hero): $3\text{rem}$ a $5.5\text{rem}$ (`font-weight: 700` o `800`, `letter-spacing: -0.03em`).
  * Subtítulos (h2/h3): $1.75\text{rem}$ a $2.5\text{rem}$ (`font-weight: 600`).
  * Cuerpo de Texto: $0.95\text{rem}$ a $1.1\text{rem}$ (`font-weight: 400`, `line-height: 1.6`).
* **Reglas de Párrafo**:
  * Limitar la longitud de línea a un máximo de 70 caracteres para evitar el cansancio ocular.
  * Utilizar `text-wrap: balance` en títulos cortos para evitar palabras huérfanas al final de las líneas.

---

## 3. Formatos y Proporciones de Recursos Visuales
Al diseñar, debes configurar las dimensiones exactas según el canal de difusión:
* **Redes Sociales (Instagram / LinkedIn)**:
  * *Post Cuadrado*: $1080 \times 1080\text{ px}$ (Proporción 1:1).
  * *Post Vertical (Recomendado)*: $1080 \times 1350\text{ px}$ (Proporción 4:5 - Ocupa más espacio visual en pantalla).
* **YouTube**:
  * *Miniatura (Thumbnail)*: $1280 \times 720\text{ px}$ (Proporción 16:9).
  * *Fondo de Pantalla / Banner*: $1920 \times 1080\text{ px}$ (Proporción 16:9).
* **Layouts Web**:
  * Proporción fluida. El diseño de la página web debe priorizar la alineación a una rejilla (grid) de 12 columnas con márgenes consistentes.

---

## 4. Pruebas de Contraste y Consistencia
Un diseño profesional debe funcionar en todas las condiciones de visibilidad:
* **Cuadrícula de Contraste de Logotipo**:
  * *Fondo Negro (`#0B0F19`)*: Logotipo con variables claras/blancas.
  * *Fondo Blanco (`#FFFFFF`)*: Logotipo con variables oscuras.
  * *Monocromo (Blanco y Negro puro)*: Versiones de silueta indispensables para facturas, sellos o impresiones.
* **Coherencia en Presentaciones**:
  * El diseño de las diapositivas de soporte de una marca debe utilizar el mismo color primario como color de estructura y el color de fondo dominante para la consistencia visual.
  * Las fuentes de la presentación deben coincidir con la combinación tipográfica de la marca.
