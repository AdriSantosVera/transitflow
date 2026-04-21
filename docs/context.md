# Context API en TransitFlow

## Contexto implementado

## `FavoritesContext`

Ruta: `src/context/FavoritesContext.tsx`

Se usa para compartir estado global de favoritos entre componentes y páginas.

Incluye:

- `favoriteIds: string[]`
- `loading: boolean`
- `error: string | null`
- `isFavorite(id)`
- `toggleFavorite(id)`
- `reloadFavorites()`

## Provider global

`FavoritesProvider` envuelve la aplicación en `src/main.tsx`, lo que permite consumir favoritos desde cualquier componente descendiente.

## Consumo en componentes

- `TransportCard`: determina si un trayecto está marcado y ejecuta toggle con el botón corazón
- `FavoritesPage`: usa `favoriteIds` para construir el listado filtrado de favoritos

## ¿Cuándo es útil Context API en este proyecto?

Context API evita pasar props por múltiples niveles (`prop drilling`) para datos globales como favoritos. Al centralizar estado y acciones:

- mejora mantenibilidad
- reduce duplicación de lógica
- mantiene consistencia de UI entre páginas

## Estado actual

El contexto se sincroniza con endpoints backend de favoritos (`GET/POST/DELETE`). La persistencia del backend es en memoria, por lo que los favoritos se reinician al apagar el servidor.
