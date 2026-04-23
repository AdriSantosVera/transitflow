# Formularios e interaccion en TransitFlow

## Formularios implementados

### Viajes
- `TripCreatePage`: alta de viaje
- `EditTripModal`: edicion de viaje

Campos:
- `name`
- `destination`
- `startDate`
- `endDate`
- `budget`
- `image` opcional

Validaciones:
- nombre obligatorio
- destino obligatorio
- presupuesto mayor que 0
- fechas validas

### Gastos
- `AddExpenseModal`
- tambien se reutiliza para editar gastos

Campos:
- `type`
- `amount`

### Ahorro
- `AddSavingModal`
- tambien se reutiliza para editar ahorro

Campos:
- `amount`
- `date`

### Lugares
- `AddPlaceModal`
- tambien se reutiliza para editar lugares

Campos:
- `name`
- `category`
- `notes`

### Notas
- `AddNoteModal`
- tambien se reutiliza para editar notas

Campos:
- `text`

## Gestion de estado

Todos los formularios son controlados con React:
- inputs sincronizados con `useState`
- apertura/cierre de modal con estado local
- feedback de error por formulario
- feedback de exito mediante toast

## Interaccion real

Tras crear, editar o borrar:
- la UI refresca datos desde backend
- el estado visual se actualiza sin recargar la pagina
- Prisma + SQLite quedan como fuente de verdad

## Mejora futura razonable

- validacion de backend mas estricta
- mensajes de error por campo
- confirmaciones visuales mas avanzadas para borrado
