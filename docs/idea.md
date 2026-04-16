# Idea del Proyecto – TransitFlow

## Descripción general

TransitFlow es una aplicación web diseñada para consultar de forma rápida y sencilla los tiempos estimados de llegada y salida de diferentes medios de transporte: autobuses, trenes y vuelos. La aplicación centraliza la información en un único lugar, permitiendo al usuario visualizar el estado del transporte, posibles retrasos y detalles relevantes como el andén o la puerta de embarque cuando esté disponible.

El objetivo principal es mejorar la experiencia del usuario a la hora de planificar sus desplazamientos, evitando tener que consultar múltiples aplicaciones o páginas web.

---

## Problema que intenta resolver

Actualmente, los usuarios que utilizan distintos medios de transporte (como autobuses, trenes o aviones) suelen tener que consultar varias plataformas para obtener información actualizada sobre horarios, retrasos o incidencias. Esto provoca pérdida de tiempo, desorganización y una experiencia poco eficiente.

TransitFlow busca solucionar este problema unificando toda esta información en una sola aplicación, ofreciendo una visión clara, rápida y accesible del estado de los trayectos.

---

## Usuario objetivo

Esta aplicación está pensada para:

* Personas que utilizan transporte público de forma habitual
* Estudiantes que se desplazan diariamente
* Trabajadores que dependen de horarios de transporte
* Viajeros que necesitan consultar información de vuelos o trayectos

En general, cualquier usuario que quiera organizar mejor sus desplazamientos y ahorrar tiempo.

---

## Funcionalidades principales

* Visualización de trayectos disponibles (autobús, tren y avión)
* Consulta del tiempo estimado de salida o llegada
* Visualización del estado del transporte (en hora, retrasado, embarcando, finalizado)
* Información adicional como andén (tren) o puerta de embarque (avión), cuando esté disponible
* Buscador de trayectos por origen, destino o tipo de transporte
* Filtro por tipo de transporte
* Posibilidad de guardar trayectos como favoritos

---

## Funcionalidades opcionales

* Modo oscuro
* Historial de búsquedas recientes
* Notificaciones simuladas de cambios de estado
* Ordenación de trayectos por hora o prioridad
* Interfaz más visual tipo “panel de salidas”

---

## Mejoras futuras

* Integración con APIs reales de transporte en tiempo real
* Implementación de geolocalización para mostrar transportes cercanos
* Sistema de notificaciones en tiempo real
* Versión móvil de la aplicación
* Sistema de usuarios con autenticación
* Integración de más tipos de transporte (metro, barco, etc.)

---

## Enfoque técnico

Para el desarrollo del proyecto se utilizará una arquitectura basada en frontend y backend:

* Frontend: React con TypeScript
* Estilos: Tailwind CSS
* Backend: Node.js con Express
* Comunicación mediante API REST
* Datos simulados inicialmente, con posibilidad de ampliación a datos reales

El objetivo es simular el funcionamiento de una aplicación real, aplicando buenas prácticas de desarrollo y organización del código.

---

## Conclusión

TransitFlow es una aplicación pensada para mejorar la organización y planificación de los desplazamientos del usuario. A pesar de ser una versión simplificada, el proyecto permite aplicar conceptos clave del desarrollo web moderno, como el uso de APIs, gestión de estado, componentes reutilizables y arquitectura por capas.

Además, el proyecto tiene potencial de crecimiento futuro, pudiendo evolucionar hacia una aplicación real con datos en tiempo real y funcionalidades más avanzadas.
