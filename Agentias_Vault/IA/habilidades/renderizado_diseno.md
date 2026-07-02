# Habilidad de Renderizado Dinámico de Diseño (HTML/CSS/SVG a PNG)

Esta habilidad proporciona el flujo de trabajo técnico para programar plantillas gráficas utilizando estándares web (HTML5, CSS3, SVG) y automatizar su conversión a imágenes de alta definición utilizando un backend local de Python.

---

## 1. Diseño y Generación de Logotipos en SVG
Los logotipos vectoriales son código estructurado en formato XML. Al diseñar un logo:
* **Escalabilidad y Limpieza**: Usa contenedores `<svg>` con `viewBox="0 0 500 500"` (o la proporción cuadrada/rectangular elegida).
* **Semántica**: Define colores clave usando variables CSS en la etiqueta `<style>` interna del SVG para facilitar cambios dinámicos:
  ```xml
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120">
    <style>
      :root {
        --primary: #3b82f6;
        --text: #ffffff;
      }
      .logo-icon { fill: var(--primary); }
      .logo-text { fill: var(--text); font-family: 'Outfit', sans-serif; font-weight: 700; }
    </style>
    <rect class="logo-icon" x="20" y="20" width="80" height="80" rx="15" />
    <text class="logo-text" x="120" y="70" font-size="32">NombreMarca</text>
  </svg>
  ```
* **Versiones de Contraste (Obligatorio)**:
  1. *Fondo Claro*: Cambiar `--text` a color oscuro (ej: `#0b0f19`).
  2. *Fondo Oscuro*: Cambiar `--text` a blanco o color claro (ej: `#f3f4f6`).
  3. *Monocromo/Escala de Grises*: Todos los elementos rellenados con `#000000` o `#FFFFFF` respectivamente.

---

## 2. Estructuración de Plantillas Gráficas (HTML/CSS)
Para componer posts de Instagram, miniaturas o fondos de pantalla:
* **Estructura HTML**: Crea un documento autocontenido. Carga tipografías de Google Fonts en el `<head>` y estiliza usando CSS Flexbox/Grid.
* **Integración del Logo**: Inserta el código del logo SVG directamente inline en el HTML para evitar problemas de carga de archivos externos.
* **Control de Aspecto y Dimensiones Exactas**:
  * **Instagram Post (Cuadrado)**: Contenedor principal con estilo `width: 1080px; height: 1080px; box-sizing: border-box; overflow: hidden;`
  * **Instagram Post (Vertical)**: Contenedor principal con `width: 1080px; height: 1350px;`
  * **YouTube Thumbnail**: Contenedor principal con `width: 1280px; height: 720px;`
  * **Fondo de Pantalla / YouTube Banner**: Contenedor principal con `width: 1920px; height: 1080px;`
  * **Custom Layout**: El contenedor debe dimensionarse explícitamente de acuerdo con el briefing acordado con el usuario.

---

## 3. Automatización de Renderizado con Python (`html2image`)
Para convertir los archivos HTML resultantes en imágenes físicas PNG listas para publicar:
1. Asegúrate de instalar la librería ejecutando `pip install html2image`.
2. Utiliza un script ejecutable en la carpeta `/Codigos/` (o autogenerado en el proyecto) con la siguiente estructura:

```python
import os
from html2image import Html2Image

def renderizar_diseno(html_path, out_name, size=(1080, 1080)):
    """
    Toma un archivo HTML local y lo renderiza como una imagen PNG de dimensiones fijas.
    """
    hti = Html2Image(output_path=os.path.dirname(html_path))
    
    # Capturar la pantalla del HTML
    hti.screenshot(
        html_file=html_path,
        save_as=out_name,
        size=size
    )
    print(f"[Render] Generada imagen {out_name} con tamaño {size}")

if __name__ == "__main__":
    # Ejemplo de uso
    renderizar_diseno("post_instagram.html", "post_instagram.png", (1080, 1080))
    renderizar_diseno("miniatura_youtube.html", "miniatura_youtube.png", (1280, 720))
```

---

## 4. Consistencia Visual en Presentaciones y LaTeX
Si el proyecto requiere presentaciones académicas o profesionales en LaTeX (`beamer`):
* Traduce la paleta HEX elegida a definiciones de color en LaTeX:
  ```latex
  \definecolor{brandprimary}{HTML}{3B82F6}
  \definecolor{branddark}{HTML}{0B0F19}
  \setbeamercolor{structure}{fg=brandprimary}
  ```
* Ajusta las portadas de las diapositivas para que incluyan el logotipo en contraste adecuado contra el fondo de presentación.
