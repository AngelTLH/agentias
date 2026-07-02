# Plantilla estética para GitHub Pages

Base minimalista en HTML, CSS y JavaScript para empezar proyectos estáticos con buen orden.

## Estructura

```
assets/
  css/        # Estilos globales y utilidades
  js/         # Interacciones ligeras (menú, scroll suave)
  img/        # Íconos e imágenes de apoyo
logos/        # Logotipos oficiales DataCore usados en header y favicon circular
funciones/     # Funciones con capítulos internos: "¿Qué hacemos?" y "Proceso"
portafolio/    # Ejemplos de soluciones y líneas de trabajo
productos/     # Catálogo de entregables y subpáginas de Producto 1, 2 y 3
quienes-somos/ # Misión, visión, valores y equipo
contacto/      # Formulario estilizado
guia-estilos/  # Guía rápida de utilidades y variables
politica-privacidad/ # Placeholder editable de privacidad
proceso/       # Redirección heredada hacia funciones/#proceso
index.html     # Página principal con CTA hacia cada sección
```

## Cómo usar

1. Clona el repositorio y abre `index.html` en tu navegador para ver la portada.
2. Edita el contenido específico en la carpeta correspondiente (`productos/`, `portafolio/`, `productos/`, `quienes-somos/`, etc.).
3. Ajusta las variables CSS en `assets/css/styles.css` para cambiar paleta y tipografía.
4. Sube el proyecto a GitHub y habilita **Pages** apuntando a la rama principal o carpeta `/docs` si prefieres mantener el código separado.

### Recepción privada de formularios

El formulario de `contacto/` no envía datos a GitHub. Para almacenar la información de manera privada:

1. Se incluyó el endpoint privado de Formspree proporcionado por el cliente (`https://formspree.io/f/tu-id-de-formulario`) en `contacto/index.html` como valor de `action` y `data-endpoint`.
2. Si prefieres otro backend, reemplaza esa URL por tu endpoint seguro (API propia detrás de autenticación, base de datos privada o plan privado de Formspree).
3. Opcional: añade validaciones o cifrado adicional en tu backend; la página solo hace `POST` al endpoint que definas.

Sin un endpoint válido, el envío se bloqueará con un mensaje para evitar exponer datos.

## Personalización rápida

- Coloca imágenes de apoyo en `assets/img`; mantén los logotipos oficiales en `logos/` para conservar el header y favicon.
- Añade scripts adicionales en `assets/js` y enlázalos en el `<head>` o antes del cierre de `<body>`.
- Si migras a React, puedes mantener la estructura de estilos y convertir las secciones en componentes.

## Licencia

Puedes usar y modificar esta plantilla libremente en proyectos personales o profesionales.
