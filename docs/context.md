# Context API en TransitFlow

## Contextos implementados

### `FavoritesContext`
Ruta: `src/context/FavoritesContext.tsx`

Se usa para compartir estado global de favoritos entre paginas y componentes.

Incluye:
- `favoriteIds: string[]`
- `loading: boolean`
- `error: string | null`
- `isFavorite(id)`
- `toggleFavorite(id)`
- `reloadFavorites()`

Persistencia:
- `FavoritesContext` se sincroniza con el backend mediante:
  - `GET /api/v1/favorites`
  - `POST /api/v1/favorites`
  - `DELETE /api/v1/favorites/:id`

### `ToastContext`
Ruta: `src/context/ToastContext.tsx`

Se usa para mostrar feedback visual al usuario tras acciones como:
- crear viaje
- editar viaje
- borrar viaje
- anadir o editar gastos, ahorro, lugares o notas

## Provider global

En `src/main.tsx` la app queda envuelta por:
- `ToastProvider`
- `FavoritesProvider`

Esto permite usar favoritos y toasts desde cualquier pagina o componente descendiente.

## Cuando es util Context API en este proyecto

Context API evita prop drilling en estados realmente globales:
- favoritos
- toasts/notificaciones visuales

La carga principal de entidades (`trips`, `places`, `expenses`, `savings`, `notes`) sigue resuelta con hooks y llamadas API, no con un store global, para mantener la arquitectura simple.
