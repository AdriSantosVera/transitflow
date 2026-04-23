# Routing en TransitFlow

## Configuracion

Se usa `React Router` con rutas declaradas en `src/App.tsx`.

## Estructura de rutas

- `/` -> redirige a `/dashboard`
- `/dashboard` -> dashboard principal
- `/trips` -> listado de viajes
- `/trips/new` -> crear viaje
- `/trips/:id` -> detalle del viaje
- `/itinerary` -> vista global de itinerario
- `/places` -> vista global de lugares
- `/budget` -> vista global de presupuesto y gastos
- `/savings` -> vista global de ahorro
- `/favorites` -> favoritos
- `/notes` -> notas
- `/settings` -> ajustes
- `*` -> pagina 404

## Navegacion

La navegacion esta centralizada en `Header`:
- Dashboard
- Mis viajes
- Itinerario
- Lugares
- Presupuesto
- Ahorro
- Favoritos
- Notas
- Ajustes

Ademas incluye CTA para `+ Crear viaje`.

## Pagina 404

Existe `NotFoundPage` como ruta fallback para mantener una UX controlada cuando la URL no coincide con ninguna pagina conocida.
