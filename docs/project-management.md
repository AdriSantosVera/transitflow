# Gestion del proyecto

## Enfoque de organizacion

El trabajo se ha organizado por iteraciones cortas, priorizando primero una base tecnica estable y despues la funcionalidad real de la aplicacion.

## Fases seguidas

1. Configuracion inicial del entorno:
- Vite
- React
- TypeScript
- Tailwind
- React Router

2. Definicion de arquitectura:
- separacion por carpetas en frontend
- backend por capas con `routes`, `controllers`, `services`

3. Construccion del MVP visual:
- dashboard
- viajes
- favoritos
- navegacion principal

4. Conexion funcional:
- formularios
- detalle de viaje
- CRUD de gastos, ahorro, lugares y notas

5. Persistencia real:
- migracion a Prisma + SQLite
- backend como unica fuente de verdad

## Priorizacion

La prioridad ha sido:
- primero que la app fuese navegable
- despues que cada accion importante fuese real
- finalmente que la persistencia dejara de depender de soluciones temporales

## Seguimiento

El tablero del proyecto sirve para:
- mantener tareas en backlog y progreso
- dividir trabajo funcional y tecnico
- reflejar mejoras futuras

## Control de versiones

Se mantiene trabajo por bloques funcionales pequeños para poder revisar cambios, detectar regresiones y documentar mejor cada fase del desarrollo.
