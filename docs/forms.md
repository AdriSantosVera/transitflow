# Formularios e interacción en TransitFlow

## Formularios controlados implementados

Actualmente se usa un formulario simple de búsqueda en `TripsPage`:

- input controlado con `useState`
- actualización en tiempo real del término de búsqueda
- filtrado de resultados por origen, destino y compañía

## Gestión de estado de inputs

- `searchTerm` se actualiza con `onChange`
- el valor del input siempre está sincronizado con el estado React

## Validación básica

En esta fase, la validación es ligera:

- se normaliza el texto (`trim` + `toLowerCase`) para evitar falsos no-coincidencias
- no se requiere formato estricto para buscar

## Mensajes de error o confirmación

- En frontend se muestran errores de carga (`error`) cuando fallan las peticiones
- En backend (`favorites`) se valida `id` en `POST /api/v1/favorites` y se responde `400` si falta
- El estado visual del botón de favorito actúa como confirmación inmediata de interacción

## Interacciones clave de usuario

- Buscar trayectos por texto
- Filtrar por tipo de transporte desde navegación
- Marcar/quitar favoritos con botón corazón

## Próxima mejora recomendada

Para cubrir formularios más completos en futuras iteraciones:

- añadir un formulario dedicado de creación/edición de trayectos simulados
- incluir validaciones explícitas por campo y mensajes de error por input
- mostrar feedback de éxito más explícito (toast o mensaje inline)
