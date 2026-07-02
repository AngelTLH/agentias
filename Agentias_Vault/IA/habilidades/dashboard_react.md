# Habilidad de Desarrollo de Dashboards con React

Esta guía define las buenas prácticas, estructuración de código y patrones de componentes para construir dashboards web interactivos y de alto rendimiento utilizando React.

---

## 1. Arquitectura de Componentes
Un dashboard en React debe estructurarse mediante componentes funcionales modulares y reutilizables:

* **Estructura de Directorios**:
  * `src/components/`: Componentes comunes del dashboard (ej: `Card.jsx`, `ChartContainer.jsx`, `Sidebar.jsx`).
  * `src/views/`: Vistas principales o pestañas (ej: `Overview.jsx`, `Analytics.jsx`).
  * `src/hooks/`: Custom hooks para modular la lógica de obtención y filtrado de datos (ej: `useAnalyticsData.js`).
* **Componentes Atómicos**:
  * Cada tarjeta de indicador o gráfico debe ser un componente independiente con propiedades (`props`) tipadas.

---

## 2. Gestión de Estado y Reactividad
* **Hooks de Estado**:
  * Utilizar `useState` para estados interactivos locales (filtros, selecciones de menú).
  * Emplear `useMemo` para el cálculo de métricas complejas a partir de arrays de datos grandes, evitando re-renderizados costosos.
* **Consumo de APIs**:
  * Implementar llamadas asincrónicas limpias dentro de un hook `useEffect` con estados de carga (`loading`) y error estructurados.
  * Utilizar `AbortController` para cancelar peticiones HTTP obsoletas si el usuario cambia de filtro rápidamente.

---

## 3. Visualizaciones y Estilos Premium
* **Librerías de Gráficos**:
  * Utilizar librerías declarativas y responsivas como `Recharts` o `Chart.js` integradas en React.
  * Personalizar los colores de los gráficos con variables CSS para mantener la armonía de la paleta institucional (ej. `UCMblue`).
* **Micro-interacciones y Animaciones**:
  * Implementar transiciones suaves y estados hover interactivos en tarjetas y botones.
  * Respetar siempre `prefers-reduced-motion` reduciendo el lag o eliminando transiciones complejas en dispositivos de bajo rendimiento.
