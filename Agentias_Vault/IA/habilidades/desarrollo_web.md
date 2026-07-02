# Habilidad de Desarrollo Web y Frontend Premium

Esta guía técnica define los estándares de desarrollo web (HTML, CSS y JS) que la IA debe seguir para garantizar interfaces de usuario rápidas, responsivas y visualmente extraordinarias.

---

## 1. HTML5 Semántico
* **Estructura Significativa**: Utilizar elementos HTML5 semánticos en lugar de divs genéricos (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`).
* **Accesibilidad (a11y)**:
  * Todos los campos de entrada deben tener su correspondiente etiqueta `<label>` enlazada mediante `for`/`id`.
  * Utilizar atributos `aria-*` cuando el estado interactivo cambie dinámicamente.
  * Todas las imágenes de contenido deben tener un atributo `alt` descriptivo.

---

## 2. CSS Moderno y Estética Premium
* **Variables CSS (Custom Properties)**: Declarar tokens de diseño globales en `:root` (colores, espaciados, fuentes) para consistencia cromática y fácil mantenimiento.
* **Sistema de Colores**:
  * Utilizar la notación `hsl()` u `oklch()` para colores definidos dinámicamente y con buena consistencia.
  * Garantizar relaciones de contraste correctas de texto.
* **Layouts Modernos**:
  * Flexbox para layouts lineales (1D) con `gap` en lugar de márgenes forzados.
  * Grid para rejillas complejas (2D). Para rejillas auto-ajustables sin breakpoints:
    ```css
    .grid-autofit {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
    }
    ```
* **Diseño Responsivo**:
  * Diseñar mobile-first por defecto.
  * Utilizar unidades relativas (`rem`, `em`, `vh`, `vw`) y `clamp()` para tamaños tipográficos responsivos fluidos.

---

## 3. JavaScript Modular
* **Vanilla JavaScript Limpio**: Escribir JavaScript nativo estructurado en módulos ES6 (`import`/`export`) sin dependencias innecesarias de librerías externas pesadas.
* **Interacciones del DOM**:
  * Delegación de eventos para optimizar el rendimiento.
  * Evitar acoplamiento duro; manipular estados visuales añadiendo o quitando clases CSS en lugar de modificar estilos en línea directos (`element.style.color`).
* **Seguridad y Rendimiento**:
  * Sanitizar datos dinámicos antes de insertarlos en el DOM para evitar ataques XSS (evitar `innerHTML` con datos no confiables, preferir `textContent`).
  * Aplicar técnicas de *debounce* o *throttle* en eventos de alta frecuencia (como scroll o resize).
