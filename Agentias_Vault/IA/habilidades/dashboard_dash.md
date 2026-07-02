# Habilidad de Desarrollo de Dashboards con Dash (Python)

Esta guía define las buenas prácticas, estructuración de código y patrones de diseño para construir dashboards analíticos interactivos utilizando Dash.

---

## 1. Estructura Base de un Proyecto Dash
Un dashboard en Dash debe organizarse de forma limpia y escalable:

* **Estructura de Archivos**:
  * `app.py`: Inicialización de la aplicación, configuración de hojas de estilo y servidor.
  * `layout.py`: Declaración de la estructura visual (árbol de componentes HTML y Dash Core Components).
  * `callbacks.py`: Lógica interactiva y reactividad.
  * `assets/`: Carpeta para hojas de estilo personalizadas (`style.css`), logos e imágenes.
* **Inicialización limpia (`app.py`)**:
  ```python
  import dash
  
  app = dash.Dash(
      __name__,
      meta_tags=[{"name": "viewport", "content": "width=device-width, initial-scale=1"}],
      assets_folder="assets"
  )
  app.title = "Visualización Analítica"
  server = app.server
  ```

---

## 2. Layout y Diseño Visual (Alineado con Estética Premium)
* **Dash HTML (`html`) y Core Components (`dcc`)**:
  * Utilizar componentes semánticos de HTML.
  * Usar `dcc.Graph` para visualizaciones, `dcc.Dropdown` para filtros y `dcc.Loading` para transiciones suaves de carga en gráficos pesados.
* **CSS en Assets**:
  * No definir estilos inline complejos. Utilizar clases CSS en `assets/style.css` para aplicar el tema de color, bordes y glassmorphism.
* **Contenedor Responsivo**:
  * Diseñar rejillas responsivas usando Flexbox o CSS Grid en la hoja de estilos de assets.

---

## 3. Lógica de Reacción (Callbacks)
* **Callbacks Reactivos**:
  * Utilizar decoradores `@app.callback` con sus respectivos `Input`, `Output` y `State`.
  * Evitar variables globales mutables dentro de los callbacks; la interactividad debe ser puramente funcional.
* **Persistencia de Estado**:
  * Para compartir datos filtrados o cargados entre múltiples callbacks, utilizar `dcc.Store(id="session-store", storage_type="session")` y serializar los datos a JSON.
* **Control de Errores**:
  * Usar `dash.exceptions.PreventUpdate` para evitar renderizados innecesarios ante inputs vacíos o cargas iniciales nulas.
