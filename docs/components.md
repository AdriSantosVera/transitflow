# Componentes de TransitFlow

## Layout y navegacion

### `Header`
Ruta: `src/components/Header.tsx`

Responsabilidad:
- sidebar de escritorio
- header compacto en movil
- navegacion principal
- acceso directo a crear viaje

### `EmptyState`
Ruta: `src/components/EmptyState.tsx`

Responsabilidad:
- mostrar estados vacios, sin resultados o sin contenido

### `Modal`
Ruta: `src/components/Modal.tsx`

Responsabilidad:
- base reutilizable para formularios modales

## Tarjetas y widgets

### `TripCard`
Ruta: `src/components/TripCard.tsx`

Responsabilidad:
- mostrar un viaje con imagen, fechas, presupuesto y progreso
- navegar al detalle del viaje
- marcar o quitar favorito

### `DashboardMetricCard`
Ruta: `src/components/DashboardMetricCard.tsx`

Responsabilidad:
- mostrar metricas superiores del dashboard

### `SavingsWidget`
Ruta: `src/components/SavingsWidget.tsx`

Responsabilidad:
- mostrar progreso del ahorro frente al presupuesto
- lanzar accion para anadir ahorro

### `ExpensesDonutChart`
Ruta: `src/components/ExpensesDonutChart.tsx`

Responsabilidad:
- mostrar distribucion de gastos por categoria

### `ItineraryTimeline`
Ruta: `src/components/ItineraryTimeline.tsx`

Responsabilidad:
- representar hitos del itinerario de forma visual

### `PlacesPanel`
Ruta: `src/components/PlacesPanel.tsx`

Responsabilidad:
- listar lugares destacados por viaje

### `RecentNotesWidget`
Ruta: `src/components/RecentNotesWidget.tsx`

Responsabilidad:
- mostrar notas recientes en dashboard y vistas relacionadas

## Formularios reutilizables

### `AddExpenseModal`
### `AddSavingModal`
### `AddPlaceModal`
### `AddNoteModal`
### `EditTripModal`

Responsabilidad:
- crear o editar entidades sin cambiar el diseño principal
- validar datos de entrada
- lanzar acciones conectadas a la API

## Paginas principales

- `HomePage`: dashboard principal
- `TripsPage`: listado y busqueda de viajes
- `TripCreatePage`: alta de viaje
- `TripDetailPage`: detalle completo del viaje
- `PlacesPage`: vista global de lugares
- `BudgetPage`: vista global de gastos
- `SavingsPage`: vista global de ahorro
- `NotesPage`: vista global de notas
- `FavoritesPage`: favoritos
- `SettingsPage`: ajustes
- `NotFoundPage`: fallback de routing

## Reutilizacion

- `TripCard` se reutiliza en dashboard, viajes y favoritos
- `EmptyState` se reutiliza en multiples pantallas
- Los modales de alta tambien se reutilizan para edicion
- `Header` centraliza navegacion y layout lateral
