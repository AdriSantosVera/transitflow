# TransitFlow

TransitFlow es una aplicacion web de planificacion de viajes con dashboard visual, detalle de viaje y backend persistente con Prisma + PostgreSQL.

## Objetivo

La aplicacion centraliza la informacion principal de un viaje en un solo panel:
- destino y fechas
- presupuesto
- gastos
- ahorro
- lugares guardados
- notas
- favoritos

La idea es sustituir notas dispersas y calculos sueltos por una herramienta unica y clara para organizar viajes.

## Stack

- Frontend: React + TypeScript + Vite
- Estilos: Tailwind CSS
- Routing: React Router
- Backend: Node.js + Express
- ORM: Prisma
- Base de datos: PostgreSQL
- Documentacion de API: Swagger

## Funcionalidades implementadas

- Dashboard con resumen de viajes, ahorro, presupuesto, lugares y notas
- Creacion de viajes
- Edicion y borrado de viajes
- Detalle de viaje por `id`
- CRUD de gastos
- CRUD de ahorro
- CRUD de lugares
- CRUD de notas
- Favoritos
- Paginas globales de viajes, lugares, presupuesto, ahorro, favoritos, notas y ajustes
- Persistencia real en backend con Prisma + PostgreSQL
- Documentacion de API con Swagger

## Estructura principal

- `src/components/`
- `src/pages/`
- `src/hooks/`
- `src/types/`
- `src/context/`
- `src/api/`
- `server/src/routes/`
- `server/src/controllers/`
- `server/src/services/`
- `server/src/lib/`
- `prisma/`
- `docs/`

## Instalacion

```bash
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
```

## Variables de entorno

Crea `.env` o `.env.local` con:

```env
PORT=3001
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[YOUR-PROJECT-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

## Scripts

```bash
npm install
npm run server:dev
npm run dev
npm run build
npm run preview
npx prisma generate
npx prisma db push
npm run prisma:seed
```

## Arranque local

Terminal 1:

```bash
npm run server:dev
```

Terminal 2:

```bash
npm run dev
```

Si quieres poblar la base con los datos iniciales despues del `db push`:

```bash
npm run prisma:seed
```

## URLs utiles

Frontend:
- `http://localhost:5173`

Backend:
- `http://localhost:3001/api/v1/trips`

Swagger:
- UI: `http://localhost:3001/api/docs`
- JSON OpenAPI: `http://localhost:3001/api/docs.json`

## Endpoints principales

Base path: `/api/v1`

### Trips
- `GET /trips`
- `GET /trips/:id`
- `POST /trips`
- `PUT /trips/:id`
- `DELETE /trips/:id`

### Places
- `GET /places?tripId=...`
- `POST /places`
- `PUT /places/:id`
- `DELETE /places/:id`

### Expenses
- `GET /expenses?tripId=...`
- `POST /expenses`
- `PUT /expenses/:id`
- `DELETE /expenses/:id`

### Savings
- `GET /savings?tripId=...`
- `POST /savings`
- `PUT /savings/:id`
- `DELETE /savings/:id`

### Notes
- `GET /notes?tripId=...`
- `POST /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`

### Favorites
- `GET /favorites`
- `POST /favorites`
- `DELETE /favorites/:id`

## Documentacion del proyecto

- [Idea del proyecto](docs/idea.md)
- [Arquitectura y diseno](docs/design.md)
- [Componentes](docs/components.md)
- [Hooks](docs/hooks.md)
- [Context API](docs/context.md)
- [Routing](docs/routing.md)
- [Formularios](docs/forms.md)
- [Gestion del proyecto](docs/project-management.md)
- [Metodologias agiles](docs/agile.md)
- [Verificacion manual](docs/testing.md)

## Limitaciones actuales

- no hay autenticacion de usuarios
- no hay despliegue productivo completamente cerrado hasta configurar una base PostgreSQL remota en Vercel
- el bundle del frontend aun puede optimizarse con code splitting

## Mejoras futuras

- autenticacion
- compartir viajes o itinerarios
- checklist de viaje
- recordatorios
- mejoras de validacion backend
- optimizacion del bundle frontend

## Tablero del proyecto

- [Tablero de trabajo](https://github.com/AdriSantosVera/transitflow/projects)
