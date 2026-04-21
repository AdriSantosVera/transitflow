# Hooks en TransitFlow

## Hooks usados y propósito

## `useState`

Usado para estado local de UI:

- término de búsqueda
- filtros
- listas cargadas
- loading y error

Ejemplos:

- `TripsPage` (búsqueda)
- `useTransports` (estado de carga)
- `FavoritesContext` (lista de favoritos)

## `useEffect`

Usado para efectos secundarios, principalmente carga de datos al montar:

- `useTransports` ejecuta petición inicial de transportes
- `FavoritesContext` ejecuta petición inicial de favoritos

## `useMemo`

Usado para optimizar cálculos derivados:

- filtrado de transportes por búsqueda + tipo en `TripsPage`
- memorización del objeto de valor en `FavoritesContext`

## `useCallback`

Usado para mantener referencias estables en funciones:

- `reloadFavorites`
- `toggleFavorite`
- `isFavorite`

Esto evita recreaciones innecesarias y mejora estabilidad en dependencias de hooks.

## Custom hooks

## `useTransports`

Ruta: `src/hooks/useTransports.ts`

Responsabilidad:

- cargar transportes desde API
- exponer estados `loading`, `error`
- exponer `reload` para recarga manual

Interfaz de retorno (resumen):

```ts
{
  transports: Transport[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}
```

## `useLocalStorage` (existente)

Ruta: `src/hooks/useLocalStorage.ts`

Responsabilidad:

- sincronizar un estado de React con `localStorage`

Nota: en la implementación actual de favoritos se usa API backend; este hook queda disponible para otros casos de persistencia cliente.
