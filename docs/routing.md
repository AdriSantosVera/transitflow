# Routing en TransitFlow

## Configuración

Se usa `React Router` con rutas declaradas en `src/App.tsx`.

## Estructura de rutas

- `/` → redirige a `/trips?type=all`
- `/trips` → listado de trayectos (con filtro por query param `type`)
- `/favorites` → listado de favoritos
- `*` → página 404

## Navegación

La navegación está centralizada en `Header`:

- `Todos` → `/trips?type=all`
- `Bus` → `/trips?type=bus`
- `Tren` → `/trips?type=train`
- `Avión` → `/trips?type=flight`
- `Favoritos` → `/favorites`

## Comportamiento de filtros por ruta

`TripsPage` lee `type` desde la URL (`useSearchParams`) y filtra visualmente:

- `all` → muestra todos
- `bus` → solo bus
- `train` → solo tren
- `flight` → solo avión

Esto permite que la URL represente el estado de la vista y sea compartible.

## Página 404

Existe una ruta fallback para manejar rutas inexistentes y mantener UX controlada.
