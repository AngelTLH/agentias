# Habilidad de Programación en Java

Esta guía técnica define los estándares para estructurar y programar en Java de forma limpia y profesional.

---

## 1. Estructura y Buenas Prácticas en Java
* **Principios de Diseño (SOLID)**: El código debe cumplir rigurosamente con los principios de diseño orientado a objetos:
  * Responsabilidad única para cada clase.
  * Extensibilidad sobre modificación.
  * Inyección de dependencias para desacoplar componentes.
* **Estructura de Paquetes**: Organizar las clases lógicamente en paquetes descriptivos (ej: `com.usuario.proyecto.model`, `com.usuario.proyecto.service`, `com.usuario.proyecto.controller`).
* **Estándar de Nombres**:
  * Clases e Interfaces: PascalCase (ej: `CalculadorSupervivencia`).
  * Variables y Métodos: camelCase (ej: `estimarRiesgoBasal()`).
  * Constantes: UPPER_CASE con guiones bajos (ej: `MAX_VALOR_ITERACION`).
* **Documentación (Javadoc)**:
  * Cada clase, interfaz, método público o parámetro complejo debe ir documentado mediante Javadoc explicando su propósito, comportamiento y excepciones disparadas.

---

## 2. Gestión de Proyectos y Testing
* **Herramientas de Construcción**: Configurar dependencias y ciclos de compilación utilizando Maven (`pom.xml`) o Gradle (`build.gradle`). Mantener las versiones controladas y limpias de redundancias.
* **Manejo de Errores**: Uso correcto de excepciones personalizadas y propagación controlada en lugar de capturar clases genéricas como `Exception` o `Throwable`.
* **Pruebas Unitarias (JUnit)**:
  * Cada módulo principal o componente de lógica de negocio debe tener su respectiva suite de pruebas unitarias utilizando JUnit 5 e integrando mocks cuando sea necesario (`Mockito`).
  * Buscar una cobertura de código lógica y robusta.
