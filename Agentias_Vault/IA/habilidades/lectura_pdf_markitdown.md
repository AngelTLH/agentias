# Habilidad de Lectura de PDF con MarkItDown

Esta guía establece el protocolo mandatorio para procesar, leer y comprender cualquier documento en formato PDF suministrado a la IA.

---

## 1. El Protocolo de Conversión Obligatorio
La IA **nunca** debe leer un archivo PDF binario directamente si tiene la capacidad de ejecutar comandos o scripts de Python. En su lugar, debe seguir estos pasos:

1. **Aislamiento**: Identificar la ruta absoluta del archivo PDF a leer (ej: `documento.pdf`).
2. **Conversión**: Ejecutar la herramienta `markitdown` (instalada en el entorno virtual del sistema) para convertir el PDF a un archivo Markdown `.md` equivalente.
   * *Comando de terminal (si aplica)*:
     ```bash
     markitdown ruta/al/archivo.pdf > ruta/al/archivo.md
     ```
   * *Código en Python (si se requiere un script)*:
     ```python
     from markitdown import MarkItDown
     md = MarkItDown()
     result = md.convert("ruta/al/archivo.pdf")
     with open("ruta/al/archivo.md", "w", encoding="utf-8") as f:
         f.write(result.text_content)
     ```
3. **Lectura**: Leer y procesar exclusivamente el archivo `.md` generado.

---

## 2. Razones y Beneficios de este Protocolo
* **Estructura Conservada**: `markitdown` convierte las tablas, viñetas, títulos y divisiones de página del PDF en elementos equivalentes de Markdown (`|`, `*`, `#`), facilitando la interpretación por el modelo de lenguaje.
* **Prevención de Errores**: Se evitan los fallos comunes de codificación, caracteres extraños y saltos de línea incorrectos que ocurren al extraer texto plano de binarios.
* **Eficiencia de Contexto**: La lectura de Markdown limpio consume menos tokens y es sustancialmente más rápida que procesar salidas en bruto.
