# Verificacion manual de TransitFlow

## Objetivo

Esta guia sirve para comprobar que la aplicacion funciona correctamente antes de entregar o desplegar el proyecto.

## Preparacion

1. Instalar dependencias:

```bash
npm install
```

2. Generar cliente Prisma y sincronizar base de datos:

```bash
npx prisma generate
npx prisma db push
```

3. Arrancar backend:

```bash
npm run server:dev
```

4. Arrancar frontend:

```bash
npm run dev
```

## URLs utiles

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001/api/v1/trips`
- Swagger UI: `http://localhost:3001/api/docs`
- OpenAPI JSON: `http://localhost:3001/api/docs.json`

## Checklist funcional

### 1. Dashboard
- abrir `/dashboard`
- comprobar que cargan metricas
- comprobar que se muestran viajes, ahorro, presupuesto, lugares y notas
- comprobar que los enlaces `Ver todos` navegan correctamente

### 2. Crear viaje
- abrir `/trips/new`
- crear un viaje con datos validos
- comprobar redireccion a `/trips/:id`
- comprobar que el viaje aparece en `/trips`

### 3. Editar y borrar viaje
- entrar en un viaje
- pulsar `Editar`
- cambiar nombre o presupuesto
- guardar cambios y comprobar refresco visual
- pulsar `Eliminar`
- confirmar borrado y comprobar retorno a `/trips`

### 4. Gastos
- anadir gasto desde el detalle
- editar gasto
- borrar gasto
- comprobar que se actualizan total y grafico

### 5. Ahorro
- anadir ahorro desde detalle o `/savings`
- editar ahorro
- borrar ahorro
- comprobar que se actualizan total y progreso

### 6. Lugares
- anadir lugar
- editar lugar
- borrar lugar
- comprobar que el itinerario se actualiza

### 7. Notas
- anadir nota
- editar nota
- borrar nota
- comprobar que aparece en dashboard y en `/notes`

### 8. Favoritos
- marcar un viaje como favorito
- comprobar que aparece en `/favorites`
- quitar favorito y comprobar actualizacion

### 9. Routing
- comprobar rutas:
  - `/dashboard`
  - `/trips`
  - `/trips/new`
  - `/trips/:id`
  - `/itinerary`
  - `/places`
  - `/budget`
  - `/savings`
  - `/favorites`
  - `/notes`
  - `/settings`
- abrir una ruta inexistente y comprobar la `404`

### 10. Swagger
- abrir `/api/docs`
- comprobar que aparecen endpoints documentados
- probar al menos `GET /trips` desde Swagger

## Resultado esperado

Si todos los puntos anteriores funcionan, TransitFlow queda listo para entrega como aplicacion de planificacion de viajes con frontend React, backend Express y persistencia real mediante Prisma + SQLite.
