# Habilidad de Auditoría de Seguridad, Sanitización y SecOps

Esta habilidad define los estándares y directrices técnicas para asegurar que el código fuente, los entornos de ejecución, las consultas a bases de datos y el manejo de credenciales se mantengan libres de vulnerabilidades críticas.

---

## 1. Gestión Segura de Credenciales y Secretos
* **Prohibición Terminante de Hardcoding**: Bajo ninguna circunstancia se deben escribir claves de API, tokens JWT, contraseñas de bases de datos o llaves privadas en el código fuente o repositorios Git.
* **Archivos `.env` y Variables de Entorno**:
  * Emplear librerías estándar como `python-dotenv` en Python o paquetes equivalentes en R/Node para cargar secretos desde un archivo `.env`.
  * Todo archivo `.env` debe figurar de manera obligatoria en el `.gitignore`.
  * Proveer siempre una plantilla `.env.example` con variables vacías o valores ficticios de demostración.
* **Auditoría de Secretos**: Utilizar herramientas automatizadas (como `detect-secrets` o `trufflehog`) antes de confirmar cualquier commit.

---

## 2. Sanitización de Entradas y Prevención de Inyecciones
* **Consultas SQL Parametrizadas**:
  * Nunca concatenar cadenas de texto (`f"SELECT * FROM users WHERE id = {user_id}"`) para construir sentencias SQL.
  * Utilizar exclusivamente consultas parametrizadas o mapeadores objeto-relacional (ORM / query builders) como SQLAlchemy, DBI en R, o PreparedStatements en Java.
* **Validación Estricta de Esquemas (APIs y Formularios)**:
  * En microservicios (FastAPI, Flask, Express), validar toda entrada mediante clases de esquema estrictas (`pydantic.BaseModel`), especificando tipos, longitudes mínimas/máximas y expresiones regulares para campos sensibles.
* **Sanitización de Salidas y Prevención de XSS**: Escapar todo contenido generado por el usuario antes de renderizarlo en plantillas HTML o páginas web interactivas.

---

## 3. Seguridad en Dependencias y Entornos de Ejecución
* **Fijación de Versiones (Pinning)**: Especificar versiones exactas en `requirements.txt`, `Pipfile.lock` o `package-lock.json` para evitar que actualizaciones automáticas introduzcan vulnerabilidades o roturas.
* **Escaneo de Vulnerabilidades Conocidas (SCA)**:
  * Ejecutar periódicamente chequeos como `pip-audit`, `safety` o `npm audit` para detectar CVEs en dependencias de terceros.
* **Minimización de Superficie en Docker**:
  * Ejecutar contenedores con usuarios sin privilegios (`USER appuser`, nunca como `root`).
  * Descartar paquetes de compilación innecesarios en la imagen final utilizando imágenes Alpine o Slim y multi-stage builds.
