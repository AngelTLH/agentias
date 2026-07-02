# Habilidad de Curaduría y Verificación de Literatura Científica

Esta guía detalla la metodología para investigar literatura científica, verificar la veracidad de las fuentes y documentar las referencias de forma estructurada en un archivo Excel.

---

## 1. Flujo de Investigación y Verificación

El agente debe seguir un riguroso proceso de verificación científica para evitar "alucinaciones" académicas:

1. **Búsqueda e Identificación Inicial:**
   * Utilizar bases de datos científicas reales (arXiv, PubMed, etc.) para identificar papers y artículos relevantes.
   * Tomar nota de los autores, año de publicación, título exacto, revista y DOI.
2. **Solicitud de Documentación Física:**
   * El agente **debe solicitar al usuario** que descargue los documentos identificados en formato PDF y los deposite en la carpeta `/Documentacion/Documento_Literatura/`.
3. **Conversión y Lectura obligatoria:**
   * Una vez depositados los PDFs, el agente debe convertirlos a Markdown (`.md`) utilizando la herramienta `markitdown` siguiendo la directriz del repositorio.
   * Está estrictamente prohibido realizar citas sin haber leído el texto Markdown extraído del documento PDF real.

---

## 2. Validación de Citas y Contenidos

Para cada afirmación, dato estadístico o teoría citada en los informes, el agente debe contrastar activamente el texto del borrador con el archivo Markdown del PDF:
* **Literalidad y Sentido:** Asegurar que la cita textual o la paráfrasis no distorsione las conclusiones originales de los autores.
* **Exactitud de Ubicación:** Localizar el número de página exacto del archivo PDF original donde se encuentra la información.

---

## 3. Registro Estructurado en Excel (`citas_verificacion.xlsx`)

Para que el usuario pueda auditar el trabajo bibliográfico, el agente debe generar y mantener actualizado un archivo Excel en la carpeta del proyecto con el nombre `citas_verificacion.xlsx` estructurado con las siguientes columnas:

* **Cita:** El texto exacto o paráfrasis que se incluyó en el informe redactado.
* **Documento Asociado:** El nombre de archivo del PDF original (ubicado en `/Documentacion/Documento_Literatura/`).
* **Número de Página Citada:** La página o rango de páginas donde se encuentra la información original.
* **Autores:** Lista completa de autores de la publicación (Formato: Apellido, Inicial del Nombre).

### Ejemplo de código para generar el Excel en Python:
```python
import pandas as pd

citas_data = {
    "Cita": ["XGBoost demostró una reducción del 15% en el error de predicción en comparación con Random Forest en datos clínicos."],
    "Documento Asociado": ["chen_2016_xgboost.pdf"],
    "Número de Página Citada": ["Pág. 3"],
    "Autores": ["Chen, T., & Guestrin, C."]
}

df = pd.DataFrame(citas_data)
df.to_excel("citas_verificacion.xlsx", index=False, sheet_name="Citas Verificadas")
```
