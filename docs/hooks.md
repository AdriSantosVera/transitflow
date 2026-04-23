# Hooks en TransitFlow

## Hooks usados y proposito

### `useState`
Se usa para:
- formularios
- estados de carga
- errores
- listas cargadas desde API
- estados de apertura de modales

### `useEffect`
Se usa para:
- cargar datos al montar una pagina
- refrescar entidades al cambiar `tripId`
- sincronizar valores iniciales en modales reutilizables

### `useMemo`
Se usa para:
- calculos derivados
- distribucion de gastos
- mapas por `id`
- filtrado de listas

### `useCallback`
Se usa para:
- exponer acciones estables desde hooks y contextos
- recargar viajes y favoritos sin recrear funciones innecesariamente

## Custom hooks

### `useTrips`
Ruta: `src/hooks/useTrips.ts`

Responsabilidad:
- cargar viajes desde `GET /api/v1/trips`
- exponer `trips`
- exponer estados `loading`, `error`, `status`
- exponer `reloadTrips()` para resincronizar la UI con backend

Estado expuesto:
- `idle`
- `loading`
- `success`
- `error`

## Como se aplican en la app

- `HomePage`, `TripsPage`, `PlacesPage`, `BudgetPage`, `SavingsPage`, `NotesPage` y `FavoritesPage` consumen `useTrips`
- Los modales usan `useState` para inputs controlados y `useEffect` para rellenar datos en edicion
- El dashboard usa `useMemo` para evitar recalcular estructuras derivadas en cada render
