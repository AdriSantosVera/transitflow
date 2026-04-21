# Componentes de TransitFlow

## Componentes reutilizables principales

## `Header`

Ruta: `src/components/Header.tsx`

Responsabilidad:

- Mostrar branding de la app
- Navegación por secciones (`Todos`, `Bus`, `Tren`, `Avión`, `Favoritos`)
- Adaptación responsive (sidebar en escritorio, navegación compacta en móvil)

Props:

- No recibe props (se apoya en `useLocation` y links de React Router)

## `TransportCard`

Ruta: `src/components/TransportCard.tsx`

Responsabilidad:

- Mostrar un trayecto con diseño consistente y moderno
- Mostrar datos clave: tipo, compañía, ruta, horas, estado, referencia
- Permitir marcar/quitar favorito

Props tipadas:

```ts
interface TransportCardProps {
  transport: Transport
}
```

## `EmptyState`

Ruta: `src/components/EmptyState.tsx`

Responsabilidad:

- Mostrar un estado vacío reutilizable en distintas páginas

Props tipadas:

```ts
interface EmptyStateProps {
  title: string
  description: string
}
```

## Páginas (composición)

## `TripsPage`

Ruta: `src/pages/TripsPage.tsx`

Compone:

- Buscador controlado
- Filtro por sección (vía query param)
- Listado de `TransportCard`
- `EmptyState` para resultados vacíos

## `FavoritesPage`

Ruta: `src/pages/FavoritesPage.tsx`

Compone:

- Datos de `useTransports`
- Estado global de favoritos desde `FavoritesContext`
- Reutiliza `TransportCard`
- `EmptyState` cuando no hay favoritos

## `HomePage`

Ruta: `src/pages/HomePage.tsx`

Compone:

- Sección de bienvenida
- Accesos rápidos a Trayectos y Favoritos

## Criterio de reutilización aplicado

Se separó presentación de datos para reutilizar UI:

- `TransportCard` se usa en `TripsPage` y `FavoritesPage`
- `EmptyState` se usa en páginas con estado vacío
- `Header` centraliza la navegación global
